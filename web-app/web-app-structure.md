2026-08-25 19:39:46 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health

2026-08-25 19:39:46 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health

2026-08-25 19:39:46 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 7ad496b9-c05e-4ba3-baa3-3779ef4e53e6] - Set SecurityContextHolder to anonymous SecurityContext

2026-08-25 19:39:46 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 7ad496b9-c05e-4ba3-baa3-3779ef4e53e6] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 11ms

2026-08-25 19:39:47 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /accounts

2026-08-25 19:39:47 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: 703698f1-313f-44e2-8267-3cf69915733d] - 

    select

        c1_0.id,

        c1_0.created_at,

        c1_0.email,

        c1_0.employment_status,

        c1_0.first_name,

        c1_0.job_title,

        c1_0.kyc_status,

        c1_0.last_name,

        c1_0.locked,

        c1_0.monthly_income,

        c1_0.password,

        c1_0.risk_profile,

        c1_0.role,

        c1_0.source_of_funds 

    from

        customers c1_0 

    where

        upper(c1_0.email)=upper(?)