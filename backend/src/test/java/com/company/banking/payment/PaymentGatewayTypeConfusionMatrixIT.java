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
public class PaymentGatewayTypeConfusionMatrixIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String MODERN_ENDPOINT = "/api/v1/gateway/payments/intents";
    private static final String MOCK_API_KEY = "Bearer sk_test_mock_123456789";

    @ParameterizedTest(name = "Type Injection TC {index}: {0}")
    @MethodSource("provideTypeConfusionPayloads")
    void testTypeConfusion_StrictlyReturns400(String description, String injectedTypeSnippet) throws Exception {
        // We inject the malformed snippet directly into the sourceAccountId value
        String payload = String.format(
            "{ \"sourceAccountId\": %s, \"amount\": 500.00, \"currency\": \"PHP\" }", 
            injectedTypeSnippet
        );

        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    private static Stream<Arguments> provideTypeConfusionPayloads() {
        return Stream.of(
            // --- GROUP 1: Boolean Primitives ---
            Arguments.of("Boolean TRUE", "true"),
            Arguments.of("Boolean FALSE", "false"),

            // --- GROUP 2: Numeric Primitives ---
            Arguments.of("Integer Zero", "0"),
            Arguments.of("Positive Integer", "12345"),
            Arguments.of("Negative Integer", "-999"),
            Arguments.of("Floating Point Number", "123.456"),
            Arguments.of("Negative Floating Point", "-0.0001"),
            Arguments.of("Scientific Notation", "1.5e10"),
            Arguments.of("Massive Integer Overflow", "999999999999999999999999999999"),

            // --- GROUP 3: Arrays (Homogeneous and Heterogeneous) ---
            Arguments.of("Empty Array", "[]"),
            Arguments.of("Array of Strings (Single item)", "[\"ACC-123\"]"),
            Arguments.of("Array of Strings (Multiple items)", "[\"ACC-123\", \"ACC-456\"]"),
            Arguments.of("Array of Numbers", "[1, 2, 3]"),
            Arguments.of("Array of Booleans", "[true, false]"),
            Arguments.of("Array containing explicit Null", "[null]"),
            Arguments.of("Array containing Empty Object", "[{}]"),
            Arguments.of("Nested Array", "[[\"ACC-123\"]]"),

            // --- GROUP 4: Objects (Nested and Flat) ---
            Arguments.of("Empty Object", "{}"),
            Arguments.of("Object with generic string property", "{ \"id\": \"ACC-123\" }"),
            Arguments.of("Object with generic numeric property", "{ \"id\": 1 }"),
            Arguments.of("Deeply Nested Object", "{ \"nested\": { \"id\": \"ACC-123\" } }"),
            Arguments.of("Object containing an Array", "{ \"list\": [\"ACC-123\"] }")
        );
    }
}
