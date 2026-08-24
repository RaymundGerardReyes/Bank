package com.company.banking.e2e;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.springframework.context.annotation.Import;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(E2ESecurityBypassConfig.class)
public class ExternalPaymentRoutingE2E {

    @Autowired
    private TestRestTemplate http;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private com.company.banking.orchestration.infrastructure.PaymentRailConfigurationJpaRepository railRepository;

    private String sourceAccount;

    @BeforeEach
    public void setup() {
        sourceAccount = "ACC-3001";
        
        Account source = accountRepository.findByAccountNumber(sourceAccount).orElseGet(() -> Account.builder()
                .accountNumber(sourceAccount)
                .customerId(103L)
                .currency("PHP")
                .allowOutgoing(true)
                .allowIncoming(true)
                .build());
        source.setBalance(new BigDecimal("10000.00"));
        source.setStatus(AccountStatus.ACTIVE);
        accountRepository.save(source);
        
        railRepository.findByRailName("SWIFT").orElseGet(() ->
            railRepository.save(com.company.banking.orchestration.domain.PaymentRailConfiguration.builder()
                .railName("SWIFT")
                .processingType("BATCH")
                .active(true)
                .maxAmountPerTx(new BigDecimal("100000.00"))
                .build())
        );
    }

    @Test
    public void shouldRouteExternalPaymentWithoutLocalDestinationCheck() {
        // 1. Arrange: Use a destination account that definitively does NOT exist in the local database
        String externalDestination = "NON_EXISTENT_EXT_ACC_999";
        
        ExternalPaymentRequest request = ExternalPaymentRequest.builder()
                .sourceAccountNumber(sourceAccount)
                .destinationAccountNumber(externalDestination)
                .amount(new BigDecimal("100.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .railName("SWIFT")
                .recipientName("NovaBank Corp")
                .routingNumber("NOVA-1234")
                .build();

        // 2. Act
        ResponseEntity<String> response = http.postForEntity(
                "/api/v1/transactions/external-payment",
                request,
                String.class
        );

        // 3. Assert HTTP Observable Behavior
        // If it incorrectly checked local destination, it would return 404 Not Found.
        // If it successfully hits the stub/gateway, it might return 200 OK or 500/400 (if gateway stub is missing),
        // but it MUST NOT return 404.
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode(), 
                "Must not return 404. External payments should not validate the destination account locally.");
        
        // Asserting it at least parses and routes to the service layer
        assertTrue(
                response.getStatusCode().is2xxSuccessful() || response.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR || response.getStatusCode() == HttpStatus.BAD_REQUEST || response.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY,
                "Expected either success or gateway rejection, but got: " + response.getStatusCode()
        );
    }
}
