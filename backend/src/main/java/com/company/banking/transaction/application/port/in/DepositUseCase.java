package com.company.banking.transaction.application.port.in;

import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;

public interface DepositUseCase {
    TransactionResponse deposit(DepositRequest request);
}
