        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:06:49 [http-nio-0.0.0.0-8085-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 65569528-e79b-45d4-a015-96e74aa7e7d3] - Secured GET /api/v1/accounts
2026-07-31 01:06:49 [http-nio-0.0.0.0-8085-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 65569528-e79b-45d4-a015-96e74aa7e7d3] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:06:49 [http-nio-0.0.0.0-8085-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 65569528-e79b-45d4-a015-96e74aa7e7d3] -
    select
        a1_0.id,
        a1_0.account_name,
        a1_0.account_number,
        a1_0.account_type,
        a1_0.allow_incoming,
        a1_0.allow_outgoing,
        a1_0.balance,
        a1_0.card_cvv,
        a1_0.card_expiry,
        a1_0.created_at,
        a1_0.currency,
        a1_0.customer_id,
        a1_0.daily_limit,
        a1_0.monthly_limit,
        a1_0.parent_account_id,
        a1_0.require_dual_approval,
        a1_0.status,
        a1_0.swift_code,
        a1_0.updated_at
    from
        accounts a1_0
    where
        a1_0.customer_id=?
Hibernate:
    select
        a1_0.id,
        a1_0.account_name,
        a1_0.account_number,
        a1_0.account_type,
        a1_0.allow_incoming,
        a1_0.allow_outgoing,
        a1_0.balance,
        a1_0.card_cvv,
        a1_0.card_expiry,
        a1_0.created_at,
        a1_0.currency,
        a1_0.customer_id,
        a1_0.daily_limit,
        a1_0.monthly_limit,
        a1_0.parent_account_id,
        a1_0.require_dual_approval,
        a1_0.status,
        a1_0.swift_code,
        a1_0.updated_at
    from
        accounts a1_0
    where
        a1_0.customer_id=?
2026-07-31 01:06:49 [http-nio-0.0.0.0-8085-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 65569528-e79b-45d4-a015-96e74aa7e7d3] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 17ms
2026-07-31 01:06:50 [http-nio-0.0.0.0-8085-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/transactions/history/4859223720296210
2026-07-31 01:06:50 [http-nio-0.0.0.0-8085-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 70b70aaa-2d46-4364-86ae-70b37a9e6adc] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:06:50 [http-nio-0.0.0.0-8085-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 70b70aaa-2d46-4364-86ae-70b37a9e6adc] - Secured GET /api/v1/transactions/history/4859223720296210
2026-07-31 01:06:50 [http-nio-0.0.0.0-8085-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 70b70aaa-2d46-4364-86ae-70b37a9e6adc] -
    select
        t1_0.id,
        t1_0.amount,
        t1_0.created_at,
        t1_0.currency,
        t1_0.description,
        t1_0.destination_account_number,
        t1_0.dispute_reason,
        t1_0.idempotency_key,
        t1_0.is_disputed,
        t1_0.scheduled_vam_restriction,
        t1_0.source_account_number,
        t1_0.status,
        t1_0.transaction_reference
    from
        transactions t1_0
    where
        t1_0.source_account_number=?
        or t1_0.destination_account_number=?
    order by
        t1_0.created_at desc
    offset
        ? rows
    fetch
        first ? rows only
Hibernate:
    select
        t1_0.id,
        t1_0.amount,
        t1_0.created_at,
        t1_0.currency,
        t1_0.description,
        t1_0.destination_account_number,
        t1_0.dispute_reason,
        t1_0.idempotency_key,
        t1_0.is_disputed,
        t1_0.scheduled_vam_restriction,
        t1_0.source_account_number,
        t1_0.status,
        t1_0.transaction_reference
    from
        transactions t1_0
    where
        t1_0.source_account_number=?
        or t1_0.destination_account_number=?
    order by
        t1_0.created_at desc
    offset
        ? rows
    fetch
        first ? rows only
2026-07-31 01:06:50 [http-nio-0.0.0.0-8085-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 70b70aaa-2d46-4364-86ae-70b37a9e6adc] - [HTTP LOG] GET /api/v1/transactions/history/4859223720296210 - Status: 200 - Duration: 29ms
2026-07-31 01:06:50 [MessageBroker-1] INFO  o.s.w.s.c.WebSocketMessageBrokerStats [X-Request-Id: ] - WebSocketSession[1 current WS(1)-HttpStream(0)-HttpPoll(0), 1 total, 0 closed abnormally (0 connect failure, 0 send limit, 0 transport error)], stompSubProtocol[processed CONNECT(1)-CONNECTED(1)-DISCONNECT(0)], stompBrokerRelay[null], inboundChannel[pool size = 6, active threads = 0, queued tasks = 0, completed tasks = 6], outboundChannel[pool size = 1, active threads = 0, queued tasks = 0, completed tasks = 1], sockJsScheduler[pool size = 1, active threads = 1, queued tasks = 0, completed tasks = 0]
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: dd4d9525-d54f-4e17-8439-cc3ef8a16d54] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/transactions/history/4859223720296210
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: dd4d9525-d54f-4e17-8439-cc3ef8a16d54] - Secured GET /api/v1/accounts
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ef53ce68-82c0-45a4-9d26-26915d5212d0] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: dd4d9525-d54f-4e17-8439-cc3ef8a16d54] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: dd4d9525-d54f-4e17-8439-cc3ef8a16d54] -
    select
        a1_0.id,
        a1_0.account_name,
        a1_0.account_number,
        a1_0.account_type,
        a1_0.allow_incoming,
        a1_0.allow_outgoing,
        a1_0.balance,
        a1_0.card_cvv,
        a1_0.card_expiry,
        a1_0.created_at,
        a1_0.currency,
        a1_0.customer_id,
        a1_0.daily_limit,
        a1_0.monthly_limit,
        a1_0.parent_account_id,
        a1_0.require_dual_approval,
        a1_0.status,
        a1_0.swift_code,
        a1_0.updated_at
    from
        accounts a1_0
    where
        a1_0.customer_id=?
Hibernate:
    select
        a1_0.id,
        a1_0.account_name,
        a1_0.account_number,
        a1_0.account_type,
        a1_0.allow_incoming,
        a1_0.allow_outgoing,
        a1_0.balance,
        a1_0.card_cvv,
        a1_0.card_expiry,
        a1_0.created_at,
        a1_0.currency,
        a1_0.customer_id,
        a1_0.daily_limit,
        a1_0.monthly_limit,
        a1_0.parent_account_id,
        a1_0.require_dual_approval,
        a1_0.status,
        a1_0.swift_code,
        a1_0.updated_at
    from
        accounts a1_0
    where
        a1_0.customer_id=?
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ef53ce68-82c0-45a4-9d26-26915d5212d0] - Secured GET /api/v1/transactions/history/4859223720296210
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ef53ce68-82c0-45a4-9d26-26915d5212d0] -
    select
        t1_0.id,
        t1_0.amount,
        t1_0.created_at,
        t1_0.currency,
        t1_0.description,
        t1_0.destination_account_number,
        t1_0.dispute_reason,
        t1_0.idempotency_key,
        t1_0.is_disputed,
        t1_0.scheduled_vam_restriction,
        t1_0.source_account_number,
        t1_0.status,
        t1_0.transaction_reference
    from
        transactions t1_0
    where
        t1_0.source_account_number=?
        or t1_0.destination_account_number=?
    order by
        t1_0.created_at desc
    offset
        ? rows
    fetch
        first ? rows only
Hibernate:
    select
        t1_0.id,
        t1_0.amount,
        t1_0.created_at,
        t1_0.currency,
        t1_0.description,
        t1_0.destination_account_number,
        t1_0.dispute_reason,
        t1_0.idempotency_key,
        t1_0.is_disputed,
        t1_0.scheduled_vam_restriction,
        t1_0.source_account_number,
        t1_0.status,
        t1_0.transaction_reference
    from
        transactions t1_0
    where
        t1_0.source_account_number=?
        or t1_0.destination_account_number=?
    order by
        t1_0.created_at desc
    offset
        ? rows
    fetch
        first ? rows only
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: dd4d9525-d54f-4e17-8439-cc3ef8a16d54] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 27ms
2026-07-31 01:06:51 [http-nio-0.0.0.0-8085-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ef53ce68-82c0-45a4-9d26-26915d5212d0] - [HTTP LOG] GET /api/v1/transactions/history/4859223720296210 - Status: 200 - Duration: 18ms
2026-07-31 01:06:59 [AsyncThread-3] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Email dispatched successfully to recipient@example.com
2026-07-31 01:07:01 [AsyncThread-2] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Email dispatched successfully to user@example.com
2026-07-31 01:07:05 [http-nio-0.0.0.0-8085-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/notifications
2026-07-31 01:07:05 [http-nio-0.0.0.0-8085-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: e099f626-f1e6-492e-89bd-9aeb498a53b9] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:07:05 [http-nio-0.0.0.0-8085-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: e099f626-f1e6-492e-89bd-9aeb498a53b9] - Secured GET /api/v1/notifications
2026-07-31 01:07:05 [http-nio-0.0.0.0-8085-exec-2] INFO  c.c.b.c.a.GetCustomerAlertsService [X-Request-Id: e099f626-f1e6-492e-89bd-9aeb498a53b9] - Fetching customer alerts for: razz@gmail.com
2026-07-31 01:07:05 [http-nio-0.0.0.0-8085-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: e099f626-f1e6-492e-89bd-9aeb498a53b9] -
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0 
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
Hibernate:
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
2026-07-31 01:07:05 [http-nio-0.0.0.0-8085-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: e099f626-f1e6-492e-89bd-9aeb498a53b9] - [HTTP LOG] GET /api/v1/notifications - Status: 200 - Duration: 54ms     
2026-07-31 01:07:07 [http-nio-0.0.0.0-8085-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/notifications
2026-07-31 01:07:07 [http-nio-0.0.0.0-8085-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 298ac323-951b-4301-b4e8-1ea79baf5bb8] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:07:07 [http-nio-0.0.0.0-8085-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 298ac323-951b-4301-b4e8-1ea79baf5bb8] - Secured GET /api/v1/notifications
2026-07-31 01:07:07 [http-nio-0.0.0.0-8085-exec-5] INFO  c.c.b.c.a.GetCustomerAlertsService [X-Request-Id: 298ac323-951b-4301-b4e8-1ea79baf5bb8] - Fetching customer alerts for: razz@gmail.com
2026-07-31 01:07:07 [http-nio-0.0.0.0-8085-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 298ac323-951b-4301-b4e8-1ea79baf5bb8] -
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
Hibernate:
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
2026-07-31 01:07:07 [http-nio-0.0.0.0-8085-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 298ac323-951b-4301-b4e8-1ea79baf5bb8] - [HTTP LOG] GET /api/v1/notifications - Status: 200 - Duration: 9ms      
2026-07-31 01:07:18 [http-nio-0.0.0.0-8085-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/notifications
2026-07-31 01:07:18 [http-nio-0.0.0.0-8085-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: f781a22b-9188-4353-81cd-855737453b62] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:07:18 [http-nio-0.0.0.0-8085-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: f781a22b-9188-4353-81cd-855737453b62] - Secured GET /api/v1/notifications
2026-07-31 01:07:18 [http-nio-0.0.0.0-8085-exec-4] INFO  c.c.b.c.a.GetCustomerAlertsService [X-Request-Id: f781a22b-9188-4353-81cd-855737453b62] - Fetching customer alerts for: razz@gmail.com
2026-07-31 01:07:18 [http-nio-0.0.0.0-8085-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: f781a22b-9188-4353-81cd-855737453b62] -
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
Hibernate:
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
2026-07-31 01:07:18 [http-nio-0.0.0.0-8085-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: f781a22b-9188-4353-81cd-855737453b62] - [HTTP LOG] GET /api/v1/notifications - Status: 200 - Duration: 11ms     
2026-07-31 01:07:25 [http-nio-0.0.0.0-8085-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/notifications
2026-07-31 01:07:25 [http-nio-0.0.0.0-8085-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: fa971d53-76ba-4eb1-afe1-fd4c7465b141] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:07:25 [http-nio-0.0.0.0-8085-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: fa971d53-76ba-4eb1-afe1-fd4c7465b141] - Secured GET /api/v1/notifications
2026-07-31 01:07:25 [http-nio-0.0.0.0-8085-exec-6] INFO  c.c.b.c.a.GetCustomerAlertsService [X-Request-Id: fa971d53-76ba-4eb1-afe1-fd4c7465b141] - Fetching customer alerts for: razz@gmail.com
2026-07-31 01:07:25 [http-nio-0.0.0.0-8085-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: fa971d53-76ba-4eb1-afe1-fd4c7465b141] -
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
Hibernate:
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
2026-07-31 01:07:25 [http-nio-0.0.0.0-8085-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: fa971d53-76ba-4eb1-afe1-fd4c7465b141] - [HTTP LOG] GET /api/v1/notifications - Status: 200 - Duration: 9ms      
2026-07-31 01:07:28 [http-nio-0.0.0.0-8085-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/notifications
2026-07-31 01:07:28 [http-nio-0.0.0.0-8085-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 957661cf-ef58-4fb5-9c69-070d13a66e1b] -
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
Hibernate:
    select
        c1_0.id,
        c1_0.created_at,
        c1_0.email,
        c1_0.employment_status,
        c1_0.first_name,
        c1_0.job_title,
        c1_0.kyc_status,
        c1_0.last_name,
        c1_0.monthly_income,
        c1_0.password,
        c1_0.role,
        c1_0.source_of_funds
    from
        customers c1_0
    where
        c1_0.email=?
2026-07-31 01:07:28 [http-nio-0.0.0.0-8085-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 957661cf-ef58-4fb5-9c69-070d13a66e1b] - Secured GET /api/v1/notifications
2026-07-31 01:07:28 [http-nio-0.0.0.0-8085-exec-7] INFO  c.c.b.c.a.GetCustomerAlertsService [X-Request-Id: 957661cf-ef58-4fb5-9c69-070d13a66e1b] - Fetching customer alerts for: razz@gmail.com
2026-07-31 01:07:28 [http-nio-0.0.0.0-8085-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 957661cf-ef58-4fb5-9c69-070d13a66e1b] -
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
Hibernate:
    select
        alje1_0.id,
        alje1_0.action,
        alje1_0.actor,
        alje1_0.created_at,
        alje1_0.details,
        alje1_0.ip_address,
        alje1_0.resource_id
    from
        audit_logs alje1_0
    where
        alje1_0.actor=?
    order by
        alje1_0.created_at desc
    fetch
        first ? rows only
2026-07-31 01:07:28 [http-nio-0.0.0.0-8085-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 957661cf-ef58-4fb5-9c69-070d13a66e1b] - [HTTP LOG] GET /api/v1/notifications - Status: 200 - Duration: 6ms      
<==========---> 80% EXECUTING [2m 24s]
> :bootRun