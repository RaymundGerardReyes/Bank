package com.company.banking.transaction.application;

import com.company.banking.common.response.PagedResponse;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetTransactionHistoryService {

    private final TransactionJpaRepository transactionRepository;

    @Transactional(readOnly = true)
    public PagedResponse<TransactionResponse> getHistory(String accountNumber, String direction, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Transaction> transactions;

        // Filter based on the requested direction
        if ("INBOUND".equalsIgnoreCase(direction)) {
            transactions = transactionRepository.findByDestinationAccountNumber(accountNumber, pageRequest);
        } else if ("OUTBOUND".equalsIgnoreCase(direction)) {
            transactions = transactionRepository.findBySourceAccountNumber(accountNumber, pageRequest);
        } else {
            // "ALL" - Fetch where the account is either the source or destination
            transactions = transactionRepository.findBySourceAccountNumberOrDestinationAccountNumber(accountNumber, accountNumber, pageRequest);
        }

        List<TransactionResponse> content = transactions.stream()
                .map(tx -> mapToResponse(tx, accountNumber))
                .collect(Collectors.toList());

        return PagedResponse.of(content, transactions.getNumber(), transactions.getSize(), transactions.getTotalElements(), transactions.getTotalPages(), transactions.isLast());
    }

    private TransactionResponse mapToResponse(Transaction tx, String requestedAccountNumber) {
        boolean isInbound = requestedAccountNumber.equals(tx.getDestinationAccountNumber());
        
        return TransactionResponse.builder()
                .transactionReference(tx.getTransactionReference())
                .sourceAccountNumber(tx.getSourceAccountNumber())
                .destinationAccountNumber(tx.getDestinationAccountNumber())
                // Assuming you have a way to fetch names, otherwise we use placeholders or account numbers
                .senderName("Account " + tx.getSourceAccountNumber()) 
                .recipientName("Account " + tx.getDestinationAccountNumber())
                .amount(tx.getAmount())
                .currency(tx.getCurrency())
                .status(tx.getStatus())
                .entryType(isInbound ? "CREDIT" : "DEBIT") // Determines the UI color!
                .createdAt(tx.getCreatedAt())
                .description(tx.getDescription() != null ? tx.getDescription() : (isInbound ? "Incoming Transfer" : "Outgoing Transfer"))
                .build();
    }
}
