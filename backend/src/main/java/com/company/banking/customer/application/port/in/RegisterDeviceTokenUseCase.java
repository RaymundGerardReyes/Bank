package com.company.banking.customer.application.port.in;

public interface RegisterDeviceTokenUseCase {
    void registerToken(String email, String fcmToken);
}