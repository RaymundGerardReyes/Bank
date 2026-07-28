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

@SpringBootTest
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
                .currency("USD")
                .status(AccountStatus.ACTIVE)
                .build());

        Account dest = accountPersistencePort.save(Account.builder()
                .accountNumber("DST-1002")
                .customerId(2L)
                .balance(new BigDecimal("500.00"))
                .currency("USD")
                .status(AccountStatus.ACTIVE)
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
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }
}
