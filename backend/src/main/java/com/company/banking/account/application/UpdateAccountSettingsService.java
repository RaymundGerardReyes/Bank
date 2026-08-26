package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.UpdateAccountSettingsRequest;
import com.company.banking.account.application.port.in.UpdateAccountSettingsUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateAccountSettingsService implements UpdateAccountSettingsUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional
    public AccountResponse updateSettings(String accountNumber, UpdateAccountSettingsRequest request, Long customerId) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        // Security Guard: Ensure the authenticated user actually owns this account
        if (!account.getCustomerId().equals(customerId)) {
            throw new ForbiddenException("You do not have permission to modify this account's settings.");
        }

        // Apply partial updates
        if (request.getFrozen() != null) account.setFrozen(request.getFrozen());
        if (request.getAllowIncoming() != null) account.setAllowIncoming(request.getAllowIncoming());
        if (request.getAllowOutgoing() != null) account.setAllowOutgoing(request.getAllowOutgoing());
        if (request.getRequireDualApproval() != null) account.setRequireDualApproval(request.getRequireDualApproval());

        Account updatedAccount = accountPersistencePort.save(account);

        return AccountResponse.fromEntity(updatedAccount);
    }
}
