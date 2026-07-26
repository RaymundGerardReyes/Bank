package com.company.banking.account.application.port.out;

import com.company.banking.account.domain.Account;

import java.util.List;
import java.util.Optional;

public interface AccountPersistencePort {
    Account save(Account account);
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByCustomerId(Long customerId);
}
