package com.company.banking.transaction.domain;

import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.company.banking.apigateway.security.ApiKeyAuthenticationToken;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class TransferPolicyTest {

    private TransferPolicy transferPolicy;

    @BeforeEach
    void setUp() {
        transferPolicy = new TransferPolicy();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("validateApiKeyVamBinding(String): matching linked account passes")
    void stringOverload_MatchingLinkedAccount_Passes() {
        ApiKeyAuthenticationToken token = new ApiKeyAuthenticationToken(
                "sk_live_test", 100L, "LIVE", 1L, "4859220013371001",
                Set.of("treasury:write"), Collections.emptyList()
        );
        SecurityContextHolder.getContext().setAuthentication(token);

        assertDoesNotThrow(() -> transferPolicy.validateApiKeyVamBinding("4859220013371001"));
    }

    @Test
    @DisplayName("validateApiKeyVamBinding(String): mismatched account throws 403 Forbidden with policy message")
    void stringOverload_MismatchedAccount_ThrowsForbidden() {
        ApiKeyAuthenticationToken token = new ApiKeyAuthenticationToken(
                "sk_live_test", 100L, "LIVE", 1L, "4859220013371001",
                Set.of("treasury:write"), Collections.emptyList()
        );
        SecurityContextHolder.getContext().setAuthentication(token);

        BusinessException ex = assertThrows(BusinessException.class,
                () -> transferPolicy.validateApiKeyVamBinding("4859220013379999"));

        assertEquals(ErrorCode.FORBIDDEN, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("API Key Policy: This key is strictly bound to VAM Sub-Account [4859220013371001]"));
    }

    @Test
    @DisplayName("validateApiKeyVamBinding(String): unlinked key passes string check")
    void stringOverload_UnlinkedKey_Passes() {
        ApiKeyAuthenticationToken token = new ApiKeyAuthenticationToken(
                "sk_live_test", 100L, "LIVE", 1L, null,
                Set.of("treasury:write"), Collections.emptyList()
        );
        SecurityContextHolder.getContext().setAuthentication(token);

        assertDoesNotThrow(() -> transferPolicy.validateApiKeyVamBinding("4859220013371001"));
    }

    @Test
    @DisplayName("validateApiKeyVamBinding(String): JWT session auth passes without VAM key restrictions")
    void stringOverload_JwtAuth_Passes() {
        UsernamePasswordAuthenticationToken jwtAuth = new UsernamePasswordAuthenticationToken(
                "user@example.com", null, Collections.emptyList()
        );
        SecurityContextHolder.getContext().setAuthentication(jwtAuth);

        assertDoesNotThrow(() -> transferPolicy.validateApiKeyVamBinding("4859220013371001"));
        assertDoesNotThrow(() -> transferPolicy.validateApiKeyVamBinding("9999999999999999"));
    }

    @Test
    @DisplayName("validateApiKeyVamBinding(Account): unlinked key accessing sub-account throws 403 Forbidden")
    void accountOverload_UnlinkedKey_SubAccount_ThrowsForbidden() {
        ApiKeyAuthenticationToken token = new ApiKeyAuthenticationToken(
                "sk_live_test", 100L, "LIVE", 1L, null,
                Set.of("treasury:write"), Collections.emptyList()
        );
        SecurityContextHolder.getContext().setAuthentication(token);

        Account subAccount = Account.builder()
                .accountNumber("4859220013371002")
                .parentAccountId("4859220013371001")
                .build();

        BusinessException ex = assertThrows(BusinessException.class,
                () -> transferPolicy.validateApiKeyVamBinding(subAccount));

        assertEquals(ErrorCode.FORBIDDEN, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("API Key Policy: Unrestricted keys default to ROOT account only"));
    }
}
