package com.company.banking.apigateway.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateApiKeyServiceTest {

    @Mock
    private ApiKeyPersistencePort apiKeyPersistencePort;

    @Mock
    private AccountPersistencePort accountPersistencePort;

    @InjectMocks
    private CreateApiKeyService createApiKeyService;

    private final Long VALID_MERCHANT_ID = 200L;
    private final String VALID_ACCOUNT_ID = "ACC-1234";
    private Account mockAuthorizedAccount;

    @BeforeEach
    void setUp() {
        mockAuthorizedAccount = Account.builder()
                .accountNumber(VALID_ACCOUNT_ID)
                .merchantId(VALID_MERCHANT_ID)
                .build();
    }

    // ==========================================
    // CREATION INVARIANT TESTS
    // ==========================================

    @Test
    @DisplayName("01 Authorized account -> credential created with server-validated boundary")
    void createKey_WithAuthorizedAccount_SavesSuccessfully() {
        CreateApiKeyRequest request = new CreateApiKeyRequest();
        request.setName("Test Key");
        request.setEnvironment("SANDBOX");
        request.setLinkedAccountId(VALID_ACCOUNT_ID);
        
        when(accountPersistencePort.findByAccountNumber(VALID_ACCOUNT_ID))
                .thenReturn(Optional.of(mockAuthorizedAccount));
        when(apiKeyPersistencePort.save(any(ApiKey.class)))
                .thenAnswer(invocation -> {
                    ApiKey key = invocation.getArgument(0);
                    key.setId(999L);
                    return key;
                });

        ApiKeyResponse response = createApiKeyService.createApiKey(VALID_MERCHANT_ID, request);

        ArgumentCaptor<ApiKey> captor = ArgumentCaptor.forClass(ApiKey.class);
        verify(apiKeyPersistencePort, times(1)).save(captor.capture());

        ApiKey savedKey = captor.getValue();
        assertNotNull(response.getId());
        assertEquals(VALID_ACCOUNT_ID, savedKey.getLinkedAccountId());
        assertEquals(VALID_ACCOUNT_ID, response.getLinkedAccountId());
    }

    @Test
    @DisplayName("02 Unauthorized account -> rejected by boundary authorization mechanism")
    void createKey_WhenAuthorizationFails_ThrowsException() {
        CreateApiKeyRequest request = new CreateApiKeyRequest();
        request.setLinkedAccountId("ACC-9999");
        
        Account unownedAccount = Account.builder()
                .accountNumber("ACC-9999")
                .merchantId(300L) // Different merchant
                .build();
                
        when(accountPersistencePort.findByAccountNumber("ACC-9999"))
                .thenReturn(Optional.of(unownedAccount));

        ForbiddenException ex = assertThrows(ForbiddenException.class, 
                () -> createApiKeyService.createApiKey(VALID_MERCHANT_ID, request));
        
        assertTrue(ex.getMessage().contains("Not authorized to bind API key to this account"));
        verify(apiKeyPersistencePort, never()).save(any());
    }

    // ==========================================
    // ROTATION INVARIANT TESTS
    // ==========================================

    @Test
    @DisplayName("06 Existing key -> rotation preserves linkedAccountId and revokes old key")
    void rotateKey_PreservesBoundaryAndRevokesOldKey() {
        Long existingKeyId = 777L;
        ApiKey oldKey = ApiKey.builder()
                .id(existingKeyId)
                .name("Old Key")
                .environment("LIVE")
                .linkedAccountId(VALID_ACCOUNT_ID)
                .merchantId(VALID_MERCHANT_ID)
                .build();

        when(apiKeyPersistencePort.findById(existingKeyId)).thenReturn(Optional.of(oldKey));
        when(accountPersistencePort.findByAccountNumber(VALID_ACCOUNT_ID))
                .thenReturn(Optional.of(mockAuthorizedAccount));
        when(apiKeyPersistencePort.save(any(ApiKey.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ApiKeyResponse response = createApiKeyService.rotateApiKey(VALID_MERCHANT_ID, existingKeyId);

        // Assert Boundary Preservation
        assertEquals(VALID_ACCOUNT_ID, response.getLinkedAccountId());
        
        // Assert Revocation Logic
        ArgumentCaptor<ApiKey> keyCaptor = ArgumentCaptor.forClass(ApiKey.class);
        // save is called twice: once for revocation, once for new key creation
        verify(apiKeyPersistencePort, times(2)).save(keyCaptor.capture());
        
        ApiKey revokedKey = keyCaptor.getAllValues().get(0);
        assertNotNull(revokedKey.getRevokedAt());
        
        ApiKey newKey = keyCaptor.getAllValues().get(1);
        assertEquals(VALID_ACCOUNT_ID, newKey.getLinkedAccountId());
    }

    @Test
    @DisplayName("07 Unauthorized current account -> rotation rejected if access lost")
    void rotateKey_WhenUserLostAccountAccess_ThrowsException() {
        Long existingKeyId = 888L;
        ApiKey oldKey = ApiKey.builder()
                .id(existingKeyId)
                .linkedAccountId(VALID_ACCOUNT_ID)
                .merchantId(VALID_MERCHANT_ID)
                .build();

        when(apiKeyPersistencePort.findById(existingKeyId)).thenReturn(Optional.of(oldKey));
        
        // Simulate that the account now belongs to a different merchant
        Account reassignedAccount = Account.builder()
                .accountNumber(VALID_ACCOUNT_ID)
                .merchantId(300L) // Access lost!
                .build();
                
        when(accountPersistencePort.findByAccountNumber(VALID_ACCOUNT_ID))
                .thenReturn(Optional.of(reassignedAccount));

        assertThrows(ForbiddenException.class, 
                () -> createApiKeyService.rotateApiKey(VALID_MERCHANT_ID, existingKeyId));
        
        // Ensure old key is NOT revoked, and new key is NOT created
        verify(apiKeyPersistencePort, never()).save(any());
    }
}
