package com.company.banking.apigateway.api;

import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gateway/keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyJpaRepository apiKeyRepository;

    @DeleteMapping("/{keyId}")
    public ResponseEntity<Void> deleteApiKey(@PathVariable Long keyId, Authentication authentication) {
        Long merchantId;
        try {
            merchantId = Long.parseLong(authentication.getName());
        } catch (Exception e) {
            merchantId = (Long) authentication.getPrincipal();
        }

        ApiKeyJpaEntity key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new NotFoundException("API Key not found"));

        if (!key.getMerchantId().equals(merchantId)) {
            throw new ForbiddenException("Not authorized to access this API Key");
        }
        
        apiKeyRepository.delete(key);
        return ResponseEntity.noContent().build();
    }
}
