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

public class DeveloperSetupIT extends com.company.banking.config.BaseIntegrationTest {

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

    @Autowired
    private com.company.banking.merchant.application.port.out.MerchantPersistencePort merchantPersistencePort;

    private Customer testCustomer;
    private Customer secondCustomer;

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

        String secondEmail = "bob.dev@test.com";
        secondCustomer = customerPersistencePort.findByEmail(secondEmail).orElseGet(() -> {
            Customer customer = Customer.builder()
                    .email(secondEmail)
                    .password("$2a$12$eACCX7c50RrnA7a4u3V0I.4QY1VzE.W8/V4L8M7iGqN5oF4N4J3qy")
                    .firstName("Bob")
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
                .stream().filter(k -> "10.0.0.0/16".equals(k.getCidrWhitelist())).findFirst();
        assertTrue(keyEntityOpt.isPresent());
        assertEquals("10.0.0.0/16", keyEntityOpt.get().getCidrWhitelist());
        assertTrue(keyEntityOpt.get().getScopes().contains("accounts:read"));
    }

    @Test
    @WithMockUser(username = "alex.dev@test.com", roles = "CUSTOMER")
    @DisplayName("Developer Onboarding with existing merchant code by same owner -> updates profile idempotently and issues new key")
    void onboardDeveloper_SameMerchantCode_SameOwner_UpdatesProfileAndIssuesKey() throws Exception {
        String code = "M-IDEMPOTENT-1";
        DeveloperOnboardingRequest initialRequest = new DeveloperOnboardingRequest(
                "Acme Initial Labs",
                "BRN-IDEMPOTENT-1",
                code,
                testCustomer.getEmail(),
                "SANDBOX",
                "0.0.0.0/0",
                Set.of("accounts:read"),
                "DEVELOPER"
        );

        MvcResult firstResult = mockMvc.perform(post("/api/v1/developer/setup/onboard")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(initialRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        DeveloperOnboardingResponse firstResponse = objectMapper.readValue(
                firstResult.getResponse().getContentAsString(),
                DeveloperOnboardingResponse.class
        );

        // Second onboarding with updated legal name and same code
        DeveloperOnboardingRequest secondRequest = new DeveloperOnboardingRequest(
                "Acme Updated Labs",
                "BRN-IDEMPOTENT-1",
                code,
                testCustomer.getEmail(),
                "LIVE",
                "192.168.1.0/24",
                Set.of("accounts:read", "accounts:write"),
                "DEVELOPER"
        );

        MvcResult secondResult = mockMvc.perform(post("/api/v1/developer/setup/onboard")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(secondRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        DeveloperOnboardingResponse secondResponse = objectMapper.readValue(
                secondResult.getResponse().getContentAsString(),
                DeveloperOnboardingResponse.class
        );

        // Merchant ID and settlement account should be reused
        assertEquals(firstResponse.merchantId(), secondResponse.merchantId());
        assertEquals(firstResponse.settlementAccountNumber(), secondResponse.settlementAccountNumber());
        // New API key generated
        assertNotNull(secondResponse.apiKey());
        assertTrue(secondResponse.apiKey().startsWith("sk_live_"));

        // Verify updated merchant legal name in persistence layer
        var merchantOpt = merchantPersistencePort.findByMerchantCode(code);
        assertTrue(merchantOpt.isPresent());
        assertEquals("Acme Updated Labs", merchantOpt.get().getLegalName());
    }

    @Test
    @DisplayName("Developer Onboarding with merchant code owned by another customer -> returns 409 Conflict")
    void onboardDeveloper_DuplicateMerchantCode_DifferentOwner_Returns409Conflict() throws Exception {
        String code = "M-CONFLICT-CODE";

        // Alex creates merchant with M-CONFLICT-CODE
        DeveloperOnboardingRequest alexRequest = new DeveloperOnboardingRequest(
                "Alex Enterprise",
                "BRN-ALEX-100",
                code,
                testCustomer.getEmail(),
                "SANDBOX",
                "0.0.0.0/0",
                Set.of("accounts:read"),
                "DEVELOPER"
        );

        mockMvc.perform(post("/api/v1/developer/setup/onboard")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("alex.dev@test.com").roles("CUSTOMER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(alexRequest)))
                .andExpect(status().isCreated());

        // Bob tries to use the same merchant code
        DeveloperOnboardingRequest bobRequest = new DeveloperOnboardingRequest(
                "Bob Enterprise",
                "BRN-BOB-200",
                code,
                secondCustomer.getEmail(),
                "SANDBOX",
                "0.0.0.0/0",
                Set.of("accounts:read"),
                "DEVELOPER"
        );

        mockMvc.perform(post("/api/v1/developer/setup/onboard")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("bob.dev@test.com").roles("CUSTOMER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bobRequest)))
                .andExpect(status().isConflict())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.errorCode").value("ERR_409"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.message").value(org.hamcrest.Matchers.containsString("already in use by another merchant")));
    }

    @Test
    @DisplayName("Developer Onboarding with BRN registered to another customer -> returns 409 Conflict")
    void onboardDeveloper_DuplicateBrn_DifferentOwner_Returns409Conflict() throws Exception {
        String brn = "BRN-SHARED-999";

        // Alex creates merchant with BRN
        DeveloperOnboardingRequest alexRequest = new DeveloperOnboardingRequest(
                "Alex Corp",
                brn,
                "M-ALEX-999",
                testCustomer.getEmail(),
                "SANDBOX",
                "0.0.0.0/0",
                Set.of("accounts:read"),
                "DEVELOPER"
        );

        mockMvc.perform(post("/api/v1/developer/setup/onboard")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("alex.dev@test.com").roles("CUSTOMER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(alexRequest)))
                .andExpect(status().isCreated());

        // Bob tries to use the same BRN with a different code
        DeveloperOnboardingRequest bobRequest = new DeveloperOnboardingRequest(
                "Bob Corp",
                brn,
                "M-BOB-999",
                secondCustomer.getEmail(),
                "SANDBOX",
                "0.0.0.0/0",
                Set.of("accounts:read"),
                "DEVELOPER"
        );

        mockMvc.perform(post("/api/v1/developer/setup/onboard")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("bob.dev@test.com").roles("CUSTOMER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bobRequest)))
                .andExpect(status().isConflict())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.errorCode").value("ERR_409"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.message").value(org.hamcrest.Matchers.containsString("already registered to another merchant")));
    }
}
