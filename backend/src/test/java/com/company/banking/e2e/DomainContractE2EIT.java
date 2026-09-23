package com.company.banking.e2e;

import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.test.util.AopTestUtils;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.lang.reflect.Method;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("E2E Domain Contracts & Invariants Suite (F1 - F9)")
public class DomainContractE2EIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PaymentIntentOrchestrationService paymentIntentService;

    // =========================================================================
    // Tier 1 & 2: Subdomain Wildcard & Security Invariants (F4)
    // =========================================================================
    @Nested
    @DisplayName("Payment Domain Wildcard Invariants")
    class PaymentDomainWildcardTests {

        private boolean invokeIsSafeCheckoutUrl(String url, List<String> allowedDomains) throws Exception {
            Object target = AopTestUtils.getTargetObject(paymentIntentService);
            Method method = PaymentIntentOrchestrationService.class.getDeclaredMethod("isSafeCheckoutUrl", String.class);
            method.setAccessible(true);
            Object originalAllowed = ReflectionTestUtils.getField(target, "allowedDomains");
            try {
                ReflectionTestUtils.setField(target, "allowedDomains", allowedDomains);
                return (boolean) method.invoke(target, url);
            } finally {
                ReflectionTestUtils.setField(target, "allowedDomains", originalAllowed);
            }
        }

        @Test
        @DisplayName("F4_01: Apex domain checkout URL must be accepted")
        void testApexDomainAllowed() throws Exception {
            List<String> domains = List.of("paymongo.com", "examplebank.com", "localhost");
            assertTrue(invokeIsSafeCheckoutUrl("https://examplebank.com/checkout/sess_001", domains),
                    "Apex domain https://examplebank.com must be allowed");
        }

        @Test
        @DisplayName("F4_02: Wildcard subdomains (pay., applicant.) must be accepted")
        void testSubdomainsAllowed() throws Exception {
            List<String> domains = List.of("paymongo.com", "examplebank.com", "localhost");
            assertTrue(invokeIsSafeCheckoutUrl("https://pay.examplebank.com/checkout/sess_002", domains),
                    "pay.examplebank.com must be allowed via wildcard suffix matching");
            assertTrue(invokeIsSafeCheckoutUrl("https://applicant.examplebank.com/verify", domains),
                    "applicant.examplebank.com must be allowed via wildcard suffix matching");
        }

        @Test
        @DisplayName("F4_03: External gateway and nested gateway subdomains must be accepted")
        void testExternalGatewayAllowed() throws Exception {
            List<String> domains = List.of("paymongo.com", "examplebank.com", "localhost");
            assertTrue(invokeIsSafeCheckoutUrl("https://paymongo.com/checkout/123", domains),
                    "paymongo.com root domain must be allowed");
            assertTrue(invokeIsSafeCheckoutUrl("https://checkout.paymongo.com/v1/session", domains),
                    "checkout.paymongo.com must be allowed");
        }

        @Test
        @DisplayName("F4_04: Localhost HTTP allowed for local developer environments")
        void testLocalhostHttpAllowed() throws Exception {
            List<String> domains = List.of("paymongo.com", "examplebank.com", "localhost");
            assertTrue(invokeIsSafeCheckoutUrl("http://localhost:3000/checkout", domains),
                    "http://localhost must be permitted for local development");
        }

        @Test
        @DisplayName("F4_05 & F4_B01: Adversarial domain spoofing must be strictly rejected")
        void testAdversarialSpoofingRejected() throws Exception {
            List<String> domains = List.of("paymongo.com", "examplebank.com", "localhost");
            // Prefix spoofing (attacker domain as parent)
            assertFalse(invokeIsSafeCheckoutUrl("https://examplebank.com.evil.com/checkout", domains),
                    "Must reject examplebank.com.evil.com");
            // Suffix hyphen spoofing
            assertFalse(invokeIsSafeCheckoutUrl("https://evil-examplebank.com/checkout", domains),
                    "Must reject evil-examplebank.com");
            // HTTP downgrade on non-localhost
            assertFalse(invokeIsSafeCheckoutUrl("http://pay.examplebank.com/checkout", domains),
                    "Must reject non-HTTPS URLs on production domains");
        }
    }

    // =========================================================================
    // Tier 1 & 2: Spring Boot CORS Validation Invariants (F5)
    // =========================================================================
    @Nested
    @DisplayName("CORS Origin Validation Invariants")
    class CorsValidationTests {

        @Test
        @DisplayName("F5_01: Legitimate development frontend origin permitted with credentials")
        void testDevelopmentFrontendOriginPermitted() throws Exception {
            mockMvc.perform(options("/api/v1/health")
                            .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                    .andExpect(status().isOk())
                    .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"));
        }

        @Test
        @DisplayName("F5_05: Malicious origin rejected without Access-Control-Allow-Origin")
        void testMaliciousOriginRejected() throws Exception {
            mockMvc.perform(options("/api/v1/health")
                            .header(HttpHeaders.ORIGIN, "https://evil-attacker.com")
                            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                    .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
        }

        @Test
        @DisplayName("F5_B03: Origin: null rejected without CORS headers")
        void testNullOriginRejected() throws Exception {
            mockMvc.perform(options("/api/v1/health")
                            .header(HttpHeaders.ORIGIN, "null")
                            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                    .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
        }
    }
}
