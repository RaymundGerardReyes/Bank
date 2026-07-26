package com.company.banking.transaction.application.port.in;

import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;

public interface TransactionUseCase {
    TransactionResponse processInternalTransfer(InternalTransferRequest request);
}
