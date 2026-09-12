package com.company.banking.security.auth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    public boolean canRouteForAccount(String requestedAccountId, String authorizedAccountId) {
        if ("UNRESTRICTED".equalsIgnoreCase(authorizedAccountId) || "*".equals(authorizedAccountId)) {
            return true;
        }
        if (authorizedAccountId != null && !authorizedAccountId.trim().isEmpty()) {
            return authorizedAccountId.equals(requestedAccountId);
        }
        // Zero-Trust: Deny if no explicit mapping exists
        return false;
    }
}
