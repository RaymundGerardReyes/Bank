package com.company.banking.apigateway.api;

import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gateway/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookEndpointJpaRepository webhookRepository;

    @DeleteMapping("/{webhookId}")
    public ResponseEntity<Void> deleteWebhook(@PathVariable Long webhookId, Authentication authentication) {
        Long merchantId;
        try {
            merchantId = Long.parseLong(authentication.getName());
        } catch (Exception e) {
            merchantId = (Long) authentication.getPrincipal();
        }

        WebhookEndpoint endpoint = webhookRepository.findById(webhookId)
                .orElseThrow(() -> new NotFoundException("Webhook not found"));

        if (!endpoint.getMerchantId().equals(merchantId)) {
            throw new ForbiddenException("Not authorized to access this webhook");
        }
        
        webhookRepository.delete(endpoint);
        return ResponseEntity.noContent().build();
    }
}
