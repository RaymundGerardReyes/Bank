package com.company.banking.account.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Centralized validator for bank account identifiers.
 * Enforces repository-wide account format rules and guarantees that
 * masked display representations are never accepted as valid transaction identifiers.
 */
@Component
public class AccountNumberValidator {

    // Valid account format: 3 to 50 alphanumeric characters with optional hyphens or underscores
    private static final Pattern ACCOUNT_NUMBER_PATTERN = Pattern.compile("^[A-Za-z0-9_-]{3,50}$");

    /**
     * Validates that an account identifier is syntactically valid and unmasked.
     * Throws BusinessException with ErrorCode.INVALID_REQUEST if invalid or masked.
     *
     * @param accountNumber the raw account number to validate
     * @param fieldName     the human-readable field name for error reporting (e.g. "Source account number")
     */
    public void validate(String accountNumber, String fieldName) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, fieldName + " must not be blank.");
        }

        String trimmed = accountNumber.trim();

        if (trimmed.contains("*") || trimmed.contains("•")) {
            throw new BusinessException(
                    ErrorCode.INVALID_REQUEST,
                    "Masked account numbers cannot be used for transactions. Please provide the complete unmasked " + fieldName.toLowerCase() + "."
            );
        }

        if (!ACCOUNT_NUMBER_PATTERN.matcher(trimmed).matches()) {
            throw new BusinessException(
                    ErrorCode.INVALID_REQUEST,
                    "Invalid " + fieldName.toLowerCase() + " format. Account numbers must be between 3 and 50 alphanumeric characters."
            );
        }
    }

    /**
     * Checks if an account identifier is valid and unmasked without throwing an exception.
     *
     * @param accountNumber the account number string to test
     * @return true if valid, unmasked, and non-blank
     */
    public boolean isValid(String accountNumber) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return false;
        }
        String trimmed = accountNumber.trim();
        return !trimmed.contains("*") && !trimmed.contains("•") && ACCOUNT_NUMBER_PATTERN.matcher(trimmed).matches();
    }
}

