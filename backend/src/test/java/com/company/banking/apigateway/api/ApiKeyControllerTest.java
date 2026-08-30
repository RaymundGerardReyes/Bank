package com.company.banking.apigateway.api;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiKeyControllerTest {

    @Mock
    private CreateApiKeyService createApiKeyService;

    @Mock
    private ApiKeyJpaRepository apiKeyRepository;

    @Mock
    private CustomerPersistencePort customerPersistencePort;

    @Mock
    private MerchantJpaRepository merchantRepository;

    @InjectMocks
    private ApiKeyController apiKeyController;

    private Authentication mockAuthentication;
    private final Long CUSTOMER_ID = 101L;
    private final Long MERCHANT_ID = 500L;

    @BeforeEach
    void setUp() {
        mockAuthentication = new UsernamePasswordAuthenticationToken(
                CUSTOMER_ID, 
                "password",
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_MERCHANT"))
        );
        
        Merchant mockMerchant = Merchant.builder().id(MERCHANT_ID).build();
        when(merchantRepository.findByOwnerId(CUSTOMER_ID)).thenReturn(List.of(mockMerchant));
    }

    @Test
    @DisplayName("31 & 32 Controller delegates creation payload and principal ID unchanged")
    void create_DelegatesCorrectlyToUseCase() {
        CreateApiKeyRequest request = new CreateApiKeyRequest();
        request.setLinkedAccountId("ACC-123");
        
        ApiKeyResponse mockResponse = ApiKeyResponse.builder().id(999L).build();
        
        when(createApiKeyService.createApiKey(eq(MERCHANT_ID), any())).thenReturn(mockResponse);

        ResponseEntity<ApiResponse<ApiKeyResponse>> response = apiKeyController.createApiKey(request, mockAuthentication);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(createApiKeyService, times(1)).createApiKey(MERCHANT_ID, request);
    }

    @Test
    @DisplayName("34 & 35 Controller delegates rotation keyId and principal ID (ignoring bodies)")
    void rotate_DelegatesCorrectlyToUseCase() {
        Long keyId = 777L;
        ApiKeyResponse mockResponse = ApiKeyResponse.builder().id(888L).build();
        
        ApiKeyJpaEntity mockEntity = new ApiKeyJpaEntity();
        mockEntity.setMerchantId(MERCHANT_ID);
        
        when(apiKeyRepository.findById(keyId)).thenReturn(Optional.of(mockEntity));
        when(createApiKeyService.rotateApiKey(eq(MERCHANT_ID), eq(keyId))).thenReturn(mockResponse);

        ResponseEntity<ApiResponse<ApiKeyResponse>> response = apiKeyController.rotateApiKey(keyId, mockAuthentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(createApiKeyService, times(1)).rotateApiKey(MERCHANT_ID, keyId);
    }
}
