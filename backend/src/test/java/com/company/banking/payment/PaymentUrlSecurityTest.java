package com.company.banking.payment;

import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Method;
import java.util.List;

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
        
        ReflectionTestUtils.setField(orchestrationService, "allowedDomains", List.of("paymongo.com", "testbank.com", "localhost"));

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

        // 5. Valid Apex & Subdomains for testbank.com (Should Pass)
        boolean isTestbankApexSafe = (boolean) validateMethod.invoke(orchestrationService, "https://testbank.com/checkout");
        assertTrue(isTestbankApexSafe, "Must accept apex testbank.com domain");

        boolean isApplicantSubdomainSafe = (boolean) validateMethod.invoke(orchestrationService, "https://applicant.testbank.com/checkout");
        assertTrue(isApplicantSubdomainSafe, "Must accept applicant.testbank.com subdomain");

        boolean isPaySubdomainSafe = (boolean) validateMethod.invoke(orchestrationService, "https://pay.testbank.com/checkout");
        assertTrue(isPaySubdomainSafe, "Must accept pay.testbank.com subdomain");

        boolean isBankSubdomainSafe = (boolean) validateMethod.invoke(orchestrationService, "https://bank.testbank.com/checkout");
        assertTrue(isBankSubdomainSafe, "Must accept bank.testbank.com subdomain");

        // 6. Malicious Spoofed testbank.com Domains (Should Fail)
        boolean isEvilPrefixSafe = (boolean) validateMethod.invoke(orchestrationService, "https://evil-testbank.com/checkout");
        assertFalse(isEvilPrefixSafe, "Must reject prefix-spoofed evil-testbank.com");

        boolean isEvilSuffixSafe = (boolean) validateMethod.invoke(orchestrationService, "https://testbank.com.evil.com/checkout");
        assertFalse(isEvilSuffixSafe, "Must reject suffix-spoofed testbank.com.evil.com");

        // 7. HTTP Downgrade on Legitimate Subdomain (Should Fail)
        boolean isHttpSubdomainSafe = (boolean) validateMethod.invoke(orchestrationService, "http://pay.testbank.com/checkout");
        assertFalse(isHttpSubdomainSafe, "Must reject HTTP downgrade on legitimate subdomains");

        // 8. Localhost Allowed over HTTP (Should Pass)
        boolean isLocalhostHttpSafe = (boolean) validateMethod.invoke(orchestrationService, "http://localhost:8080/checkout");
        assertTrue(isLocalhostHttpSafe, "Must allow HTTP for localhost");
    }

    @Test
    @DisplayName("Security Gate: Defensively sanitize whitespace and casing in allowedDomains")
    void isSafeCheckoutUrl_ShouldHandleWhitespaceAndCasing() throws Exception {
        Method validateMethod = PaymentIntentOrchestrationService.class.getDeclaredMethod("isSafeCheckoutUrl", String.class);
        validateMethod.setAccessible(true);

        ReflectionTestUtils.setField(orchestrationService, "allowedDomains", List.of(" paymongo.com ", " TESTBANK.COM ", "  localhost  "));

        boolean isApplicantSafe = (boolean) validateMethod.invoke(orchestrationService, "https://applicant.testbank.com/checkout");
        assertTrue(isApplicantSafe, "Must accept subdomain even when configured domain has whitespace or uppercase");

        boolean isCaseInsensitiveUrlSafe = (boolean) validateMethod.invoke(orchestrationService, "https://PAY.TESTBANK.COM/checkout");
        assertTrue(isCaseInsensitiveUrlSafe, "Must accept uppercase URL matching allowed domain");

        boolean isLocalhostSafe = (boolean) validateMethod.invoke(orchestrationService, "http://localhost:8080/checkout");
        assertTrue(isLocalhostSafe, "Must accept localhost with trimmed allowedDomains");
    }
}
