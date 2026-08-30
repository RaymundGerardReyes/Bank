package com.company.banking.merchant.application;

import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingResponse;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeveloperOnboardingService {

    private final MerchantJpaRepository merchantRepository;
    private final CreateApiKeyService apiKeyService;
    private final AccountPersistencePort accountPersistencePort;

    @Transactional
    public DeveloperOnboardingResponse onboardDeveloper(Long customerId, DeveloperOnboardingRequest request) {
        // 1. Create Draft Merchant Entity in PENDING_ACCOUNT_SELECTION state
        Merchant merchant = Merchant.builder()
                .legalName(request.legalName())
                .merchantCode(request.merchantCode())
                .businessRegistrationNumber(request.businessRegistrationNumber())
                .ownerId(customerId)
                .status("PENDING_ACCOUNT_SELECTION")
                .build();
        
        Merchant savedMerchant = merchantRepository.save(merchant);

        // 2. Provision & Persist the Authorized Settlement Account Boundary
        String settlementAccountNumber = "MERCHANT-SETTLEMENT-" + savedMerchant.getId();
        Account settlementAccount = Account.builder()
                .accountNumber(settlementAccountNumber)
                .merchantId(savedMerchant.getId())
                .balance(java.math.BigDecimal.ZERO)
                .currency("PHP")
                .status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                .build();
        accountPersistencePort.save(settlementAccount);

        // 3. Complete State Transition: Bind settlement account and activate Merchant
        savedMerchant.setSettlementAccount(settlementAccountNumber);
        savedMerchant.setStatus("ACTIVE");
        savedMerchant = merchantRepository.save(savedMerchant);

        // 4. Generate API Key bound strictly to this authorized Merchant & Account
        CreateApiKeyRequest keyRequest = new CreateApiKeyRequest();
        keyRequest.setName(request.legalName() + " Production Key");
        keyRequest.setEnvironment("LIVE");
        keyRequest.setScopes(java.util.Set.of("API_ACCESS"));
        keyRequest.setLinkedAccountId(settlementAccountNumber);

        String generatedApiKey = apiKeyService.createApiKey(savedMerchant.getId(), keyRequest).getRawKey();

        // 5. Return payload to the Developer Portal UI
        return new DeveloperOnboardingResponse(
                savedMerchant.getId(),
                settlementAccountNumber,
                generatedApiKey
        );
    }
}
