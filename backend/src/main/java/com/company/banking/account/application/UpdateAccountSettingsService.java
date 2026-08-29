package com.company.banking.account.application;

import com.company.banking.account.api.dto.UpdateAccountSettingsRequest;
import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.domain.Account;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.account.application.port.in.UpdateAccountSettingsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateAccountSettingsService implements UpdateAccountSettingsUseCase {
    
    private final AccountPersistencePort accountPersistencePort;
    
    @Transactional
    public AccountResponse updateSettings(String accountNumber, UpdateAccountSettingsRequest request, Long ownerId) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new NotFoundException("Account not found"));
            
        if (!account.getCustomerId().equals(ownerId)) {
            throw new com.company.banking.common.exception.ForbiddenException("Not authorized to access this account");
        }

        if (request != null) {
            if (request.getFrozen() != null) {
                account.setFrozen(request.getFrozen());
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

        AccountResponse response = new AccountResponse();
        response.setAccountNumber(account.getAccountNumber());
        response.setFrozen(account.isFrozen());
        response.setAllowIncoming(account.isAllowIncoming());
        response.setAllowOutgoing(account.isAllowOutgoing());
        response.setRequireDualApproval(account.isRequireDualApproval());
        return response;
    }
}
