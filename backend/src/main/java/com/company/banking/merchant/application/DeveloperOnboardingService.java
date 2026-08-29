package com.company.banking.merchant.application;

import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingResponse;
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

    @Transactional
    public DeveloperOnboardingResponse onboardDeveloper(DeveloperOnboardingRequest request) {
        // 1. Create the Merchant Record dynamically
        Merchant merchant = Merchant.builder()
                .legalName(request.legalName())
                .merchantCode(request.merchantCode())
                .businessRegistrationNumber(request.businessRegistrationNumber())
                .status("ACTIVE")
                .build();
        
        Merchant savedMerchant = merchantRepository.save(merchant);

        // 2. Generate a valid API Key bound strictly to this new Merchant
        CreateApiKeyRequest keyRequest = new CreateApiKeyRequest();
        keyRequest.setName(request.legalName() + " Production Key");
        keyRequest.setEnvironment("LIVE");
        keyRequest.setScopes(java.util.Set.of("API_ACCESS"));
        keyRequest.setLinkedAccountId("MERCHANT-SETTLEMENT-" + savedMerchant.getId());

        String generatedApiKey = apiKeyService.createApiKey(savedMerchant.getId(), keyRequest).getRawKey();

        // 3. Return payload to the Developer Portal UI
        return new DeveloperOnboardingResponse(
                savedMerchant.getId(),
                "MERCHANT-SETTLEMENT-" + savedMerchant.getId(), // Assumes deterministic account format
                generatedApiKey
        );
    }
}
