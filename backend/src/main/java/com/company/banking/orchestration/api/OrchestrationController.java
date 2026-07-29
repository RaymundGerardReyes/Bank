package com.company.banking.orchestration.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.orchestration.api.dto.OrchestrationRequest;
import com.company.banking.orchestration.api.dto.OrchestrationResponse;
import com.company.banking.orchestration.application.port.in.PaymentOrchestrationUseCase;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orchestration")
@RequiredArgsConstructor
public class OrchestrationController {

    private final PaymentOrchestrationUseCase orchestrationUseCase;

    @PostMapping("/route")
    public ResponseEntity<ApiResponse<OrchestrationResponse>> routePayment(@Valid @RequestBody OrchestrationRequest request) {
        // Retrieve the distributed tracing ID from the MDC context you already built
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        OrchestrationResponse response = orchestrationUseCase.routePayment(request);
        
        return ResponseEntity.ok(ApiResponse.success(
                response, 
                "Payment successfully routed and authorized via active-active cluster", 
                correlationId
        ));
    }
}