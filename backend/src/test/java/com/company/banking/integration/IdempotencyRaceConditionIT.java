package com.company.banking.integration;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class IdempotencyRaceConditionIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionJpaRepository;

    private Account source;
    private Account dest;

    @BeforeEach
    void setUp() {
        transactionJpaRepository.deleteAll();

        source = accountPersistencePort.save(Account.builder()
                .accountNumber("SRC-RACE-1001")
                .customerId(1L)
                .balance(new BigDecimal("5000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());

        dest = accountPersistencePort.save(Account.builder()
                .accountNumber("DST-RACE-1002")
                .customerId(2L)
                .balance(new BigDecimal("0.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());
    }

    @Test
    public void testConcurrentTransfersWithSameIdempotencyKey() throws InterruptedException {
        String sharedIdempotencyKey = UUID.randomUUID().toString();
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(dest.getAccountNumber())
                .amount(new BigDecimal("500.00"))
                .idempotencyKey(sharedIdempotencyKey)
                .description("Race Condition Test")
                .build();

        String jsonPayload;
        try {
            jsonPayload = objectMapper.writeValueAsString(request);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        int numberOfThreads = 3;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(numberOfThreads);
        AtomicInteger mitigatedResponses = new AtomicInteger(0);

        for (int i = 0; i < numberOfThreads; i++) {
            final String payload = jsonPayload;
            executor.submit(() -> {
                try {
                    startPistol.await(); 
                    
                    // FIX: Attach security context explicitly via .with(user()) to survive thread spawning
                    mockMvc.perform(post("/api/v1/transfers/internal")
                            .with(user("test@example.com").roles("USER"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload))
                            .andDo(result -> {
                                int status = result.getResponse().getStatus();
                                // Status 200 (Won the race) or 409 Conflict (Successfully blocked duplicate)
                                if (status == 200 || status == 409) {
                                    mitigatedResponses.incrementAndGet();
                                }
                            });
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown(); 
        finishLine.await();      
        executor.shutdown();

        // 1. Ensure exactly one transaction was recorded
        long transactionCount = transactionJpaRepository.count();
        assertEquals(1, transactionCount, "Only ONE transaction should exist despite concurrent requests.");
        
        // 2. FIX: Use compareTo() for BigDecimal scale agnosticism
        Account updatedSource = accountPersistencePort.findByAccountNumber(source.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("4500.00").compareTo(updatedSource.getBalance()), "Balance should only be deducted once.");
    }
}
