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

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeveloperOnboardingService {

    private final MerchantPersistencePort merchantPersistencePort;
    private final CreateApiKeyService apiKeyService;
    private final AccountPersistencePort accountPersistencePort;

    @Transactional
    public DeveloperOnboardingResponse onboardDeveloper(Long customerId, DeveloperOnboardingRequest request) {
        String env = request.environment() != null && !request.environment().isBlank() ? request.environment() : "LIVE";

        // 1. Sanitize inputs
        String requestedBrn = request.businessRegistrationNumber() != null ? request.businessRegistrationNumber().trim() : null;
        String requestedCode = request.merchantCode() != null ? request.merchantCode().trim() : null;
        String legalName = request.legalName() != null ? request.legalName().trim() : null;

        // 2. Identify if this customer already owns an existing merchant
        // Check by BRN first, then by Code, then by OwnerId
        Merchant existingMerchant = null;
        if (requestedBrn != null && !requestedBrn.isBlank()) {
            Optional<Merchant> byBrn = merchantPersistencePort.findByBusinessRegistrationNumber(requestedBrn);
            if (byBrn.isPresent()) {
                if (!byBrn.get().getOwnerId().equals(customerId)) {
                    throw new BusinessException(
                            ErrorCode.CONFLICT,
                            "Business Registration Number '" + requestedBrn + "' is already registered to another merchant."
                    );
                }
                existingMerchant = byBrn.get();
            }
        }

        if (existingMerchant == null && requestedCode != null && !requestedCode.isBlank()) {
            Optional<Merchant> byCode = merchantPersistencePort.findByMerchantCode(requestedCode);
            if (byCode.isPresent()) {
                if (!byCode.get().getOwnerId().equals(customerId)) {
                    throw new BusinessException(
                            ErrorCode.CONFLICT,
                            "Preferred routing code '" + requestedCode + "' is already in use by another merchant. Please choose a different code or leave blank to auto-generate."
                    );
                }
                existingMerchant = byCode.get();
            }
        }

        if (existingMerchant == null) {
            List<Merchant> owned = merchantPersistencePort.findByOwnerId(customerId);
            if (owned != null && !owned.isEmpty()) {
                existingMerchant = owned.get(0);
            }
        }

        // 3. Validate cross-merchant collisions
        if (requestedCode != null && !requestedCode.isBlank()) {
            Optional<Merchant> byCode = merchantPersistencePort.findByMerchantCode(requestedCode);
            if (byCode.isPresent() && !byCode.get().getOwnerId().equals(customerId)) {
                throw new BusinessException(
                        ErrorCode.CONFLICT,
                        "Preferred routing code '" + requestedCode + "' is already in use by another merchant. Please choose a different code or leave blank to auto-generate."
                );
            }
        }

        if (requestedBrn != null && !requestedBrn.isBlank()) {
            Optional<Merchant> byBrn = merchantPersistencePort.findByBusinessRegistrationNumber(requestedBrn);
            if (byBrn.isPresent() && !byBrn.get().getOwnerId().equals(customerId)) {
                throw new BusinessException(
                        ErrorCode.CONFLICT,
                        "Business Registration Number '" + requestedBrn + "' is already registered to another merchant."
                );
            }
        }

        // 4. Update existing or create new Merchant entity
        Merchant savedMerchant;
        if (existingMerchant != null) {
            if (legalName != null && !legalName.isBlank()) {
                existingMerchant.setLegalName(legalName);
            }
            if (requestedBrn != null && !requestedBrn.isBlank()) {
                existingMerchant.setBusinessRegistrationNumber(requestedBrn);
            } else if (existingMerchant.getBusinessRegistrationNumber() == null || existingMerchant.getBusinessRegistrationNumber().isBlank()) {
                String fallbackBrn = "LIVE".equalsIgnoreCase(env)
                        ? "BRN-" + customerId + "-" + System.currentTimeMillis()
                        : "DEV-" + customerId + "-" + System.currentTimeMillis();
                existingMerchant.setBusinessRegistrationNumber(fallbackBrn);
            }

            if (requestedCode != null && !requestedCode.isBlank()) {
                existingMerchant.setMerchantCode(requestedCode);
            } else if (existingMerchant.getMerchantCode() == null || existingMerchant.getMerchantCode().isBlank()) {
                String generatedCode;
                do {
                    generatedCode = "M-" + (int)(100000 + Math.random() * 900000);
                } while (merchantPersistencePort.findByMerchantCode(generatedCode).isPresent());
                existingMerchant.setMerchantCode(generatedCode);
            }

            existingMerchant.setStatus("ACTIVE");
            savedMerchant = merchantPersistencePort.save(existingMerchant);
        } else {
            String finalBrn = requestedBrn;
            if (finalBrn == null || finalBrn.isBlank()) {
                finalBrn = "LIVE".equalsIgnoreCase(env)
                        ? "BRN-" + customerId + "-" + System.currentTimeMillis()
                        : "DEV-" + customerId + "-" + System.currentTimeMillis();
            }

            String finalCode = requestedCode;
            if (finalCode == null || finalCode.isBlank()) {
                do {
                    finalCode = "M-" + (int)(100000 + Math.random() * 900000);
                } while (merchantPersistencePort.findByMerchantCode(finalCode).isPresent());
            }

            Merchant merchant = Merchant.builder()
                    .legalName(legalName != null && !legalName.isBlank() ? legalName : "Developer " + customerId + " Entity")
                    .merchantCode(finalCode)
                    .businessRegistrationNumber(finalBrn)
                    .ownerId(customerId)
                    .status("ACTIVE")
                    .build();

            savedMerchant = merchantPersistencePort.save(merchant);
        }

        // 2. Provision & Persist the Authorized Settlement Account Boundary (if missing)
        String settlementAccountNumber = savedMerchant.getSettlementAccount();
        if (settlementAccountNumber == null || settlementAccountNumber.isBlank()) {
            settlementAccountNumber = "MERCHANT-SETTLEMENT-" + savedMerchant.getId();
            final String accNum = settlementAccountNumber;
            if (accountPersistencePort.findByAccountNumber(accNum).isEmpty()) {
                Account settlementAccount = Account.builder()
                        .accountNumber(accNum)
                        .customerId(customerId) // Bound to authenticated customer for account listing
                        .merchantId(savedMerchant.getId())
                        .balance(java.math.BigDecimal.ZERO)
                        .currency("PHP")
                        .status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                        .allowIncoming(true)
                        .allowOutgoing(true)
                        .frozen(false)
                        .build();
                accountPersistencePort.save(settlementAccount);
            }

            // 3. Complete State Transition: Bind settlement account and activate Merchant
            savedMerchant.setSettlementAccount(settlementAccountNumber);
            savedMerchant.setStatus("ACTIVE");
            savedMerchant = merchantPersistencePort.save(savedMerchant);
        }

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
