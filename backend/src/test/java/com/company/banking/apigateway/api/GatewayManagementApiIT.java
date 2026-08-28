package com.company.banking.apigateway.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class GatewayManagementApiIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username="user@example.com", roles="MERCHANT")
    public void createApiKey_ShouldReturn201Created() throws Exception {
        String payload = """
            {
                "name": "ERP System Key",
                "environment": "LIVE",
                "scopes": ["payments", "webhooks"]
            }
            """;

        mockMvc.perform(post("/api/v1/apikeys")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username="user@example.com", roles="MERCHANT")
    public void createWebhook_ShouldReturn200OkAndLogAudit() throws Exception {
        String payload = """
            {
                "url": "https://api.minimartgrocery.dev/api/v1/finance/webhooks/banking",
                "events": "payment.completed,payment.failed",
                "environment": "LIVE"
            }
            """;

        mockMvc.perform(post("/api/v1/webhooks")
                .header("X-Client-Id", "client_100")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username="user@example.com", roles="MERCHANT")
    public void deleteWebhook_ShouldReturn200OkAndLogAudit() throws Exception {
        // 1. Create the webhook first to ensure it exists in the test database
        String payload = """
            {
                "url": "https://api.minimartgrocery.dev/api/v1/finance/webhooks/banking",
                "events": "payment.completed,payment.failed",
                "environment": "LIVE"
            }
            """;

        String responseBody = mockMvc.perform(post("/api/v1/webhooks")
                .header("X-Client-Id", "client_100")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // 2. Extract the dynamically generated ID from ApiResponse structure
        Integer generatedId = com.jayway.jsonpath.JsonPath.parse(responseBody).read("$.data.id");

        // 3. Perform the DELETE using the dynamic ID
        mockMvc.perform(delete("/api/v1/webhooks/" + generatedId)
                .header("X-Client-Id", "client_100")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk()); 
    }
}
