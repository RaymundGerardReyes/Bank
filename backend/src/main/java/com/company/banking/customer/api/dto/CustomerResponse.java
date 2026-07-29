package com.company.banking.customer.api.dto;

import com.company.banking.common.enums.RoleType;
import com.company.banking.customer.domain.Customer;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CustomerResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName; // <-- ADDED FOR DIGITAL CARD UI
    private String email;
    private RoleType role;
    private LocalDateTime createdAt;
    
    // KYC Fields
    private String employmentStatus;
    private String jobTitle;
    private String monthlyIncome;
    private String sourceOfFunds;
    private String kycStatus;

    public static CustomerResponse fromEntity(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .fullName(customer.getFirstName() + " " + customer.getLastName()) // <-- AUTOMATICALLY MERGED
                .email(customer.getEmail())
                .role(customer.getRole())
                .createdAt(customer.getCreatedAt())
                .employmentStatus(customer.getEmploymentStatus())
                .jobTitle(customer.getJobTitle())
                .monthlyIncome(customer.getMonthlyIncome())
                .sourceOfFunds(customer.getSourceOfFunds())
                .kycStatus(customer.getKycStatus())
                .build();
    }
}