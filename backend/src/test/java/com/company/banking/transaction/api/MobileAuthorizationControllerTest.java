package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.domain.Customer;
import com.company.banking.transaction.application.TransactionAuthorizationService;
import com.company.banking.transaction.domain.AuthorizationAttempt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MobileAuthorizationControllerTest {

    @Mock
    private TransactionAuthorizationService authorizationService;

    @InjectMocks
    private MobileAuthorizationController controller;

    private Authentication mockAuthentication;
    private final Long USER_ID = 888L;

    @BeforeEach
    void setUp() {
        Customer customer = Customer.builder().id(USER_ID).email("user@novabank.com").build();
        mockAuthentication = new UsernamePasswordAuthenticationToken(
                customer,
                "credentials",
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
    }

    @Test
    @DisplayName("Returns pending mobile authorizations for authenticated user")
    void getPendingAuthorizations_Success() {
        AuthorizationAttempt attempt = AuthorizationAttempt.builder()
                .id(1L)
                .transactionIntentId(10L)
                .amount(new BigDecimal("1500.00"))
                .status("PENDING")
                .authType("OOB_MOBILE")
                .build();

        when(authorizationService.getPendingMobileAuthorizations(USER_ID)).thenReturn(List.of(attempt));

        ResponseEntity<ApiResponse<List<AuthorizationAttempt>>> response = controller.getPendingAuthorizations(mockAuthentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getData().size());
        verify(authorizationService, times(1)).getPendingMobileAuthorizations(USER_ID);
    }

    @Test
    @DisplayName("Approves authorization successfully via mobile device")
    void approveAuthorization_Success() {
        Long intentId = 10L;
        doNothing().when(authorizationService).approveMobileAuthorization(intentId, USER_ID);

        ResponseEntity<ApiResponse<Void>> response = controller.approveAuthorization(intentId, mockAuthentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authorizationService, times(1)).approveMobileAuthorization(intentId, USER_ID);
    }

    @Test
    @DisplayName("Denies authorization successfully via mobile device")
    void denyAuthorization_Success() {
        Long intentId = 10L;
        doNothing().when(authorizationService).denyMobileAuthorization(intentId, USER_ID);

        ResponseEntity<ApiResponse<Void>> response = controller.denyAuthorization(intentId, mockAuthentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authorizationService, times(1)).denyMobileAuthorization(intentId, USER_ID);
    }
}
