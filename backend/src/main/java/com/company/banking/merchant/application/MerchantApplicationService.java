package com.company.banking.merchant.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MerchantApplicationService {

    private final MerchantJpaRepository merchantJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public Merchant submitApplication(String legalName, String brn, String taxId, String industryCode, String beneficialOwnerName) {
        log.info("MERCHANT ONBOARDING: Submitting application for {}", legalName);

        if (merchantJpaRepository.findByBusinessRegistrationNumber(brn).isPresent()) {
            throw new BusinessException(ErrorCode.CONFLICT, "Merchant with this Business Registration Number already exists.");
        }

        Merchant merchant = Merchant.builder()
                .legalName(legalName)
                .businessRegistrationNumber(brn)
                .taxId(taxId)
                .industryCode(industryCode)
                .beneficialOwnerName(beneficialOwnerName)
                .status("APPLICATION")
                .riskProfile("PENDING_EVALUATION")
                .build();

        Merchant saved = merchantJpaRepository.save(merchant);
        
        auditEventPublisher.publishEvent("MERCHANT_APP_SUBMITTED", "SYSTEM", 
            "Merchant application submitted for " + legalName, "MERCHANT-" + saved.getId());

        return saved;
    }

    @Transactional
    public Merchant advanceLifecycle(Long merchantId, String expectedStatus, String nextStatus, String reviewer, String riskProfileUpdate) {
        Merchant merchant = merchantJpaRepository.findById(merchantId)
                .orElseThrow(() -> new NotFoundException("Merchant not found"));

        if (!merchant.getStatus().equals(expectedStatus)) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Merchant must be in " + expectedStatus + " state to transition to " + nextStatus);
        }

        merchant.setStatus(nextStatus);
        if (riskProfileUpdate != null) {
            merchant.setRiskProfile(riskProfileUpdate);
        }
        
        log.info("MERCHANT LIFECYCLE: Advanced {} to {} by {}", merchant.getLegalName(), nextStatus, reviewer);
        auditEventPublisher.publishEvent("MERCHANT_LIFECYCLE_ADVANCED", reviewer, 
            "Merchant advanced to " + nextStatus, "MERCHANT-" + merchant.getId());

        return merchantJpaRepository.save(merchant);
    }
}
