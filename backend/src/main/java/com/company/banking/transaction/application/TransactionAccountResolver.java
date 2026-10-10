package com.company.banking.transaction.application;

import com.company.banking.account.application.AccountNumberValidator;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.apigateway.security.ApiKeyAuthenticationToken;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.transaction.domain.TransferPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionAccountResolver {
    private final AccountPersistencePort accountPersistencePort;
    private final TransferPolicy transferPolicy;
    private final AccountNumberValidator accountNumberValidator;
    private final CustomerPersistencePort customerPersistencePort;

    public Account resolveAndAuthorizeSource(String accountNumber) {
        // Enforce account identifier format and reject masked input before querying DB
        accountNumberValidator.validate(accountNumber, "Source account number");

        // Fast-path VAM authorization: reject unauthorized source accounts before DB lookup
        transferPolicy.validateApiKeyVamBinding(accountNumber.trim());

        Account account = accountPersistencePort.findByAccountNumber(accountNumber.trim())
                .orElseThrow(() -> new NotFoundException("Transfer failed: Source account '" + accountNumber + "' does not exist."));

        // Unavoidable VAM source check (e.g. root account restriction for unrestricted keys)
        transferPolicy.validateApiKeyVamBinding(account);

        // Authorize source-account debit against authenticated principal
        authorizeSourceAccountOwnership(account);

        return account;
    }

    public Account resolveAndAuthorizeDestination(String destinationAccountNumber, Account sourceAccount) {
        // Enforce account identifier format and reject masked input before querying DB
        accountNumberValidator.validate(destinationAccountNumber, "Destination account number");

        if (sourceAccount == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Source account must be resolved before destination.");
        }

        Account destination = accountPersistencePort.findByAccountNumber(destinationAccountNumber.trim())
                .orElseThrow(() -> new NotFoundException("Transfer failed: Destination account '" + destinationAccountNumber + "' does not exist."));

        // Unavoidable VAM destination check
        transferPolicy.validateDestinationWithinVamHierarchy(sourceAccount, destination);
        return destination;
    }

    private void authorizeSourceAccountOwnership(Account account) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            return;
        }

        if (auth instanceof ApiKeyAuthenticationToken apiToken) {
            if (!apiToken.canAccessAccount(account.getAccountNumber())) {
                throw new ForbiddenException(
                        ErrorCode.ACCOUNT_NOT_AUTHORIZED,
                        "API Key Policy: Not authorized to access source account [" + account.getAccountNumber() + "]. Bound account scope: " + apiToken.getLinkedAccountId()
                );
            }
            return;
        }

        boolean isPrivileged = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()) || "ROLE_TELLER".equals(a.getAuthority()));
        if (isPrivileged) {
            return;
        }

        String principalEmail = auth.getName();
        if (principalEmail != null && !principalEmail.isBlank() && !"anonymousUser".equals(principalEmail)) {
            Customer customer = customerPersistencePort.findByEmail(principalEmail)
                    .orElseThrow(() -> new ForbiddenException("Authenticated user profile not found."));

            if (account.getCustomerId() == null || !account.getCustomerId().equals(customer.getId())) {
                throw new ForbiddenException(
                        ErrorCode.FORBIDDEN,
                        "Access denied: You do not have authorization to debit source account."
                );
            }
        }
    }
}
