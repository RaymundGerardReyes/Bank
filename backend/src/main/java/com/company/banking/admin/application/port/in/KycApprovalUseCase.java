package com.company.banking.admin.application.port.in;

public interface KycApprovalUseCase {
    void approveKyc(Long customerId, String approvedByAdmin);
}
