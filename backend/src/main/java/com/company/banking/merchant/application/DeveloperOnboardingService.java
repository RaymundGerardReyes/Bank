package com.company.banking.merchant.application;

import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingResponse;
import com.company.banking.merchant.application.port.out.MerchantPersistencePort;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.merchant.domain.Merchant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeveloperOnboardingService {

    private final MerchantPersistencePort merchantPersistencePort;
    private final CreateApiKeyService apiKeyService;
    private final AccountPersistencePort accountPersistencePort;

    @Transactional
    public DeveloperOnboardingResponse onboardDeveloper(Long customerId, DeveloperOnboardingRequest request) {
        String env = request.environment() != null && !request.environment().isBlank() ? request.environment() : "LIVE";
        String brn = request.businessRegistrationNumber();
        if (brn == null || brn.isBlank()) {
            if ("LIVE".equalsIgnoreCase(env)) {
                brn = "BRN-" + customerId + "-" + System.currentTimeMillis();
            } else {
                brn = "DEV-" + customerId + "-" + System.currentTimeMillis();
            }
        }
        String code = request.merchantCode();
        if (code == null || code.isBlank()) {
            code = "M-" + (int)(100000 + Math.random() * 900000);
        }

        // 1. Create Draft Merchant Entity in PENDING_ACCOUNT_SELECTION state
        Merchant merchant = Merchant.builder()
                .legalName(request.legalName())
                .merchantCode(code)
                .businessRegistrationNumber(brn)
                .ownerId(customerId)
                .status("PENDING_ACCOUNT_SELECTION")
                .build();
        
        Merchant savedMerchant = merchantPersistencePort.save(merchant);

        // 2. Provision & Persist the Authorized Settlement Account Boundary
        String settlementAccountNumber = "MERCHANT-SETTLEMENT-" + savedMerchant.getId();
        Account settlementAccount = Account.builder()
                .accountNumber(settlementAccountNumber)
                .customerId(customerId) // Bound to authenticated customer for account listing
                .merchantId(savedMerchant.getId())
                .balance(java.math.BigDecimal.ZERO)
                .currency("PHP")
                .status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                .build();
        accountPersistencePort.save(settlementAccount);

        // 3. Complete State Transition: Bind settlement account and activate Merchant
        savedMerchant.setSettlementAccount(settlementAccountNumber);
        savedMerchant.setStatus("ACTIVE");
        savedMerchant = merchantPersistencePort.save(savedMerchant);

        // 4. Generate API Key via the Centralized Credential Provisioner
        String cidr = request.cidrWhitelist() != null && !request.cidrWhitelist().isBlank() ? request.cidrWhitelist().trim() : "0.0.0.0/0";
        java.util.Set<String> scopes = (request.scopes() != null && !request.scopes().isEmpty())
                ? request.scopes()
                : java.util.Set.of("accounts:read", "accounts:write", "treasury:read", "treasury:write", "payments:write");

        CreateApiKeyRequest keyRequest = new CreateApiKeyRequest();
        keyRequest.setName(request.legalName() + " (" + env + " Key)");
        keyRequest.setEnvironment(env);
        keyRequest.setCidrWhitelist(cidr);
        keyRequest.setScopes(scopes);
        keyRequest.setLinkedAccountId(settlementAccountNumber);
        keyRequest.setApplicationName(request.legalName());

        String generatedApiKey = apiKeyService.createApiKey(savedMerchant.getId(), keyRequest).getRawKey();

        // 5. Return payload to the Developer Portal UI
        return new DeveloperOnboardingResponse(
                savedMerchant.getId(),
                settlementAccountNumber,
                generatedApiKey
        );
    }
}
