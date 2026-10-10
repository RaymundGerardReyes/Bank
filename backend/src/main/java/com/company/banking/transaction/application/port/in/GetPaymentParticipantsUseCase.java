package com.company.banking.transaction.application.port.in;

import com.company.banking.transaction.api.dto.InstitutionResponse;

import java.util.List;

public interface GetPaymentParticipantsUseCase {
    List<InstitutionResponse> getActiveInstitutions(String rail);
}
