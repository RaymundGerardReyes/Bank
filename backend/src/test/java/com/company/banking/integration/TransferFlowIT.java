package com.company.banking.integration;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TransferFlowIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Test
    @WithMockUser(username = "test@example.com")
    public void testInternalTransferFlow() throws Exception {

        Account source = accountPersistencePort.save(Account.builder()
                .accountNumber("SRC-1001")
                .customerId(1L)
                .balance(new BigDecimal("1000.00"))
                .currency("PHP") // Changed to PHP
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());

        Account dest = accountPersistencePort.save(Account.builder()
                .accountNumber("DST-1002")
                .customerId(2L)
                .balance(new BigDecimal("500.00"))
                .currency("PHP") // Changed to PHP
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(dest.getAccountNumber())
                .amount(new BigDecimal("200.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Test internal transfer")
                .build();

        mockMvc.perform(post("/api/v1/transfers/internal")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data.createdAt").value(org.hamcrest.Matchers.matchesPattern("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$")));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    public void testScheduledTransferFlowWithUtcInstant() throws Exception {
        Account source = accountPersistencePort.save(Account.builder()
                .accountNumber("SRC-SCHED-1")
                .customerId(3L)
                .balance(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());

        Account dest = accountPersistencePort.save(Account.builder()
                .accountNumber("DST-SCHED-2")
                .customerId(4L)
                .balance(new BigDecimal("500.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(dest.getAccountNumber())
                .amount(new BigDecimal("150.00"))
                .scheduledDate("2026-09-20T10:00:00Z")
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Test scheduled transfer")
                .build();

        mockMvc.perform(post("/api/v1/transfers/internal")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SCHEDULED"))
                .andExpect(jsonPath("$.data.createdAt").value(org.hamcrest.Matchers.matchesPattern("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$")))
                .andExpect(jsonPath("$.data.scheduledExecutionAt").value("2026-09-20T10:00:00Z"));
    }
}