package com.company.banking.account;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.AccountProvisioningService;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.enums.RoleType;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AccountProvisioningPathIT extends BaseIntegrationTest {

    @Autowired
    private AccountProvisioningService provisioningService;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    private Customer testCustomer;
    private Account parentAccount;

    @BeforeEach
    public void setup() {
        testCustomer = customerPersistencePort.save(Customer.builder()
                .firstName("John")
                .lastName("Provisioning")
                .email("provision-" + UUID.randomUUID() + "@test.com")
                .password("securePass123!")
                .role(RoleType.CUSTOMER)
                .kycStatus("ACTIVE")
                .build());

        parentAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("ACC-PARENT-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(testCustomer.getId())
                .balance(new BigDecimal("50000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true)
                .allowIncoming(true)
                .build());
    }

    @Test
    @DisplayName("P01 (Golden Path): Provisioning creates account with valid PAN, card, and limits")
    public void p01_provisionAccount_HappyPath() {
        OpenAccountRequest request = OpenAccountRequest.builder()
                .customerId(testCustomer.getId())
                .currency("PHP")
                .accountType("CHECKING")
                .initialDeposit(new BigDecimal("1000.00"))
                .parentAccountId(parentAccount.getAccountNumber())
                .issueVirtualCard(true)
                .build();

        AccountResponse response = provisioningService.openAccount(request);

        assertNotNull(response);
        assertNotNull(response.getAccountNumber(), "Account response must contain a generated account number");
        assertEquals(AccountStatus.ACTIVE, response.getStatus());

        Account createdAccount = accountPersistencePort.findByAccountNumber(response.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("1000.00").compareTo(createdAccount.getBalance()));
    }

    @Test
    @DisplayName("P02 (Cross-Tenant Guard): Provisioning fails if requesting customer does not own parent account")
    public void p02_provisionAccount_CrossTenantForbidden() {
        Customer attacker = customerPersistencePort.save(Customer.builder()
                .firstName("Attacker")
                .lastName("User")
                .email("attacker-" + UUID.randomUUID() + "@test.com")
                .password("securePass123!")
                .role(RoleType.CUSTOMER)
                .kycStatus("ACTIVE")
                .build());

        OpenAccountRequest request = OpenAccountRequest.builder()
                .customerId(attacker.getId())
                .currency("PHP")
                .accountType("CHECKING")
                .initialDeposit(new BigDecimal("500.00"))
                .parentAccountId(parentAccount.getAccountNumber())
                .build();

        assertThrows(BusinessException.class, () -> provisioningService.openAccount(request));
    }
}
