package com.company.banking.security.auth.dto;

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

    public static AuthenticationResponse bearer(String token) {
        return AuthenticationResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .build();
    }
}
