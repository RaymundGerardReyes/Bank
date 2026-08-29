package com.company.banking.payment;

import com.company.banking.config.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.stream.Stream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PaymentGatewayPayloadValidationIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String GATEWAY_ENDPOINT = "/api/v1/gateway/payments/intents";
    private static final String MOCK_API_KEY = "Bearer sk_test_mock_123456789";

    /**
     * Group 1: The Missing Field Matrix (Replicating the C# bug)
     * Proves ERR_NF_001 is prevented.
     */
    @Test
    @DisplayName("V01: Completely missing sourceAccountId field is strictly rejected")
    void testMissingField_Returns400() throws Exception {
        String payload = """
            { "amount": 500.00, "currency": "PHP", "paymentMethod": "card" }
            """;
        mockMvc.perform(post(GATEWAY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    /**
     * Group 2: The Explicit Null Matrix
     * Ensures Jackson doesn't silently map explicit nulls to empty strings.
     */
    @Test
    @DisplayName("V02: Explicitly mapped null sourceAccountId is strictly rejected")
    void testExplicitNull_Returns400() throws Exception {
        String payload = """
            { "sourceAccountId": null, "amount": 500.00, "currency": "PHP" }
            """;
        mockMvc.perform(post(GATEWAY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest());
    }

    /**
     * Group 3: The Blank/Whitespace Matrix (@NotBlank stress testing)
     */
    @ParameterizedTest(name = "V03-{index}: Rejected blank payload: ''{0}''")
    @ValueSource(strings = {
            "",          // Empty string
            " ",         // Single space
            "   ",       // Multiple spaces
            "\t",        // Tab character
            "\n",        // Newline
            " \t\n ",    // Mixed whitespace
            "    "       // Four spaces
    })
    void testBlankPayloads_Return400(String invalidAccount) throws Exception {
        String payload = String.format("""
            { "sourceAccountId": "%s", "amount": 500.00, "currency": "PHP" }
            """, invalidAccount);

        mockMvc.perform(post(GATEWAY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest());
    }

    /**
     * Group 4: The Syntactic Bypass Matrix
     * Ensures structural edge cases fail DTO deserialization or @NotBlank rules.
     */
    @ParameterizedTest(name = "V04-{index}: Rejected malformed JSON type: {0}")
    @MethodSource("provideMalformedAccountTypes")
    void testMalformedTypes_Return400(String payloadSnippet) throws Exception {
        String payload = "{ \"sourceAccountId\": " + payloadSnippet + ", \"amount\": 500.00, \"currency\": \"PHP\" }";

        mockMvc.perform(post(GATEWAY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest());
    }

    private static Stream<Arguments> provideMalformedAccountTypes() {
        return Stream.of(
                Arguments.of("12345"),       // Number instead of String
                Arguments.of("true"),        // Boolean instead of String
                Arguments.of("[]"),          // Empty Array
                Arguments.of("[\"ACC\"]"),   // Populated Array
                Arguments.of("{}"),          // Empty Object
                Arguments.of("{\"id\":\"ACC\"}") // Nested Object
        );
    }

    /**
     * Group 5: The Downstream Execution Matrix (Valid Data)
     * Proves that structurally valid data successfully passes the DTO edge 
     * and correctly hits the Authorization bounds.
     */
    @ParameterizedTest(name = "V05-{index}: Valid request triggers downstream authorization: {0}")
    @ValueSource(strings = {
            "ACC-EXT-12345",
            "MERCHANT-SETTLEMENT-99",
            "UNIV-ACCT-001",
            "a",             // Minimum length boundary
            "ACC-1234-5678-9012" // Long length boundary
    })
    void testValidPayload_PassesEdgeValidation(String validAccount) throws Exception {
        String payload = String.format("""
            { "sourceAccountId": "%s", "amount": 500.00, "currency": "PHP" }
            """, validAccount);

        // We expect anything EXCEPT 400 Bad Request.
        // It will likely return 403 (Forbidden) if the API key isn't mapped to these accounts,
        // or 404/500 if the domain setup is incomplete. The goal is proving validation passed.
        mockMvc.perform(post(GATEWAY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(result -> {
                    int statusCode = result.getResponse().getStatus();
                    org.junit.jupiter.api.Assertions.assertNotEquals(400, statusCode, "Valid payload was incorrectly rejected at the DTO boundary");
                });
    }

    /**
     * Group 6: Security Filter Precedence Check
     * Proves that missing Authentication fails BEFORE DTO validation triggers.
     */
    @Test
    @DisplayName("V06: Unauthenticated request is rejected before DTO validation")
    void testUnauthenticated_Returns401() throws Exception {
        String payloadMissingAccount = """
            { "amount": 500.00, "currency": "PHP" }
            """;

        mockMvc.perform(post(GATEWAY_ENDPOINT)
                // Missing Authorization header
                .contentType(MediaType.APPLICATION_JSON)
                .content(payloadMissingAccount))
                .andExpect(status().isUnauthorized()); // Must return 401, not 400
    }
    
    /**
     * Group 7: Content-Type Boundary Check
     */
    @Test
    @DisplayName("V07: Invalid Content-Type is rejected")
    void testInvalidContentType_Returns415() throws Exception {
        mockMvc.perform(post(GATEWAY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.TEXT_PLAIN) // Wrong content type
                .content("sourceAccountId=ACC-1234"))
                .andExpect(status().isUnsupportedMediaType());
    }
}
