package com.company.banking.account.domain;

import com.company.banking.common.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private String currency;

// --- VAM & HIERARCHY FIELDS ---
    @Column(name = "account_type")
    private String accountType; // <-- ADD THIS FIELD (e.g., MAIN, PAYROLL, TREASURY)
    // --- VAM & HIERARCHY FIELDS ---
    @Column(name = "parent_account_id")
    private String parentAccountId;

    @Column(name = "account_name")
    private String accountName;

    @Column(name = "daily_limit")
    private BigDecimal dailyLimit;

    @Column(name = "monthly_limit")
    private BigDecimal monthlyLimit;

    @Column(name = "allow_incoming")
    private boolean allowIncoming;

    @Column(name = "allow_outgoing")
    private boolean allowOutgoing;

    @Column(name = "require_dual_approval")
    private boolean requireDualApproval;

    // --- CARD & ROUTING FIELDS ---
    @Builder.Default
    @Column(name = "swift_code")
    private String swiftCode = "NOVBUS33XXX";

    @Builder.Default
    @Column(name = "card_expiry")
    private String cardExpiry = "12/99";

    @Builder.Default
    @Column(name = "card_cvv")
    private String cardCvv = "000";

    @Builder.Default
    @Column(nullable = false)
    private boolean frozen = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}