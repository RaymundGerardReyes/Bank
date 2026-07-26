package com.company.banking.customer.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerProfile {
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
