package com.company.banking.transaction.application.port.in;

import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;

public interface ExternalPaymentUseCase {
    TransactionResponse processPayment(ExternalPaymentRequest request);
}
