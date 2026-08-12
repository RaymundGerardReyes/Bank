package com.company.banking.apigateway.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "api_audit_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiAuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", nullable = false)
    private String requestId;

    @Column(name = "client_id")
    private String clientId;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(nullable = false)
    private String endpoint;

    @Column(name = "http_method", nullable = false)
    private String httpMethod;

    @Column(name = "source_ip", nullable = false)
    private String sourceIp;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "response_code", nullable = false)
    private Integer responseCode;

    @Column(name = "risk_decision")
    private String riskDecision;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
