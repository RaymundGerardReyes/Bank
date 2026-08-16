package com.company.banking.payment.routing;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.PaymentMethod;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Component
public class ConfigurablePaymentRouter implements PaymentRouter {

    // Automatically injects all beans implementing ExternalPaymentGateway (e.g., PaynamicsGateway, MayaGateway)
    private final Map<String, ExternalPaymentGateway> gateways;

    public ConfigurablePaymentRouter(Map<String, ExternalPaymentGateway> gateways) {
        this.gateways = gateways;
    }

    @Override
    public ExternalPaymentGateway route(PaymentMethod method, BigDecimal amount, String currency) {
        log.info("[ROUTER] Resolving downstream processor for method: {}", method);

        // Based on the specific routing table established in the Phase C plan
        String gatewayBeanName = switch (method) {
            case CARD -> "paynamicsGateway";
            case EWALLET, QR -> "mayaGateway";
            case ONLINE_BANKING -> "payMongoGateway";
            case CASH_OTC -> "otcGateway";
            default -> throw new BusinessException(ErrorCode.INVALID_REQUEST, "Unsupported payment method");
        };

        ExternalPaymentGateway gateway = gateways.get(gatewayBeanName);
        
        if (gateway == null) {
            log.warn("[ROUTER] Resolved gateway '{}' is not registered. Attempting fallback to default available gateway...", gatewayBeanName);
            gateway = gateways.values().stream().findFirst().orElse(null);
        }

        if (gateway == null) {
            log.error("[ROUTER] FATAL: No payment gateway implementations are registered in the application context.");
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "Payment processor temporarily unavailable.");
        }

        log.info("[ROUTER] Successfully routed to processor: {}", gateway.getProvider());
        return gateway;
    }
}