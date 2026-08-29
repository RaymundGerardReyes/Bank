package com.company.banking.apigateway.application;

import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookManagementService {

    private final WebhookEndpointJpaRepository endpointRepository;
    private final AuditEventPublisher auditEventPublisher;
    
    @Transactional
    public WebhookEndpoint createEndpoint(Long merchantId, String url, String environment, String events) {
        // Phase 15 - Webhook URL Validation
        if (url == null || !url.startsWith("https://")) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Webhook URL must use HTTPS.");
        }
        if (url.contains("localhost") || url.contains("127.0.0.1") || url.contains("10.") || url.startsWith("https://192.168.")) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Webhook URL cannot be a private or local address (SSRF Protection).");
        }
        
        String rawSecret = generateSecret();
        
        WebhookEndpoint endpoint = WebhookEndpoint.builder()
                .merchantId(merchantId)
                .url(url)
                .environment(environment)
                .events(events)
                .status("ACTIVE")
                .secretHash(rawSecret) // In a real system, symmetrically encrypt this!
                .build();
                
        WebhookEndpoint saved = endpointRepository.save(endpoint);
        
        auditEventPublisher.publishEvent("WEBHOOK_ENDPOINT_CREATED", String.valueOf(merchantId), 
                "Created webhook endpoint for " + url, saved.getId().toString());
                
        // Inject the raw secret into the returned object ONLY for the first time display
        saved.setSecretHash(rawSecret); 
        return saved;
    }

    @Transactional(readOnly = true)
    public List<WebhookEndpoint> getEndpoints(Long merchantId) {
        return endpointRepository.findByMerchantId(merchantId);
    }
    
    @Transactional
    public void deleteEndpoint(Long merchantId, Long endpointId) {
        WebhookEndpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new NotFoundException("Webhook endpoint not found"));
                
        if (!endpoint.getMerchantId().equals(merchantId)) {
            throw new com.company.banking.common.exception.ForbiddenException("Not authorized to access this webhook");
        }
        
        endpointRepository.delete(endpoint);
        
        auditEventPublisher.publishEvent("WEBHOOK_ENDPOINT_DELETED", String.valueOf(merchantId), 
                "Deleted webhook endpoint", endpointId.toString());
    }

    private String generateSecret() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return "whsec_" + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
