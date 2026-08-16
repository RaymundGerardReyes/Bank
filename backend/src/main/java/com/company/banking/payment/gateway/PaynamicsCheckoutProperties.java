package com.company.banking.payment.gateway;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payment.paynamics")
@Data
public class PaynamicsCheckoutProperties {
    private String merchantId;
    private String secretKey;
    private String checkoutBaseUrl;
    private String webhookSecret;
    private boolean sandbox;
}