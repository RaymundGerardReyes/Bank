package com.company.banking.payment.domain;

public enum PaymentSessionStatus {
    CREATED, 
    ACTIVE, 
    PROCESSING, 
    SUCCESS, 
    FAILED, 
    EXPIRED, 
    COMPLETED
}