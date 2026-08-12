package com.company.banking.merchant.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "merchants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "merchant_code", unique = true, nullable = false)
    private String merchantCode;

    @Column(name = "legal_name", nullable = false)
    private String legalName;

    @Column(name = "business_registration_number", unique = true, nullable = false)
    private String businessRegistrationNumber;

    @Column(name = "tax_id")
    private String taxId;

    @Column(name = "industry_code")
    private String industryCode;

    @Column(name = "beneficial_owner_name")
    private String beneficialOwnerName;

    @Column(nullable = false)
    private String status;

    @Column(name = "risk_profile")
    private String riskProfile;

    @Column(name = "settlement_account")
    private String settlementAccount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.merchantCode == null) {
            this.merchantCode = "M-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
