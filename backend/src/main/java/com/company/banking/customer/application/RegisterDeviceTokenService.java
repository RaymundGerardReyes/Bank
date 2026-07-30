package com.company.banking.customer.application;

import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.application.port.in.RegisterDeviceTokenUseCase;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegisterDeviceTokenService implements RegisterDeviceTokenUseCase {

    private final CustomerPersistencePort customerPersistencePort;

    @Override
    @Transactional
    public void registerToken(String email, String fcmToken) {
        Customer customer = customerPersistencePort.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Customer not found"));
                
        // Step 3: Associate the Token with the Authenticated User
        customer.setFcmToken(fcmToken);
        customerPersistencePort.save(customer);
        
        log.info("[FCM REGISTRATION] Successfully linked Firebase device token to customer ID: {}", customer.getId());
    }
}