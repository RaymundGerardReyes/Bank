package com.company.banking.transaction.api;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.application.port.out.FxRateProviderPort;
import com.company.banking.transaction.domain.CurrencyCode;
import com.company.banking.transaction.domain.FxCalculationService;
import com.company.banking.transaction.domain.FxQuote;
import com.company.banking.transaction.domain.Money;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/fx")
@RequiredArgsConstructor
public class FxController {

    private final FxRateProviderPort fxRateProviderPort;
    private final FxCalculationService fxCalculationService;

    @GetMapping("/rates")
    public ResponseEntity<Map<String, Object>> getRates(
            @RequestParam(value = "base", defaultValue = "PHP") String baseCurrencyStr) {
        CurrencyCode baseCurrency = CurrencyCode.fromString(baseCurrencyStr);
        Money dummyBaseAmount = Money.of(BigDecimal.ONE, baseCurrency);

        Map<String, BigDecimal> rates = new LinkedHashMap<>();
        Map<String, BigDecimal> ratesToPhp = new LinkedHashMap<>();

        for (CurrencyCode target : CurrencyCode.values()) {
            if (target == baseCurrency) {
                rates.put(target.name(), BigDecimal.ONE.setScale(6, RoundingMode.HALF_UP));
            } else {
                FxQuote quoteFromBase = fxRateProviderPort.getQuote(baseCurrency, target, dummyBaseAmount);
                rates.put(target.name(), quoteFromBase.getRate().setScale(6, RoundingMode.HALF_UP));
            }

            if (target == CurrencyCode.PHP) {
                ratesToPhp.put(target.name(), BigDecimal.ONE.setScale(6, RoundingMode.HALF_UP));
            } else {
                FxQuote quoteToPhp = fxRateProviderPort.getQuote(target, CurrencyCode.PHP, Money.of(BigDecimal.ONE, target));
                ratesToPhp.put(target.name(), quoteToPhp.getRate().setScale(6, RoundingMode.HALF_UP));
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("base", baseCurrency.name());
        response.put("rates", rates);
        response.put("ratesToPhp", ratesToPhp);
        response.put("timestamp", java.time.Instant.now().toString());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/quote")
    public ResponseEntity<Map<String, Object>> getQuote(
            @RequestParam("from") String fromCurrencyStr,
            @RequestParam("to") String toCurrencyStr,
            @RequestParam("amount") BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Amount must be strictly positive");
        }

        CurrencyCode fromCurrency = CurrencyCode.fromString(fromCurrencyStr);
        CurrencyCode toCurrency = CurrencyCode.fromString(toCurrencyStr);
        Money sourceMoney = Money.of(amount, fromCurrency);

        if (fromCurrency == toCurrency) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("fromCurrency", fromCurrency.name());
            response.put("toCurrency", toCurrency.name());
            response.put("sourceAmount", sourceMoney.getAmount());
            response.put("destinationAmount", sourceMoney.getAmount());
            response.put("rate", BigDecimal.ONE.setScale(6, RoundingMode.HALF_UP));
            response.put("providerReference", "SAME_CURRENCY");
            response.put("expiresAt", java.time.Instant.now().plusSeconds(86400).toString());
            return ResponseEntity.ok(response);
        }

        FxQuote quote = fxRateProviderPort.getQuote(fromCurrency, toCurrency, sourceMoney);
        Money destinationMoney = fxCalculationService.calculateDestinationAmount(sourceMoney, quote);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("fromCurrency", fromCurrency.name());
        response.put("toCurrency", toCurrency.name());
        response.put("sourceAmount", sourceMoney.getAmount());
        response.put("destinationAmount", destinationMoney.getAmount());
        response.put("rate", quote.getRate());
        response.put("providerReference", quote.getProviderReference());
        response.put("expiresAt", quote.getExpiresAt().toString());

        return ResponseEntity.ok(response);
    }
}

