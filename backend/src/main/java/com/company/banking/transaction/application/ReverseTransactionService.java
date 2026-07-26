package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReverseTransactionService {

    private final LedgerPersistencePort ledgerPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    @Transactional
    public TransactionResponse reverse(String originalTransactionReference) {
        // We do not actually look up the exact original transaction from an interface here, 
        // assuming it requires a raw SQL query or finding it first. For this mock stub:
        throw new BusinessException(ErrorCode.SYSTEM_ERROR, "Transaction reversal requires ledger admin privileges");
    }
}
