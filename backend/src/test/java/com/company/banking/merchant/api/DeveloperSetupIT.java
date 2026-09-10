package com.company.banking.merchant.api;

import com.company.banking.merchant.api.dto.DeveloperOnboardingRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DeveloperSetupIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private ApiKeyJpaRepository apiKeyRepository;

    private Customer testCustomer;

    @BeforeEach
    void setUp() {
        String email = "alex.dev@test.com";
        testCustomer = customerPersistencePort.findByEmail(email).orElseGet(() -> {
            Customer customer = Customer.builder()
                    .email(email)
                    .password("$2a$12$eACCX7c50RrnA7a4u3V0I.4QY1VzE.W8/V4L8M7iGqN5oF4N4J3qy")
                    .firstName("Alex")
                    .lastName("Dev")
                    .role(com.company.banking.common.enums.RoleType.CUSTOMER)
                    .build();
            return customerPersistencePort.save(customer);
        });
    }

    @Test
    @WithMockUser(username = "alex.dev@test.com", roles = "CUSTOMER")
    @DisplayName("Developer Onboarding without BIR/BRN -> auto-generates BRN, links account to customer, assigns canonical scopes")
    void onboardDeveloper_WithoutBrn_SucceedsWithCanonicalScopes() throws Exception {
        DeveloperOnboardingRequest request = new DeveloperOnboardingRequest(
                "Acme Dev Labs",
                null, // Optional BRN
                null, // Optional code
                testCustomer.getEmail(),
                "SANDBOX",
                "10.0.0.0/16",
                Set.of("accounts:read", "treasury:read"),
                "DEVELOPER"
        );

        MvcResult result = mockMvc.perform(post("/api/v1/developer/setup/onboard")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        DeveloperOnboardingResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                DeveloperOnboardingResponse.class
        );

        assertNotNull(response.merchantId());
        assertNotNull(response.settlementAccountNumber());
        assertNotNull(response.apiKey());
        assertTrue(response.apiKey().startsWith("sk_test_"));

        // Verify Settlement Account is bound to the customer
        Optional<Account> accountOpt = accountPersistencePort.findByAccountNumber(response.settlementAccountNumber());
        assertTrue(accountOpt.isPresent());
        assertEquals(testCustomer.getId(), accountOpt.get().getCustomerId());
        assertEquals(response.merchantId(), accountOpt.get().getMerchantId());

        // Verify ApiKey entity in DB
        Optional<ApiKeyJpaEntity> keyEntityOpt = apiKeyRepository.findByMerchantId(response.merchantId())
                .stream().findFirst();
        assertTrue(keyEntityOpt.isPresent());
        assertEquals("10.0.0.0/16", keyEntityOpt.get().getCidrWhitelist());
        assertTrue(keyEntityOpt.get().getScopes().contains("accounts:read"));
    }
}
