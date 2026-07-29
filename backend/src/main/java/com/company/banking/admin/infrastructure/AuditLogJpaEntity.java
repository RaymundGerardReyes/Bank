package com.company.banking.admin.infrastructure;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String actor;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "resource_id")
    private String resourceId;
    
    private String details;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
