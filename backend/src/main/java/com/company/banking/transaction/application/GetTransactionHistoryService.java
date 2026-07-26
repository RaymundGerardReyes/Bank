package com.company.banking.transaction.application;

import com.company.banking.common.response.PagedResponse;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetTransactionHistoryService {

    private final TransactionJpaRepository transactionJpaRepository;

    @Transactional(readOnly = true)
    public PagedResponse<TransactionResponse> getHistory(String accountNumber, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<com.company.banking.transaction.domain.Transaction> transactionPage = 
            transactionJpaRepository.findBySourceAccountNumberOrDestinationAccountNumber(
                accountNumber, accountNumber, pageable);

        List<TransactionResponse> content = transactionPage.getContent().stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                transactionPage.getNumber(),
                transactionPage.getSize(),
                transactionPage.getTotalElements(),
                transactionPage.getTotalPages(),
                transactionPage.isLast()
        );
    }
}
