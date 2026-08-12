package com.company.banking.admin.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.admin.application.port.in.KycApprovalUseCase;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KycApprovalService implements KycApprovalUseCase {

    private final CustomerPersistencePort customerPersistencePort;
    private final OpenAccountUseCase openAccountUseCase;
    private final DepositUseCase depositUseCase;
    private final AuditEventPublisher auditEventPublisher;

    @Override
    @Transactional
    public void approveKyc(Long customerId, String approvedByAdmin) {
        Customer customer = customerPersistencePort.findById(customerId)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        if (!"PENDING_VERIFICATION".equals(customer.getKycStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Customer is not in a pending verification state");
        }

        // MAKER-CHECKER: Update status to ACTIVE
        customer.setKycStatus("ACTIVE");
        customerPersistencePort.save(customer);

        // Provision default checking account for the newly approved user
        AccountResponse newAccount = openAccountUseCase.openAccount(OpenAccountRequest.builder()
                .customerId(customer.getId())
                .currency("USD")
                .build());

        // Process formal ledger entry for onboarding bonus
        depositUseCase.deposit(DepositRequest.builder()
                .accountNumber(newAccount.getAccountNumber())
                .amount(BigDecimal.valueOf(5000.00))
                .idempotencyKey("ONBOARD-BONUS-" + UUID.randomUUID())
                .build());

        log.info("KYC Approved for Customer ID: {} by Admin: {}", customerId, approvedByAdmin);
        
        auditEventPublisher.publishEvent("KYC_APPROVED", approvedByAdmin,
                "Admin officially verified CDD identity documents and approved KYC for customer " + customerId, 
                "KYC-APP-" + customerId);
    }
}
