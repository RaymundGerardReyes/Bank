package com.company.banking.common.resilience;

import com.company.banking.common.audit.AuditEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResilienceEngine {

    private final AuditEventPublisher auditEventPublisher;
    
    // Tracks failures per destination/service
    private final ConcurrentHashMap<String, AtomicInteger> failureCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> circuitOpenTimestamps = new ConcurrentHashMap<>();

    private static final int FAILURE_THRESHOLD = 5;
    private static final long CIRCUIT_TIMEOUT_MS = 60_000; // 60 seconds

    public boolean isCircuitOpen(String serviceName) {
        if (circuitOpenTimestamps.containsKey(serviceName)) {
            long openTime = circuitOpenTimestamps.get(serviceName);
            if (System.currentTimeMillis() - openTime > CIRCUIT_TIMEOUT_MS) {
                // Half-open: attempt recovery
                log.info("[RESILIENCE] Circuit for {} transitioning to HALF-OPEN", serviceName);
                circuitOpenTimestamps.remove(serviceName);
                failureCounts.put(serviceName, new AtomicInteger(0));
                return false;
            }
            return true;
        }
        return false;
    }

    public void recordSuccess(String serviceName) {
        if (failureCounts.containsKey(serviceName) && failureCounts.get(serviceName).get() > 0) {
            failureCounts.put(serviceName, new AtomicInteger(0));
            log.info("[RESILIENCE] Circuit for {} resetting failure count (SUCCESS)", serviceName);
        }
    }

    public void recordFailure(String serviceName) {
        AtomicInteger count = failureCounts.computeIfAbsent(serviceName, k -> new AtomicInteger(0));
        int currentFailures = count.incrementAndGet();

        log.warn("[RESILIENCE] Failure recorded for {}. Count: {}/{}", serviceName, currentFailures, FAILURE_THRESHOLD);

        if (currentFailures >= FAILURE_THRESHOLD) {
            circuitOpenTimestamps.put(serviceName, System.currentTimeMillis());
            log.error("[RESILIENCE] CRITICAL: Circuit for {} is now OPEN (Failing Fast)", serviceName);
            
            auditEventPublisher.publishEvent("CIRCUIT_BREAKER_TRIPPED", "SYSTEM", 
                "Cascading failures detected. Circuit breached for " + serviceName, serviceName);
        }
    }
}
