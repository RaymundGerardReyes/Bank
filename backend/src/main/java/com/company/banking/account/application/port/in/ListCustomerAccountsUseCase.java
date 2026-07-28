package com.company.banking.account.application.port.in;

import com.company.banking.account.api.dto.AccountSummaryResponse;
import java.util.List;

public interface ListCustomerAccountsUseCase {
    List<AccountSummaryResponse> listAccounts(Long customerId);
}
