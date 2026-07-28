package com.company.banking.account.application.port.in;

import com.company.banking.common.enums.AccountStatus;

public interface ChangeAccountStatusUseCase {
    void changeStatus(String accountNumber, AccountStatus newStatus);
}
