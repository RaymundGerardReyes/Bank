package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.domain.TransferPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionAccountResolver {
    private final AccountPersistencePort accountPersistencePort;
    private final TransferPolicy transferPolicy;

    public Account resolveAndAuthorizeSource(String accountNumber) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Transfer failed: Source account '" + accountNumber + "' does not exist."));
        // Unavoidable VAM source check
        transferPolicy.validateApiKeyVamBinding(account);
        return account;
    }

    public Account resolveAndAuthorizeDestination(String destinationAccountNumber, Account sourceAccount) {
        if (sourceAccount == null) {
            throw new com.company.banking.common.exception.BusinessException(com.company.banking.common.exception.ErrorCode.INVALID_REQUEST, "Source account must be resolved before destination.");
        }
        Account destination = accountPersistencePort.findByAccountNumber(destinationAccountNumber)
                .orElseThrow(() -> new NotFoundException("Transfer failed: Destination account '" + destinationAccountNumber + "' does not exist."));
        // Unavoidable VAM destination check
        transferPolicy.validateDestinationWithinVamHierarchy(sourceAccount, destination);
        return destination;
    }
}
