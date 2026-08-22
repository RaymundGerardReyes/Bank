package com.company.banking.transaction;

import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TransactionIdempotencyIT {

    @Autowired
    private TransactionUseCase transactionUseCase;

    @Test
    public void duplicateTransferRequests_ShouldReturnSameTransaction_WithoutFailing() {
        // Arrange: Create a transfer request with a static idempotency key
        String idempotencyKey = "idem-duplicate-test-999";
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber("4859220013371001")
                .destinationAccountNumber("4859220013379999")
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(idempotencyKey)
                .description("Idempotency Test")
                .build();

        // Act: Execute the same request twice
        TransactionResponse firstResponse = transactionUseCase.processInternalTransfer(request);
        TransactionResponse secondResponse = transactionUseCase.processInternalTransfer(request);

        // Assert: Both responses should map to the exact same transaction reference
        assertEquals(firstResponse.getTransactionReference(), secondResponse.getTransactionReference());
    }
}
