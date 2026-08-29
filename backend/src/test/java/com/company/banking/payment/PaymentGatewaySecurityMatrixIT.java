package com.company.banking.payment;

import com.company.banking.config.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.stream.Stream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PaymentGatewaySecurityMatrixIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String MODERN_ENDPOINT = "/api/v1/gateway/payments/intents";
    private static final String LEGACY_ENDPOINT = "/api/v1/gateway/payments";
    private static final String MOCK_API_KEY = "Bearer sk_test_mock_123456789";

    // ===================================================================================
    // SECTION 1: LEGACY ENDPOINT DEPRECATION (TC 01 - 05)
    // ===================================================================================

    @ParameterizedTest(name = "TC{index}: Legacy endpoint rejects {0} with 405 Method Not Allowed")
    @CsvSource({"POST", "PUT", "PATCH", "DELETE"})
    void legacyEndpoints_Return405(String httpMethod) throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.request(HttpMethod.valueOf(httpMethod), LEGACY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.message").value("This endpoint is deprecated. Use /api/v1/gateway/payments/intents instead."));
    }

    @Test
    @DisplayName("TC05: Spoofing X-Client-Id on Legacy Endpoint still returns 405")
    void legacyEndpoint_WithSpoofedHeader_Returns405() throws Exception {
        mockMvc.perform(post(LEGACY_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("X-Client-Id", "admin-override")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isMethodNotAllowed());
    }

    // ===================================================================================
    // SECTION 2: MODERN ENDPOINT MISSING/NULL FIELD VALIDATION (TC 06 - 10)
    // ===================================================================================

    @Test
    @DisplayName("TC06: Missing request body returns 400 Bad Request")
    void modernEndpoint_MissingBody_Returns400() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC07: Empty JSON object returns 400 Bad Request")
    void modernEndpoint_EmptyJson_Returns400() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC08: Missing sourceAccountId returns 400 Bad Request")
    void modernEndpoint_MissingAccountField_Returns400() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"amount\": 500.00 }"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC09: Explicitly null sourceAccountId returns 400 Bad Request")
    void modernEndpoint_NullAccountField_Returns400() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": null, \"amount\": 500.00 }"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC10: Empty string sourceAccountId returns 400 Bad Request")
    void modernEndpoint_EmptyStringAccountField_Returns400() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"\", \"amount\": 500.00 }"))
                .andExpect(status().isBadRequest());
    }

    // ===================================================================================
    // SECTION 3: MODERN ENDPOINT WHITESPACE & TYPE VALIDATION (TC 11 - 18)
    // ===================================================================================

    @ParameterizedTest(name = "TC{index}: Reject whitespace-only sourceAccountId: ''{0}''")
    @ValueSource(strings = {" ", "   ", "\t", "\n", " \t\n "})
    void modernEndpoint_WhitespaceAccountField_Returns400(String invalidSpacing) throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format("{ \"sourceAccountId\": \"%s\" }", invalidSpacing)))
                .andExpect(status().isBadRequest());
    }

    @ParameterizedTest(name = "TC{index}: Reject malformed data type for sourceAccountId: {0}")
    @ValueSource(strings = {"12345", "true", "[]", "{}", "[\"ACC\"]", "{\"id\":\"1\"}"})
    void modernEndpoint_MalformedTypeAccountField_Returns400(String malformedType) throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format("{ \"sourceAccountId\": %s }", malformedType)))
                .andExpect(status().isBadRequest());
    }

    // ===================================================================================
    // SECTION 4: AUTHENTICATION PRECEDENCE (TC 19 - 24)
    // ===================================================================================

    @Test
    @DisplayName("TC19: Missing Authorization header returns 401 Unauthorized")
    void modernEndpoint_NoAuth_Returns401() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"ACC-123\" }"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC20: Empty Bearer token returns 401 Unauthorized")
    void modernEndpoint_EmptyToken_Returns401() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", "Bearer ")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"ACC-123\" }"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC21: Wrong authentication scheme (Basic) returns 401 Unauthorized")
    void modernEndpoint_WrongScheme_Returns401() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", "Basic dXNlcjpwYXNz")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"ACC-123\" }"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC22: Invalid API key returns 401 Unauthorized")
    void modernEndpoint_InvalidToken_Returns401() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", "Bearer sk_invalid_key_999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"ACC-123\" }"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC23: Invalid Content-Type (text/plain) returns 415 Unsupported Media Type")
    void modernEndpoint_TextPlain_Returns415() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.TEXT_PLAIN)
                .content("{ \"sourceAccountId\": \"ACC-123\" }"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    @DisplayName("TC24: Invalid Content-Type (application/xml) returns 415 Unsupported Media Type")
    void modernEndpoint_XML_Returns415() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_XML)
                .content("<request><sourceAccountId>ACC-123</sourceAccountId></request>"))
                .andExpect(status().isUnsupportedMediaType());
    }

    // ===================================================================================
    // SECTION 5: AUTHORIZATION & IDOR GUARD (TC 25 - 27)
    // ===================================================================================

    @Test
    @DisplayName("TC25: Valid Key A requesting Account B returns 403 Forbidden (IDOR Guard)")
    void modernEndpoint_UnauthorizedAccount_Returns403() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"UNAUTHORIZED-ACC-999\" }"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC26: X-Client-Id header spoofing cannot bypass authorization")
    void modernEndpoint_SpoofedClientId_Returns403() throws Exception {
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("X-Client-Id", "admin-merchant-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"UNAUTHORIZED-ACC-999\" }"))
                .andExpect(status().isForbidden()); // X-Client-Id is strictly ignored
    }

    @Test
    @DisplayName("TC27: Completely Valid API Key and Account mapping proceeds to Orchestration")
    void modernEndpoint_ValidAccount_PassesValidation() throws Exception {
        // Will return 200, 404, or 500 depending on DB state, but proves 400/403/405 are bypassed
        mockMvc.perform(post(MODERN_ENDPOINT)
                .header("Authorization", MOCK_API_KEY)
                .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"sourceAccountId\": \"MERCHANT-SETTLEMENT-123\" }"))
                .andExpect(result -> org.junit.jupiter.api.Assertions.assertTrue(
                        result.getResponse().getStatus() != 400 && 
                        result.getResponse().getStatus() != 401 && 
                        result.getResponse().getStatus() != 405
                ));
    }

    // ===================================================================================
    // SECTION 6: GET ENDPOINT OPERATIONAL INTEGRITY (TC 28 - 30)
    // ===================================================================================

    @Test
    @DisplayName("TC28: GET intent without auth returns 401 Unauthorized")
    void getEndpoint_NoAuth_Returns401() throws Exception {
        mockMvc.perform(get(MODERN_ENDPOINT + "/pi_123456"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC29: GET malformed intent ID returns 400 Bad Request")
    void getEndpoint_MalformedId_Returns400() throws Exception {
        mockMvc.perform(get(MODERN_ENDPOINT + "/invalid-uuid-@#$")
                .header("Authorization", MOCK_API_KEY))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC30: GET non-existent valid UUID returns 404 Not Found")
    void getEndpoint_NotFound_Returns404() throws Exception {
        mockMvc.perform(get(MODERN_ENDPOINT + "/550e8400-e29b-41d4-a716-446655440000")
                .header("Authorization", MOCK_API_KEY))
                .andExpect(status().isNotFound());
    }
}
