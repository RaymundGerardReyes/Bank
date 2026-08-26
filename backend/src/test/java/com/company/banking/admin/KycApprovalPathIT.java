package com.company.banking.admin;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.admin.application.KycApprovalService;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.enums.RoleType;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import com.company.banking.transaction.domain.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class KycApprovalPathIT extends BaseIntegrationTest {

    @Autowired
    private KycApprovalService kycApprovalService;

    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    @MockitoBean
    private OpenAccountUseCase openAccountUseCase;

    @MockitoBean
    private DepositUseCase depositUseCase;

    @MockitoBean
    private AuditEventPublisher auditEventPublisher;

    private Customer pendingCustomer;

    @BeforeEach
    public void setup() {
        pendingCustomer = customerPersistencePort.save(Customer.builder()
                .firstName("Alice")
                .lastName("KYC")
                .email("kyc-" + UUID.randomUUID() + "@test.com")
                .password("securePass123!")
                .role(RoleType.CUSTOMER)
                .kycStatus("PENDING_VERIFICATION")
                .build());
    }

    @Test
    @DisplayName("P01 (Golden Path): KYC approval transitions customer kycStatus, provisions account, and seeds deposit bonus")
    public void p01_ApproveKyc_HappyPath() {
        when(openAccountUseCase.openAccount(any())).thenReturn(
                AccountResponse.builder().accountNumber("ACC-CHK-9999").status(AccountStatus.ACTIVE).build()
        );
        when(depositUseCase.deposit(any())).thenReturn(
                TransactionResponse.builder().transactionReference("TXN-DEP-8888").status(TransactionStatus.COMPLETED).build()
        );

        kycApprovalService.approveKyc(pendingCustomer.getId(), "ADMIN_OFFICER_01");

        Customer updatedCustomer = customerPersistencePort.findById(pendingCustomer.getId()).orElseThrow();
        assertEquals("ACTIVE", updatedCustomer.getKycStatus(), "Customer kycStatus must be updated to ACTIVE");

        verify(openAccountUseCase, times(1)).openAccount(any());
        verify(depositUseCase, times(1)).deposit(any());
        verify(auditEventPublisher, times(1)).publishEvent(eq("KYC_APPROVED"), eq("ADMIN_OFFICER_01"), any(), eq("KYC-APP-" + pendingCustomer.getId()));
    }

    @Test
    @DisplayName("P02 (State Guard): KYC approval fails when customer is already ACTIVE")
    public void p02_ApproveKyc_AlreadyActiveGuard() {
        pendingCustomer.setKycStatus("ACTIVE");
        customerPersistencePort.save(pendingCustomer);

        assertThrows(BusinessException.class, () -> {
            kycApprovalService.approveKyc(pendingCustomer.getId(), "ADMIN_OFFICER_01");
        });

        verifyNoInteractions(openAccountUseCase);
        verifyNoInteractions(depositUseCase);
    }

    @Test
    @DisplayName("P03 (Entity Integrity): KYC approval fails for non-existent customer")
    public void p03_ApproveKyc_CustomerNotFound() {
        assertThrows(NotFoundException.class, () -> {
            kycApprovalService.approveKyc(999999L, "ADMIN_OFFICER_01");
        });
    }
}
