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

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PaymentGatewayValidBoundaryMatrixIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String MODERN_ENDPOINT = "/api/v1/gateway/payments/intents";
    private static final String MOCK_API_KEY = "Bearer sk_test_mock_123456789";

    @ParameterizedTest(name = "Valid TC {index}: {0}")
    @MethodSource("provideValidAccountIds")
    void testValidStringPayloads_BypassValidationLayer(String description, String validAccountId) throws Exception {
        
        String payload = String.format("""
            { "sourceAccountId": "%s", "amount": 500.00, "currency": "PHP" }
            """, validAccountId);

        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(result -> {
                    int statusCode = result.getResponse().getStatus();
                    // We expect 403 (Forbidden), 404 (Not Found), or 200/201.
                    // If it returns 400, the @NotBlank or Jackson validation incorrectly rejected it.
                    assertNotEquals(400, statusCode, 
                        "Valid string was incorrectly rejected by DTO validation: " + description);
                });
    }

    private static Stream<Arguments> provideValidAccountIds() {
        return Stream.of(
            // --- GROUP 1: Standard Account Formats ---
            Arguments.of("Standard Alphanumeric", "ACC123456789"),
            Arguments.of("Alphanumeric with hyphens", "ACC-EXT-12345"),
            Arguments.of("Alphanumeric with underscores", "MERCHANT_SETTLEMENT_99"),
            
            // --- GROUP 2: UUID Formats ---
            Arguments.of("Standard UUIDv4", "550e8400-e29b-41d4-a716-446655440000"),
            Arguments.of("UUID without hyphens", "550e8400e29b41d4a716446655440000"),
            Arguments.of("Uppercase UUID", "550E8400-E29B-41D4-A716-446655440000"),

            // --- GROUP 3: Length Boundaries ---
            Arguments.of("Absolute minimum length (1 char)", "A"),
            Arguments.of("Short string (2 chars)", "99"),
            Arguments.of("Long string (50 chars)", "ACC-1234567890-1234567890-1234567890-1234567890-XX"),
            Arguments.of("Very long string (255 chars)", "A".repeat(255)),

            // --- GROUP 4: Type-like Strings (Must be treated as Strings) ---
            Arguments.of("Numeric-only string", "999999999999999999"),
            Arguments.of("Boolean-like string (true)", "true"),
            Arguments.of("Boolean-like string (false)", "false"),
            Arguments.of("Null literal string", "null"),
            Arguments.of("Float-like string", "12345.67890"),

            // --- GROUP 5: Encoded & Special Character Formats ---
            Arguments.of("Email-like format", "merchant@domain.com"),
            Arguments.of("Phone-like format", "+639171234567"),
            Arguments.of("Base64 encoded string", "SGVsbG8gV29ybGQ="),
            Arguments.of("Hexadecimal string", "0xDEADBEEF"),
            Arguments.of("URL-like format", "https://api.merchant.com/acc/123"),

            // --- GROUP 6: Edge Cases & Unicode ---
            Arguments.of("Valid characters surrounded by whitespace", "  ACC-123  "),
            Arguments.of("Unicode characters", "ACC-テスト-123"),
            Arguments.of("Emoji characters", "ACC-🚀-99"),
            Arguments.of("JSON-like string payload", "{\\\"id\\\":\\\"ACC-123\\\"}"),
            Arguments.of("XML-like string payload", "<id>ACC-123</id>")
        );
    }
}
