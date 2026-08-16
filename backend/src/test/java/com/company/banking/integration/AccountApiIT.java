package com.company.banking.account.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles; // <-- ADD THIS IMPORT
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // <-- ADD THIS ANNOTATION
public class AccountApiIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void contextLoadsAndCorrelationIdHeaderIsReturned() throws Exception {
        // We intentionally send an empty POST request to a known public endpoint.
        // This completely bypasses the 404 /error routing trap, hits our GlobalExceptionHandler,
        // returns a safe 400 Bad Request, and perfectly preserves our X-Request-Id header!
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(header().exists("X-Request-Id"));
    }
}