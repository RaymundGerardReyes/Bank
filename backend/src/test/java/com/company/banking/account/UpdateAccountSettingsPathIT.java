package com.company.banking.account;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.enums.RoleType;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UpdateAccountSettingsPathIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    private Customer testCustomer;
    private Customer otherCustomer;
    private Account testAccount;
    private final String ENDPOINT = "/api/v1/accounts/{accountNumber}/settings";

    @BeforeEach
    void setup() {
        accountRepository.deleteAll();

        String email1 = "user99-" + UUID.randomUUID() + "@test.com";
        testCustomer = customerPersistencePort.save(Customer.builder()
                .firstName("Owner")
                .lastName("User")
                .email(email1)
                .password("password123")
                .role(RoleType.CUSTOMER)
                .kycStatus("ACTIVE")
                .build());

        String email2 = "user88-" + UUID.randomUUID() + "@test.com";
        otherCustomer = customerPersistencePort.save(Customer.builder()
                .firstName("Other")
                .lastName("User")
                .email(email2)
                .password("password123")
                .role(RoleType.CUSTOMER)
                .kycStatus("ACTIVE")
                .build());

        testAccount = accountRepository.save(Account.builder()
                .accountNumber("ACC-PATH-" + UUID.randomUUID().toString().substring(0, 5))
                .customerId(testCustomer.getId())
                .balance(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .frozen(false)
                .allowIncoming(true)
                .allowOutgoing(true)
                .requireDualApproval(false)
                .build());
    }

    @Test
    @DisplayName("P01: Golden Path successfully patches the database")
    void p01_GoldenPath() throws Exception {
        String payload = "{\"frozen\": true, \"allowIncoming\": false}";

        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.frozen").value(true));

        Account dbAccount = accountRepository.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertTrue(dbAccount.isFrozen());
        assertFalse(dbAccount.isAllowIncoming());
    }

    @Test
    @DisplayName("P02: Missing authentication token halts at gateway")
    void p02_MissingAuth() throws Exception {
        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isUnauthorized()); // 401
    }

    @Test
    @DisplayName("P03: Cross-tenant attack returns Forbidden")
    void p03_CrossTenantAttack() throws Exception {
        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(user(otherCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"frozen\": true}"))
                .andExpect(status().isForbidden()); // 403

        Account dbAccount = accountRepository.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertFalse(dbAccount.isFrozen(), "Database must remain untouched");
    }

    @Test
    @DisplayName("P04: Invalid account number returns Not Found")
    void p04_InvalidAccount() throws Exception {
        mockMvc.perform(patch(ENDPOINT, "UNKNOWN-ACC")
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isNotFound()); // 404
    }

    @Test
    @DisplayName("P05: Malformed payload returns Bad Request")
    void p05_MalformedPayload() throws Exception {
        String badPayload = "{ \"frozen\": invalid_value }";

        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(badPayload))
                .andExpect(status().isBadRequest()); // 400
    }

    @Test
    @DisplayName("P06: Database crash triggers safe rollback")
    void p06_DatabaseCrashRollback() throws Exception {
        accountRepository.deleteAll(); 
        
        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"frozen\": true}"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("P07: State Transition - Full Lockdown execution")
    void p07_FullLockdown() throws Exception {
        String payload = "{\"frozen\": true, \"allowIncoming\": false, \"allowOutgoing\": false}";

        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk());

        Account dbAccount = accountRepository.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertTrue(dbAccount.isFrozen());
        assertFalse(dbAccount.isAllowOutgoing());
    }

    @Test
    @DisplayName("P08: State Transition - Reversing a lockdown")
    void p08_ReverseLockdown() throws Exception {
        testAccount.setFrozen(true);
        accountRepository.save(testAccount);

        String payload = "{\"frozen\": false}";
        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk());

        Account dbAccount = accountRepository.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertFalse(dbAccount.isFrozen());
    }

    @Test
    @DisplayName("P09: Invalid HTTP Method returns 405")
    void p09_MethodValidation() throws Exception {
        mockMvc.perform(post(ENDPOINT, testAccount.getAccountNumber())
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isMethodNotAllowed()); // 405
    }

    @Test
    @DisplayName("P10: Empty payload returns 200 without data destruction")
    void p10_EmptyPayloadSafety() throws Exception {
        mockMvc.perform(patch(ENDPOINT, testAccount.getAccountNumber())
                .with(user(testCustomer.getEmail()))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk());

        Account dbAccount = accountRepository.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertTrue(dbAccount.isAllowIncoming(), "Original flags must survive an empty patch");
    }
}
