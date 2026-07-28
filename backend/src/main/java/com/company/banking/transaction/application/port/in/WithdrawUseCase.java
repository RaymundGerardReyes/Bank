package com.company.banking.transaction.application.port.in;

import com.company.banking.transaction.api.dto.WithdrawRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;

public interface WithdrawUseCase {
    TransactionResponse withdraw(WithdrawRequest request);
}
