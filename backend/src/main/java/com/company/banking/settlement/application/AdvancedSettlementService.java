package com.company.banking.settlement.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.settlement.domain.SettlementException;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.domain.SettlementWindow;
import com.company.banking.settlement.infrastructure.SettlementExceptionJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementWindowJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdvancedSettlementService {

    private final SettlementWindowJpaRepository settlementWindowJpaRepository;
    private final SettlementInstructionJpaRepository settlementInstructionJpaRepository;
    private final SettlementExceptionJpaRepository settlementExceptionJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    /**
     * Executes at 12:00 PM for Intraday Settlements
     */
    @Scheduled(cron = "0 0 12 * * ?") 
    @Transactional
    public void executeIntradaySettlementCycle() {
        executeSettlementCycle("INTRADAY");
    }

    /**
     * Executes at 11:30 PM for End-Of-Day (EOD) Settlements
     */
    @Scheduled(cron = "0 30 23 * * ?") 
    @Transactional
    public void executeEodSettlementCycle() {
        executeSettlementCycle("EOD");
    }

    private void executeSettlementCycle(String cycleType) {
        log.info("[SETTLEMENT] Initiating {} Settlement Cycle...", cycleType);

        String windowRef = "WIN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        SettlementWindow window = SettlementWindow.builder()
                .windowReference(windowRef)
                .cycleType(cycleType)
                .rail("INSTAPAY") // Example default rail
                .cutOffTime(LocalDateTime.now())
                .status("OPEN")
                .build();

        settlementWindowJpaRepository.save(window);

        // In a real scenario, this would aggregate MerchantBalances and generate SettlementInstructions
        
        window.setStatus("CLOSED");
        settlementWindowJpaRepository.save(window);

        auditEventPublisher.publishEvent("SETTLEMENT_WINDOW_CLOSED", "SYSTEM", 
                cycleType + " Settlement Window closed.", windowRef);
    }

    @Transactional
    public void logSettlementException(Long instructionId, String errorCode, String errorDesc) {
        String exceptionRef = "EXC-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        
        SettlementException exception = SettlementException.builder()
                .exceptionReference(exceptionRef)
                .settlementInstructionId(instructionId)
                .errorCode(errorCode)
                .errorDescription(errorDesc)
                .status("UNRESOLVED")
                .build();
                
        settlementExceptionJpaRepository.save(exception);
        
        log.error("[SETTLEMENT EXCEPTION] Instruction {} failed with {}: {}", instructionId, errorCode, errorDesc);
        
        auditEventPublisher.publishEvent("SETTLEMENT_EXCEPTION_RAISED", "SYSTEM", 
                "Exception on instruction: " + errorDesc, exceptionRef);
    }
}
