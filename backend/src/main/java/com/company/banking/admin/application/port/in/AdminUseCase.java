package com.company.banking.admin.application.port.in;

import java.time.LocalDateTime;

public interface AdminUseCase {
    void reviewLogs(LocalDateTime from, LocalDateTime to);
}
