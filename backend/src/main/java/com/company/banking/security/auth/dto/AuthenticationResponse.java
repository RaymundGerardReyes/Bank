package com.company.banking.security.auth.dto;

import com.company.banking.customer.api.dto.CustomerResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {

    private String token;
    private String tokenType;
    private CustomerResponse user; // <-- ATTACH USER PROFILE HERE

    public static AuthenticationResponse bearer(String token, CustomerResponse userProfile) {
        return AuthenticationResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userProfile)
                .build();
    }
}