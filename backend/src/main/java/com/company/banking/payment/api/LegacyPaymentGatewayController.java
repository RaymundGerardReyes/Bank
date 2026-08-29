package com.company.banking.payment.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
public class LegacyPaymentGatewayController {

    @RequestMapping(value = "/api/v1/gateway/payments", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.GET})
    public ResponseEntity<Map<String, Object>> deprecatedLegacyEndpoint() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "This endpoint is deprecated. Use /api/v1/gateway/payments/intents instead.", "errorCode", "INVALID_REQUEST"));
    }

    @RequestMapping(value = "/api/v1/gateway/payments/{id}/capture", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.GET})
    public ResponseEntity<Map<String, Object>> deprecatedLegacyCaptureEndpoint() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "This endpoint is deprecated. Use /api/v1/gateway/payments/intents instead.", "errorCode", "INVALID_REQUEST"));
    }
}
