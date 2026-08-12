package com.company.banking.security.auth;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 3; // AFASA strict requirement
    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    
    private final CustomerPersistencePort customerPersistencePort;
    private final AuditEventPublisher auditEventPublisher;

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
    }

    public void loginFailed(String email) {
        int attempts = attemptsCache.getOrDefault(email, 0) + 1;
        attemptsCache.put(email, attempts);

        if (attempts >= MAX_ATTEMPTS) {
            lockAccount(email);
        }
    }

    private void lockAccount(String email) {
        Optional<Customer> optionalCustomer = customerPersistencePort.findByEmail(email);
        if (optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            if (!customer.isLocked()) {
                customer.setLocked(true);
                customerPersistencePort.save(customer);
                
                log.warn("AFASA SECURITY: Account {} locked due to consecutive failed authentication attempts.", email);
                auditEventPublisher.publishEvent("ACCOUNT_LOCKED", email,
                        "System locked account due to exceeding maximum allowed authentication failures (Brute Force Protection)",
                        "LOCK-" + customer.getId());
            }
        }
    }

    public boolean isBlocked(String key) {
        return attemptsCache.getOrDefault(key, 0) >= MAX_ATTEMPTS;
    }
}
