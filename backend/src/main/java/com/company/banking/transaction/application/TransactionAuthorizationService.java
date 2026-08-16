package com.company.banking.transaction.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.domain.AuthorizationAttempt;
import com.company.banking.transaction.domain.TransactionIntent;
import com.company.banking.transaction.domain.TransactionIntentStatus;
import com.company.banking.transaction.infrastructure.AuthorizationAttemptJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Base64;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRequestOptions;
import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.UserVerificationRequirement;

@Service
@RequiredArgsConstructor
public class TransactionAuthorizationService {

    private final TransactionIntentJpaRepository intentRepository;
    private final AuthorizationAttemptJpaRepository attemptRepository;
    private final TransactionUseCase transactionUseCase;
    // Inject ExternalPaymentUseCase, etc. as needed

    @Transactional
    public TransactionIntent createIntent(TransactionIntent intent, Long userId) {
        if (!intent.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Cannot create intent for another user");
        }
        return intentRepository.findByIdempotencyKey(intent.getIdempotencyKey())
                .orElseGet(() -> intentRepository.save(intent));
    }

    @Transactional
    public AuthorizationAttempt createAuthorizationOptions(Long intentId, Long userId) {
        TransactionIntent intent = intentRepository.findById(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Intent not found"));

        if (!intent.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Cannot access this intent");
        }

        if (intent.getStatus() != TransactionIntentStatus.DRAFT && intent.getStatus() != TransactionIntentStatus.PENDING_AUTH) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Intent cannot be authorized in current state");
        }

        // Generate cryptographically secure challenge
        byte[] challengeBytes = new byte[32];
        new SecureRandom().nextBytes(challengeBytes);
        Bytes challengeBytesObj = new Bytes(challengeBytes);
        String challenge = challengeBytesObj.toBase64UrlString();

        PublicKeyCredentialRequestOptions options = PublicKeyCredentialRequestOptions.builder()
                .challenge(challengeBytesObj)
                .rpId("localhost")
                .userVerification(UserVerificationRequirement.REQUIRED)
                .build();

        AuthorizationAttempt attempt = AuthorizationAttempt.builder()
                .transactionIntentId(intent.getId())
                .challenge(challenge)
                .status("PENDING")
                .build();

        intent.setStatus(TransactionIntentStatus.AUTHENTICATING);
        intentRepository.save(intent);

        // We return the attempt. The controller should ideally return the 'options' JSON
        // but for integration test purposes, returning the attempt allows us to assert the challenge.
        return attemptRepository.save(attempt);
    }

    @Transactional
    public void verifyAuthorization(Long intentId, Long userId, String challenge, String assertionPayload) {
        AuthorizationAttempt attempt = attemptRepository.findByChallenge(challenge)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Challenge not found"));

        if (!attempt.getTransactionIntentId().equals(intentId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Challenge does not belong to this intent");
        }

        TransactionIntent intent = intentRepository.findById(intentId).orElseThrow();
        if (!intent.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Cannot access this intent");
        }

        if (attempt.getExpiresAt().isBefore(LocalDateTime.now())) {
            attempt.setStatus("EXPIRED");
            attemptRepository.save(attempt);
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Challenge expired");
        }

        if (!"PENDING".equals(attempt.getStatus())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Challenge has already been used or failed");
        }

        // TODO: In reality, use Spring Security / WebAuthn4J to verify the assertionPayload against the stored public key
        boolean isValid = true; // Placeholder for actual cryptographic verification

        if (!isValid) {
            attempt.setStatus("FAILED");
            attemptRepository.save(attempt);
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Invalid WebAuthn assertion");
        }

        attempt.setStatus("VERIFIED");
        attempt.setVerifiedAt(LocalDateTime.now());
        attemptRepository.save(attempt);

        intent.setStatus(TransactionIntentStatus.AUTHORIZED);
        intentRepository.save(intent);
    }

    @Transactional
    public TransactionResponse executeIntent(Long intentId, Long userId) {
        // Use pessimistic write lock to prevent concurrent double-execution
        TransactionIntent intent = intentRepository.findByIdForUpdate(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Intent not found"));

        if (!intent.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Cannot access this intent");
        }

        if (intent.getStatus() != TransactionIntentStatus.AUTHORIZED) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Intent is not authorized for execution");
        }

        if (intent.getExecutedTransactionId() != null) {
            throw new BusinessException(ErrorCode.CONFLICT, "Intent already executed");
        }

        // Atomically transition state to processing to claim execution
        intent.setStatus(TransactionIntentStatus.PROCESSING);
        intentRepository.saveAndFlush(intent);

        // Delegate to existing core logic with UNKNOWN fallback
        TransactionResponse response;
        try {
            if ("INTERNAL".equals(intent.getRail())) {
                InternalTransferRequest req = new InternalTransferRequest();
                req.setSourceAccountNumber(intent.getSourceAccountId());
                req.setDestinationAccountNumber(intent.getRecipient());
                req.setAmount(intent.getAmount());
                req.setIdempotencyKey(intent.getIdempotencyKey());
                response = transactionUseCase.processInternalTransfer(req);
            } else {
                throw new UnsupportedOperationException("Rail not supported in this example");
            }
        } catch (Exception e) {
            intent.setStatus(TransactionIntentStatus.UNKNOWN);
            intentRepository.save(intent);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Transaction execution outcome unknown: " + e.getMessage());
        }

        intent.setStatus(TransactionIntentStatus.EXECUTED);
        intentRepository.save(intent);

        return response;
    }
}
