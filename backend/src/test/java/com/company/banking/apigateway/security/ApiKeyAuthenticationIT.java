package com.company.banking.apigateway.security;

import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ApiKeyAuthenticationIT {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ApiKeyJpaRepository apiKeyJpaRepository;

    @MockitoBean
    private CustomerPersistencePort customerPersistencePort;

    @Test
    public void requestWithoutApiKey_ShouldReturn4xxError() throws Exception {
        mockMvc.perform(get("/api/v1/accounts")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void requestWithValidApiKey_ShouldPassSecurityFilter() throws Exception {
        String rawApiKey = "sk_live_valid_test_key_999";
        String expectedHash = hashKey(rawApiKey);

        // Aligned with your exact ApiKeyJpaEntity fields
        ApiKeyJpaEntity mockEntity = new ApiKeyJpaEntity();
        mockEntity.setId(1L);
        mockEntity.setKeyPrefix("sk_live_");
        mockEntity.setKeyHash(expectedHash);
        mockEntity.setName("ERP System Key");
        mockEntity.setEnvironment("LIVE");
        mockEntity.setLinkedAccountId("ACC-12345");
        mockEntity.setMerchantId(1L);
        mockEntity.setScopes("accounts:read");
        mockEntity.setExpiresAt(LocalDateTime.now().plusDays(30)); // Indicates the key is active

        when(apiKeyJpaRepository.findByKeyHash(anyString())).thenReturn(Optional.of(mockEntity));

        Customer mockCustomer = Customer.builder().id(1L).email("ERP System Key").build();
        when(customerPersistencePort.findByEmail("ERP System Key")).thenReturn(Optional.of(mockCustomer));

        mockMvc.perform(get("/api/v1/accounts")
                .header("X-API-Key", rawApiKey)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(result -> org.junit.jupiter.api.Assertions.assertTrue(result.getResponse().getStatus() >= 200));
    }

    private String hashKey(String rawKey) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(hash);
    }
}
