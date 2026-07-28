package com.company.banking.transaction.application.port.in;

import com.company.banking.common.response.PagedResponse;
import com.company.banking.transaction.api.dto.TransactionResponse;

public interface GetTransactionHistoryUseCase {
    PagedResponse<TransactionResponse> getHistory(String accountNumber, int page, int size);
}
