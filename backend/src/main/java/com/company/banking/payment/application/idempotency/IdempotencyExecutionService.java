package com.company.banking.payment.application.idempotency;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.IdempotencyClaim;
import com.company.banking.payment.domain.IdempotencyClaimStatus;
import com.company.banking.payment.infrastructure.IdempotencyClaimJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class IdempotencyExecutionService {

    private final IdempotencyClaimJpaRepository claimRepository;
    private final PaymentFingerprintService fingerprintService;
    private final PlatformTransactionManager transactionManager;

    /**
     * Attempts to acquire an idempotency claim.
     * Returns true if a new claim was successfully created.
     * Returns false if an existing claim matched the fingerprint (Replay).
     * Throws ConflictException if an existing claim has a different fingerprint.
     */
    public boolean acquireClaimOrReplay(Long merchantId, String idempotencyKey, PaymentRequestNormalizer.NormalizedPaymentRequest request) {
        String requestHash = fingerprintService.generateFingerprint(request);

        IdempotencyClaim newClaim = IdempotencyClaim.builder()
                .merchantId(merchantId)
                .idempotencyKey(idempotencyKey)
                .requestHash(requestHash)
                .status(IdempotencyClaimStatus.PROCESSING)
                .build();

        TransactionTemplate template = new TransactionTemplate(transactionManager);
        // REQUIRES_NEW guarantees the insert commits immediately and independently
        template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);

        try {
            template.execute(status -> claimRepository.saveAndFlush(newClaim));
            return true; // Successfully acquired new claim
        } catch (DataIntegrityViolationException e) {
            log.info("[IDEMPOTENCY] Concurrent claim detected for merchant {} key {}", merchantId, idempotencyKey);
            return handleExistingClaim(merchantId, idempotencyKey, requestHash);
        }
    }

    private boolean handleExistingClaim(Long merchantId, String idempotencyKey, String currentHash) {
        Optional<IdempotencyClaim> existingOpt = claimRepository.findByMerchantIdAndIdempotencyKey(merchantId, idempotencyKey);
        
        if (existingOpt.isEmpty()) {
            // Very rare race condition where constraint fired but read uncommitted fails.
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "Failed to retrieve existing idempotency claim.");
        }

        IdempotencyClaim existingClaim = existingOpt.get();

        if (existingClaim.getRequestHash().equals(currentHash)) {
            if (existingClaim.getStatus() == IdempotencyClaimStatus.PROCESSING) {
                log.warn("[IDEMPOTENCY] Concurrent request in progress for key {}", idempotencyKey);
                throw new BusinessException(ErrorCode.CONFLICT, "An operation with this idempotency key is currently in progress.");
            }
            log.info("[IDEMPOTENCY] Replay approved for key {}", idempotencyKey);
            return false; // Replay requested
        } else {
            log.warn("[IDEMPOTENCY] Conflict! Hash mismatch for key {}", idempotencyKey);
            throw new BusinessException(ErrorCode.CONFLICT, "An operation with this idempotency key already exists with different parameters.");
        }
    }

    public void completeClaim(Long merchantId, String idempotencyKey, String responseBody) {
        TransactionTemplate template = new TransactionTemplate(transactionManager);
        template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        template.executeWithoutResult(status -> {
            claimRepository.findByMerchantIdAndIdempotencyKey(merchantId, idempotencyKey).ifPresent(claim -> {
                claim.setStatus(IdempotencyClaimStatus.COMPLETED);
                claim.setResponseBody(responseBody);
                claimRepository.saveAndFlush(claim);
            });
        });
    }

    public String getStoredResponse(Long merchantId, String idempotencyKey) {
        return claimRepository.findByMerchantIdAndIdempotencyKey(merchantId, idempotencyKey)
                .map(IdempotencyClaim::getResponseBody)
                .orElse(null);
    }

    public void failClaim(Long merchantId, String idempotencyKey) {
        TransactionTemplate template = new TransactionTemplate(transactionManager);
        template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        template.executeWithoutResult(status -> {
            claimRepository.findByMerchantIdAndIdempotencyKey(merchantId, idempotencyKey).ifPresent(claim -> {
                claim.setStatus(IdempotencyClaimStatus.FAILED);
                claimRepository.saveAndFlush(claim);
            });
        });
    }
}
