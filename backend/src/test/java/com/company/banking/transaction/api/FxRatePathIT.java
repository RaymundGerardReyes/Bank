package com.company.banking.transaction.api;

import com.company.banking.config.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("FX Rates & Currency Conversion Path Integration Tests")
public class FxRatePathIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Nested
    @DisplayName("GET /api/v1/fx/rates - Reference Exchange Rate Queries")
    class FxRatesEndpointTests {

        @Test
        @DisplayName("Returns 200 OK with PHP base and accurate ratesToPhp containing 62.6280 for USD")
        void shouldReturnRealtimeFxRatesWithPhpBase() throws Exception {
            mockMvc.perform(get("/api/v1/fx/rates")
                            .param("base", "PHP")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.base").value("PHP"))
                    .andExpect(jsonPath("$.ratesToPhp.PHP").value(1.000000))
                    .andExpect(jsonPath("$.ratesToPhp.USD").value(62.628000))
                    .andExpect(jsonPath("$.ratesToPhp.EUR").value(63.500000))
                    .andExpect(jsonPath("$.ratesToPhp.GBP").value(74.800000))
                    .andExpect(jsonPath("$.ratesToPhp.CAD").value(42.800000))
                    .andExpect(jsonPath("$.ratesToPhp.SGD").value(44.500000))
                    .andExpect(jsonPath("$.ratesToPhp.JPY").value(0.380000))
                    .andExpect(jsonPath("$.timestamp").isNotEmpty());
        }

        @Test
        @DisplayName("Returns 200 OK when requesting base currency as USD")
        void shouldReturnRatesWithUsdBase() throws Exception {
            mockMvc.perform(get("/api/v1/fx/rates")
                            .param("base", "USD")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.base").value("USD"))
                    .andExpect(jsonPath("$.rates.USD").value(1.000000))
                    .andExpect(jsonPath("$.rates.PHP").value(62.628000))
                    .andExpect(jsonPath("$.ratesToPhp.USD").value(62.628000));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/fx/quote - Time-Bound Exchange Quotes")
    class FxQuoteEndpointTests {

        @Test
        @DisplayName("Exact user scenario: $122,074.00 USD converts to exactly ₱7,645,250.47 PHP")
        void shouldConvertUniversityErpUsdBalanceAccurately() throws Exception {
            mockMvc.perform(get("/api/v1/fx/quote")
                            .param("from", "USD")
                            .param("to", "PHP")
                            .param("amount", "122074.00")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.fromCurrency").value("USD"))
                    .andExpect(jsonPath("$.toCurrency").value("PHP"))
                    .andExpect(jsonPath("$.sourceAmount").value(122074.00))
                    .andExpect(jsonPath("$.destinationAmount").value(7645250.47))
                    .andExpect(jsonPath("$.rate").value(62.628000))
                    .andExpect(jsonPath("$.providerReference").isNotEmpty())
                    .andExpect(jsonPath("$.expiresAt").isNotEmpty());
        }

        @Test
        @DisplayName("Same currency quote (PHP -> PHP) returns 1.000000 rate with 1:1 destination amount")
        void shouldReturnIdenticalAmountForSameCurrencyQuote() throws Exception {
            mockMvc.perform(get("/api/v1/fx/quote")
                            .param("from", "PHP")
                            .param("to", "PHP")
                            .param("amount", "50.00")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.fromCurrency").value("PHP"))
                    .andExpect(jsonPath("$.toCurrency").value("PHP"))
                    .andExpect(jsonPath("$.sourceAmount").value(50.00))
                    .andExpect(jsonPath("$.destinationAmount").value(50.00))
                    .andExpect(jsonPath("$.rate").value(1.000000));
        }

        @Test
        @DisplayName("Inverse quote (PHP -> USD) returns calculated inverse rate")
        void shouldCalculateInverseQuoteFromPhpToUsd() throws Exception {
            mockMvc.perform(get("/api/v1/fx/quote")
                            .param("from", "PHP")
                            .param("to", "USD")
                            .param("amount", "7645250.47")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.fromCurrency").value("PHP"))
                    .andExpect(jsonPath("$.toCurrency").value("USD"))
                    .andExpect(jsonPath("$.destinationAmount").value(greaterThan(122000.00)));
        }

        @Test
        @DisplayName("Negative amount must return 400 Bad Request")
        void shouldRejectNegativeAmount() throws Exception {
            mockMvc.perform(get("/api/v1/fx/quote")
                            .param("from", "USD")
                            .param("to", "PHP")
                            .param("amount", "-100.00")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Zero amount must return 400 Bad Request")
        void shouldRejectZeroAmount() throws Exception {
            mockMvc.perform(get("/api/v1/fx/quote")
                            .param("from", "USD")
                            .param("to", "PHP")
                            .param("amount", "0.00")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Invalid currency symbol must return 400 Bad Request")
        void shouldRejectInvalidCurrency() throws Exception {
            mockMvc.perform(get("/api/v1/fx/quote")
                            .param("from", "XYZ")
                            .param("to", "PHP")
                            .param("amount", "100.00")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }
    }
}

