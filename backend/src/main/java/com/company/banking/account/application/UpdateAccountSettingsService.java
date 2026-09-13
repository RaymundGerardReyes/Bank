package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.UpdateAccountSettingsRequest;
import com.company.banking.account.application.port.in.UpdateAccountSettingsUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.merchant.application.port.out.MerchantPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateAccountSettingsService implements UpdateAccountSettingsUseCase {
    
    private final AccountPersistencePort accountPersistencePort;
    private final MerchantPersistencePort merchantPersistencePort;
    
    @Transactional
    @Override
    public AccountResponse updateSettings(String accountNumber, UpdateAccountSettingsRequest request, Long ownerId) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new NotFoundException("Account '" + accountNumber + "' not found."));
            
        boolean isOwner = false;
        if (account.getCustomerId() != null && account.getCustomerId().equals(ownerId)) {
            isOwner = true;
        } else if (account.getMerchantId() != null && merchantPersistencePort != null) {
            isOwner = merchantPersistencePort.findById(account.getMerchantId())
                    .map(m -> ownerId.equals(m.getOwnerId()))
                    .orElse(false);
        }
        if (!isOwner) {
            throw new ForbiddenException("Not authorized to access this account");
        }

        if (request != null) {
            if (request.getFrozen() != null) {
                account.setFrozen(request.getFrozen());
                if (request.getFrozen()) {
                    account.setStatus(AccountStatus.FROZEN);
                } else if (account.getStatus() == AccountStatus.FROZEN) {
                    account.setStatus(AccountStatus.ACTIVE);
                }
            }
            if (request.getAllowIncoming() != null) {
                account.setAllowIncoming(request.getAllowIncoming());
            }
            if (request.getAllowOutgoing() != null) {
                account.setAllowOutgoing(request.getAllowOutgoing());
            }
            if (request.getRequireDualApproval() != null) {
                account.setRequireDualApproval(request.getRequireDualApproval());
            }
        }
        
        account = accountPersistencePort.save(account);

        return AccountResponse.fromEntity(account);
    }
}
