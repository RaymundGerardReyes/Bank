package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.UpdateAccountSettingsRequest;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UpdateAccountSettingsServiceTest {

    @Mock
    private AccountPersistencePort accountPersistencePort;

    @InjectMocks
    private UpdateAccountSettingsService updateService;

    private Account mockAccount;
    private final String ACC_NUM = "ACC-123";
    private final Long OWNER_ID = 55L;

    @BeforeEach
    void setup() {
        mockAccount = Account.builder()
                .id(1L)
                .accountNumber(ACC_NUM)
                .customerId(OWNER_ID)
                .status(AccountStatus.ACTIVE)
                .frozen(false)
                .allowIncoming(true)
                .allowOutgoing(true)
                .requireDualApproval(false)
                .build();
    }

    @Test
    @DisplayName("U01: Full update modifies all 4 flags")
    void u01_fullUpdate() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(true, false, false, true);
        updateService.updateSettings(ACC_NUM, req, OWNER_ID);

        assertTrue(mockAccount.isFrozen());
        assertFalse(mockAccount.isAllowIncoming());
        assertFalse(mockAccount.isAllowOutgoing());
        assertTrue(mockAccount.isRequireDualApproval());
    }

    @Test
    @DisplayName("U02: Partial update targets only Frozen flag")
    void u02_partialUpdate_Frozen() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(true, null, null, null);
        updateService.updateSettings(ACC_NUM, req, OWNER_ID);

        assertTrue(mockAccount.isFrozen());
        assertTrue(mockAccount.isAllowIncoming()); // Unchanged
    }

    @Test
    @DisplayName("U03: Partial update targets only Allow Incoming flag")
    void u03_partialUpdate_AllowIncoming() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(null, false, null, null);
        updateService.updateSettings(ACC_NUM, req, OWNER_ID);

        assertFalse(mockAccount.isAllowIncoming());
        assertTrue(mockAccount.isAllowOutgoing()); // Unchanged
    }

    @Test
    @DisplayName("U04: Partial update targets only Allow Outgoing flag")
    void u04_partialUpdate_AllowOutgoing() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(null, null, false, null);
        updateService.updateSettings(ACC_NUM, req, OWNER_ID);

        assertFalse(mockAccount.isAllowOutgoing());
    }

    @Test
    @DisplayName("U05: Partial update targets only Dual Approval flag")
    void u05_partialUpdate_DualApproval() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(null, null, null, true);
        updateService.updateSettings(ACC_NUM, req, OWNER_ID);

        assertTrue(mockAccount.isRequireDualApproval());
    }

    @Test
    @DisplayName("U06: Null payload causes no mutations")
    void u06_nullPayload_NoMutations() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(null, null, null, null);
        updateService.updateSettings(ACC_NUM, req, OWNER_ID);

        assertFalse(mockAccount.isFrozen());
        assertTrue(mockAccount.isAllowIncoming());
        assertTrue(mockAccount.isAllowOutgoing());
    }

    @Test
    @DisplayName("U07: Cross-user manipulation throws Forbidden")
    void u07_crossUserManipulation_ThrowsForbidden() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        
        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(true, false, false, true);
        assertThrows(ForbiddenException.class, () -> updateService.updateSettings(ACC_NUM, req, 999L));
    }

    @Test
    @DisplayName("U08: Invalid account throws NotFound")
    void u08_invalidAccount_ThrowsNotFound() {
        when(accountPersistencePort.findByAccountNumber("FAKE")).thenReturn(Optional.empty());
        
        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest();
        assertThrows(NotFoundException.class, () -> updateService.updateSettings("FAKE", req, OWNER_ID));
    }

    @Test
    @DisplayName("U09: DTO perfectly mirrors the updated entity")
    void u09_dtoMappingIsExact() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        UpdateAccountSettingsRequest req = new UpdateAccountSettingsRequest(true, false, false, true);
        AccountResponse response = updateService.updateSettings(ACC_NUM, req, OWNER_ID);

        assertTrue(response.isFrozen());
        assertFalse(response.isAllowIncoming());
    }

    @Test
    @DisplayName("U10: Persistence save is called exactly once")
    void u10_persistenceCalledExactlyOnce() {
        when(accountPersistencePort.findByAccountNumber(ACC_NUM)).thenReturn(Optional.of(mockAccount));
        when(accountPersistencePort.save(any())).thenReturn(mockAccount);

        updateService.updateSettings(ACC_NUM, new UpdateAccountSettingsRequest(), OWNER_ID);
        verify(accountPersistencePort, times(1)).save(any(Account.class));
    }
}
