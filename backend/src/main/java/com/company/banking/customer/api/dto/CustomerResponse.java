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
    private String email;
    private RoleType role;
    private LocalDateTime createdAt;

    public static CustomerResponse fromEntity(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .role(customer.getRole())
                .createdAt(customer.getCreatedAt())
                .build();
    }
}
