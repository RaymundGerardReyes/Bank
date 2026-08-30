package com.company.banking.apigateway.security;

import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.apigateway.application.CreateApiKeyService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApiKeyAuthenticationFilterTest {

    @Mock
    private ApiKeyPersistencePort apiKeyPersistencePort;

    @Mock
    private CidrWhitelistValidator cidrValidator;

    @Test
    void invalidApiKeyReturnsUnauthorized() throws Exception {
        ApiKeyAuthenticationFilter filter = new ApiKeyAuthenticationFilter(apiKeyPersistencePort, cidrValidator);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/transfers/internal");
        request.setRequestURI("/api/v1/transfers/internal");
        request.addHeader("Authorization", "Bearer sk_test_invalid");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        when(apiKeyPersistencePort.findByKeyHash(anyString())).thenReturn(Optional.empty());

        filter.doFilter(request, response, chain);

        assertEquals(401, response.getStatus());
        assertTrue(response.getContentAsString().contains("\"code\":\"ERR_401\""));
        assertNull(chain.getRequest());
    }

    @Test
    void receiptSendWithoutTreasuryWriteScopeReturnsForbiddenAndKeepsAuditIdentity() throws Exception {
        String rawKey = "sk_test_receipt_read_only";
        ApiKeyAuthenticationFilter filter = new ApiKeyAuthenticationFilter(apiKeyPersistencePort, cidrValidator);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/transactions/receipt/send");
        request.setRequestURI("/api/v1/transactions/receipt/send");
        request.addHeader("Authorization", "Bearer " + rawKey);
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        when(apiKeyPersistencePort.findByKeyHash(eq(CreateApiKeyService.hashKey(rawKey))))
                .thenReturn(Optional.of(apiKeyWithScopes(rawKey, Set.of("treasury:read"))));
        when(cidrValidator.isIpWhitelisted(anyString(), eq("0.0.0.0/0"))).thenReturn(true);

        filter.doFilter(request, response, chain);

        assertEquals(403, response.getStatus());
        assertTrue(response.getContentAsString().contains("\"code\":\"ERR_GATEWAY_002\""));
        assertEquals("SCOPE_REJECTED", request.getAttribute("GATEWAY_AUTH_STAGE"));
        assertEquals(42L, request.getAttribute("GATEWAY_API_KEY_ID"));
        assertEquals(1001L, request.getAttribute("GATEWAY_MERCHANT_ID"));
        assertEquals("4859228705057459", request.getAttribute("GATEWAY_LINKED_ACCOUNT_ID"));
        assertNull(chain.getRequest());
    }

    @Test
    void receiptSendWithTreasuryWriteScopeAuthenticatesAndContinues() throws Exception {
        String rawKey = "sk_test_receipt_write";
        ApiKeyAuthenticationFilter filter = new ApiKeyAuthenticationFilter(apiKeyPersistencePort, cidrValidator);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/transactions/receipt/send");
        request.setRequestURI("/api/v1/transactions/receipt/send");
        request.addHeader("Authorization", "Bearer " + rawKey);
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        when(apiKeyPersistencePort.findByKeyHash(eq(CreateApiKeyService.hashKey(rawKey))))
                .thenReturn(Optional.of(apiKeyWithScopes(rawKey, Set.of("treasury:write"))));
        when(cidrValidator.isIpWhitelisted(anyString(), eq("0.0.0.0/0"))).thenReturn(true);

        try {
            filter.doFilter(request, response, chain);

            assertEquals(200, response.getStatus());
            assertEquals("API_KEY_AUTHENTICATED", request.getAttribute("GATEWAY_AUTH_STAGE"));
            assertInstanceOf(ApiKeyAuthenticationToken.class, SecurityContextHolder.getContext().getAuthentication());
            assertTrue(((ApiKeyAuthenticationToken) SecurityContextHolder.getContext().getAuthentication()).getScopes().contains("treasury:write"));
            jakarta.servlet.http.HttpServletRequest passedRequest = (jakarta.servlet.http.HttpServletRequest) chain.getRequest();
            assertTrue(passedRequest instanceof jakarta.servlet.http.HttpServletRequestWrapper);
            assertEquals(request, ((jakarta.servlet.http.HttpServletRequestWrapper) passedRequest).getRequest());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    private ApiKey apiKeyWithScopes(String rawKey, Set<String> scopes) {
        return ApiKey.builder()
                .id(42L)
                .keyPrefix(rawKey.substring(0, 8))
                .merchantId(1001L)
                .keyHash(CreateApiKeyService.hashKey(rawKey))
                .name("Receipt Scope Test Key")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes(scopes)
                .linkedAccountId("4859228705057459")
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build();
    }
}
