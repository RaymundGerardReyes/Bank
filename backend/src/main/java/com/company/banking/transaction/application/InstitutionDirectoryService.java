package com.company.banking.transaction.application;

import com.company.banking.payment.application.port.out.PaymentParticipantPersistencePort;
import com.company.banking.payment.domain.PaymentParticipant;
import com.company.banking.transaction.api.dto.InstitutionResponse;
import com.company.banking.transaction.application.port.in.GetPaymentParticipantsUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InstitutionDirectoryService implements GetPaymentParticipantsUseCase {

    private final PaymentParticipantPersistencePort participantPersistencePort;

    @Override
    @Transactional(readOnly = true)
    public List<InstitutionResponse> getActiveInstitutions(String rail) {
        log.info("[DIRECTORY] Fetching active financial institutions for rail filter: {}", rail != null ? rail : "ALL");

        List<PaymentParticipant> participants;
        if (rail != null && !rail.isBlank()) {
            participants = participantPersistencePort.findByRailAndActive(rail.trim());
        } else {
            participants = participantPersistencePort.findAllActive();
        }

        return participants.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InstitutionResponse mapToResponse(PaymentParticipant p) {
        return InstitutionResponse.builder()
                .id(p.getId())
                .bic(p.getBic())
                .routingCode(p.getBic())
                .name(p.getInstitutionName())
                .institutionName(p.getInstitutionName())
                .role(p.getRole())
                .rail(p.getRail())
                .status(p.getStatus())
                .connectivityStatus(p.getConnectivityStatus())
                .build();
    }
}
