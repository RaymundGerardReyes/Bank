package com.company.banking.security.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaceVerificationRequest {
    private List<Double> embedding;
    private String email;
    private String deviceId;
    private String challenge;
    private String signature;

    public FaceVerificationRequest(List<Double> embedding) {
        this.embedding = embedding;
    }

    public FaceVerificationRequest(List<Double> embedding, String email) {
        this.embedding = embedding;
        this.email = email;
    }
}
