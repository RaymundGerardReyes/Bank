package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Maps to the existing 'merchants' table but scoped for the Institution API usage.
 * This prevents modifying the legacy Merchant domain class directly.
 */
@Entity
@Table(name = "merchants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "legal_name", nullable = false)
    private String name;

    @Column(name = "merchant_code", nullable = false, unique = true)
    private String code;

    @Column(name = "institution_type")
    private String institutionType;
}