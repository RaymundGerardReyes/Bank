package com.company.banking.transaction.domain;

import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.company.banking.apigateway.security.ApiKeyAuthenticationToken;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class TransferPolicy {

    // VULN 5: Null means "Root Account Only"
    public void validateApiKeyVamBinding(Account requestedSourceAccount) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth instanceof ApiKeyAuthenticationToken) {
            String restrictedVamAccountId = ((ApiKeyAuthenticationToken) auth).getLinkedAccountId();
            
            if (restrictedVamAccountId == null || restrictedVamAccountId.trim().isEmpty()) {
                if (requestedSourceAccount.getParentAccountId() != null && !requestedSourceAccount.getParentAccountId().trim().isEmpty()) {
                    throw new BusinessException(ErrorCode.FORBIDDEN, 
                        "API Key Policy: Unrestricted keys default to ROOT account only. Access to Sub-Account denied.");
                }
            } else if (!restrictedVamAccountId.equals(requestedSourceAccount.getAccountNumber())) {
                throw new BusinessException(ErrorCode.FORBIDDEN, 
                    "API Key Policy: This key is strictly bound to VAM Sub-Account [" + restrictedVamAccountId + "].");
            }
        }
    }

    // VULN 4: Destination Checking to stop Exfiltration
    public void validateDestinationWithinVamHierarchy(Account sourceAccount, Account destinationAccount) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof ApiKeyAuthenticationToken) {
            boolean isSameHierarchy = sourceAccount.getCustomerId().equals(destinationAccount.getCustomerId());
            if (!isSameHierarchy) {
                throw new BusinessException(ErrorCode.VAM_DESTINATION_NOT_PERMITTED,
                    "VAM Security Policy: API Key cannot transfer funds to an out-of-hierarchy destination.");
            }
        }
    }

    // --- ENTERPRISE VAM PERMISSION ENFORCEMENT ---
    public void validateVamPermissions(Account source, Account destination) {
        if (!source.isAllowOutgoing()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, 
                "VAM Policy Enforced: Sub-account [" + source.getAccountNumber() + "] is strictly restricted from OUTGOING transactions.");
        }
        if (!destination.isAllowIncoming()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, 
                "VAM Policy Enforced: Sub-account [" + destination.getAccountNumber() + "] is strictly restricted from INCOMING transactions.");
        }
    }

    public void validateVelocity(Account sourceAccount, BigDecimal amount, List<Transaction> todaysTransactions) {
        // Enterprise VAM: Use the dynamically provisioned sub-account limit, fallback to global default
        BigDecimal dailyLimit = (sourceAccount.getDailyLimit() != null && sourceAccount.getDailyLimit().compareTo(BigDecimal.ZERO) > 0)
                ? sourceAccount.getDailyLimit()
                : new BigDecimal("50000.00");

        BigDecimal todayTotal = todaysTransactions == null ? BigDecimal.ZERO :
                todaysTransactions.stream()
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (todayTotal.add(amount).compareTo(dailyLimit) > 0) {
            throw new BusinessException(
                    ErrorCode.TRANSFER_VELOCITY_EXCEEDED,
                    String.format("VAM Policy Enforced: Transfer exceeds the daily operational limit of $%.2f for this sub-account.", dailyLimit)
            );
        }
    }

    // --- NRPS (InstaPay/PESONet) Config-Driven Limits ---
    public void validateRailLimits(com.company.banking.orchestration.domain.PaymentRailConfiguration config, BigDecimal amount) {
        if (!config.isActive()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Payment rail " + config.getRailName() + " is currently inactive.");
        }
        if (config.getMaxAmountPerTx() != null && amount.compareTo(config.getMaxAmountPerTx()) > 0) {
            throw new BusinessException(
                    ErrorCode.INVALID_REQUEST,
                    String.format("Transfer amount of $%.2f exceeds the maximum allowed limit ($%.2f) for rail: %s", 
                            amount, config.getMaxAmountPerTx(), config.getRailName())
            );
        }
    }
}