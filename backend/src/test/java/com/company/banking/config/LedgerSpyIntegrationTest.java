package com.company.banking.config;

import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

public abstract class LedgerSpyIntegrationTest extends BaseIntegrationTest {
    @MockitoSpyBean
    protected LedgerPersistencePort ledgerPersistencePort;
    
    @MockitoSpyBean
    protected LedgerEntryJpaRepository ledgerEntryRepository;
    
    @MockitoSpyBean
    protected SettlementBatchJpaRepository settlementBatchRepository;
}
