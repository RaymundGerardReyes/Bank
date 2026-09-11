package com.company.banking.merchant.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.merchant.api.dto.DeveloperOnboardingRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingResponse;
import com.company.banking.merchant.application.port.out.MerchantPersistencePort;
import com.company.banking.merchant.domain.Merchant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeveloperOnboardingServiceTest {

    @Mock
    private MerchantPersistencePort merchantPersistencePort;

    @Mock
    private CreateApiKeyService apiKeyService;

    @Mock
    private AccountPersistencePort accountPersistencePort;

    @InjectMocks
    private DeveloperOnboardingService onboardingService;

    private final Long CUSTOMER_ID = 42L;
    private final Long OTHER_CUSTOMER_ID = 999L;

    @BeforeEach
    void setUp() {
        lenient().when(apiKeyService.createApiKey(any(), any())).thenReturn(
                ApiKeyResponse.builder().rawKey("sk_test_mock_12345").build()
        );
        lenient().when(accountPersistencePort.findByAccountNumber(any())).thenReturn(Optional.empty());
    }

    @Test
    @DisplayName("Path 1: Fresh new merchant without BRN and code -> auto-generates BRN/code, provisions settlement account & issues key")
    void path1_BrandNewMerchant_AutoGeneratesBrnAndCode_ProvisionsAccountAndKey() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Fresh Dev Labs",
                null,
                null,
                "dev@freshlabs.io",
                "SANDBOX",
                null,
                null,
                "DEVELOPER"
        );

        when(merchantPersistencePort.findByMerchantCode(any())).thenReturn(Optional.empty());
        when(merchantPersistencePort.findByOwnerId(CUSTOMER_ID)).thenReturn(Collections.emptyList());

        when(merchantPersistencePort.save(any(Merchant.class))).thenAnswer(invocation -> {
            Merchant m = invocation.getArgument(0);
            if (m.getId() == null) {
                m.setId(101L);
            }
            return m;
        });

        DeveloperOnboardingResponse response = onboardingService.onboardDeveloper(CUSTOMER_ID, request);

        assertNotNull(response);
        assertEquals(101L, response.merchantId());
        assertEquals("MERCHANT-SETTLEMENT-101", response.settlementAccountNumber());
        assertEquals("sk_test_mock_12345", response.apiKey());

        // Verify account creation
        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
        verify(accountPersistencePort).save(accountCaptor.capture());
        Account savedAccount = accountCaptor.getValue();
        assertEquals("MERCHANT-SETTLEMENT-101", savedAccount.getAccountNumber());
        assertEquals(CUSTOMER_ID, savedAccount.getCustomerId());
        assertEquals(101L, savedAccount.getMerchantId());

        // Verify default scopes applied
        ArgumentCaptor<CreateApiKeyRequest> keyReqCaptor = ArgumentCaptor.forClass(CreateApiKeyRequest.class);
        verify(apiKeyService).createApiKey(eq(101L), keyReqCaptor.capture());
        assertTrue(keyReqCaptor.getValue().getScopes().contains("accounts:read"));
        assertEquals("0.0.0.0/0", keyReqCaptor.getValue().getCidrWhitelist());
    }

    @Test
    @DisplayName("Path 2: Fresh new merchant with explicit BRN, code, custom scopes and CIDR -> uses provided attributes")
    void path2_BrandNewMerchant_ExplicitBrnAndCode_CustomScopesAndCidr() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Acme Enterprise",
                "BRN-2026-EXPLICIT",
                "M-ACME-EXP",
                "admin@acme.com",
                "LIVE",
                "192.168.1.0/24",
                Set.of("payments:write", "treasury:read"),
                "MERCHANT"
        );

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-2026-EXPLICIT")).thenReturn(Optional.empty());
        when(merchantPersistencePort.findByMerchantCode("M-ACME-EXP")).thenReturn(Optional.empty());
        when(merchantPersistencePort.findByOwnerId(CUSTOMER_ID)).thenReturn(Collections.emptyList());

        when(merchantPersistencePort.save(any(Merchant.class))).thenAnswer(invocation -> {
            Merchant m = invocation.getArgument(0);
            if (m.getId() == null) {
                m.setId(202L);
            }
            return m;
        });

        DeveloperOnboardingResponse response = onboardingService.onboardDeveloper(CUSTOMER_ID, request);

        assertEquals(202L, response.merchantId());
        assertEquals("MERCHANT-SETTLEMENT-202", response.settlementAccountNumber());

        ArgumentCaptor<CreateApiKeyRequest> keyReqCaptor = ArgumentCaptor.forClass(CreateApiKeyRequest.class);
        verify(apiKeyService).createApiKey(eq(202L), keyReqCaptor.capture());
        assertEquals("192.168.1.0/24", keyReqCaptor.getValue().getCidrWhitelist());
        assertEquals(Set.of("payments:write", "treasury:read"), keyReqCaptor.getValue().getScopes());
    }

    @Test
    @DisplayName("Path 3: BRN collision with merchant owned by a different customer -> throws CONFLICT BusinessException")
    void path3_Collision_BrnBelongsToDifferentCustomer_Throws409Conflict() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Impostor Corp",
                "BRN-REGISTERED-TO-OTHER",
                "M-NEW-CODE",
                "impostor@fake.com"
        );

        Merchant existingOther = Merchant.builder()
                .id(99L)
                .ownerId(OTHER_CUSTOMER_ID)
                .businessRegistrationNumber("BRN-REGISTERED-TO-OTHER")
                .merchantCode("M-OTHER")
                .build();

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-REGISTERED-TO-OTHER"))
                .thenReturn(Optional.of(existingOther));

        BusinessException ex = assertThrows(BusinessException.class, () ->
                onboardingService.onboardDeveloper(CUSTOMER_ID, request)
        );

        assertEquals(ErrorCode.CONFLICT, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("already registered to another merchant"));
        verify(merchantPersistencePort, never()).save(any());
    }

    @Test
    @DisplayName("Path 4: Merchant code collision with merchant owned by a different customer -> throws CONFLICT BusinessException")
    void path4_Collision_MerchantCodeBelongsToDifferentCustomer_Throws409Conflict() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Valid Name",
                "BRN-UNCLAIMED",
                "M-TAKEN-BY-OTHER",
                "dev@valid.com"
        );

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-UNCLAIMED")).thenReturn(Optional.empty());

        Merchant existingOther = Merchant.builder()
                .id(88L)
                .ownerId(OTHER_CUSTOMER_ID)
                .businessRegistrationNumber("BRN-OTHER")
                .merchantCode("M-TAKEN-BY-OTHER")
                .build();

        when(merchantPersistencePort.findByMerchantCode("M-TAKEN-BY-OTHER"))
                .thenReturn(Optional.of(existingOther));

        BusinessException ex = assertThrows(BusinessException.class, () ->
                onboardingService.onboardDeveloper(CUSTOMER_ID, request)
        );

        assertEquals(ErrorCode.CONFLICT, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("already in use by another merchant"));
        verify(merchantPersistencePort, never()).save(any());
    }

    @Test
    @DisplayName("Path 5: Same customer re-onboards matching existing merchant by BRN -> updates profile idempotently without duplicate insert")
    void path5_Idempotent_SameCustomer_MatchesByBrn_UpdatesProfileWithoutDuplicateInsert() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Acme Updated Name",
                "BRN-MY-EXISTING",
                null, // Empty code (should retain or assign safely)
                "billing@acme.com"
        );

        Merchant existingMine = Merchant.builder()
                .id(505L)
                .ownerId(CUSTOMER_ID)
                .businessRegistrationNumber("BRN-MY-EXISTING")
                .merchantCode("M-MY-STABLE-CODE")
                .legalName("Acme Old Name")
                .settlementAccount("MERCHANT-SETTLEMENT-505")
                .status("ACTIVE")
                .build();

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-MY-EXISTING"))
                .thenReturn(Optional.of(existingMine));
        when(merchantPersistencePort.save(any(Merchant.class))).thenAnswer(i -> i.getArgument(0));

        DeveloperOnboardingResponse response = onboardingService.onboardDeveloper(CUSTOMER_ID, request);

        assertEquals(505L, response.merchantId());
        assertEquals("MERCHANT-SETTLEMENT-505", response.settlementAccountNumber());

        // Verify that the existing entity was updated in place and saved
        ArgumentCaptor<Merchant> merchantCaptor = ArgumentCaptor.forClass(Merchant.class);
        verify(merchantPersistencePort).save(merchantCaptor.capture());
        Merchant updated = merchantCaptor.getValue();
        assertEquals(505L, updated.getId());
        assertEquals("Acme Updated Name", updated.getLegalName());
        assertEquals("M-MY-STABLE-CODE", updated.getMerchantCode()); // preserved!
        assertEquals("BRN-MY-EXISTING", updated.getBusinessRegistrationNumber());
    }

    @Test
    @DisplayName("Path 6: Same customer re-onboards matching existing merchant by Code -> updates profile idempotently without duplicate insert")
    void path6_Idempotent_SameCustomer_MatchesByCode_UpdatesProfileWithoutDuplicateInsert() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Fintech Solutions Corp",
                "BRN-NEW-REGISTRATION",
                "M-MY-SAVED-CODE",
                "fintech@solutions.io"
        );

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-NEW-REGISTRATION")).thenReturn(Optional.empty());

        Merchant existingMine = Merchant.builder()
                .id(606L)
                .ownerId(CUSTOMER_ID)
                .businessRegistrationNumber("DEV-TEMPORARY")
                .merchantCode("M-MY-SAVED-CODE")
                .legalName("Old Fintech")
                .settlementAccount("MERCHANT-SETTLEMENT-606")
                .status("ACTIVE")
                .build();

        when(merchantPersistencePort.findByMerchantCode("M-MY-SAVED-CODE"))
                .thenReturn(Optional.of(existingMine));
        when(merchantPersistencePort.save(any(Merchant.class))).thenAnswer(i -> i.getArgument(0));

        DeveloperOnboardingResponse response = onboardingService.onboardDeveloper(CUSTOMER_ID, request);

        assertEquals(606L, response.merchantId());
        assertEquals("MERCHANT-SETTLEMENT-606", response.settlementAccountNumber());

        ArgumentCaptor<Merchant> merchantCaptor = ArgumentCaptor.forClass(Merchant.class);
        verify(merchantPersistencePort).save(merchantCaptor.capture());
        Merchant updated = merchantCaptor.getValue();
        assertEquals("Fintech Solutions Corp", updated.getLegalName());
        assertEquals("BRN-NEW-REGISTRATION", updated.getBusinessRegistrationNumber());
    }

    @Test
    @DisplayName("Path 7: Workspace Upgrade - customer already has initial default workspace -> upgrades in-place")
    void path7_WorkspaceUpgrade_CustomerAlreadyHasDefaultWorkspace_UpgradesInPlace() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Acme Official Inc",
                "BRN-OFFICIAL-2026",
                "M-OFFICIAL-CODE",
                "official@acme.com"
        );

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-OFFICIAL-2026")).thenReturn(Optional.empty());
        when(merchantPersistencePort.findByMerchantCode("M-OFFICIAL-CODE")).thenReturn(Optional.empty());

        Merchant defaultWorkspace = Merchant.builder()
                .id(707L)
                .ownerId(CUSTOMER_ID)
                .legalName("Developer 42 Workspace")
                .merchantCode("DEV-42")
                .businessRegistrationNumber("DEV-REG-42-123456789")
                .status("ACTIVE")
                .build();

        when(merchantPersistencePort.findByOwnerId(CUSTOMER_ID)).thenReturn(List.of(defaultWorkspace));
        when(merchantPersistencePort.save(any(Merchant.class))).thenAnswer(i -> i.getArgument(0));

        DeveloperOnboardingResponse response = onboardingService.onboardDeveloper(CUSTOMER_ID, request);

        assertEquals(707L, response.merchantId());

        // Verify in-place upgrade
        ArgumentCaptor<Merchant> merchantCaptor = ArgumentCaptor.forClass(Merchant.class);
        verify(merchantPersistencePort, atLeastOnce()).save(merchantCaptor.capture());
        Merchant upgraded = merchantCaptor.getValue();
        assertEquals(707L, upgraded.getId());
        assertEquals("Acme Official Inc", upgraded.getLegalName());
        assertEquals("BRN-OFFICIAL-2026", upgraded.getBusinessRegistrationNumber());
        assertEquals("M-OFFICIAL-CODE", upgraded.getMerchantCode());
    }

    @Test
    @DisplayName("Path 8: Existing settlement account is preserved -> does not create duplicate account in persistence port")
    void path8_SettlementAccount_PreservesExistingSettlementAccount_DoesNotRecreate() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Acme Bank Corp",
                "BRN-PRESERVED",
                "M-PRESERVED",
                "ops@acme.com"
        );

        Merchant existingWithAccount = Merchant.builder()
                .id(808L)
                .ownerId(CUSTOMER_ID)
                .businessRegistrationNumber("BRN-PRESERVED")
                .merchantCode("M-PRESERVED")
                .legalName("Acme Bank Corp")
                .settlementAccount("MERCHANT-SETTLEMENT-808")
                .status("ACTIVE")
                .build();

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-PRESERVED")).thenReturn(Optional.of(existingWithAccount));
        when(merchantPersistencePort.save(any(Merchant.class))).thenAnswer(i -> i.getArgument(0));

        DeveloperOnboardingResponse response = onboardingService.onboardDeveloper(CUSTOMER_ID, request);

        assertEquals("MERCHANT-SETTLEMENT-808", response.settlementAccountNumber());
        // Verify accountPersistencePort.save was NEVER called because settlement account already existed!
        verify(accountPersistencePort, never()).save(any());
    }

    @Test
    @DisplayName("Path 9: Cross-collision: customer matches by BRN, but requested new code belongs to another merchant -> throws 409 Conflict")
    void path9_CrossCollision_MatchesBrnButRequestedNewCodeOwnedByOther_Throws409Conflict() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Acme Corp",
                "BRN-MY-BIZ",
                "M-CODE-OF-OTHER",
                "dev@acme.com"
        );

        Merchant myMerchant = Merchant.builder()
                .id(901L)
                .ownerId(CUSTOMER_ID)
                .businessRegistrationNumber("BRN-MY-BIZ")
                .merchantCode("M-MY-ORIGINAL")
                .build();

        Merchant otherMerchant = Merchant.builder()
                .id(902L)
                .ownerId(OTHER_CUSTOMER_ID)
                .businessRegistrationNumber("BRN-OTHER")
                .merchantCode("M-CODE-OF-OTHER")
                .build();

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-MY-BIZ")).thenReturn(Optional.of(myMerchant));
        when(merchantPersistencePort.findByMerchantCode("M-CODE-OF-OTHER")).thenReturn(Optional.of(otherMerchant));

        BusinessException ex = assertThrows(BusinessException.class, () ->
                onboardingService.onboardDeveloper(CUSTOMER_ID, request)
        );

        assertEquals(ErrorCode.CONFLICT, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("is already in use by another merchant"));
        verify(merchantPersistencePort, never()).save(any());
    }

    @Test
    @DisplayName("Path 10: Cross-collision: customer matches by Code, but requested new BRN belongs to another merchant -> throws 409 Conflict")
    void path10_CrossCollision_MatchesCodeButRequestedNewBrnOwnedByOther_Throws409Conflict() {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Acme Corp",
                "BRN-CODE-OF-OTHER",
                "M-MY-CODE",
                "dev@acme.com"
        );

        Merchant otherMerchant = Merchant.builder()
                .id(1001L)
                .ownerId(OTHER_CUSTOMER_ID)
                .businessRegistrationNumber("BRN-CODE-OF-OTHER")
                .merchantCode("M-OTHER-CODE")
                .build();

        when(merchantPersistencePort.findByBusinessRegistrationNumber("BRN-CODE-OF-OTHER")).thenReturn(Optional.of(otherMerchant));

        BusinessException ex = assertThrows(BusinessException.class, () ->
                onboardingService.onboardDeveloper(CUSTOMER_ID, request)
        );

        assertEquals(ErrorCode.CONFLICT, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("already registered to another merchant"));
        verify(merchantPersistencePort, never()).save(any());
    }
}

