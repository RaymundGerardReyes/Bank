package com.company.banking.payment;

import com.company.banking.config.BaseIntegrationTest;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
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
public class PaymentGatewayMissingFieldMatrixIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String MODERN_ENDPOINT = "/api/v1/gateway/payments/intents";
    private static final String MOCK_API_KEY = "Bearer sk_test_mock_123456789";

    @ParameterizedTest(name = "Missing/Null TC {index}: {0}")
    @MethodSource("provideMissingAndNullPayloads")
    void testMissingAndNullFields_StrictlyReturns400(String description, String payload) throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    private static Stream<Arguments> provideMissingAndNullPayloads() {
        return Stream.of(
            // --- GROUP 1: Entirely Missing Fields ---
            Arguments.of("Completely empty JSON object", 
                "{}"),
            Arguments.of("Missing sourceAccountId, valid amount and currency", 
                "{ \"amount\": 500.00, \"currency\": \"PHP\" }"),
            Arguments.of("Missing sourceAccountId and amount, valid currency", 
                "{ \"currency\": \"PHP\" }"),
            Arguments.of("Missing sourceAccountId and currency, valid amount", 
                "{ \"amount\": 500.00 }"),
            Arguments.of("Missing sourceAccountId with arbitrary unmapped extra fields", 
                "{ \"amount\": 500.00, \"currency\": \"PHP\", \"unrelatedField\": \"exploit\" }"),

            // --- GROUP 2: C# Serialization Casing Mismatches (Maps to null in Java) ---
            Arguments.of("PascalCase mapping failure (C# Default)", 
                "{ \"SourceAccountId\": \"ACC-123\", \"Amount\": 500.00 }"),
            Arguments.of("Snake_case mapping failure", 
                "{ \"source_account_id\": \"ACC-123\", \"amount\": 500.00 }"),
            Arguments.of("All-caps mapping failure", 
                "{ \"SOURCEACCOUNTID\": \"ACC-123\" }"),
            Arguments.of("Typo in field name mapping failure", 
                "{ \"sourceAccount\": \"ACC-123\" }"),

            // --- GROUP 3: Explicit Null Injections ---
            Arguments.of("Explicitly null sourceAccountId, valid siblings", 
                "{ \"sourceAccountId\": null, \"amount\": 500.00, \"currency\": \"PHP\" }"),
            Arguments.of("Explicitly null sourceAccountId, missing siblings", 
                "{ \"sourceAccountId\": null }"),
            Arguments.of("All explicitly null fields", 
                "{ \"sourceAccountId\": null, \"amount\": null, \"currency\": null }"),
            Arguments.of("Explicit null array bypassing string type", 
                "{ \"sourceAccountId\": [null], \"amount\": 500.00 }"),
            Arguments.of("Explicit null object bypassing string type", 
                "{ \"sourceAccountId\": { \"id\": null }, \"amount\": 500.00 }"),

            // --- GROUP 4: Null-byte & Empty Edge Cases masquerading as presence ---
            Arguments.of("Empty string masquerading as present", 
                "{ \"sourceAccountId\": \"\", \"amount\": 500.00, \"currency\": \"PHP\" }"),
            Arguments.of("Null literal string (Bypasses @NotNull, caught by domain or @NotBlank)", 
                "{ \"sourceAccountId\": \"null\", \"amount\": 500.00 }"),
            Arguments.of("Null-byte character injection", 
                "{ \"sourceAccountId\": \"\\u0000\", \"amount\": 500.00 }"),
            Arguments.of("Empty array mapping failure", 
                "{ \"sourceAccountId\": [], \"amount\": 500.00 }"),
            Arguments.of("Empty object mapping failure", 
                "{ \"sourceAccountId\": {}, \"amount\": 500.00 }"),

            // --- GROUP 5: Structural Integrity Failures ---
            Arguments.of("Top-level array instead of object", 
                "[ { \"sourceAccountId\": \"ACC-123\" } ]")
        );
    }
}
