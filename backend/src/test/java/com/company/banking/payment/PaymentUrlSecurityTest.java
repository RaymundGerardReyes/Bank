package com.company.banking.payment;

import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PaymentUrlSecurityTest {

    @InjectMocks
    private PaymentIntentOrchestrationService orchestrationService;

    @Test
    @DisplayName("Security Gate: Reject Malicious URLs from Compromised Providers")
    void isSafeCheckoutUrl_ShouldRejectMaliciousDomains() throws Exception {
        // Use reflection to test the private validation method
        Method validateMethod = PaymentIntentOrchestrationService.class.getDeclaredMethod("isSafeCheckoutUrl", String.class);
        validateMethod.setAccessible(true);

        // 1. Evil Subdomain Takeover (Should Fail)
        boolean isEvilSubdomainSafe = (boolean) validateMethod.invoke(orchestrationService, "https://paymongo.com.evil.com/checkout");
        assertFalse(isEvilSubdomainSafe, "Must reject domains attempting to spoof the root domain");

        // 2. HTTP Downgrade Attack (Should Fail)
        boolean isHttpSafe = (boolean) validateMethod.invoke(orchestrationService, "http://checkout.paymongo.com");
        assertFalse(isHttpSafe, "Must reject non-HTTPS URLs");

        // 3. Typo Squatting (Should Fail)
        boolean isTypoSafe = (boolean) validateMethod.invoke(orchestrationService, "https://paynamic.net/checkout");
        assertFalse(isTypoSafe, "Must reject unregistered typo domains");

        // 4. Valid Root Domain (Should Pass)
        boolean isRootSafe = (boolean) validateMethod.invoke(orchestrationService, "https://paymongo.com/checkout/123");
        assertTrue(isRootSafe, "Must accept valid root domain");

        // 5. Valid Subdomain (Should Pass)
        boolean isSubdomainSafe = (boolean) validateMethod.invoke(orchestrationService, "https://checkout.maya.ph/v1/session");
        assertTrue(isSubdomainSafe, "Must accept valid subdomains of trusted providers");
    }
}
