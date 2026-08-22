2026-08-22 17:49:47.272 | 2026-08-22 09:49:47 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 17:49:47.273 | 2026-08-22 09:49:47 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 17:49:47.278 | 2026-08-22 09:49:47 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 38b91144-3e0f-4d42-8679-528f7220d700] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 17:49:47.278 | 2026-08-22 09:49:47 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 38b91144-3e0f-4d42-8679-528f7220d700] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-22 17:49:52.003 | 2026-08-22 09:49:52 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/apikeys
2026-08-22 17:49:52.015 | 2026-08-22 09:49:52 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: f1a55043-6ee4-4dae-93c6-91ddbec66da8] - 
2026-08-22 17:49:52.015 |     select
2026-08-22 17:49:52.015 |         c1_0.id,
2026-08-22 17:49:52.015 |         c1_0.created_at,
2026-08-22 17:49:52.015 |         c1_0.email,
2026-08-22 17:49:52.015 |         c1_0.employment_status,
2026-08-22 17:49:52.015 |         c1_0.first_name,
2026-08-22 17:49:52.015 |         c1_0.job_title,
2026-08-22 17:49:52.015 |         c1_0.kyc_status,
2026-08-22 17:49:52.015 |         c1_0.last_name,
2026-08-22 17:49:52.015 |         c1_0.locked,
2026-08-22 17:49:52.015 |         c1_0.monthly_income,
2026-08-22 17:49:52.015 |         c1_0.password,
2026-08-22 17:49:52.015 |         c1_0.risk_profile,
2026-08-22 17:49:52.015 |         c1_0.role,
2026-08-22 17:49:52.015 |         c1_0.source_of_funds 
2026-08-22 17:49:52.015 |     from
2026-08-22 17:49:52.015 |         customers c1_0 
2026-08-22 17:49:52.015 |     where
2026-08-22 17:49:52.015 |         upper(c1_0.email)=upper(?)
2026-08-22 17:49:52.015 | Hibernate: 
2026-08-22 17:49:52.015 |     select
2026-08-22 17:49:52.015 |         c1_0.id,
2026-08-22 17:49:52.015 |         c1_0.created_at,
2026-08-22 17:49:52.015 |         c1_0.email,
2026-08-22 17:49:52.015 |         c1_0.employment_status,
2026-08-22 17:49:52.015 |         c1_0.first_name,
2026-08-22 17:49:52.015 |         c1_0.job_title,
2026-08-22 17:49:52.015 |         c1_0.kyc_status,
2026-08-22 17:49:52.015 |         c1_0.last_name,
2026-08-22 17:49:52.016 |         c1_0.locked,
2026-08-22 17:49:52.016 |         c1_0.monthly_income,
2026-08-22 17:49:52.016 |         c1_0.password,
2026-08-22 17:49:52.016 |         c1_0.risk_profile,
2026-08-22 17:49:52.016 |         c1_0.role,
2026-08-22 17:49:52.016 |         c1_0.source_of_funds 
2026-08-22 17:49:52.016 |     from
2026-08-22 17:49:52.016 |         customers c1_0 
2026-08-22 17:49:52.016 |     where
2026-08-22 17:49:52.016 |         upper(c1_0.email)=upper(?)
2026-08-22 17:49:52.034 | 2026-08-22 09:49:52 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: f1a55043-6ee4-4dae-93c6-91ddbec66da8] - Secured POST /api/v1/apikeys
2026-08-22 17:49:52.043 | 2026-08-22 09:49:52 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: f1a55043-6ee4-4dae-93c6-91ddbec66da8] - 
2026-08-22 17:49:52.043 |     insert 
2026-08-22 17:49:52.043 |     into
2026-08-22 17:49:52.043 |         api_keys
2026-08-22 17:49:52.043 |         (cidr_whitelist, created_at, environment, expires_at, key_hash, key_prefix, last_used_at, linked_account_id, name, revoked_at, scopes) 
2026-08-22 17:49:52.043 |     values
2026-08-22 17:49:52.043 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-22 17:49:52.043 | Hibernate: 
2026-08-22 17:49:52.043 |     insert 
2026-08-22 17:49:52.043 |     into
2026-08-22 17:49:52.043 |         api_keys
2026-08-22 17:49:52.043 |         (cidr_whitelist, created_at, environment, expires_at, key_hash, key_prefix, last_used_at, linked_account_id, name, revoked_at, scopes) 
2026-08-22 17:49:52.043 |     values
2026-08-22 17:49:52.043 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-22 17:49:52.069 | 2026-08-22 09:49:52 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: f1a55043-6ee4-4dae-93c6-91ddbec66da8] - [HTTP LOG] POST /api/v1/apikeys - Status: 201 - Duration: 34ms
2026-08-22 17:49:57.369 | 2026-08-22 09:49:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 17:49:57.370 | 2026-08-22 09:49:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 17:49:57.375 | 2026-08-22 09:49:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 26deec7a-879d-49e4-9e63-8a04e9cb27f3] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 17:49:57.375 | 2026-08-22 09:49:57 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 26deec7a-879d-49e4-9e63-8a04e9cb27f3] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-22 17:50:07.443 | 2026-08-22 09:50:07 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 17:50:07.444 | 2026-08-22 09:50:07 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 17:50:07.467 | 2026-08-22 09:50:07 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: a14bb590-0343-4113-9896-2419e0dff2d3] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 17:50:07.468 | 2026-08-22 09:50:07 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: a14bb590-0343-4113-9896-2419e0dff2d3] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 23ms
2026-08-22 17:50:17.543 | 2026-08-22 09:50:17 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 17:50:17.545 | 2026-08-22 09:50:17 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 17:50:17.549 | 2026-08-22 09:50:17 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: edeade48-7f4c-4468-ac46-5fcc667cdd2e] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 17:50:17.549 | 2026-08-22 09:50:17 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: edeade48-7f4c-4468-ac46-5fcc667cdd2e] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 17:50:18.555 | 2026-08-22 09:50:18 [MessageBroker-14] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 17:50:18.555 |     select
2026-08-22 17:50:18.555 |         icl1_0.id,
2026-08-22 17:50:18.555 |         icl1_0.attempt_count,
2026-08-22 17:50:18.555 |         icl1_0.callback_url,
2026-08-22 17:50:18.555 |         icl1_0.created_at,
2026-08-22 17:50:18.555 |         icl1_0.next_retry_at,
2026-08-22 17:50:18.555 |         icl1_0.payload,
2026-08-22 17:50:18.555 |         icl1_0.payment_session_id,
2026-08-22 17:50:18.555 |         icl1_0.response_body,
2026-08-22 17:50:18.555 |         icl1_0.response_code,
2026-08-22 17:50:18.555 |         icl1_0.status,
2026-08-22 17:50:18.555 |         icl1_0.updated_at 
2026-08-22 17:50:18.555 |     from
2026-08-22 17:50:18.555 |         institution_callback_log icl1_0 
2026-08-22 17:50:18.555 |     where
2026-08-22 17:50:18.555 |         icl1_0.status=? 
2026-08-22 17:50:18.555 |         and icl1_0.next_retry_at<?
2026-08-22 17:50:18.555 | Hibernate: 
2026-08-22 17:50:18.555 |     select
2026-08-22 17:50:18.555 |         icl1_0.id,
2026-08-22 17:50:18.555 |         icl1_0.attempt_count,
2026-08-22 17:50:18.555 |         icl1_0.callback_url,
2026-08-22 17:50:18.555 |         icl1_0.created_at,
2026-08-22 17:50:18.555 |         icl1_0.next_retry_at,
2026-08-22 17:50:18.555 |         icl1_0.payload,
2026-08-22 17:50:18.555 |         icl1_0.payment_session_id,
2026-08-22 17:50:18.555 |         icl1_0.response_body,
2026-08-22 17:50:18.555 |         icl1_0.response_code,
2026-08-22 17:50:18.555 |         icl1_0.status,
2026-08-22 17:50:18.555 |         icl1_0.updated_at 
2026-08-22 17:50:18.555 |     from
2026-08-22 17:50:18.555 |         institution_callback_log icl1_0 
2026-08-22 17:50:18.555 |     where
2026-08-22 17:50:18.555 |         icl1_0.status=? 
2026-08-22 17:50:18.555 |         and icl1_0.next_retry_at<?
2026-08-22 17:50:24.088 | 2026-08-22 09:50:24 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing DELETE /api/v1/webhooks/4
2026-08-22 17:50:24.097 | 2026-08-22 09:50:24 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: b3d445cb-fb7b-414e-8dde-b8809cb8b904] - 
2026-08-22 17:50:24.097 |     select
2026-08-22 17:50:24.097 |         c1_0.id,
2026-08-22 17:50:24.097 |         c1_0.created_at,
2026-08-22 17:50:24.097 |         c1_0.email,
2026-08-22 17:50:24.097 |         c1_0.employment_status,
2026-08-22 17:50:24.097 |         c1_0.first_name,
2026-08-22 17:50:24.097 |         c1_0.job_title,
2026-08-22 17:50:24.097 |         c1_0.kyc_status,
2026-08-22 17:50:24.097 |         c1_0.last_name,
2026-08-22 17:50:24.097 |         c1_0.locked,
2026-08-22 17:50:24.097 |         c1_0.monthly_income,
2026-08-22 17:50:24.097 |         c1_0.password,
2026-08-22 17:50:24.097 |         c1_0.risk_profile,
2026-08-22 17:50:24.097 |         c1_0.role,
2026-08-22 17:50:24.097 |         c1_0.source_of_funds 
2026-08-22 17:50:24.097 |     from
2026-08-22 17:50:24.097 |         customers c1_0 
2026-08-22 17:50:24.097 |     where
2026-08-22 17:50:24.097 |         upper(c1_0.email)=upper(?)
2026-08-22 17:50:24.097 | Hibernate: 
2026-08-22 17:50:24.097 |     select
2026-08-22 17:50:24.097 |         c1_0.id,
2026-08-22 17:50:24.097 |         c1_0.created_at,
2026-08-22 17:50:24.097 |         c1_0.email,
2026-08-22 17:50:24.097 |         c1_0.employment_status,
2026-08-22 17:50:24.097 |         c1_0.first_name,
2026-08-22 17:50:24.097 |         c1_0.job_title,
2026-08-22 17:50:24.097 |         c1_0.kyc_status,
2026-08-22 17:50:24.097 |         c1_0.last_name,
2026-08-22 17:50:24.097 |         c1_0.locked,
2026-08-22 17:50:24.097 |         c1_0.monthly_income,
2026-08-22 17:50:24.097 |         c1_0.password,
2026-08-22 17:50:24.097 |         c1_0.risk_profile,
2026-08-22 17:50:24.097 |         c1_0.role,
2026-08-22 17:50:24.097 |         c1_0.source_of_funds 
2026-08-22 17:50:24.097 |     from
2026-08-22 17:50:24.097 |         customers c1_0 
2026-08-22 17:50:24.097 |     where
2026-08-22 17:50:24.097 |         upper(c1_0.email)=upper(?)
2026-08-22 17:50:24.111 | 2026-08-22 09:50:24 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: b3d445cb-fb7b-414e-8dde-b8809cb8b904] - Secured DELETE /api/v1/webhooks/4
2026-08-22 17:50:24.166 | 2026-08-22 09:50:24 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: b3d445cb-fb7b-414e-8dde-b8809cb8b904] - 
2026-08-22 17:50:24.166 |     select
2026-08-22 17:50:24.166 |         we1_0.id,
2026-08-22 17:50:24.166 |         we1_0.created_at,
2026-08-22 17:50:24.166 |         we1_0.environment,
2026-08-22 17:50:24.166 |         we1_0.events,
2026-08-22 17:50:24.166 |         we1_0.merchant_id,
2026-08-22 17:50:24.166 |         we1_0.secret_hash,
2026-08-22 17:50:24.166 |         we1_0.status,
2026-08-22 17:50:24.166 |         we1_0.updated_at,
2026-08-22 17:50:24.166 |         we1_0.url 
2026-08-22 17:50:24.166 |     from
2026-08-22 17:50:24.166 |         webhook_endpoints we1_0 
2026-08-22 17:50:24.166 |     where
2026-08-22 17:50:24.166 |         we1_0.id=?
2026-08-22 17:50:24.166 | Hibernate: 
2026-08-22 17:50:24.166 |     select
2026-08-22 17:50:24.166 |         we1_0.id,
2026-08-22 17:50:24.166 |         we1_0.created_at,
2026-08-22 17:50:24.166 |         we1_0.environment,
2026-08-22 17:50:24.166 |         we1_0.events,
2026-08-22 17:50:24.166 |         we1_0.merchant_id,
2026-08-22 17:50:24.166 |         we1_0.secret_hash,
2026-08-22 17:50:24.166 |         we1_0.status,
2026-08-22 17:50:24.166 |         we1_0.updated_at,
2026-08-22 17:50:24.166 |         we1_0.url 
2026-08-22 17:50:24.166 |     from
2026-08-22 17:50:24.166 |         webhook_endpoints we1_0 
2026-08-22 17:50:24.166 |     where
2026-08-22 17:50:24.166 |         we1_0.id=?
2026-08-22 17:50:24.274 | 2026-08-22 09:50:24 [AsyncThread-1] INFO  c.c.b.c.audit.AuditEventPublisher [X-Request-Id: ] - [AUDIT EVENT] Action: WEBHOOK_ENDPOINT_DELETED, User: 1, CorrelationID: 4, Details: Deleted webhook endpoint
2026-08-22 17:50:24.277 | 2026-08-22 09:50:24 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: b3d445cb-fb7b-414e-8dde-b8809cb8b904] - 
2026-08-22 17:50:24.277 |     delete 
2026-08-22 17:50:24.277 |     from
2026-08-22 17:50:24.277 |         webhook_endpoints 
2026-08-22 17:50:24.277 |     where
2026-08-22 17:50:24.277 |         id=?
2026-08-22 17:50:24.277 | Hibernate: 
2026-08-22 17:50:24.277 |     delete 
2026-08-22 17:50:24.277 |     from
2026-08-22 17:50:24.277 |         webhook_endpoints 
2026-08-22 17:50:24.277 |     where
2026-08-22 17:50:24.277 |         id=?
2026-08-22 17:50:24.282 | 2026-08-22 09:50:24 [AsyncThread-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 17:50:24.282 |     insert 
2026-08-22 17:50:24.282 |     into
2026-08-22 17:50:24.282 |         audit_logs
2026-08-22 17:50:24.282 |         (action, actor, created_at, details, ip_address, resource_id) 
2026-08-22 17:50:24.282 |     values
2026-08-22 17:50:24.282 |         (?, ?, ?, ?, ?, ?)
2026-08-22 17:50:24.282 | Hibernate: 
2026-08-22 17:50:24.282 |     insert 
2026-08-22 17:50:24.282 |     into
2026-08-22 17:50:24.282 |         audit_logs
2026-08-22 17:50:24.282 |         (action, actor, created_at, details, ip_address, resource_id) 
2026-08-22 17:50:24.282 |     values
2026-08-22 17:50:24.282 |         (?, ?, ?, ?, ?, ?)
2026-08-22 17:50:24.308 | 2026-08-22 09:50:24 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b3d445cb-fb7b-414e-8dde-b8809cb8b904] - [HTTP LOG] DELETE /api/v1/webhooks/4 - Status: 200 - Duration: 197ms
2026-08-22 17:50:27.648 | 2026-08-22 09:50:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 17:50:27.649 | 2026-08-22 09:50:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 17:50:27.655 | 2026-08-22 09:50:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 36f45ef6-dd16-41f3-bdb0-5ae767b0a534] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 17:50:27.656 | 2026-08-22 09:50:27 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 36f45ef6-dd16-41f3-bdb0-5ae767b0a534] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-22 17:50:29.706 | 2026-08-22 09:50:29 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/webhooks
2026-08-22 17:50:29.716 | 2026-08-22 09:50:29 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: db5db653-ae02-4efa-aaf9-856ece7cf1e1] - 
2026-08-22 17:50:29.716 |     select
2026-08-22 17:50:29.716 |         c1_0.id,
2026-08-22 17:50:29.716 |         c1_0.created_at,
2026-08-22 17:50:29.716 |         c1_0.email,
2026-08-22 17:50:29.716 |         c1_0.employment_status,
2026-08-22 17:50:29.716 |         c1_0.first_name,
2026-08-22 17:50:29.716 |         c1_0.job_title,
2026-08-22 17:50:29.716 |         c1_0.kyc_status,
2026-08-22 17:50:29.716 |         c1_0.last_name,
2026-08-22 17:50:29.716 |         c1_0.locked,
2026-08-22 17:50:29.716 |         c1_0.monthly_income,
2026-08-22 17:50:29.716 |         c1_0.password,
2026-08-22 17:50:29.716 |         c1_0.risk_profile,
2026-08-22 17:50:29.716 |         c1_0.role,
2026-08-22 17:50:29.716 |         c1_0.source_of_funds 
2026-08-22 17:50:29.716 |     from
2026-08-22 17:50:29.716 |         customers c1_0 
2026-08-22 17:50:29.716 |     where
2026-08-22 17:50:29.716 |         upper(c1_0.email)=upper(?)
2026-08-22 17:50:29.717 | Hibernate: 
2026-08-22 17:50:29.717 |     select
2026-08-22 17:50:29.717 |         c1_0.id,
2026-08-22 17:50:29.717 |         c1_0.created_at,
2026-08-22 17:50:29.717 |         c1_0.email,
2026-08-22 17:50:29.717 |         c1_0.employment_status,
2026-08-22 17:50:29.717 |         c1_0.first_name,
2026-08-22 17:50:29.717 |         c1_0.job_title,
2026-08-22 17:50:29.717 |         c1_0.kyc_status,
2026-08-22 17:50:29.717 |         c1_0.last_name,
2026-08-22 17:50:29.717 |         c1_0.locked,
2026-08-22 17:50:29.717 |         c1_0.monthly_income,
2026-08-22 17:50:29.717 |         c1_0.password,
2026-08-22 17:50:29.717 |         c1_0.risk_profile,
2026-08-22 17:50:29.717 |         c1_0.role,
2026-08-22 17:50:29.717 |         c1_0.source_of_funds 
2026-08-22 17:50:29.717 |     from
2026-08-22 17:50:29.717 |         customers c1_0 
2026-08-22 17:50:29.717 |     where
2026-08-22 17:50:29.717 |         upper(c1_0.email)=upper(?)
2026-08-22 17:50:29.733 | 2026-08-22 09:50:29 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: db5db653-ae02-4efa-aaf9-856ece7cf1e1] - Secured POST /api/v1/webhooks
2026-08-22 17:50:29.753 | 2026-08-22 09:50:29 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: db5db653-ae02-4efa-aaf9-856ece7cf1e1] - 
2026-08-22 17:50:29.753 |     insert 
2026-08-22 17:50:29.753 |     into
2026-08-22 17:50:29.753 |         webhook_endpoints
2026-08-22 17:50:29.753 |         (created_at, environment, events, merchant_id, secret_hash, status, updated_at, url) 
2026-08-22 17:50:29.753 |     values
2026-08-22 17:50:29.753 |         (?, ?, ?, ?, ?, ?, ?, ?)
2026-08-22 17:50:29.753 | Hibernate: 
2026-08-22 17:50:29.753 |     insert 
2026-08-22 17:50:29.753 |     into
2026-08-22 17:50:29.753 |         webhook_endpoints
2026-08-22 17:50:29.753 |         (created_at, environment, events, merchant_id, secret_hash, status, updated_at, url) 
2026-08-22 17:50:29.753 |     values
2026-08-22 17:50:29.753 |         (?, ?, ?, ?, ?, ?, ?, ?)
2026-08-22 17:50:29.763 | 2026-08-22 09:50:29 [AsyncThread-2] INFO  c.c.b.c.audit.AuditEventPublisher [X-Request-Id: ] - [AUDIT EVENT] Action: WEBHOOK_ENDPOINT_CREATED, User: 1, CorrelationID: 5, Details: Created webhook endpoint for https://api.minimartgrocery.dev/api/v1/finance/webhooks/banking
2026-08-22 17:50:29.766 | 2026-08-22 09:50:29 [AsyncThread-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 17:50:29.766 |     insert 
2026-08-22 17:50:29.766 |     into
2026-08-22 17:50:29.766 |         audit_logs
2026-08-22 17:50:29.766 |         (action, actor, created_at, details, ip_address, resource_id) 
2026-08-22 17:50:29.766 |     values
2026-08-22 17:50:29.766 |         (?, ?, ?, ?, ?, ?)
2026-08-22 17:50:29.766 | Hibernate: 
2026-08-22 17:50:29.766 |     insert 
2026-08-22 17:50:29.766 |     into
2026-08-22 17:50:29.766 |         audit_logs
2026-08-22 17:50:29.766 |         (action, actor, created_at, details, ip_address, resource_id) 
2026-08-22 17:50:29.766 |     values
2026-08-22 17:50:29.766 |         (?, ?, ?, ?, ?, ?)
2026-08-22 17:50:29.771 | 2026-08-22 09:50:29 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: db5db653-ae02-4efa-aaf9-856ece7cf1e1] - [HTTP LOG] POST /api/v1/webhooks - Status: 200 - Duration: 38ms