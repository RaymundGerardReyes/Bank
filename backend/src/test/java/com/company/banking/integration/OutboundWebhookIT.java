package com.company.banking.integration;

import com.company.banking.apigateway.application.WebhookDispatcherService;
import com.company.banking.apigateway.domain.WebhookDelivery;
import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookDeliveryJpaRepository;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
public class OutboundWebhookIT {

    @Autowired
    private WebhookDispatcherService webhookDispatcherService;

    @MockitoBean
    private WebhookEndpointJpaRepository endpointRepository;

    @MockitoBean
    private WebhookDeliveryJpaRepository deliveryRepository;

    @Test
    public void dispatchEvent_ShouldProcessAndSaveDelivery() {
        Long merchantId = 1L;
        String eventType = "payment.completed";
        String payload = "{\"transactionId\":\"TXN-123\", \"status\":\"COMPLETED\"}";

        // 1. Arrange: Provide a mock endpoint mimicking the DB response
        WebhookEndpoint mockEndpoint = new WebhookEndpoint();
        mockEndpoint.setId(100L);
        mockEndpoint.setMerchantId(merchantId);
        mockEndpoint.setUrl("https://api.minimartgrocery.dev/api/v1/finance/webhooks/banking");
        mockEndpoint.setEvents("*"); // Simulating subscription to all events
        mockEndpoint.setSecretHash("whsec_super_secret_key_for_minimart");

        when(endpointRepository.findByMerchantIdAndEnvironmentAndStatus(merchantId, "LIVE", "ACTIVE"))
                .thenReturn(List.of(mockEndpoint));

        // 2. Act: Trigger the asynchronous dispatcher
        webhookDispatcherService.dispatchEvent(merchantId, eventType, payload);

        // 3. Assert: Verify the delivery was logged correctly. 
        // Because dispatchEvent() is @Async, we use a 2-second timeout to allow the thread to complete.
        verify(deliveryRepository, timeout(2000).times(1)).save(any(WebhookDelivery.class));
    }
}
