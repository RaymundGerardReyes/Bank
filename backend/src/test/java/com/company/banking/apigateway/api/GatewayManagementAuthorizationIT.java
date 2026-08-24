package com.company.banking.apigateway.api;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class GatewayManagementAuthorizationIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserDetailsService userDetailsService;

    @Test
    public void merchantCannotDeleteAnotherMerchantsWebhook() throws Exception {
        // 1. Merchant A (user@example.com) creates a webhook
        String payload = """
            {
                "url": "https://api.merchant-a.com/webhooks",
                "events": "payment.completed",
                "environment": "LIVE"
            }
            """;

        String responseBody = mockMvc.perform(post("/api/v1/webhooks")
                .with(user(userDetailsService.loadUserByUsername("user@example.com")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Integer generatedId = JsonPath.parse(responseBody).read("$.data.id");

        // 2. Merchant B (recipient@example.com) attempts to delete Merchant A's webhook
        mockMvc.perform(delete("/api/v1/webhooks/" + generatedId)
                .with(user(userDetailsService.loadUserByUsername("recipient@example.com")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // We want 404 to hide existence
    }

    @Test
    public void merchantCannotAccessAnotherMerchantsApiKey() throws Exception {
        // 1. Merchant A creates an API Key
        String payload = """
            {
                "name": "ERP System Key",
                "environment": "LIVE",
                "scopes": ["payments"]
            }
            """;

        String responseBody = mockMvc.perform(post("/api/v1/apikeys")
                .with(user(userDetailsService.loadUserByUsername("user@example.com")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer generatedId = JsonPath.parse(responseBody).read("$.data.id");

        // 2. Merchant B attempts to revoke Merchant A's API Key
        mockMvc.perform(post("/api/v1/apikeys/" + generatedId + "/revoke")
                .with(user(userDetailsService.loadUserByUsername("recipient@example.com")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        // 3. Merchant B attempts to rotate Merchant A's API Key
        mockMvc.perform(post("/api/v1/apikeys/" + generatedId + "/rotate")
                .with(user(userDetailsService.loadUserByUsername("recipient@example.com")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void unauthenticatedCannotAccessGatewayManagement() throws Exception {
        mockMvc.perform(get("/api/v1/webhooks")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
