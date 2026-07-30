package com.company.banking.account.application.provisioning;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ParentAccountValidator {
    private final AccountPersistencePort accountPersistencePort;

    public void validate(String parentAccountId, Long customerId) {
        if (parentAccountId == null || parentAccountId.isEmpty()) return; // Root account

        Account parent = accountPersistencePort.findByAccountNumber(parentAccountId)
                .orElseThrow(() -> new NotFoundException("Parent Master Account not found: " + parentAccountId));

        if (!parent.getCustomerId().equals(customerId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You do not have ownership of the specified parent account.");
        }

        if (parent.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "Parent account must be ACTIVE to provision sub-ledgers.");
        }
    }
}