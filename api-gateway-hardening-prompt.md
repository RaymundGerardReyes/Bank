2026-08-24 17:03:22.756 |   _   _               _                     _   ____              _    _             
2026-08-24 17:03:22.756 |  | | | | __ _ _ __ __| | ___ _ __   ___  __| | | __ )  __ _ _ __ | | _(_)_ __   __ _ 
2026-08-24 17:03:22.756 |  | |_| |/ _` | '__/ _` |/ _ \ '_ \ / _ \/ _` | |  _ \ / _` | '_ \| |/ / | '_ \ / _` |
2026-08-24 17:03:22.756 |  |  _  | (_| | | | (_| |  __/ | | |  __/ (_| | | |_) | (_| | | | |   <| | | | | (_| |
2026-08-24 17:03:22.756 |  |_| |_|\__,_|_|  \__,_|\___|_| |_|\___|\__,_| |____/ \__,_|_| |_|_|\_\_|_| |_|\__, |
2026-08-24 17:03:22.756 |                                                                                |___/ 
2026-08-24 17:03:22.756 |  :: Hardened Modular Monolith Backend ::
2026-08-24 17:03:22.756 | 
2026-08-24 17:03:22.777 | 2026-08-24 09:03:22 [background-preinit] INFO  o.h.validator.internal.util.Version [X-Request-Id: ] - HV000001: Hibernate Validator 8.0.1.Final
2026-08-24 17:03:22.910 | 2026-08-24 09:03:22 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - Starting BankingApplication v0.1.0 using Java 21.0.12 with PID 1 (/app/app.jar started by spring in /app)
2026-08-24 17:03:22.911 | 2026-08-24 09:03:22 [main] DEBUG c.company.banking.BankingApplication [X-Request-Id: ] - Running with Spring Boot v3.4.0, Spring v6.2.0
2026-08-24 17:03:22.912 | 2026-08-24 09:03:22 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - The following 1 profile is active: "dev"
2026-08-24 17:03:26.224 | 2026-08-24 09:03:26 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-08-24 17:03:26.698 | 2026-08-24 09:03:26 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Finished Spring Data repository scanning in 446 ms. Found 47 JPA repository interfaces.
2026-08-24 17:03:29.111 | 2026-08-24 09:03:29 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer [X-Request-Id: ] - Tomcat initialized with port 8080 (http)
2026-08-24 17:03:29.155 | 2026-08-24 09:03:29 [main] INFO  o.a.coyote.http11.Http11NioProtocol [X-Request-Id: ] - Initializing ProtocolHandler ["http-nio-0.0.0.0-8080"]
2026-08-24 17:03:29.162 | 2026-08-24 09:03:29 [main] INFO  o.a.catalina.core.StandardService [X-Request-Id: ] - Starting service [Tomcat]
2026-08-24 17:03:29.162 | 2026-08-24 09:03:29 [main] INFO  o.a.catalina.core.StandardEngine [X-Request-Id: ] - Starting Servlet engine: [Apache Tomcat/10.1.33]
2026-08-24 17:03:29.304 | 2026-08-24 09:03:29 [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] [X-Request-Id: ] - Initializing Spring embedded WebApplicationContext
2026-08-24 17:03:29.309 | 2026-08-24 09:03:29 [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext [X-Request-Id: ] - Root WebApplicationContext: initialization completed in 6291 ms
2026-08-24 17:03:30.395 | 2026-08-24 09:03:30 [main] INFO  com.zaxxer.hikari.HikariDataSource [X-Request-Id: ] - HikariPool-1 - Starting...
2026-08-24 17:03:30.723 | 2026-08-24 09:03:30 [main] INFO  com.zaxxer.hikari.pool.HikariPool [X-Request-Id: ] - HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@789d8fd6
2026-08-24 17:03:30.727 | 2026-08-24 09:03:30 [main] INFO  com.zaxxer.hikari.HikariDataSource [X-Request-Id: ] - HikariPool-1 - Start completed.
2026-08-24 17:03:30.795 | 2026-08-24 09:03:30 [main] INFO  org.flywaydb.core.FlywayExecutor [X-Request-Id: ] - Database: jdbc:postgresql://database:5432/banking (PostgreSQL 17.10)
2026-08-24 17:03:31.002 | 2026-08-24 09:03:31 [main] INFO  o.f.core.internal.command.DbValidate [X-Request-Id: ] - Successfully validated 50 migrations (execution time 00:00.142s)
2026-08-24 17:03:31.006 | 2026-08-24 09:03:31 [main] WARN  org.flywaydb.core.Flyway [X-Request-Id: ] - cleanOnValidationError is deprecated and will be removed in a later release
2026-08-24 17:03:31.050 | 2026-08-24 09:03:31 [main] INFO  o.f.core.internal.command.DbMigrate [X-Request-Id: ] - Current version of schema "public": 51
2026-08-24 17:03:31.060 | 2026-08-24 09:03:31 [main] INFO  o.f.core.internal.command.DbMigrate [X-Request-Id: ] - Schema "public" is up to date. No migration necessary.
2026-08-24 17:03:31.335 | 2026-08-24 09:03:31 [main] INFO  o.h.jpa.internal.util.LogHelper [X-Request-Id: ] - HHH000204: Processing PersistenceUnitInfo [name: default]
2026-08-24 17:03:31.432 | 2026-08-24 09:03:31 [main] INFO  org.hibernate.Version [X-Request-Id: ] - HHH000412: Hibernate ORM core version 6.6.2.Final
2026-08-24 17:03:31.491 | 2026-08-24 09:03:31 [main] INFO  o.h.c.i.RegionFactoryInitiator [X-Request-Id: ] - HHH000026: Second-level cache disabled
2026-08-24 17:03:31.955 | 2026-08-24 09:03:31 [main] INFO  o.s.o.j.p.SpringPersistenceUnitInfo [X-Request-Id: ] - No LoadTimeWeaver setup: ignoring JPA class transformer
2026-08-24 17:03:32.055 | 2026-08-24 09:03:32 [main] WARN  org.hibernate.orm.deprecation [X-Request-Id: ] - HHH90000025: PostgreSQLDialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default)
2026-08-24 17:03:32.099 | 2026-08-24 09:03:32 [main] INFO  o.hibernate.orm.connections.pooling [X-Request-Id: ] - HHH10001005: Database info:
2026-08-24 17:03:32.099 | 	Database JDBC URL [Connecting through datasource 'HikariDataSource (HikariPool-1)']
2026-08-24 17:03:32.099 | 	Database driver: undefined/unknown
2026-08-24 17:03:32.099 | 	Database version: 17.10
2026-08-24 17:03:32.099 | 	Autocommit mode: undefined/unknown
2026-08-24 17:03:32.099 | 	Isolation level: undefined/unknown
2026-08-24 17:03:32.099 | 	Minimum pool size: undefined/unknown
2026-08-24 17:03:32.099 | 	Maximum pool size: undefined/unknown
2026-08-24 17:03:35.449 | 2026-08-24 09:03:35 [main] INFO  o.h.e.t.j.p.i.JtaPlatformInitiator [X-Request-Id: ] - HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-08-24 17:03:35.569 | 2026-08-24 09:03:35 [main] INFO  o.s.o.j.LocalContainerEntityManagerFactoryBean [X-Request-Id: ] - Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-08-24 17:03:36.162 | 2026-08-24 09:03:36 [main] INFO  o.s.d.j.r.query.QueryEnhancerFactory [X-Request-Id: ] - Hibernate is in classpath; If applicable, HQL parser will be used.
2026-08-24 17:03:37.642 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.s.jwt.JwtAuthenticationFilter [X-Request-Id: ] - Filter 'jwtAuthenticationFilter' configured for use
2026-08-24 17:03:37.642 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.web.filter.BffIdentityFilter [X-Request-Id: ] - Filter 'bffIdentityFilter' configured for use
2026-08-24 17:03:37.642 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.web.filter.RateLimitFilter [X-Request-Id: ] - Filter 'rateLimitFilter' configured for use
2026-08-24 17:03:37.644 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ] - Filter 'requestLoggingFilter' configured for use
2026-08-24 17:03:37.645 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.a.s.ApiGatewayIdempotencyInterceptor [X-Request-Id: ] - Filter 'apiGatewayIdempotencyInterceptor' configured for use
2026-08-24 17:03:37.645 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.web.filter.CorrelationIdFilter [X-Request-Id: ] - Filter 'correlationIdFilter' configured for use
2026-08-24 17:03:37.648 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.a.s.GatewayRateLimitFilter [X-Request-Id: ] - Filter 'gatewayRateLimitFilter' configured for use
2026-08-24 17:03:37.648 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.a.s.ApiKeyAuthenticationFilter [X-Request-Id: ] - Filter 'apiKeyAuthenticationFilter' configured for use
2026-08-24 17:03:37.648 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - Filter 'apiAuditLoggingFilter' configured for use
2026-08-24 17:03:37.648 | 2026-08-24 09:03:37 [main] DEBUG c.c.b.w.filter.SecurityHeadersFilter [X-Request-Id: ] - Filter 'securityHeadersFilter' configured for use
2026-08-24 17:03:40.738 | 2026-08-24 09:03:40 [main] INFO  o.s.s.c.a.a.c.InitializeAuthenticationProviderBeanManagerConfigurer$InitializeAuthenticationProviderManagerConfigurer [X-Request-Id: ] - Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-08-24 17:03:40.740 | 2026-08-24 09:03:40 [main] WARN  o.s.s.c.a.a.c.InitializeUserDetailsBeanManagerConfigurer$InitializeUserDetailsManagerConfigurer [X-Request-Id: ] - Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-08-24 17:03:41.247 | 2026-08-24 09:03:41 [main] WARN  o.s.b.a.o.j.JpaBaseConfiguration$JpaWebConfiguration [X-Request-Id: ] - spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2026-08-24 17:03:42.227 | 2026-08-24 09:03:42 [main] INFO  o.s.b.a.e.web.EndpointLinksResolver [X-Request-Id: ] - Exposing 3 endpoints beneath base path '/actuator'
2026-08-24 17:03:42.407 | 2026-08-24 09:03:42 [main] DEBUG o.s.s.web.DefaultSecurityFilterChain [X-Request-Id: ] - Will secure Or [Mvc [pattern='/actuator/**']] with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, LogoutFilter, BasicAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, ExceptionTranslationFilter, AuthorizationFilter
2026-08-24 17:03:42.512 | 2026-08-24 09:03:42 [main] DEBUG o.s.s.web.DefaultSecurityFilterChain [X-Request-Id: ] - Will secure any request with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, LogoutFilter, CorrelationIdFilter, BffIdentityFilter, ApiKeyAuthenticationFilter, JwtAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, SessionManagementFilter, ExceptionTranslationFilter, AuthorizationFilter
2026-08-24 17:03:43.712 | 2026-08-24 09:03:43 [main] INFO  o.s.m.s.b.SimpleBrokerMessageHandler [X-Request-Id: ] - Starting...
2026-08-24 17:03:43.713 | 2026-08-24 09:03:43 [main] INFO  o.s.m.s.b.SimpleBrokerMessageHandler [X-Request-Id: ] - BrokerAvailabilityEvent[available=true, SimpleBrokerMessageHandler [org.springframework.messaging.simp.broker.DefaultSubscriptionRegistry@21ef8eda]]
2026-08-24 17:03:43.716 | 2026-08-24 09:03:43 [main] INFO  o.s.m.s.b.SimpleBrokerMessageHandler [X-Request-Id: ] - Started.
2026-08-24 17:03:43.717 | 2026-08-24 09:03:43 [main] INFO  o.a.coyote.http11.Http11NioProtocol [X-Request-Id: ] - Starting ProtocolHandler ["http-nio-0.0.0.0-8080"]
2026-08-24 17:03:43.747 | 2026-08-24 09:03:43 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer [X-Request-Id: ] - Tomcat started on port 8080 (http) with context path '/'
2026-08-24 17:03:43.788 | 2026-08-24 09:03:43 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - Started BankingApplication in 22.021 seconds (process running for 22.984)
2026-08-24 17:03:43.925 | 2026-08-24 09:03:43 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:43.925 |     SELECT
2026-08-24 17:03:43.925 |         * 
2026-08-24 17:03:43.925 |     FROM
2026-08-24 17:03:43.925 |         payment_event_outbox 
2026-08-24 17:03:43.925 |     WHERE
2026-08-24 17:03:43.925 |         status = 'DELIVERING'   
2026-08-24 17:03:43.925 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:43.926 | Hibernate: 
2026-08-24 17:03:43.926 |     SELECT
2026-08-24 17:03:43.926 |         * 
2026-08-24 17:03:43.926 |     FROM
2026-08-24 17:03:43.926 |         payment_event_outbox 
2026-08-24 17:03:43.926 |     WHERE
2026-08-24 17:03:43.926 |         status = 'DELIVERING'   
2026-08-24 17:03:43.926 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:43.933 | 2026-08-24 09:03:43 [MessageBroker-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:43.933 |     SELECT
2026-08-24 17:03:43.933 |         o1.* 
2026-08-24 17:03:43.933 |     FROM
2026-08-24 17:03:43.933 |         payment_event_outbox o1 
2026-08-24 17:03:43.933 |     WHERE
2026-08-24 17:03:43.933 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:43.933 |         AND (
2026-08-24 17:03:43.933 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:43.933 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:43.933 |         )   
2026-08-24 17:03:43.933 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:43.933 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:43.933 |             1 
2026-08-24 17:03:43.933 |         FROM
2026-08-24 17:03:43.933 |             payment_event_outbox o2       
2026-08-24 17:03:43.933 |         WHERE
2026-08-24 17:03:43.933 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:43.933 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:43.933 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:43.933 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:43.933 |     ORDER BY
2026-08-24 17:03:43.933 |         o1.created_at ASC 
2026-08-24 17:03:43.933 |     LIMIT
2026-08-24 17:03:43.933 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:43.933 | Hibernate: 
2026-08-24 17:03:43.933 |     SELECT
2026-08-24 17:03:43.933 |         o1.* 
2026-08-24 17:03:43.933 |     FROM
2026-08-24 17:03:43.933 |         payment_event_outbox o1 
2026-08-24 17:03:43.933 |     WHERE
2026-08-24 17:03:43.933 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:43.933 |         AND (
2026-08-24 17:03:43.933 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:43.933 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:43.933 |         )   
2026-08-24 17:03:43.933 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:43.933 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:43.933 |             1 
2026-08-24 17:03:43.933 |         FROM
2026-08-24 17:03:43.933 |             payment_event_outbox o2       
2026-08-24 17:03:43.933 |         WHERE
2026-08-24 17:03:43.933 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:43.933 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:43.933 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:43.933 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:43.933 |     ORDER BY
2026-08-24 17:03:43.933 |         o1.created_at ASC 
2026-08-24 17:03:43.933 |     LIMIT
2026-08-24 17:03:43.933 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:44.020 | 2026-08-24 09:03:44 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:44.020 |     select
2026-08-24 17:03:44.020 |         icl1_0.id,
2026-08-24 17:03:44.020 |         icl1_0.attempt_count,
2026-08-24 17:03:44.020 |         icl1_0.callback_url,
2026-08-24 17:03:44.020 |         icl1_0.created_at,
2026-08-24 17:03:44.020 |         icl1_0.next_retry_at,
2026-08-24 17:03:44.020 |         icl1_0.payload,
2026-08-24 17:03:44.020 |         icl1_0.payment_session_id,
2026-08-24 17:03:44.020 |         icl1_0.response_body,
2026-08-24 17:03:44.020 |         icl1_0.response_code,
2026-08-24 17:03:44.020 |         icl1_0.status,
2026-08-24 17:03:44.020 |         icl1_0.updated_at 
2026-08-24 17:03:44.020 |     from
2026-08-24 17:03:44.020 |         institution_callback_log icl1_0 
2026-08-24 17:03:44.020 |     where
2026-08-24 17:03:44.020 |         icl1_0.status=? 
2026-08-24 17:03:44.020 |         and icl1_0.next_retry_at<?
2026-08-24 17:03:44.020 | Hibernate: 
2026-08-24 17:03:44.020 |     select
2026-08-24 17:03:44.020 |         icl1_0.id,
2026-08-24 17:03:44.020 |         icl1_0.attempt_count,
2026-08-24 17:03:44.020 |         icl1_0.callback_url,
2026-08-24 17:03:44.020 |         icl1_0.created_at,
2026-08-24 17:03:44.020 |         icl1_0.next_retry_at,
2026-08-24 17:03:44.020 |         icl1_0.payload,
2026-08-24 17:03:44.020 |         icl1_0.payment_session_id,
2026-08-24 17:03:44.020 |         icl1_0.response_body,
2026-08-24 17:03:44.020 |         icl1_0.response_code,
2026-08-24 17:03:44.020 |         icl1_0.status,
2026-08-24 17:03:44.020 |         icl1_0.updated_at 
2026-08-24 17:03:44.020 |     from
2026-08-24 17:03:44.020 |         institution_callback_log icl1_0 
2026-08-24 17:03:44.020 |     where
2026-08-24 17:03:44.020 |         icl1_0.status=? 
2026-08-24 17:03:44.020 |         and icl1_0.next_retry_at<?
2026-08-24 17:03:44.066 | 2026-08-24 09:03:44 [main] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:44.066 |     select
2026-08-24 17:03:44.066 |         c1_0.id,
2026-08-24 17:03:44.066 |         c1_0.created_at,
2026-08-24 17:03:44.066 |         c1_0.email,
2026-08-24 17:03:44.066 |         c1_0.employment_status,
2026-08-24 17:03:44.066 |         c1_0.first_name,
2026-08-24 17:03:44.066 |         c1_0.job_title,
2026-08-24 17:03:44.066 |         c1_0.kyc_status,
2026-08-24 17:03:44.066 |         c1_0.last_name,
2026-08-24 17:03:44.066 |         c1_0.locked,
2026-08-24 17:03:44.066 |         c1_0.monthly_income,
2026-08-24 17:03:44.066 |         c1_0.password,
2026-08-24 17:03:44.066 |         c1_0.risk_profile,
2026-08-24 17:03:44.066 |         c1_0.role,
2026-08-24 17:03:44.066 |         c1_0.source_of_funds 
2026-08-24 17:03:44.066 |     from
2026-08-24 17:03:44.066 |         customers c1_0 
2026-08-24 17:03:44.066 |     where
2026-08-24 17:03:44.066 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:44.066 | Hibernate: 
2026-08-24 17:03:44.066 |     select
2026-08-24 17:03:44.066 |         c1_0.id,
2026-08-24 17:03:44.066 |         c1_0.created_at,
2026-08-24 17:03:44.066 |         c1_0.email,
2026-08-24 17:03:44.066 |         c1_0.employment_status,
2026-08-24 17:03:44.066 |         c1_0.first_name,
2026-08-24 17:03:44.066 |         c1_0.job_title,
2026-08-24 17:03:44.066 |         c1_0.kyc_status,
2026-08-24 17:03:44.066 |         c1_0.last_name,
2026-08-24 17:03:44.066 |         c1_0.locked,
2026-08-24 17:03:44.066 |         c1_0.monthly_income,
2026-08-24 17:03:44.066 |         c1_0.password,
2026-08-24 17:03:44.066 |         c1_0.risk_profile,
2026-08-24 17:03:44.066 |         c1_0.role,
2026-08-24 17:03:44.066 |         c1_0.source_of_funds 
2026-08-24 17:03:44.066 |     from
2026-08-24 17:03:44.066 |         customers c1_0 
2026-08-24 17:03:44.066 |     where
2026-08-24 17:03:44.066 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:44.109 | 2026-08-24 09:03:44 [main] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:44.109 |     select
2026-08-24 17:03:44.109 |         c1_0.id,
2026-08-24 17:03:44.109 |         c1_0.created_at,
2026-08-24 17:03:44.109 |         c1_0.email,
2026-08-24 17:03:44.109 |         c1_0.employment_status,
2026-08-24 17:03:44.109 |         c1_0.first_name,
2026-08-24 17:03:44.109 |         c1_0.job_title,
2026-08-24 17:03:44.109 |         c1_0.kyc_status,
2026-08-24 17:03:44.109 |         c1_0.last_name,
2026-08-24 17:03:44.109 |         c1_0.locked,
2026-08-24 17:03:44.109 |         c1_0.monthly_income,
2026-08-24 17:03:44.109 |         c1_0.password,
2026-08-24 17:03:44.109 |         c1_0.risk_profile,
2026-08-24 17:03:44.109 |         c1_0.role,
2026-08-24 17:03:44.109 |         c1_0.source_of_funds 
2026-08-24 17:03:44.109 |     from
2026-08-24 17:03:44.109 |         customers c1_0 
2026-08-24 17:03:44.109 |     where
2026-08-24 17:03:44.109 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:44.109 | Hibernate: 
2026-08-24 17:03:44.109 |     select
2026-08-24 17:03:44.109 |         c1_0.id,
2026-08-24 17:03:44.109 |         c1_0.created_at,
2026-08-24 17:03:44.109 |         c1_0.email,
2026-08-24 17:03:44.109 |         c1_0.employment_status,
2026-08-24 17:03:44.109 |         c1_0.first_name,
2026-08-24 17:03:44.109 |         c1_0.job_title,
2026-08-24 17:03:44.109 |         c1_0.kyc_status,
2026-08-24 17:03:44.109 |         c1_0.last_name,
2026-08-24 17:03:44.109 |         c1_0.locked,
2026-08-24 17:03:44.109 |         c1_0.monthly_income,
2026-08-24 17:03:44.109 |         c1_0.password,
2026-08-24 17:03:44.109 |         c1_0.risk_profile,
2026-08-24 17:03:44.109 |         c1_0.role,
2026-08-24 17:03:44.109 |         c1_0.source_of_funds 
2026-08-24 17:03:44.109 |     from
2026-08-24 17:03:44.109 |         customers c1_0 
2026-08-24 17:03:44.109 |     where
2026-08-24 17:03:44.109 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:44.192 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] [X-Request-Id: ] - Initializing Spring DispatcherServlet 'dispatcherServlet'
2026-08-24 17:03:44.193 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet [X-Request-Id: ] - Initializing Servlet 'dispatcherServlet'
2026-08-24 17:03:44.201 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet [X-Request-Id: ] - Completed initialization in 7 ms
2026-08-24 17:03:44.246 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:03:44.284 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 3f569dde-d237-4ed6-a76d-678c432059d8] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:44.298 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 3f569dde-d237-4ed6-a76d-678c432059d8] - Secured POST /api/v1/auth/login
2026-08-24 17:03:44.602 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: 3f569dde-d237-4ed6-a76d-678c432059d8] - 
2026-08-24 17:03:44.602 |     select
2026-08-24 17:03:44.602 |         c1_0.id,
2026-08-24 17:03:44.602 |         c1_0.created_at,
2026-08-24 17:03:44.602 |         c1_0.email,
2026-08-24 17:03:44.602 |         c1_0.employment_status,
2026-08-24 17:03:44.602 |         c1_0.first_name,
2026-08-24 17:03:44.602 |         c1_0.job_title,
2026-08-24 17:03:44.602 |         c1_0.kyc_status,
2026-08-24 17:03:44.602 |         c1_0.last_name,
2026-08-24 17:03:44.602 |         c1_0.locked,
2026-08-24 17:03:44.602 |         c1_0.monthly_income,
2026-08-24 17:03:44.602 |         c1_0.password,
2026-08-24 17:03:44.602 |         c1_0.risk_profile,
2026-08-24 17:03:44.602 |         c1_0.role,
2026-08-24 17:03:44.602 |         c1_0.source_of_funds 
2026-08-24 17:03:44.602 |     from
2026-08-24 17:03:44.602 |         customers c1_0 
2026-08-24 17:03:44.602 |     where
2026-08-24 17:03:44.602 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:44.602 | Hibernate: 
2026-08-24 17:03:44.602 |     select
2026-08-24 17:03:44.602 |         c1_0.id,
2026-08-24 17:03:44.602 |         c1_0.created_at,
2026-08-24 17:03:44.602 |         c1_0.email,
2026-08-24 17:03:44.602 |         c1_0.employment_status,
2026-08-24 17:03:44.602 |         c1_0.first_name,
2026-08-24 17:03:44.602 |         c1_0.job_title,
2026-08-24 17:03:44.602 |         c1_0.kyc_status,
2026-08-24 17:03:44.602 |         c1_0.last_name,
2026-08-24 17:03:44.602 |         c1_0.locked,
2026-08-24 17:03:44.602 |         c1_0.monthly_income,
2026-08-24 17:03:44.602 |         c1_0.password,
2026-08-24 17:03:44.602 |         c1_0.risk_profile,
2026-08-24 17:03:44.602 |         c1_0.role,
2026-08-24 17:03:44.602 |         c1_0.source_of_funds 
2026-08-24 17:03:44.602 |     from
2026-08-24 17:03:44.602 |         customers c1_0 
2026-08-24 17:03:44.602 |     where
2026-08-24 17:03:44.602 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:44.605 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 3f569dde-d237-4ed6-a76d-678c432059d8] - Failed to authenticate since user account is locked
2026-08-24 17:03:44.611 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.authentication.ProviderManager [X-Request-Id: 3f569dde-d237-4ed6-a76d-678c432059d8] - Authentication failed for user 'paymondo@gmail.com' since their account status is User account is locked
2026-08-24 17:03:44.611 | org.springframework.security.authentication.LockedException: User account is locked
2026-08-24 17:03:44.611 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider$DefaultPreAuthenticationChecks.check(AbstractUserDetailsAuthenticationProvider.java:328)
2026-08-24 17:03:44.611 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider.authenticate(AbstractUserDetailsAuthenticationProvider.java:149)
2026-08-24 17:03:44.611 | 	at org.springframework.security.authentication.ProviderManager.authenticate(ProviderManager.java:182)
2026-08-24 17:03:44.611 | 	at com.company.banking.security.auth.AuthenticationService.authenticate(AuthenticationService.java:29)
2026-08-24 17:03:44.611 | 	at com.company.banking.security.auth.AuthenticationController.login(AuthenticationController.java:63)
2026-08-24 17:03:44.611 | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
2026-08-24 17:03:44.611 | 	at java.base/java.lang.reflect.Method.invoke(Unknown Source)
2026-08-24 17:03:44.611 | 	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:255)
2026-08-24 17:03:44.611 | 	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:188)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1088)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:978)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
2026-08-24 17:03:44.611 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:590)
2026-08-24 17:03:44.611 | 	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
2026-08-24 17:03:44.611 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at com.company.banking.apigateway.security.GatewayRateLimitFilter.doFilterInternal(GatewayRateLimitFilter.java:37)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at com.company.banking.apigateway.security.ApiGatewayIdempotencyInterceptor.doFilterInternal(ApiGatewayIdempotencyInterceptor.java:43)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at com.company.banking.web.filter.RateLimitFilter.doFilterInternal(RateLimitFilter.java:35)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at com.company.banking.web.filter.RequestLoggingFilter.doFilterInternal(RequestLoggingFilter.java:28)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at com.company.banking.web.filter.SecurityHeadersFilter.doFilterInternal(SecurityHeadersFilter.java:40)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.611 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:125)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:119)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at com.company.banking.security.jwt.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:65)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at com.company.banking.apigateway.security.ApiKeyAuthenticationFilter.doFilterInternal(ApiKeyAuthenticationFilter.java:113)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.611 | 	at com.company.banking.web.filter.BffIdentityFilter.doFilterInternal(BffIdentityFilter.java:40)
2026-08-24 17:03:44.611 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.611 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.612 | 	at com.company.banking.web.filter.CorrelationIdFilter.doFilterInternal(CorrelationIdFilter.java:36)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
2026-08-24 17:03:44.612 | 	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.ServletRequestPathFilter.doFilter(ServletRequestPathFilter.java:52)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:44.612 | 	at org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebSecurityConfiguration.java:319)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:44.612 | 	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:44.612 | 	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:240)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.612 | 	at com.company.banking.apigateway.security.ApiAuditLoggingFilter.doFilterInternal(ApiAuditLoggingFilter.java:39)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.612 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
2026-08-24 17:03:44.612 | 	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
2026-08-24 17:03:44.612 | 	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
2026-08-24 17:03:44.612 | 	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
2026-08-24 17:03:44.612 | 	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
2026-08-24 17:03:44.612 | 	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1741)
2026-08-24 17:03:44.612 | 	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
2026-08-24 17:03:44.612 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
2026-08-24 17:03:44.612 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
2026-08-24 17:03:44.612 | 	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
2026-08-24 17:03:44.612 | 	at java.base/java.lang.Thread.run(Unknown Source)
2026-08-24 17:03:44.660 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 3f569dde-d237-4ed6-a76d-678c432059d8] - [HTTP LOG] POST /api/v1/auth/login - Status: 401 - Duration: 362ms
2026-08-24 17:03:44.711 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:44.711 |     insert 
2026-08-24 17:03:44.711 |     into
2026-08-24 17:03:44.711 |         api_audit_events
2026-08-24 17:03:44.711 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:44.711 |     values
2026-08-24 17:03:44.711 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:44.711 | Hibernate: 
2026-08-24 17:03:44.711 |     insert 
2026-08-24 17:03:44.711 |     into
2026-08-24 17:03:44.711 |         api_audit_events
2026-08-24 17:03:44.711 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:44.711 |     values
2026-08-24 17:03:44.711 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:44.750 | 2026-08-24 09:03:44 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 401 | stage=COMPLETED | keyId=null | acct=null | latency=446ms
2026-08-24 17:03:45.622 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:03:45.623 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 99737e08-8e65-4de1-be3b-4ab707e980fc] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:45.625 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 99737e08-8e65-4de1-be3b-4ab707e980fc] - Secured POST /api/v1/auth/login
2026-08-24 17:03:45.632 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: 99737e08-8e65-4de1-be3b-4ab707e980fc] - 
2026-08-24 17:03:45.632 |     select
2026-08-24 17:03:45.632 |         c1_0.id,
2026-08-24 17:03:45.632 |         c1_0.created_at,
2026-08-24 17:03:45.632 |         c1_0.email,
2026-08-24 17:03:45.632 |         c1_0.employment_status,
2026-08-24 17:03:45.632 |         c1_0.first_name,
2026-08-24 17:03:45.632 |         c1_0.job_title,
2026-08-24 17:03:45.632 |         c1_0.kyc_status,
2026-08-24 17:03:45.632 |         c1_0.last_name,
2026-08-24 17:03:45.632 |         c1_0.locked,
2026-08-24 17:03:45.632 |         c1_0.monthly_income,
2026-08-24 17:03:45.632 |         c1_0.password,
2026-08-24 17:03:45.632 |         c1_0.risk_profile,
2026-08-24 17:03:45.632 |         c1_0.role,
2026-08-24 17:03:45.632 |         c1_0.source_of_funds 
2026-08-24 17:03:45.632 |     from
2026-08-24 17:03:45.632 |         customers c1_0 
2026-08-24 17:03:45.632 |     where
2026-08-24 17:03:45.632 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:45.632 | Hibernate: 
2026-08-24 17:03:45.632 |     select
2026-08-24 17:03:45.632 |         c1_0.id,
2026-08-24 17:03:45.632 |         c1_0.created_at,
2026-08-24 17:03:45.632 |         c1_0.email,
2026-08-24 17:03:45.632 |         c1_0.employment_status,
2026-08-24 17:03:45.632 |         c1_0.first_name,
2026-08-24 17:03:45.632 |         c1_0.job_title,
2026-08-24 17:03:45.632 |         c1_0.kyc_status,
2026-08-24 17:03:45.632 |         c1_0.last_name,
2026-08-24 17:03:45.632 |         c1_0.locked,
2026-08-24 17:03:45.632 |         c1_0.monthly_income,
2026-08-24 17:03:45.632 |         c1_0.password,
2026-08-24 17:03:45.632 |         c1_0.risk_profile,
2026-08-24 17:03:45.632 |         c1_0.role,
2026-08-24 17:03:45.632 |         c1_0.source_of_funds 
2026-08-24 17:03:45.632 |     from
2026-08-24 17:03:45.632 |         customers c1_0 
2026-08-24 17:03:45.632 |     where
2026-08-24 17:03:45.632 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:45.636 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 99737e08-8e65-4de1-be3b-4ab707e980fc] - Failed to authenticate since user account is locked
2026-08-24 17:03:45.638 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.authentication.ProviderManager [X-Request-Id: 99737e08-8e65-4de1-be3b-4ab707e980fc] - Authentication failed for user 'paymondo@gmail.com' since their account status is User account is locked
2026-08-24 17:03:45.638 | org.springframework.security.authentication.LockedException: User account is locked
2026-08-24 17:03:45.638 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider$DefaultPreAuthenticationChecks.check(AbstractUserDetailsAuthenticationProvider.java:328)
2026-08-24 17:03:45.638 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider.authenticate(AbstractUserDetailsAuthenticationProvider.java:149)
2026-08-24 17:03:45.638 | 	at org.springframework.security.authentication.ProviderManager.authenticate(ProviderManager.java:182)
2026-08-24 17:03:45.638 | 	at com.company.banking.security.auth.AuthenticationService.authenticate(AuthenticationService.java:29)
2026-08-24 17:03:45.638 | 	at com.company.banking.security.auth.AuthenticationController.login(AuthenticationController.java:63)
2026-08-24 17:03:45.638 | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
2026-08-24 17:03:45.638 | 	at java.base/java.lang.reflect.Method.invoke(Unknown Source)
2026-08-24 17:03:45.638 | 	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:255)
2026-08-24 17:03:45.638 | 	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:188)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1088)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:978)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
2026-08-24 17:03:45.638 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:590)
2026-08-24 17:03:45.638 | 	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
2026-08-24 17:03:45.638 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at com.company.banking.apigateway.security.GatewayRateLimitFilter.doFilterInternal(GatewayRateLimitFilter.java:37)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at com.company.banking.apigateway.security.ApiGatewayIdempotencyInterceptor.doFilterInternal(ApiGatewayIdempotencyInterceptor.java:43)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.638 | 	at com.company.banking.web.filter.RateLimitFilter.doFilterInternal(RateLimitFilter.java:35)
2026-08-24 17:03:45.638 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.638 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at com.company.banking.web.filter.RequestLoggingFilter.doFilterInternal(RequestLoggingFilter.java:28)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at com.company.banking.web.filter.SecurityHeadersFilter.doFilterInternal(SecurityHeadersFilter.java:40)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:125)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:119)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at com.company.banking.security.jwt.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:65)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at com.company.banking.apigateway.security.ApiKeyAuthenticationFilter.doFilterInternal(ApiKeyAuthenticationFilter.java:113)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at com.company.banking.web.filter.BffIdentityFilter.doFilterInternal(BffIdentityFilter.java:40)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at com.company.banking.web.filter.CorrelationIdFilter.doFilterInternal(CorrelationIdFilter.java:36)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
2026-08-24 17:03:45.639 | 	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.ServletRequestPathFilter.doFilter(ServletRequestPathFilter.java:52)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:45.639 | 	at org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebSecurityConfiguration.java:319)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:45.639 | 	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:45.639 | 	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:240)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at com.company.banking.apigateway.security.ApiAuditLoggingFilter.doFilterInternal(ApiAuditLoggingFilter.java:39)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
2026-08-24 17:03:45.639 | 	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
2026-08-24 17:03:45.639 | 	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
2026-08-24 17:03:45.639 | 	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
2026-08-24 17:03:45.639 | 	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
2026-08-24 17:03:45.639 | 	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1741)
2026-08-24 17:03:45.639 | 	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
2026-08-24 17:03:45.639 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
2026-08-24 17:03:45.639 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
2026-08-24 17:03:45.639 | 	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
2026-08-24 17:03:45.639 | 	at java.base/java.lang.Thread.run(Unknown Source)
2026-08-24 17:03:45.645 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 99737e08-8e65-4de1-be3b-4ab707e980fc] - [HTTP LOG] POST /api/v1/auth/login - Status: 401 - Duration: 19ms
2026-08-24 17:03:45.648 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:45.648 |     insert 
2026-08-24 17:03:45.648 |     into
2026-08-24 17:03:45.648 |         api_audit_events
2026-08-24 17:03:45.648 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:45.648 |     values
2026-08-24 17:03:45.648 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:45.648 | Hibernate: 
2026-08-24 17:03:45.648 |     insert 
2026-08-24 17:03:45.648 |     into
2026-08-24 17:03:45.648 |         api_audit_events
2026-08-24 17:03:45.648 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:45.648 |     values
2026-08-24 17:03:45.648 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:45.669 | 2026-08-24 09:03:45 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 401 | stage=COMPLETED | keyId=null | acct=null | latency=25ms
2026-08-24 17:03:46.345 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:03:46.351 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:03:46.351 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: d190fd13-a1a8-4327-bdf6-f041de9ae4e4] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:46.444 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d190fd13-a1a8-4327-bdf6-f041de9ae4e4] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 92ms
2026-08-24 17:03:46.563 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:03:46.565 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 93c62653-bd18-4b56-b3c9-cfc6e38e8060] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:46.566 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 93c62653-bd18-4b56-b3c9-cfc6e38e8060] - Secured POST /api/v1/auth/login
2026-08-24 17:03:46.572 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: 93c62653-bd18-4b56-b3c9-cfc6e38e8060] - 
2026-08-24 17:03:46.572 |     select
2026-08-24 17:03:46.572 |         c1_0.id,
2026-08-24 17:03:46.572 |         c1_0.created_at,
2026-08-24 17:03:46.572 |         c1_0.email,
2026-08-24 17:03:46.572 |         c1_0.employment_status,
2026-08-24 17:03:46.572 |         c1_0.first_name,
2026-08-24 17:03:46.572 |         c1_0.job_title,
2026-08-24 17:03:46.572 |         c1_0.kyc_status,
2026-08-24 17:03:46.572 |         c1_0.last_name,
2026-08-24 17:03:46.572 |         c1_0.locked,
2026-08-24 17:03:46.572 |         c1_0.monthly_income,
2026-08-24 17:03:46.572 |         c1_0.password,
2026-08-24 17:03:46.572 |         c1_0.risk_profile,
2026-08-24 17:03:46.572 |         c1_0.role,
2026-08-24 17:03:46.572 |         c1_0.source_of_funds 
2026-08-24 17:03:46.572 |     from
2026-08-24 17:03:46.572 |         customers c1_0 
2026-08-24 17:03:46.572 |     where
2026-08-24 17:03:46.572 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:46.572 | Hibernate: 
2026-08-24 17:03:46.572 |     select
2026-08-24 17:03:46.572 |         c1_0.id,
2026-08-24 17:03:46.572 |         c1_0.created_at,
2026-08-24 17:03:46.572 |         c1_0.email,
2026-08-24 17:03:46.572 |         c1_0.employment_status,
2026-08-24 17:03:46.572 |         c1_0.first_name,
2026-08-24 17:03:46.572 |         c1_0.job_title,
2026-08-24 17:03:46.572 |         c1_0.kyc_status,
2026-08-24 17:03:46.572 |         c1_0.last_name,
2026-08-24 17:03:46.572 |         c1_0.locked,
2026-08-24 17:03:46.572 |         c1_0.monthly_income,
2026-08-24 17:03:46.572 |         c1_0.password,
2026-08-24 17:03:46.572 |         c1_0.risk_profile,
2026-08-24 17:03:46.572 |         c1_0.role,
2026-08-24 17:03:46.572 |         c1_0.source_of_funds 
2026-08-24 17:03:46.572 |     from
2026-08-24 17:03:46.572 |         customers c1_0 
2026-08-24 17:03:46.572 |     where
2026-08-24 17:03:46.572 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:46.578 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 93c62653-bd18-4b56-b3c9-cfc6e38e8060] - Failed to authenticate since user account is locked
2026-08-24 17:03:46.579 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.authentication.ProviderManager [X-Request-Id: 93c62653-bd18-4b56-b3c9-cfc6e38e8060] - Authentication failed for user 'paymondo@gmail.com' since their account status is User account is locked
2026-08-24 17:03:46.579 | org.springframework.security.authentication.LockedException: User account is locked
2026-08-24 17:03:46.579 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider$DefaultPreAuthenticationChecks.check(AbstractUserDetailsAuthenticationProvider.java:328)
2026-08-24 17:03:46.579 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider.authenticate(AbstractUserDetailsAuthenticationProvider.java:149)
2026-08-24 17:03:46.579 | 	at org.springframework.security.authentication.ProviderManager.authenticate(ProviderManager.java:182)
2026-08-24 17:03:46.579 | 	at com.company.banking.security.auth.AuthenticationService.authenticate(AuthenticationService.java:29)
2026-08-24 17:03:46.579 | 	at com.company.banking.security.auth.AuthenticationController.login(AuthenticationController.java:63)
2026-08-24 17:03:46.579 | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
2026-08-24 17:03:46.579 | 	at java.base/java.lang.reflect.Method.invoke(Unknown Source)
2026-08-24 17:03:46.579 | 	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:255)
2026-08-24 17:03:46.579 | 	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:188)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1088)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:978)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
2026-08-24 17:03:46.579 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:590)
2026-08-24 17:03:46.579 | 	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
2026-08-24 17:03:46.579 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at com.company.banking.apigateway.security.GatewayRateLimitFilter.doFilterInternal(GatewayRateLimitFilter.java:37)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at com.company.banking.apigateway.security.ApiGatewayIdempotencyInterceptor.doFilterInternal(ApiGatewayIdempotencyInterceptor.java:43)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at com.company.banking.web.filter.RateLimitFilter.doFilterInternal(RateLimitFilter.java:35)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at com.company.banking.web.filter.RequestLoggingFilter.doFilterInternal(RequestLoggingFilter.java:28)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at com.company.banking.web.filter.SecurityHeadersFilter.doFilterInternal(SecurityHeadersFilter.java:40)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.579 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:125)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:119)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at com.company.banking.security.jwt.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:65)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at com.company.banking.apigateway.security.ApiKeyAuthenticationFilter.doFilterInternal(ApiKeyAuthenticationFilter.java:113)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at com.company.banking.web.filter.BffIdentityFilter.doFilterInternal(BffIdentityFilter.java:40)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at com.company.banking.web.filter.CorrelationIdFilter.doFilterInternal(CorrelationIdFilter.java:36)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
2026-08-24 17:03:46.579 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.579 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
2026-08-24 17:03:46.580 | 	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.ServletRequestPathFilter.doFilter(ServletRequestPathFilter.java:52)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:46.580 | 	at org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebSecurityConfiguration.java:319)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:46.580 | 	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:46.580 | 	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:240)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.580 | 	at com.company.banking.apigateway.security.ApiAuditLoggingFilter.doFilterInternal(ApiAuditLoggingFilter.java:39)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.580 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
2026-08-24 17:03:46.580 | 	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
2026-08-24 17:03:46.580 | 	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
2026-08-24 17:03:46.580 | 	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
2026-08-24 17:03:46.580 | 	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
2026-08-24 17:03:46.580 | 	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1741)
2026-08-24 17:03:46.580 | 	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
2026-08-24 17:03:46.580 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
2026-08-24 17:03:46.580 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
2026-08-24 17:03:46.580 | 	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
2026-08-24 17:03:46.580 | 	at java.base/java.lang.Thread.run(Unknown Source)
2026-08-24 17:03:46.583 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: 93c62653-bd18-4b56-b3c9-cfc6e38e8060] - 
2026-08-24 17:03:46.583 |     select
2026-08-24 17:03:46.583 |         c1_0.id,
2026-08-24 17:03:46.583 |         c1_0.created_at,
2026-08-24 17:03:46.583 |         c1_0.email,
2026-08-24 17:03:46.583 |         c1_0.employment_status,
2026-08-24 17:03:46.583 |         c1_0.first_name,
2026-08-24 17:03:46.583 |         c1_0.job_title,
2026-08-24 17:03:46.583 |         c1_0.kyc_status,
2026-08-24 17:03:46.583 |         c1_0.last_name,
2026-08-24 17:03:46.583 |         c1_0.locked,
2026-08-24 17:03:46.583 |         c1_0.monthly_income,
2026-08-24 17:03:46.583 |         c1_0.password,
2026-08-24 17:03:46.583 |         c1_0.risk_profile,
2026-08-24 17:03:46.583 |         c1_0.role,
2026-08-24 17:03:46.583 |         c1_0.source_of_funds 
2026-08-24 17:03:46.583 |     from
2026-08-24 17:03:46.583 |         customers c1_0 
2026-08-24 17:03:46.583 |     where
2026-08-24 17:03:46.583 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:46.583 | Hibernate: 
2026-08-24 17:03:46.583 |     select
2026-08-24 17:03:46.583 |         c1_0.id,
2026-08-24 17:03:46.583 |         c1_0.created_at,
2026-08-24 17:03:46.583 |         c1_0.email,
2026-08-24 17:03:46.583 |         c1_0.employment_status,
2026-08-24 17:03:46.583 |         c1_0.first_name,
2026-08-24 17:03:46.583 |         c1_0.job_title,
2026-08-24 17:03:46.583 |         c1_0.kyc_status,
2026-08-24 17:03:46.583 |         c1_0.last_name,
2026-08-24 17:03:46.583 |         c1_0.locked,
2026-08-24 17:03:46.583 |         c1_0.monthly_income,
2026-08-24 17:03:46.583 |         c1_0.password,
2026-08-24 17:03:46.583 |         c1_0.risk_profile,
2026-08-24 17:03:46.583 |         c1_0.role,
2026-08-24 17:03:46.583 |         c1_0.source_of_funds 
2026-08-24 17:03:46.583 |     from
2026-08-24 17:03:46.583 |         customers c1_0 
2026-08-24 17:03:46.583 |     where
2026-08-24 17:03:46.583 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:46.591 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 93c62653-bd18-4b56-b3c9-cfc6e38e8060] - [HTTP LOG] POST /api/v1/auth/login - Status: 401 - Duration: 25ms
2026-08-24 17:03:46.594 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:46.594 |     insert 
2026-08-24 17:03:46.594 |     into
2026-08-24 17:03:46.594 |         api_audit_events
2026-08-24 17:03:46.594 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:46.594 |     values
2026-08-24 17:03:46.594 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:46.594 | Hibernate: 
2026-08-24 17:03:46.594 |     insert 
2026-08-24 17:03:46.594 |     into
2026-08-24 17:03:46.594 |         api_audit_events
2026-08-24 17:03:46.594 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:46.594 |     values
2026-08-24 17:03:46.594 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:46.616 | 2026-08-24 09:03:46 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 401 | stage=COMPLETED | keyId=null | acct=null | latency=31ms
2026-08-24 17:03:47.588 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:03:47.590 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 61d542fc-7e78-4e9e-b6ba-1b08566162c3] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:47.592 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 61d542fc-7e78-4e9e-b6ba-1b08566162c3] - Secured POST /api/v1/auth/login
2026-08-24 17:03:47.600 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 61d542fc-7e78-4e9e-b6ba-1b08566162c3] - 
2026-08-24 17:03:47.600 |     select
2026-08-24 17:03:47.600 |         c1_0.id,
2026-08-24 17:03:47.600 |         c1_0.created_at,
2026-08-24 17:03:47.600 |         c1_0.email,
2026-08-24 17:03:47.600 |         c1_0.employment_status,
2026-08-24 17:03:47.600 |         c1_0.first_name,
2026-08-24 17:03:47.600 |         c1_0.job_title,
2026-08-24 17:03:47.600 |         c1_0.kyc_status,
2026-08-24 17:03:47.600 |         c1_0.last_name,
2026-08-24 17:03:47.600 |         c1_0.locked,
2026-08-24 17:03:47.600 |         c1_0.monthly_income,
2026-08-24 17:03:47.600 |         c1_0.password,
2026-08-24 17:03:47.600 |         c1_0.risk_profile,
2026-08-24 17:03:47.600 |         c1_0.role,
2026-08-24 17:03:47.600 |         c1_0.source_of_funds 
2026-08-24 17:03:47.600 |     from
2026-08-24 17:03:47.600 |         customers c1_0 
2026-08-24 17:03:47.600 |     where
2026-08-24 17:03:47.600 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:47.600 | Hibernate: 
2026-08-24 17:03:47.600 |     select
2026-08-24 17:03:47.600 |         c1_0.id,
2026-08-24 17:03:47.600 |         c1_0.created_at,
2026-08-24 17:03:47.600 |         c1_0.email,
2026-08-24 17:03:47.600 |         c1_0.employment_status,
2026-08-24 17:03:47.600 |         c1_0.first_name,
2026-08-24 17:03:47.600 |         c1_0.job_title,
2026-08-24 17:03:47.600 |         c1_0.kyc_status,
2026-08-24 17:03:47.600 |         c1_0.last_name,
2026-08-24 17:03:47.600 |         c1_0.locked,
2026-08-24 17:03:47.600 |         c1_0.monthly_income,
2026-08-24 17:03:47.600 |         c1_0.password,
2026-08-24 17:03:47.600 |         c1_0.risk_profile,
2026-08-24 17:03:47.600 |         c1_0.role,
2026-08-24 17:03:47.600 |         c1_0.source_of_funds 
2026-08-24 17:03:47.600 |     from
2026-08-24 17:03:47.600 |         customers c1_0 
2026-08-24 17:03:47.600 |     where
2026-08-24 17:03:47.600 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:47.605 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 61d542fc-7e78-4e9e-b6ba-1b08566162c3] - Failed to authenticate since user account is locked
2026-08-24 17:03:47.607 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.authentication.ProviderManager [X-Request-Id: 61d542fc-7e78-4e9e-b6ba-1b08566162c3] - Authentication failed for user 'paymondo@gmail.com' since their account status is User account is locked
2026-08-24 17:03:47.607 | org.springframework.security.authentication.LockedException: User account is locked
2026-08-24 17:03:47.607 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider$DefaultPreAuthenticationChecks.check(AbstractUserDetailsAuthenticationProvider.java:328)
2026-08-24 17:03:47.607 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider.authenticate(AbstractUserDetailsAuthenticationProvider.java:149)
2026-08-24 17:03:47.607 | 	at org.springframework.security.authentication.ProviderManager.authenticate(ProviderManager.java:182)
2026-08-24 17:03:47.607 | 	at com.company.banking.security.auth.AuthenticationService.authenticate(AuthenticationService.java:29)
2026-08-24 17:03:47.607 | 	at com.company.banking.security.auth.AuthenticationController.login(AuthenticationController.java:63)
2026-08-24 17:03:47.607 | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
2026-08-24 17:03:47.607 | 	at java.base/java.lang.reflect.Method.invoke(Unknown Source)
2026-08-24 17:03:47.607 | 	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:255)
2026-08-24 17:03:47.607 | 	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:188)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1088)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:978)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
2026-08-24 17:03:47.607 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:590)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
2026-08-24 17:03:47.607 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at com.company.banking.apigateway.security.GatewayRateLimitFilter.doFilterInternal(GatewayRateLimitFilter.java:37)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at com.company.banking.apigateway.security.ApiGatewayIdempotencyInterceptor.doFilterInternal(ApiGatewayIdempotencyInterceptor.java:43)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at com.company.banking.web.filter.RateLimitFilter.doFilterInternal(RateLimitFilter.java:35)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at com.company.banking.web.filter.RequestLoggingFilter.doFilterInternal(RequestLoggingFilter.java:28)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at com.company.banking.web.filter.SecurityHeadersFilter.doFilterInternal(SecurityHeadersFilter.java:40)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:125)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:119)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at com.company.banking.security.jwt.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:65)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at com.company.banking.apigateway.security.ApiKeyAuthenticationFilter.doFilterInternal(ApiKeyAuthenticationFilter.java:113)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at com.company.banking.web.filter.BffIdentityFilter.doFilterInternal(BffIdentityFilter.java:40)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at com.company.banking.web.filter.CorrelationIdFilter.doFilterInternal(CorrelationIdFilter.java:36)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
2026-08-24 17:03:47.607 | 	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.ServletRequestPathFilter.doFilter(ServletRequestPathFilter.java:52)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:47.607 | 	at org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebSecurityConfiguration.java:319)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:47.607 | 	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:47.607 | 	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:240)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at com.company.banking.apigateway.security.ApiAuditLoggingFilter.doFilterInternal(ApiAuditLoggingFilter.java:39)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
2026-08-24 17:03:47.607 | 	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
2026-08-24 17:03:47.607 | 	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
2026-08-24 17:03:47.607 | 	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
2026-08-24 17:03:47.607 | 	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
2026-08-24 17:03:47.607 | 	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1741)
2026-08-24 17:03:47.607 | 	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
2026-08-24 17:03:47.607 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
2026-08-24 17:03:47.607 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
2026-08-24 17:03:47.607 | 	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
2026-08-24 17:03:47.607 | 	at java.base/java.lang.Thread.run(Unknown Source)
2026-08-24 17:03:47.610 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 61d542fc-7e78-4e9e-b6ba-1b08566162c3] - 
2026-08-24 17:03:47.610 |     select
2026-08-24 17:03:47.610 |         c1_0.id,
2026-08-24 17:03:47.610 |         c1_0.created_at,
2026-08-24 17:03:47.610 |         c1_0.email,
2026-08-24 17:03:47.610 |         c1_0.employment_status,
2026-08-24 17:03:47.610 |         c1_0.first_name,
2026-08-24 17:03:47.610 |         c1_0.job_title,
2026-08-24 17:03:47.610 |         c1_0.kyc_status,
2026-08-24 17:03:47.610 |         c1_0.last_name,
2026-08-24 17:03:47.610 |         c1_0.locked,
2026-08-24 17:03:47.610 |         c1_0.monthly_income,
2026-08-24 17:03:47.610 |         c1_0.password,
2026-08-24 17:03:47.610 |         c1_0.risk_profile,
2026-08-24 17:03:47.610 |         c1_0.role,
2026-08-24 17:03:47.610 |         c1_0.source_of_funds 
2026-08-24 17:03:47.610 |     from
2026-08-24 17:03:47.610 |         customers c1_0 
2026-08-24 17:03:47.610 |     where
2026-08-24 17:03:47.610 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:47.610 | Hibernate: 
2026-08-24 17:03:47.610 |     select
2026-08-24 17:03:47.610 |         c1_0.id,
2026-08-24 17:03:47.610 |         c1_0.created_at,
2026-08-24 17:03:47.610 |         c1_0.email,
2026-08-24 17:03:47.610 |         c1_0.employment_status,
2026-08-24 17:03:47.610 |         c1_0.first_name,
2026-08-24 17:03:47.610 |         c1_0.job_title,
2026-08-24 17:03:47.610 |         c1_0.kyc_status,
2026-08-24 17:03:47.610 |         c1_0.last_name,
2026-08-24 17:03:47.610 |         c1_0.locked,
2026-08-24 17:03:47.610 |         c1_0.monthly_income,
2026-08-24 17:03:47.610 |         c1_0.password,
2026-08-24 17:03:47.610 |         c1_0.risk_profile,
2026-08-24 17:03:47.610 |         c1_0.role,
2026-08-24 17:03:47.610 |         c1_0.source_of_funds 
2026-08-24 17:03:47.610 |     from
2026-08-24 17:03:47.610 |         customers c1_0 
2026-08-24 17:03:47.610 |     where
2026-08-24 17:03:47.610 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:47.616 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 61d542fc-7e78-4e9e-b6ba-1b08566162c3] - [HTTP LOG] POST /api/v1/auth/login - Status: 401 - Duration: 23ms
2026-08-24 17:03:47.621 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:47.621 |     insert 
2026-08-24 17:03:47.621 |     into
2026-08-24 17:03:47.621 |         api_audit_events
2026-08-24 17:03:47.621 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:47.621 |     values
2026-08-24 17:03:47.621 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:47.621 | Hibernate: 
2026-08-24 17:03:47.621 |     insert 
2026-08-24 17:03:47.621 |     into
2026-08-24 17:03:47.621 |         api_audit_events
2026-08-24 17:03:47.621 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:47.621 |     values
2026-08-24 17:03:47.621 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:47.642 | 2026-08-24 09:03:47 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 401 | stage=COMPLETED | keyId=null | acct=null | latency=29ms
2026-08-24 17:03:48.185 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:03:48.186 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: a683f517-2207-4a21-83de-fbae0fdc08ef] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:48.187 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: a683f517-2207-4a21-83de-fbae0fdc08ef] - Secured POST /api/v1/auth/login
2026-08-24 17:03:48.193 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: a683f517-2207-4a21-83de-fbae0fdc08ef] - 
2026-08-24 17:03:48.193 |     select
2026-08-24 17:03:48.193 |         c1_0.id,
2026-08-24 17:03:48.193 |         c1_0.created_at,
2026-08-24 17:03:48.193 |         c1_0.email,
2026-08-24 17:03:48.193 |         c1_0.employment_status,
2026-08-24 17:03:48.193 |         c1_0.first_name,
2026-08-24 17:03:48.193 |         c1_0.job_title,
2026-08-24 17:03:48.193 |         c1_0.kyc_status,
2026-08-24 17:03:48.193 |         c1_0.last_name,
2026-08-24 17:03:48.193 |         c1_0.locked,
2026-08-24 17:03:48.193 |         c1_0.monthly_income,
2026-08-24 17:03:48.193 |         c1_0.password,
2026-08-24 17:03:48.193 |         c1_0.risk_profile,
2026-08-24 17:03:48.193 |         c1_0.role,
2026-08-24 17:03:48.193 |         c1_0.source_of_funds 
2026-08-24 17:03:48.193 |     from
2026-08-24 17:03:48.193 |         customers c1_0 
2026-08-24 17:03:48.193 |     where
2026-08-24 17:03:48.193 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:48.193 | Hibernate: 
2026-08-24 17:03:48.193 |     select
2026-08-24 17:03:48.193 |         c1_0.id,
2026-08-24 17:03:48.193 |         c1_0.created_at,
2026-08-24 17:03:48.193 |         c1_0.email,
2026-08-24 17:03:48.193 |         c1_0.employment_status,
2026-08-24 17:03:48.193 |         c1_0.first_name,
2026-08-24 17:03:48.193 |         c1_0.job_title,
2026-08-24 17:03:48.193 |         c1_0.kyc_status,
2026-08-24 17:03:48.193 |         c1_0.last_name,
2026-08-24 17:03:48.193 |         c1_0.locked,
2026-08-24 17:03:48.193 |         c1_0.monthly_income,
2026-08-24 17:03:48.193 |         c1_0.password,
2026-08-24 17:03:48.193 |         c1_0.risk_profile,
2026-08-24 17:03:48.193 |         c1_0.role,
2026-08-24 17:03:48.193 |         c1_0.source_of_funds 
2026-08-24 17:03:48.193 |     from
2026-08-24 17:03:48.193 |         customers c1_0 
2026-08-24 17:03:48.193 |     where
2026-08-24 17:03:48.193 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:48.197 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: a683f517-2207-4a21-83de-fbae0fdc08ef] - Failed to authenticate since user account is locked
2026-08-24 17:03:48.199 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.authentication.ProviderManager [X-Request-Id: a683f517-2207-4a21-83de-fbae0fdc08ef] - Authentication failed for user 'paymondo@gmail.com' since their account status is User account is locked
2026-08-24 17:03:48.199 | org.springframework.security.authentication.LockedException: User account is locked
2026-08-24 17:03:48.199 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider$DefaultPreAuthenticationChecks.check(AbstractUserDetailsAuthenticationProvider.java:328)
2026-08-24 17:03:48.199 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider.authenticate(AbstractUserDetailsAuthenticationProvider.java:149)
2026-08-24 17:03:48.199 | 	at org.springframework.security.authentication.ProviderManager.authenticate(ProviderManager.java:182)
2026-08-24 17:03:48.199 | 	at com.company.banking.security.auth.AuthenticationService.authenticate(AuthenticationService.java:29)
2026-08-24 17:03:48.199 | 	at com.company.banking.security.auth.AuthenticationController.login(AuthenticationController.java:63)
2026-08-24 17:03:48.199 | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
2026-08-24 17:03:48.199 | 	at java.base/java.lang.reflect.Method.invoke(Unknown Source)
2026-08-24 17:03:48.199 | 	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:255)
2026-08-24 17:03:48.199 | 	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:188)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1088)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:978)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
2026-08-24 17:03:48.199 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:590)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
2026-08-24 17:03:48.199 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at com.company.banking.apigateway.security.GatewayRateLimitFilter.doFilterInternal(GatewayRateLimitFilter.java:37)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at com.company.banking.apigateway.security.ApiGatewayIdempotencyInterceptor.doFilterInternal(ApiGatewayIdempotencyInterceptor.java:43)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at com.company.banking.web.filter.RateLimitFilter.doFilterInternal(RateLimitFilter.java:35)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at com.company.banking.web.filter.RequestLoggingFilter.doFilterInternal(RequestLoggingFilter.java:28)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at com.company.banking.web.filter.SecurityHeadersFilter.doFilterInternal(SecurityHeadersFilter.java:40)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:125)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:119)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at com.company.banking.security.jwt.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:65)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at com.company.banking.apigateway.security.ApiKeyAuthenticationFilter.doFilterInternal(ApiKeyAuthenticationFilter.java:113)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at com.company.banking.web.filter.BffIdentityFilter.doFilterInternal(BffIdentityFilter.java:40)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at com.company.banking.web.filter.CorrelationIdFilter.doFilterInternal(CorrelationIdFilter.java:36)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
2026-08-24 17:03:48.199 | 	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.ServletRequestPathFilter.doFilter(ServletRequestPathFilter.java:52)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:48.199 | 	at org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebSecurityConfiguration.java:319)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:48.199 | 	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:48.199 | 	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:240)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at com.company.banking.apigateway.security.ApiAuditLoggingFilter.doFilterInternal(ApiAuditLoggingFilter.java:39)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
2026-08-24 17:03:48.199 | 	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
2026-08-24 17:03:48.199 | 	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
2026-08-24 17:03:48.199 | 	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
2026-08-24 17:03:48.199 | 	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
2026-08-24 17:03:48.199 | 	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1741)
2026-08-24 17:03:48.199 | 	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
2026-08-24 17:03:48.199 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
2026-08-24 17:03:48.199 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
2026-08-24 17:03:48.199 | 	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
2026-08-24 17:03:48.199 | 	at java.base/java.lang.Thread.run(Unknown Source)
2026-08-24 17:03:48.202 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: a683f517-2207-4a21-83de-fbae0fdc08ef] - 
2026-08-24 17:03:48.203 |     select
2026-08-24 17:03:48.203 |         c1_0.id,
2026-08-24 17:03:48.203 |         c1_0.created_at,
2026-08-24 17:03:48.203 |         c1_0.email,
2026-08-24 17:03:48.203 |         c1_0.employment_status,
2026-08-24 17:03:48.203 |         c1_0.first_name,
2026-08-24 17:03:48.203 |         c1_0.job_title,
2026-08-24 17:03:48.203 |         c1_0.kyc_status,
2026-08-24 17:03:48.203 |         c1_0.last_name,
2026-08-24 17:03:48.203 |         c1_0.locked,
2026-08-24 17:03:48.203 |         c1_0.monthly_income,
2026-08-24 17:03:48.203 |         c1_0.password,
2026-08-24 17:03:48.203 |         c1_0.risk_profile,
2026-08-24 17:03:48.203 |         c1_0.role,
2026-08-24 17:03:48.203 |         c1_0.source_of_funds 
2026-08-24 17:03:48.203 |     from
2026-08-24 17:03:48.203 |         customers c1_0 
2026-08-24 17:03:48.203 |     where
2026-08-24 17:03:48.203 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:48.203 | Hibernate: 
2026-08-24 17:03:48.203 |     select
2026-08-24 17:03:48.203 |         c1_0.id,
2026-08-24 17:03:48.203 |         c1_0.created_at,
2026-08-24 17:03:48.203 |         c1_0.email,
2026-08-24 17:03:48.203 |         c1_0.employment_status,
2026-08-24 17:03:48.203 |         c1_0.first_name,
2026-08-24 17:03:48.203 |         c1_0.job_title,
2026-08-24 17:03:48.203 |         c1_0.kyc_status,
2026-08-24 17:03:48.203 |         c1_0.last_name,
2026-08-24 17:03:48.203 |         c1_0.locked,
2026-08-24 17:03:48.203 |         c1_0.monthly_income,
2026-08-24 17:03:48.203 |         c1_0.password,
2026-08-24 17:03:48.203 |         c1_0.risk_profile,
2026-08-24 17:03:48.203 |         c1_0.role,
2026-08-24 17:03:48.203 |         c1_0.source_of_funds 
2026-08-24 17:03:48.203 |     from
2026-08-24 17:03:48.203 |         customers c1_0 
2026-08-24 17:03:48.203 |     where
2026-08-24 17:03:48.203 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:48.208 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: a683f517-2207-4a21-83de-fbae0fdc08ef] - [HTTP LOG] POST /api/v1/auth/login - Status: 401 - Duration: 20ms
2026-08-24 17:03:48.214 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:48.214 |     insert 
2026-08-24 17:03:48.214 |     into
2026-08-24 17:03:48.214 |         api_audit_events
2026-08-24 17:03:48.214 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:48.214 |     values
2026-08-24 17:03:48.214 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:48.214 | Hibernate: 
2026-08-24 17:03:48.214 |     insert 
2026-08-24 17:03:48.214 |     into
2026-08-24 17:03:48.214 |         api_audit_events
2026-08-24 17:03:48.214 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:48.214 |     values
2026-08-24 17:03:48.214 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:48.235 | 2026-08-24 09:03:48 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 401 | stage=COMPLETED | keyId=null | acct=null | latency=28ms
2026-08-24 17:03:49.060 | 2026-08-24 09:03:49 [MessageBroker-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:49.061 |     SELECT
2026-08-24 17:03:49.061 |         o1.* 
2026-08-24 17:03:49.061 |     FROM
2026-08-24 17:03:49.061 |         payment_event_outbox o1 
2026-08-24 17:03:49.061 |     WHERE
2026-08-24 17:03:49.061 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:49.061 |         AND (
2026-08-24 17:03:49.061 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:49.061 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:49.061 |         )   
2026-08-24 17:03:49.061 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:49.061 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:49.061 |             1 
2026-08-24 17:03:49.061 |         FROM
2026-08-24 17:03:49.061 |             payment_event_outbox o2       
2026-08-24 17:03:49.061 |         WHERE
2026-08-24 17:03:49.061 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:49.061 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:49.061 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:49.061 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:49.061 |     ORDER BY
2026-08-24 17:03:49.061 |         o1.created_at ASC 
2026-08-24 17:03:49.061 |     LIMIT
2026-08-24 17:03:49.061 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:49.061 | Hibernate: 
2026-08-24 17:03:49.061 |     SELECT
2026-08-24 17:03:49.061 |         o1.* 
2026-08-24 17:03:49.061 |     FROM
2026-08-24 17:03:49.061 |         payment_event_outbox o1 
2026-08-24 17:03:49.061 |     WHERE
2026-08-24 17:03:49.061 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:49.061 |         AND (
2026-08-24 17:03:49.061 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:49.061 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:49.061 |         )   
2026-08-24 17:03:49.061 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:49.061 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:49.061 |             1 
2026-08-24 17:03:49.061 |         FROM
2026-08-24 17:03:49.061 |             payment_event_outbox o2       
2026-08-24 17:03:49.061 |         WHERE
2026-08-24 17:03:49.061 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:49.061 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:49.061 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:49.061 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:49.061 |     ORDER BY
2026-08-24 17:03:49.061 |         o1.created_at ASC 
2026-08-24 17:03:49.061 |     LIMIT
2026-08-24 17:03:49.061 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:52.333 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:03:52.334 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 5c20da93-7ed5-471c-9dff-f19249db3a7c] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:52.335 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 5c20da93-7ed5-471c-9dff-f19249db3a7c] - Secured POST /api/v1/auth/login
2026-08-24 17:03:52.342 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 5c20da93-7ed5-471c-9dff-f19249db3a7c] - 
2026-08-24 17:03:52.342 |     select
2026-08-24 17:03:52.342 |         c1_0.id,
2026-08-24 17:03:52.342 |         c1_0.created_at,
2026-08-24 17:03:52.342 |         c1_0.email,
2026-08-24 17:03:52.342 |         c1_0.employment_status,
2026-08-24 17:03:52.342 |         c1_0.first_name,
2026-08-24 17:03:52.342 |         c1_0.job_title,
2026-08-24 17:03:52.342 |         c1_0.kyc_status,
2026-08-24 17:03:52.342 |         c1_0.last_name,
2026-08-24 17:03:52.342 |         c1_0.locked,
2026-08-24 17:03:52.342 |         c1_0.monthly_income,
2026-08-24 17:03:52.342 |         c1_0.password,
2026-08-24 17:03:52.343 |         c1_0.risk_profile,
2026-08-24 17:03:52.343 |         c1_0.role,
2026-08-24 17:03:52.343 |         c1_0.source_of_funds 
2026-08-24 17:03:52.343 |     from
2026-08-24 17:03:52.343 |         customers c1_0 
2026-08-24 17:03:52.343 |     where
2026-08-24 17:03:52.343 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:52.343 | Hibernate: 
2026-08-24 17:03:52.343 |     select
2026-08-24 17:03:52.343 |         c1_0.id,
2026-08-24 17:03:52.343 |         c1_0.created_at,
2026-08-24 17:03:52.343 |         c1_0.email,
2026-08-24 17:03:52.343 |         c1_0.employment_status,
2026-08-24 17:03:52.343 |         c1_0.first_name,
2026-08-24 17:03:52.343 |         c1_0.job_title,
2026-08-24 17:03:52.343 |         c1_0.kyc_status,
2026-08-24 17:03:52.343 |         c1_0.last_name,
2026-08-24 17:03:52.343 |         c1_0.locked,
2026-08-24 17:03:52.343 |         c1_0.monthly_income,
2026-08-24 17:03:52.343 |         c1_0.password,
2026-08-24 17:03:52.343 |         c1_0.risk_profile,
2026-08-24 17:03:52.343 |         c1_0.role,
2026-08-24 17:03:52.343 |         c1_0.source_of_funds 
2026-08-24 17:03:52.343 |     from
2026-08-24 17:03:52.343 |         customers c1_0 
2026-08-24 17:03:52.343 |     where
2026-08-24 17:03:52.343 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:52.347 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 5c20da93-7ed5-471c-9dff-f19249db3a7c] - Failed to authenticate since user account is locked
2026-08-24 17:03:52.349 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.authentication.ProviderManager [X-Request-Id: 5c20da93-7ed5-471c-9dff-f19249db3a7c] - Authentication failed for user 'paymondo@gmail.com' since their account status is User account is locked
2026-08-24 17:03:52.349 | org.springframework.security.authentication.LockedException: User account is locked
2026-08-24 17:03:52.349 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider$DefaultPreAuthenticationChecks.check(AbstractUserDetailsAuthenticationProvider.java:328)
2026-08-24 17:03:52.349 | 	at org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider.authenticate(AbstractUserDetailsAuthenticationProvider.java:149)
2026-08-24 17:03:52.349 | 	at org.springframework.security.authentication.ProviderManager.authenticate(ProviderManager.java:182)
2026-08-24 17:03:52.349 | 	at com.company.banking.security.auth.AuthenticationService.authenticate(AuthenticationService.java:29)
2026-08-24 17:03:52.349 | 	at com.company.banking.security.auth.AuthenticationController.login(AuthenticationController.java:63)
2026-08-24 17:03:52.349 | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
2026-08-24 17:03:52.349 | 	at java.base/java.lang.reflect.Method.invoke(Unknown Source)
2026-08-24 17:03:52.349 | 	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:255)
2026-08-24 17:03:52.349 | 	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:188)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1088)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:978)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
2026-08-24 17:03:52.349 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:590)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
2026-08-24 17:03:52.349 | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at com.company.banking.apigateway.security.GatewayRateLimitFilter.doFilterInternal(GatewayRateLimitFilter.java:37)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at com.company.banking.apigateway.security.ApiGatewayIdempotencyInterceptor.doFilterInternal(ApiGatewayIdempotencyInterceptor.java:43)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at com.company.banking.web.filter.RateLimitFilter.doFilterInternal(RateLimitFilter.java:35)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at com.company.banking.web.filter.RequestLoggingFilter.doFilterInternal(RequestLoggingFilter.java:28)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at com.company.banking.web.filter.SecurityHeadersFilter.doFilterInternal(SecurityHeadersFilter.java:40)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:125)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:119)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at com.company.banking.security.jwt.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:65)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at com.company.banking.apigateway.security.ApiKeyAuthenticationFilter.doFilterInternal(ApiKeyAuthenticationFilter.java:113)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at com.company.banking.web.filter.BffIdentityFilter.doFilterInternal(BffIdentityFilter.java:40)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at com.company.banking.web.filter.CorrelationIdFilter.doFilterInternal(CorrelationIdFilter.java:36)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
2026-08-24 17:03:52.349 | 	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.ServletRequestPathFilter.doFilter(ServletRequestPathFilter.java:52)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:52.349 | 	at org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebSecurityConfiguration.java:319)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:52.349 | 	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
2026-08-24 17:03:52.349 | 	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:240)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at com.company.banking.apigateway.security.ApiAuditLoggingFilter.doFilterInternal(ApiAuditLoggingFilter.java:39)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
2026-08-24 17:03:52.349 | 	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
2026-08-24 17:03:52.349 | 	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
2026-08-24 17:03:52.349 | 	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
2026-08-24 17:03:52.349 | 	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
2026-08-24 17:03:52.349 | 	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1741)
2026-08-24 17:03:52.349 | 	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
2026-08-24 17:03:52.349 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
2026-08-24 17:03:52.349 | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
2026-08-24 17:03:52.349 | 	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
2026-08-24 17:03:52.349 | 	at java.base/java.lang.Thread.run(Unknown Source)
2026-08-24 17:03:52.352 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 5c20da93-7ed5-471c-9dff-f19249db3a7c] - 
2026-08-24 17:03:52.352 |     select
2026-08-24 17:03:52.352 |         c1_0.id,
2026-08-24 17:03:52.352 |         c1_0.created_at,
2026-08-24 17:03:52.352 |         c1_0.email,
2026-08-24 17:03:52.352 |         c1_0.employment_status,
2026-08-24 17:03:52.352 |         c1_0.first_name,
2026-08-24 17:03:52.352 |         c1_0.job_title,
2026-08-24 17:03:52.352 |         c1_0.kyc_status,
2026-08-24 17:03:52.352 |         c1_0.last_name,
2026-08-24 17:03:52.352 |         c1_0.locked,
2026-08-24 17:03:52.352 |         c1_0.monthly_income,
2026-08-24 17:03:52.352 |         c1_0.password,
2026-08-24 17:03:52.352 |         c1_0.risk_profile,
2026-08-24 17:03:52.352 |         c1_0.role,
2026-08-24 17:03:52.352 |         c1_0.source_of_funds 
2026-08-24 17:03:52.352 |     from
2026-08-24 17:03:52.352 |         customers c1_0 
2026-08-24 17:03:52.352 |     where
2026-08-24 17:03:52.352 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:52.352 | Hibernate: 
2026-08-24 17:03:52.352 |     select
2026-08-24 17:03:52.352 |         c1_0.id,
2026-08-24 17:03:52.352 |         c1_0.created_at,
2026-08-24 17:03:52.352 |         c1_0.email,
2026-08-24 17:03:52.352 |         c1_0.employment_status,
2026-08-24 17:03:52.352 |         c1_0.first_name,
2026-08-24 17:03:52.352 |         c1_0.job_title,
2026-08-24 17:03:52.352 |         c1_0.kyc_status,
2026-08-24 17:03:52.352 |         c1_0.last_name,
2026-08-24 17:03:52.352 |         c1_0.locked,
2026-08-24 17:03:52.352 |         c1_0.monthly_income,
2026-08-24 17:03:52.352 |         c1_0.password,
2026-08-24 17:03:52.352 |         c1_0.risk_profile,
2026-08-24 17:03:52.352 |         c1_0.role,
2026-08-24 17:03:52.352 |         c1_0.source_of_funds 
2026-08-24 17:03:52.352 |     from
2026-08-24 17:03:52.352 |         customers c1_0 
2026-08-24 17:03:52.352 |     where
2026-08-24 17:03:52.352 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:52.358 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 5c20da93-7ed5-471c-9dff-f19249db3a7c] - [HTTP LOG] POST /api/v1/auth/login - Status: 401 - Duration: 22ms
2026-08-24 17:03:52.362 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:52.362 |     insert 
2026-08-24 17:03:52.362 |     into
2026-08-24 17:03:52.362 |         api_audit_events
2026-08-24 17:03:52.362 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:52.362 |     values
2026-08-24 17:03:52.362 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:52.362 | Hibernate: 
2026-08-24 17:03:52.362 |     insert 
2026-08-24 17:03:52.362 |     into
2026-08-24 17:03:52.362 |         api_audit_events
2026-08-24 17:03:52.362 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:52.362 |     values
2026-08-24 17:03:52.362 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:52.382 | 2026-08-24 09:03:52 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 401 | stage=COMPLETED | keyId=null | acct=null | latency=27ms
2026-08-24 17:03:54.072 | 2026-08-24 09:03:54 [MessageBroker-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:54.072 |     SELECT
2026-08-24 17:03:54.072 |         o1.* 
2026-08-24 17:03:54.072 |     FROM
2026-08-24 17:03:54.072 |         payment_event_outbox o1 
2026-08-24 17:03:54.072 |     WHERE
2026-08-24 17:03:54.072 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:54.072 |         AND (
2026-08-24 17:03:54.072 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:54.072 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:54.072 |         )   
2026-08-24 17:03:54.072 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:54.072 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:54.072 |             1 
2026-08-24 17:03:54.072 |         FROM
2026-08-24 17:03:54.072 |             payment_event_outbox o2       
2026-08-24 17:03:54.072 |         WHERE
2026-08-24 17:03:54.072 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:54.072 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:54.072 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:54.072 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:54.072 |     ORDER BY
2026-08-24 17:03:54.072 |         o1.created_at ASC 
2026-08-24 17:03:54.072 |     LIMIT
2026-08-24 17:03:54.072 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:54.072 | Hibernate: 
2026-08-24 17:03:54.072 |     SELECT
2026-08-24 17:03:54.072 |         o1.* 
2026-08-24 17:03:54.072 |     FROM
2026-08-24 17:03:54.072 |         payment_event_outbox o1 
2026-08-24 17:03:54.072 |     WHERE
2026-08-24 17:03:54.072 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:54.072 |         AND (
2026-08-24 17:03:54.072 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:54.072 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:54.072 |         )   
2026-08-24 17:03:54.072 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:54.072 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:54.072 |             1 
2026-08-24 17:03:54.072 |         FROM
2026-08-24 17:03:54.072 |             payment_event_outbox o2       
2026-08-24 17:03:54.072 |         WHERE
2026-08-24 17:03:54.072 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:54.072 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:54.072 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:54.072 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:54.072 |     ORDER BY
2026-08-24 17:03:54.072 |         o1.created_at ASC 
2026-08-24 17:03:54.072 |     LIMIT
2026-08-24 17:03:54.072 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:55.946 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/forgot-password
2026-08-24 17:03:55.948 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 41a7bd56-d6ca-4039-b048-a3763fd6b3d6] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:55.949 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 41a7bd56-d6ca-4039-b048-a3763fd6b3d6] - Secured POST /api/v1/auth/forgot-password
2026-08-24 17:03:55.958 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.s.a.AuthenticationController [X-Request-Id: 41a7bd56-d6ca-4039-b048-a3763fd6b3d6] - [FORGOT-PASSWORD] Reset requested for email: paymondo@gmail.com
2026-08-24 17:03:55.963 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 41a7bd56-d6ca-4039-b048-a3763fd6b3d6] - 
2026-08-24 17:03:55.963 |     select
2026-08-24 17:03:55.963 |         c1_0.id,
2026-08-24 17:03:55.963 |         c1_0.created_at,
2026-08-24 17:03:55.963 |         c1_0.email,
2026-08-24 17:03:55.963 |         c1_0.employment_status,
2026-08-24 17:03:55.963 |         c1_0.first_name,
2026-08-24 17:03:55.963 |         c1_0.job_title,
2026-08-24 17:03:55.963 |         c1_0.kyc_status,
2026-08-24 17:03:55.963 |         c1_0.last_name,
2026-08-24 17:03:55.963 |         c1_0.locked,
2026-08-24 17:03:55.963 |         c1_0.monthly_income,
2026-08-24 17:03:55.963 |         c1_0.password,
2026-08-24 17:03:55.963 |         c1_0.risk_profile,
2026-08-24 17:03:55.963 |         c1_0.role,
2026-08-24 17:03:55.963 |         c1_0.source_of_funds 
2026-08-24 17:03:55.963 |     from
2026-08-24 17:03:55.963 |         customers c1_0 
2026-08-24 17:03:55.963 |     where
2026-08-24 17:03:55.963 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:55.963 | Hibernate: 
2026-08-24 17:03:55.963 |     select
2026-08-24 17:03:55.963 |         c1_0.id,
2026-08-24 17:03:55.963 |         c1_0.created_at,
2026-08-24 17:03:55.963 |         c1_0.email,
2026-08-24 17:03:55.963 |         c1_0.employment_status,
2026-08-24 17:03:55.963 |         c1_0.first_name,
2026-08-24 17:03:55.963 |         c1_0.job_title,
2026-08-24 17:03:55.963 |         c1_0.kyc_status,
2026-08-24 17:03:55.963 |         c1_0.last_name,
2026-08-24 17:03:55.963 |         c1_0.locked,
2026-08-24 17:03:55.963 |         c1_0.monthly_income,
2026-08-24 17:03:55.963 |         c1_0.password,
2026-08-24 17:03:55.963 |         c1_0.risk_profile,
2026-08-24 17:03:55.963 |         c1_0.role,
2026-08-24 17:03:55.963 |         c1_0.source_of_funds 
2026-08-24 17:03:55.963 |     from
2026-08-24 17:03:55.963 |         customers c1_0 
2026-08-24 17:03:55.963 |     where
2026-08-24 17:03:55.963 |         upper(c1_0.email)=upper(?)
2026-08-24 17:03:55.968 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.s.a.AuthenticationController [X-Request-Id: 41a7bd56-d6ca-4039-b048-a3763fd6b3d6] - [FORGOT-PASSWORD] Account found for 'paymondo@gmail.com'. Generating reset token and dispatching email.
2026-08-24 17:03:55.977 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.s.a.AuthenticationController [X-Request-Id: 41a7bd56-d6ca-4039-b048-a3763fd6b3d6] - [FORGOT-PASSWORD] emailPort.sendEmail() dispatched (async) to: paymondo@gmail.com
2026-08-24 17:03:55.978 | 2026-08-24 09:03:55 [AsyncThread-1] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Sending email to: paymondo@gmail.com
2026-08-24 17:03:55.980 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 41a7bd56-d6ca-4039-b048-a3763fd6b3d6] - [HTTP LOG] POST /api/v1/auth/forgot-password - Status: 200 - Duration: 30ms
2026-08-24 17:03:55.984 | 2026-08-24 09:03:55 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:55.984 |     insert 
2026-08-24 17:03:55.984 |     into
2026-08-24 17:03:55.984 |         api_audit_events
2026-08-24 17:03:55.984 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:55.984 |     values
2026-08-24 17:03:55.984 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:55.984 | Hibernate: 
2026-08-24 17:03:55.984 |     insert 
2026-08-24 17:03:55.984 |     into
2026-08-24 17:03:55.984 |         api_audit_events
2026-08-24 17:03:55.984 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:03:55.984 |     values
2026-08-24 17:03:55.984 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:03:56.005 | 2026-08-24 09:03:56 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/forgot-password → 200 | stage=COMPLETED | keyId=null | acct=null | latency=37ms
2026-08-24 17:03:56.572 | 2026-08-24 09:03:56 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:03:56.573 | 2026-08-24 09:03:56 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:03:56.574 | 2026-08-24 09:03:56 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 98f012ea-9b6d-4e3c-96af-db72f7544b5c] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:03:56.581 | 2026-08-24 09:03:56 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 98f012ea-9b6d-4e3c-96af-db72f7544b5c] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 8ms
2026-08-24 17:03:59.080 | 2026-08-24 09:03:59 [MessageBroker-7] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:03:59.080 |     SELECT
2026-08-24 17:03:59.080 |         o1.* 
2026-08-24 17:03:59.080 |     FROM
2026-08-24 17:03:59.080 |         payment_event_outbox o1 
2026-08-24 17:03:59.080 |     WHERE
2026-08-24 17:03:59.080 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:59.080 |         AND (
2026-08-24 17:03:59.080 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:59.080 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:59.080 |         )   
2026-08-24 17:03:59.080 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:59.080 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:59.080 |             1 
2026-08-24 17:03:59.080 |         FROM
2026-08-24 17:03:59.080 |             payment_event_outbox o2       
2026-08-24 17:03:59.080 |         WHERE
2026-08-24 17:03:59.080 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:59.080 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:59.080 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:59.080 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:59.080 |     ORDER BY
2026-08-24 17:03:59.080 |         o1.created_at ASC 
2026-08-24 17:03:59.080 |     LIMIT
2026-08-24 17:03:59.080 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:03:59.080 | Hibernate: 
2026-08-24 17:03:59.080 |     SELECT
2026-08-24 17:03:59.080 |         o1.* 
2026-08-24 17:03:59.080 |     FROM
2026-08-24 17:03:59.080 |         payment_event_outbox o1 
2026-08-24 17:03:59.080 |     WHERE
2026-08-24 17:03:59.080 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:03:59.080 |         AND (
2026-08-24 17:03:59.080 |             o1.next_attempt_at IS NULL 
2026-08-24 17:03:59.080 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:03:59.080 |         )   
2026-08-24 17:03:59.080 |         AND o1.locked_at IS NULL   
2026-08-24 17:03:59.080 |         AND NOT EXISTS (       SELECT
2026-08-24 17:03:59.080 |             1 
2026-08-24 17:03:59.080 |         FROM
2026-08-24 17:03:59.080 |             payment_event_outbox o2       
2026-08-24 17:03:59.080 |         WHERE
2026-08-24 17:03:59.080 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:03:59.080 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:03:59.080 |             AND o2.sequence < o1.sequence         
2026-08-24 17:03:59.080 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:03:59.080 |     ORDER BY
2026-08-24 17:03:59.080 |         o1.created_at ASC 
2026-08-24 17:03:59.080 |     LIMIT
2026-08-24 17:03:59.080 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:00.485 | 2026-08-24 09:04:00 [AsyncThread-1] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Email dispatched successfully to paymondo@gmail.com
2026-08-24 17:04:04.086 | 2026-08-24 09:04:04 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:04.086 |     SELECT
2026-08-24 17:04:04.086 |         o1.* 
2026-08-24 17:04:04.086 |     FROM
2026-08-24 17:04:04.086 |         payment_event_outbox o1 
2026-08-24 17:04:04.086 |     WHERE
2026-08-24 17:04:04.086 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:04.086 |         AND (
2026-08-24 17:04:04.086 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:04.086 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:04.086 |         )   
2026-08-24 17:04:04.086 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:04.086 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:04.086 |             1 
2026-08-24 17:04:04.086 |         FROM
2026-08-24 17:04:04.086 |             payment_event_outbox o2       
2026-08-24 17:04:04.086 |         WHERE
2026-08-24 17:04:04.086 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:04.086 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:04.086 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:04.086 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:04.086 |     ORDER BY
2026-08-24 17:04:04.086 |         o1.created_at ASC 
2026-08-24 17:04:04.086 |     LIMIT
2026-08-24 17:04:04.086 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:04.086 | Hibernate: 
2026-08-24 17:04:04.086 |     SELECT
2026-08-24 17:04:04.086 |         o1.* 
2026-08-24 17:04:04.086 |     FROM
2026-08-24 17:04:04.086 |         payment_event_outbox o1 
2026-08-24 17:04:04.086 |     WHERE
2026-08-24 17:04:04.086 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:04.086 |         AND (
2026-08-24 17:04:04.086 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:04.086 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:04.086 |         )   
2026-08-24 17:04:04.086 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:04.086 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:04.086 |             1 
2026-08-24 17:04:04.086 |         FROM
2026-08-24 17:04:04.086 |             payment_event_outbox o2       
2026-08-24 17:04:04.086 |         WHERE
2026-08-24 17:04:04.086 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:04.086 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:04.086 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:04.086 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:04.086 |     ORDER BY
2026-08-24 17:04:04.086 |         o1.created_at ASC 
2026-08-24 17:04:04.086 |     LIMIT
2026-08-24 17:04:04.086 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:06.666 | 2026-08-24 09:04:06 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:04:06.667 | 2026-08-24 09:04:06 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:04:06.667 | 2026-08-24 09:04:06 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 39d14e23-306a-4cd9-9bf5-20e98cc1515f] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:06.674 | 2026-08-24 09:04:06 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 39d14e23-306a-4cd9-9bf5-20e98cc1515f] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:04:09.094 | 2026-08-24 09:04:09 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:09.094 |     SELECT
2026-08-24 17:04:09.094 |         o1.* 
2026-08-24 17:04:09.094 |     FROM
2026-08-24 17:04:09.094 |         payment_event_outbox o1 
2026-08-24 17:04:09.094 |     WHERE
2026-08-24 17:04:09.094 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:09.094 |         AND (
2026-08-24 17:04:09.094 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:09.094 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:09.094 |         )   
2026-08-24 17:04:09.094 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:09.094 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:09.094 |             1 
2026-08-24 17:04:09.094 |         FROM
2026-08-24 17:04:09.094 |             payment_event_outbox o2       
2026-08-24 17:04:09.094 |         WHERE
2026-08-24 17:04:09.094 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:09.094 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:09.094 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:09.094 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:09.094 |     ORDER BY
2026-08-24 17:04:09.094 |         o1.created_at ASC 
2026-08-24 17:04:09.094 |     LIMIT
2026-08-24 17:04:09.094 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:09.094 | Hibernate: 
2026-08-24 17:04:09.094 |     SELECT
2026-08-24 17:04:09.094 |         o1.* 
2026-08-24 17:04:09.094 |     FROM
2026-08-24 17:04:09.094 |         payment_event_outbox o1 
2026-08-24 17:04:09.094 |     WHERE
2026-08-24 17:04:09.094 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:09.094 |         AND (
2026-08-24 17:04:09.094 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:09.094 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:09.094 |         )   
2026-08-24 17:04:09.094 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:09.094 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:09.094 |             1 
2026-08-24 17:04:09.094 |         FROM
2026-08-24 17:04:09.094 |             payment_event_outbox o2       
2026-08-24 17:04:09.094 |         WHERE
2026-08-24 17:04:09.094 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:09.094 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:09.094 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:09.094 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:09.094 |     ORDER BY
2026-08-24 17:04:09.094 |         o1.created_at ASC 
2026-08-24 17:04:09.094 |     LIMIT
2026-08-24 17:04:09.094 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:14.098 | 2026-08-24 09:04:14 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:14.099 |     SELECT
2026-08-24 17:04:14.099 |         o1.* 
2026-08-24 17:04:14.099 |     FROM
2026-08-24 17:04:14.099 |         payment_event_outbox o1 
2026-08-24 17:04:14.099 |     WHERE
2026-08-24 17:04:14.099 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:14.099 |         AND (
2026-08-24 17:04:14.099 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:14.099 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:14.099 |         )   
2026-08-24 17:04:14.099 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:14.099 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:14.099 |             1 
2026-08-24 17:04:14.099 |         FROM
2026-08-24 17:04:14.099 |             payment_event_outbox o2       
2026-08-24 17:04:14.099 |         WHERE
2026-08-24 17:04:14.099 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:14.099 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:14.099 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:14.099 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:14.099 |     ORDER BY
2026-08-24 17:04:14.099 |         o1.created_at ASC 
2026-08-24 17:04:14.099 |     LIMIT
2026-08-24 17:04:14.099 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:14.099 | Hibernate: 
2026-08-24 17:04:14.099 |     SELECT
2026-08-24 17:04:14.099 |         o1.* 
2026-08-24 17:04:14.099 |     FROM
2026-08-24 17:04:14.099 |         payment_event_outbox o1 
2026-08-24 17:04:14.099 |     WHERE
2026-08-24 17:04:14.099 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:14.099 |         AND (
2026-08-24 17:04:14.099 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:14.099 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:14.099 |         )   
2026-08-24 17:04:14.099 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:14.099 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:14.099 |             1 
2026-08-24 17:04:14.099 |         FROM
2026-08-24 17:04:14.099 |             payment_event_outbox o2       
2026-08-24 17:04:14.099 |         WHERE
2026-08-24 17:04:14.099 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:14.099 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:14.099 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:14.099 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:14.099 |     ORDER BY
2026-08-24 17:04:14.099 |         o1.created_at ASC 
2026-08-24 17:04:14.099 |     LIMIT
2026-08-24 17:04:14.099 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:16.080 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/reset-password
2026-08-24 17:04:16.081 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 68a5bc6d-c984-4a47-bbe6-5b6bcda92e86] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:16.082 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 68a5bc6d-c984-4a47-bbe6-5b6bcda92e86] - Secured POST /api/v1/auth/reset-password
2026-08-24 17:04:16.102 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: 68a5bc6d-c984-4a47-bbe6-5b6bcda92e86] - 
2026-08-24 17:04:16.102 |     select
2026-08-24 17:04:16.102 |         c1_0.id,
2026-08-24 17:04:16.102 |         c1_0.created_at,
2026-08-24 17:04:16.102 |         c1_0.email,
2026-08-24 17:04:16.102 |         c1_0.employment_status,
2026-08-24 17:04:16.102 |         c1_0.first_name,
2026-08-24 17:04:16.102 |         c1_0.job_title,
2026-08-24 17:04:16.102 |         c1_0.kyc_status,
2026-08-24 17:04:16.102 |         c1_0.last_name,
2026-08-24 17:04:16.102 |         c1_0.locked,
2026-08-24 17:04:16.102 |         c1_0.monthly_income,
2026-08-24 17:04:16.102 |         c1_0.password,
2026-08-24 17:04:16.102 |         c1_0.risk_profile,
2026-08-24 17:04:16.102 |         c1_0.role,
2026-08-24 17:04:16.102 |         c1_0.source_of_funds 
2026-08-24 17:04:16.102 |     from
2026-08-24 17:04:16.102 |         customers c1_0 
2026-08-24 17:04:16.102 |     where
2026-08-24 17:04:16.102 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:16.102 | Hibernate: 
2026-08-24 17:04:16.102 |     select
2026-08-24 17:04:16.102 |         c1_0.id,
2026-08-24 17:04:16.102 |         c1_0.created_at,
2026-08-24 17:04:16.102 |         c1_0.email,
2026-08-24 17:04:16.102 |         c1_0.employment_status,
2026-08-24 17:04:16.102 |         c1_0.first_name,
2026-08-24 17:04:16.102 |         c1_0.job_title,
2026-08-24 17:04:16.102 |         c1_0.kyc_status,
2026-08-24 17:04:16.102 |         c1_0.last_name,
2026-08-24 17:04:16.102 |         c1_0.locked,
2026-08-24 17:04:16.102 |         c1_0.monthly_income,
2026-08-24 17:04:16.102 |         c1_0.password,
2026-08-24 17:04:16.102 |         c1_0.risk_profile,
2026-08-24 17:04:16.102 |         c1_0.role,
2026-08-24 17:04:16.102 |         c1_0.source_of_funds 
2026-08-24 17:04:16.102 |     from
2026-08-24 17:04:16.102 |         customers c1_0 
2026-08-24 17:04:16.102 |     where
2026-08-24 17:04:16.102 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:16.231 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: 68a5bc6d-c984-4a47-bbe6-5b6bcda92e86] - 
2026-08-24 17:04:16.231 |     update
2026-08-24 17:04:16.231 |         customers 
2026-08-24 17:04:16.231 |     set
2026-08-24 17:04:16.231 |         email=?,
2026-08-24 17:04:16.231 |         employment_status=?,
2026-08-24 17:04:16.231 |         first_name=?,
2026-08-24 17:04:16.231 |         job_title=?,
2026-08-24 17:04:16.231 |         kyc_status=?,
2026-08-24 17:04:16.231 |         last_name=?,
2026-08-24 17:04:16.231 |         locked=?,
2026-08-24 17:04:16.231 |         monthly_income=?,
2026-08-24 17:04:16.231 |         password=?,
2026-08-24 17:04:16.231 |         risk_profile=?,
2026-08-24 17:04:16.231 |         role=?,
2026-08-24 17:04:16.231 |         source_of_funds=? 
2026-08-24 17:04:16.231 |     where
2026-08-24 17:04:16.231 |         id=?
2026-08-24 17:04:16.231 | Hibernate: 
2026-08-24 17:04:16.231 |     update
2026-08-24 17:04:16.231 |         customers 
2026-08-24 17:04:16.231 |     set
2026-08-24 17:04:16.231 |         email=?,
2026-08-24 17:04:16.231 |         employment_status=?,
2026-08-24 17:04:16.231 |         first_name=?,
2026-08-24 17:04:16.231 |         job_title=?,
2026-08-24 17:04:16.231 |         kyc_status=?,
2026-08-24 17:04:16.231 |         last_name=?,
2026-08-24 17:04:16.231 |         locked=?,
2026-08-24 17:04:16.231 |         monthly_income=?,
2026-08-24 17:04:16.231 |         password=?,
2026-08-24 17:04:16.231 |         risk_profile=?,
2026-08-24 17:04:16.231 |         role=?,
2026-08-24 17:04:16.231 |         source_of_funds=? 
2026-08-24 17:04:16.231 |     where
2026-08-24 17:04:16.231 |         id=?
2026-08-24 17:04:16.255 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 68a5bc6d-c984-4a47-bbe6-5b6bcda92e86] - [HTTP LOG] POST /api/v1/auth/reset-password - Status: 200 - Duration: 173ms
2026-08-24 17:04:16.257 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:16.257 |     insert 
2026-08-24 17:04:16.257 |     into
2026-08-24 17:04:16.257 |         api_audit_events
2026-08-24 17:04:16.257 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:16.257 |     values
2026-08-24 17:04:16.257 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:16.257 | Hibernate: 
2026-08-24 17:04:16.257 |     insert 
2026-08-24 17:04:16.257 |     into
2026-08-24 17:04:16.257 |         api_audit_events
2026-08-24 17:04:16.257 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:16.257 |     values
2026-08-24 17:04:16.257 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:16.269 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/reset-password → 200 | stage=COMPLETED | keyId=null | acct=null | latency=177ms
2026-08-24 17:04:16.757 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:04:16.758 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:04:16.759 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 8fb9f4c9-e814-41a3-8bd0-01b543149072] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:16.766 | 2026-08-24 09:04:16 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 8fb9f4c9-e814-41a3-8bd0-01b543149072] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:04:19.106 | 2026-08-24 09:04:19 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:19.106 |     SELECT
2026-08-24 17:04:19.106 |         o1.* 
2026-08-24 17:04:19.106 |     FROM
2026-08-24 17:04:19.106 |         payment_event_outbox o1 
2026-08-24 17:04:19.106 |     WHERE
2026-08-24 17:04:19.106 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:19.106 |         AND (
2026-08-24 17:04:19.106 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:19.106 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:19.106 |         )   
2026-08-24 17:04:19.106 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:19.106 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:19.106 |             1 
2026-08-24 17:04:19.106 |         FROM
2026-08-24 17:04:19.106 |             payment_event_outbox o2       
2026-08-24 17:04:19.106 |         WHERE
2026-08-24 17:04:19.106 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:19.106 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:19.106 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:19.106 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:19.106 |     ORDER BY
2026-08-24 17:04:19.106 |         o1.created_at ASC 
2026-08-24 17:04:19.106 |     LIMIT
2026-08-24 17:04:19.106 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:19.106 | Hibernate: 
2026-08-24 17:04:19.106 |     SELECT
2026-08-24 17:04:19.106 |         o1.* 
2026-08-24 17:04:19.106 |     FROM
2026-08-24 17:04:19.106 |         payment_event_outbox o1 
2026-08-24 17:04:19.106 |     WHERE
2026-08-24 17:04:19.106 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:19.106 |         AND (
2026-08-24 17:04:19.106 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:19.106 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:19.106 |         )   
2026-08-24 17:04:19.106 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:19.106 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:19.106 |             1 
2026-08-24 17:04:19.106 |         FROM
2026-08-24 17:04:19.106 |             payment_event_outbox o2       
2026-08-24 17:04:19.106 |         WHERE
2026-08-24 17:04:19.106 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:19.106 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:19.106 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:19.106 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:19.106 |     ORDER BY
2026-08-24 17:04:19.106 |         o1.created_at ASC 
2026-08-24 17:04:19.106 |     LIMIT
2026-08-24 17:04:19.106 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:24.114 | 2026-08-24 09:04:24 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:24.114 |     SELECT
2026-08-24 17:04:24.114 |         o1.* 
2026-08-24 17:04:24.114 |     FROM
2026-08-24 17:04:24.114 |         payment_event_outbox o1 
2026-08-24 17:04:24.114 |     WHERE
2026-08-24 17:04:24.114 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:24.114 |         AND (
2026-08-24 17:04:24.114 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:24.114 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:24.114 |         )   
2026-08-24 17:04:24.114 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:24.114 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:24.114 |             1 
2026-08-24 17:04:24.114 |         FROM
2026-08-24 17:04:24.114 |             payment_event_outbox o2       
2026-08-24 17:04:24.114 |         WHERE
2026-08-24 17:04:24.114 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:24.114 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:24.114 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:24.114 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:24.114 |     ORDER BY
2026-08-24 17:04:24.114 |         o1.created_at ASC 
2026-08-24 17:04:24.114 |     LIMIT
2026-08-24 17:04:24.115 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:24.115 | Hibernate: 
2026-08-24 17:04:24.115 |     SELECT
2026-08-24 17:04:24.115 |         o1.* 
2026-08-24 17:04:24.115 |     FROM
2026-08-24 17:04:24.115 |         payment_event_outbox o1 
2026-08-24 17:04:24.115 |     WHERE
2026-08-24 17:04:24.115 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:24.115 |         AND (
2026-08-24 17:04:24.115 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:24.115 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:24.115 |         )   
2026-08-24 17:04:24.115 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:24.115 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:24.115 |             1 
2026-08-24 17:04:24.115 |         FROM
2026-08-24 17:04:24.115 |             payment_event_outbox o2       
2026-08-24 17:04:24.115 |         WHERE
2026-08-24 17:04:24.115 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:24.115 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:24.115 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:24.115 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:24.115 |     ORDER BY
2026-08-24 17:04:24.115 |         o1.created_at ASC 
2026-08-24 17:04:24.115 |     LIMIT
2026-08-24 17:04:24.115 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:26.201 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:04:26.202 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 3d2710a7-8a50-48d4-a650-95087282c5f1] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:26.203 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 3d2710a7-8a50-48d4-a650-95087282c5f1] - Secured POST /api/v1/auth/login
2026-08-24 17:04:26.208 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 3d2710a7-8a50-48d4-a650-95087282c5f1] - 
2026-08-24 17:04:26.208 |     select
2026-08-24 17:04:26.208 |         c1_0.id,
2026-08-24 17:04:26.208 |         c1_0.created_at,
2026-08-24 17:04:26.208 |         c1_0.email,
2026-08-24 17:04:26.208 |         c1_0.employment_status,
2026-08-24 17:04:26.208 |         c1_0.first_name,
2026-08-24 17:04:26.208 |         c1_0.job_title,
2026-08-24 17:04:26.208 |         c1_0.kyc_status,
2026-08-24 17:04:26.208 |         c1_0.last_name,
2026-08-24 17:04:26.208 |         c1_0.locked,
2026-08-24 17:04:26.208 |         c1_0.monthly_income,
2026-08-24 17:04:26.208 |         c1_0.password,
2026-08-24 17:04:26.208 |         c1_0.risk_profile,
2026-08-24 17:04:26.208 |         c1_0.role,
2026-08-24 17:04:26.208 |         c1_0.source_of_funds 
2026-08-24 17:04:26.208 |     from
2026-08-24 17:04:26.208 |         customers c1_0 
2026-08-24 17:04:26.208 |     where
2026-08-24 17:04:26.208 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:26.208 | Hibernate: 
2026-08-24 17:04:26.208 |     select
2026-08-24 17:04:26.208 |         c1_0.id,
2026-08-24 17:04:26.208 |         c1_0.created_at,
2026-08-24 17:04:26.208 |         c1_0.email,
2026-08-24 17:04:26.208 |         c1_0.employment_status,
2026-08-24 17:04:26.208 |         c1_0.first_name,
2026-08-24 17:04:26.208 |         c1_0.job_title,
2026-08-24 17:04:26.208 |         c1_0.kyc_status,
2026-08-24 17:04:26.208 |         c1_0.last_name,
2026-08-24 17:04:26.208 |         c1_0.locked,
2026-08-24 17:04:26.208 |         c1_0.monthly_income,
2026-08-24 17:04:26.208 |         c1_0.password,
2026-08-24 17:04:26.208 |         c1_0.risk_profile,
2026-08-24 17:04:26.208 |         c1_0.role,
2026-08-24 17:04:26.208 |         c1_0.source_of_funds 
2026-08-24 17:04:26.208 |     from
2026-08-24 17:04:26.208 |         customers c1_0 
2026-08-24 17:04:26.208 |     where
2026-08-24 17:04:26.208 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:26.306 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 3d2710a7-8a50-48d4-a650-95087282c5f1] - Authenticated user
2026-08-24 17:04:26.310 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 3d2710a7-8a50-48d4-a650-95087282c5f1] - 
2026-08-24 17:04:26.310 |     select
2026-08-24 17:04:26.310 |         c1_0.id,
2026-08-24 17:04:26.310 |         c1_0.created_at,
2026-08-24 17:04:26.310 |         c1_0.email,
2026-08-24 17:04:26.310 |         c1_0.employment_status,
2026-08-24 17:04:26.310 |         c1_0.first_name,
2026-08-24 17:04:26.310 |         c1_0.job_title,
2026-08-24 17:04:26.310 |         c1_0.kyc_status,
2026-08-24 17:04:26.310 |         c1_0.last_name,
2026-08-24 17:04:26.310 |         c1_0.locked,
2026-08-24 17:04:26.310 |         c1_0.monthly_income,
2026-08-24 17:04:26.310 |         c1_0.password,
2026-08-24 17:04:26.310 |         c1_0.risk_profile,
2026-08-24 17:04:26.310 |         c1_0.role,
2026-08-24 17:04:26.310 |         c1_0.source_of_funds 
2026-08-24 17:04:26.310 |     from
2026-08-24 17:04:26.310 |         customers c1_0 
2026-08-24 17:04:26.310 |     where
2026-08-24 17:04:26.310 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:26.310 | Hibernate: 
2026-08-24 17:04:26.310 |     select
2026-08-24 17:04:26.310 |         c1_0.id,
2026-08-24 17:04:26.310 |         c1_0.created_at,
2026-08-24 17:04:26.310 |         c1_0.email,
2026-08-24 17:04:26.310 |         c1_0.employment_status,
2026-08-24 17:04:26.310 |         c1_0.first_name,
2026-08-24 17:04:26.310 |         c1_0.job_title,
2026-08-24 17:04:26.310 |         c1_0.kyc_status,
2026-08-24 17:04:26.310 |         c1_0.last_name,
2026-08-24 17:04:26.310 |         c1_0.locked,
2026-08-24 17:04:26.310 |         c1_0.monthly_income,
2026-08-24 17:04:26.310 |         c1_0.password,
2026-08-24 17:04:26.310 |         c1_0.risk_profile,
2026-08-24 17:04:26.310 |         c1_0.role,
2026-08-24 17:04:26.310 |         c1_0.source_of_funds 
2026-08-24 17:04:26.310 |     from
2026-08-24 17:04:26.310 |         customers c1_0 
2026-08-24 17:04:26.310 |     where
2026-08-24 17:04:26.310 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:26.366 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 3d2710a7-8a50-48d4-a650-95087282c5f1] - [HTTP LOG] POST /api/v1/auth/login - Status: 200 - Duration: 162ms
2026-08-24 17:04:26.369 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:26.369 |     insert 
2026-08-24 17:04:26.369 |     into
2026-08-24 17:04:26.369 |         api_audit_events
2026-08-24 17:04:26.369 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:26.369 |     values
2026-08-24 17:04:26.369 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:26.369 | Hibernate: 
2026-08-24 17:04:26.369 |     insert 
2026-08-24 17:04:26.369 |     into
2026-08-24 17:04:26.369 |         api_audit_events
2026-08-24 17:04:26.369 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:26.369 |     values
2026-08-24 17:04:26.369 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:26.380 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 200 | stage=COMPLETED | keyId=null | acct=null | latency=168ms
2026-08-24 17:04:26.879 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:04:26.881 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:04:26.882 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b8e0ff3a-18b5-48bd-afbf-030a3c89731c] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:26.888 | 2026-08-24 09:04:26 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b8e0ff3a-18b5-48bd-afbf-030a3c89731c] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:04:27.041 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:04:27.078 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 5ac9d7ff-571d-44a1-8de2-73aec5eddbfa] - 
2026-08-24 17:04:27.078 |     select
2026-08-24 17:04:27.078 |         c1_0.id,
2026-08-24 17:04:27.078 |         c1_0.created_at,
2026-08-24 17:04:27.078 |         c1_0.email,
2026-08-24 17:04:27.078 |         c1_0.employment_status,
2026-08-24 17:04:27.078 |         c1_0.first_name,
2026-08-24 17:04:27.078 |         c1_0.job_title,
2026-08-24 17:04:27.078 |         c1_0.kyc_status,
2026-08-24 17:04:27.078 |         c1_0.last_name,
2026-08-24 17:04:27.078 |         c1_0.locked,
2026-08-24 17:04:27.078 |         c1_0.monthly_income,
2026-08-24 17:04:27.078 |         c1_0.password,
2026-08-24 17:04:27.078 |         c1_0.risk_profile,
2026-08-24 17:04:27.078 |         c1_0.role,
2026-08-24 17:04:27.078 |         c1_0.source_of_funds 
2026-08-24 17:04:27.078 |     from
2026-08-24 17:04:27.078 |         customers c1_0 
2026-08-24 17:04:27.078 |     where
2026-08-24 17:04:27.078 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.078 | Hibernate: 
2026-08-24 17:04:27.078 |     select
2026-08-24 17:04:27.078 |         c1_0.id,
2026-08-24 17:04:27.078 |         c1_0.created_at,
2026-08-24 17:04:27.078 |         c1_0.email,
2026-08-24 17:04:27.078 |         c1_0.employment_status,
2026-08-24 17:04:27.078 |         c1_0.first_name,
2026-08-24 17:04:27.078 |         c1_0.job_title,
2026-08-24 17:04:27.078 |         c1_0.kyc_status,
2026-08-24 17:04:27.078 |         c1_0.last_name,
2026-08-24 17:04:27.078 |         c1_0.locked,
2026-08-24 17:04:27.078 |         c1_0.monthly_income,
2026-08-24 17:04:27.078 |         c1_0.password,
2026-08-24 17:04:27.078 |         c1_0.risk_profile,
2026-08-24 17:04:27.078 |         c1_0.role,
2026-08-24 17:04:27.078 |         c1_0.source_of_funds 
2026-08-24 17:04:27.078 |     from
2026-08-24 17:04:27.078 |         customers c1_0 
2026-08-24 17:04:27.078 |     where
2026-08-24 17:04:27.078 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.091 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 5ac9d7ff-571d-44a1-8de2-73aec5eddbfa] - Secured GET /api/v1/accounts
2026-08-24 17:04:27.096 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 5ac9d7ff-571d-44a1-8de2-73aec5eddbfa] - 
2026-08-24 17:04:27.096 |     select
2026-08-24 17:04:27.096 |         c1_0.id,
2026-08-24 17:04:27.096 |         c1_0.created_at,
2026-08-24 17:04:27.096 |         c1_0.email,
2026-08-24 17:04:27.096 |         c1_0.employment_status,
2026-08-24 17:04:27.096 |         c1_0.first_name,
2026-08-24 17:04:27.096 |         c1_0.job_title,
2026-08-24 17:04:27.096 |         c1_0.kyc_status,
2026-08-24 17:04:27.096 |         c1_0.last_name,
2026-08-24 17:04:27.096 |         c1_0.locked,
2026-08-24 17:04:27.096 |         c1_0.monthly_income,
2026-08-24 17:04:27.096 |         c1_0.password,
2026-08-24 17:04:27.096 |         c1_0.risk_profile,
2026-08-24 17:04:27.096 |         c1_0.role,
2026-08-24 17:04:27.096 |         c1_0.source_of_funds 
2026-08-24 17:04:27.096 |     from
2026-08-24 17:04:27.096 |         customers c1_0 
2026-08-24 17:04:27.096 |     where
2026-08-24 17:04:27.096 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.096 | Hibernate: 
2026-08-24 17:04:27.096 |     select
2026-08-24 17:04:27.096 |         c1_0.id,
2026-08-24 17:04:27.096 |         c1_0.created_at,
2026-08-24 17:04:27.096 |         c1_0.email,
2026-08-24 17:04:27.096 |         c1_0.employment_status,
2026-08-24 17:04:27.096 |         c1_0.first_name,
2026-08-24 17:04:27.096 |         c1_0.job_title,
2026-08-24 17:04:27.096 |         c1_0.kyc_status,
2026-08-24 17:04:27.096 |         c1_0.last_name,
2026-08-24 17:04:27.096 |         c1_0.locked,
2026-08-24 17:04:27.096 |         c1_0.monthly_income,
2026-08-24 17:04:27.096 |         c1_0.password,
2026-08-24 17:04:27.096 |         c1_0.risk_profile,
2026-08-24 17:04:27.096 |         c1_0.role,
2026-08-24 17:04:27.096 |         c1_0.source_of_funds 
2026-08-24 17:04:27.096 |     from
2026-08-24 17:04:27.096 |         customers c1_0 
2026-08-24 17:04:27.096 |     where
2026-08-24 17:04:27.096 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.104 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 5ac9d7ff-571d-44a1-8de2-73aec5eddbfa] - 
2026-08-24 17:04:27.104 |     select
2026-08-24 17:04:27.104 |         a1_0.id,
2026-08-24 17:04:27.104 |         a1_0.account_name,
2026-08-24 17:04:27.104 |         a1_0.account_number,
2026-08-24 17:04:27.104 |         a1_0.account_type,
2026-08-24 17:04:27.104 |         a1_0.allow_incoming,
2026-08-24 17:04:27.104 |         a1_0.allow_outgoing,
2026-08-24 17:04:27.104 |         a1_0.balance,
2026-08-24 17:04:27.104 |         a1_0.card_cvv,
2026-08-24 17:04:27.104 |         a1_0.card_expiry,
2026-08-24 17:04:27.104 |         a1_0.created_at,
2026-08-24 17:04:27.104 |         a1_0.currency,
2026-08-24 17:04:27.104 |         a1_0.customer_id,
2026-08-24 17:04:27.104 |         a1_0.daily_limit,
2026-08-24 17:04:27.104 |         a1_0.frozen,
2026-08-24 17:04:27.104 |         a1_0.monthly_limit,
2026-08-24 17:04:27.104 |         a1_0.parent_account_id,
2026-08-24 17:04:27.104 |         a1_0.require_dual_approval,
2026-08-24 17:04:27.104 |         a1_0.status,
2026-08-24 17:04:27.104 |         a1_0.swift_code,
2026-08-24 17:04:27.104 |         a1_0.updated_at,
2026-08-24 17:04:27.104 |         a1_0.version 
2026-08-24 17:04:27.104 |     from
2026-08-24 17:04:27.104 |         accounts a1_0 
2026-08-24 17:04:27.104 |     where
2026-08-24 17:04:27.104 |         a1_0.customer_id=?
2026-08-24 17:04:27.104 | Hibernate: 
2026-08-24 17:04:27.104 |     select
2026-08-24 17:04:27.104 |         a1_0.id,
2026-08-24 17:04:27.104 |         a1_0.account_name,
2026-08-24 17:04:27.104 |         a1_0.account_number,
2026-08-24 17:04:27.104 |         a1_0.account_type,
2026-08-24 17:04:27.104 |         a1_0.allow_incoming,
2026-08-24 17:04:27.104 |         a1_0.allow_outgoing,
2026-08-24 17:04:27.104 |         a1_0.balance,
2026-08-24 17:04:27.104 |         a1_0.card_cvv,
2026-08-24 17:04:27.104 |         a1_0.card_expiry,
2026-08-24 17:04:27.104 |         a1_0.created_at,
2026-08-24 17:04:27.104 |         a1_0.currency,
2026-08-24 17:04:27.104 |         a1_0.customer_id,
2026-08-24 17:04:27.104 |         a1_0.daily_limit,
2026-08-24 17:04:27.104 |         a1_0.frozen,
2026-08-24 17:04:27.104 |         a1_0.monthly_limit,
2026-08-24 17:04:27.104 |         a1_0.parent_account_id,
2026-08-24 17:04:27.104 |         a1_0.require_dual_approval,
2026-08-24 17:04:27.104 |         a1_0.status,
2026-08-24 17:04:27.104 |         a1_0.swift_code,
2026-08-24 17:04:27.104 |         a1_0.updated_at,
2026-08-24 17:04:27.104 |         a1_0.version 
2026-08-24 17:04:27.104 |     from
2026-08-24 17:04:27.104 |         accounts a1_0 
2026-08-24 17:04:27.104 |     where
2026-08-24 17:04:27.104 |         a1_0.customer_id=?
2026-08-24 17:04:27.130 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 5ac9d7ff-571d-44a1-8de2-73aec5eddbfa] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 39ms
2026-08-24 17:04:27.132 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:27.132 |     insert 
2026-08-24 17:04:27.132 |     into
2026-08-24 17:04:27.132 |         api_audit_events
2026-08-24 17:04:27.132 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:27.132 |     values
2026-08-24 17:04:27.132 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:27.132 | Hibernate: 
2026-08-24 17:04:27.132 |     insert 
2026-08-24 17:04:27.132 |     into
2026-08-24 17:04:27.132 |         api_audit_events
2026-08-24 17:04:27.132 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:27.132 |     values
2026-08-24 17:04:27.132 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:27.154 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=90ms
2026-08-24 17:04:27.276 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:04:27.282 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: 1cae36b1-4e89-4a0a-9a3a-feb32cdec267] - 
2026-08-24 17:04:27.282 |     select
2026-08-24 17:04:27.282 |         c1_0.id,
2026-08-24 17:04:27.282 |         c1_0.created_at,
2026-08-24 17:04:27.282 |         c1_0.email,
2026-08-24 17:04:27.282 |         c1_0.employment_status,
2026-08-24 17:04:27.282 |         c1_0.first_name,
2026-08-24 17:04:27.282 |         c1_0.job_title,
2026-08-24 17:04:27.282 |         c1_0.kyc_status,
2026-08-24 17:04:27.282 |         c1_0.last_name,
2026-08-24 17:04:27.282 |         c1_0.locked,
2026-08-24 17:04:27.282 |         c1_0.monthly_income,
2026-08-24 17:04:27.282 |         c1_0.password,
2026-08-24 17:04:27.282 |         c1_0.risk_profile,
2026-08-24 17:04:27.282 |         c1_0.role,
2026-08-24 17:04:27.282 |         c1_0.source_of_funds 
2026-08-24 17:04:27.282 |     from
2026-08-24 17:04:27.282 |         customers c1_0 
2026-08-24 17:04:27.282 |     where
2026-08-24 17:04:27.282 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.282 | Hibernate: 
2026-08-24 17:04:27.282 |     select
2026-08-24 17:04:27.282 |         c1_0.id,
2026-08-24 17:04:27.282 |         c1_0.created_at,
2026-08-24 17:04:27.282 |         c1_0.email,
2026-08-24 17:04:27.282 |         c1_0.employment_status,
2026-08-24 17:04:27.282 |         c1_0.first_name,
2026-08-24 17:04:27.282 |         c1_0.job_title,
2026-08-24 17:04:27.282 |         c1_0.kyc_status,
2026-08-24 17:04:27.282 |         c1_0.last_name,
2026-08-24 17:04:27.282 |         c1_0.locked,
2026-08-24 17:04:27.282 |         c1_0.monthly_income,
2026-08-24 17:04:27.282 |         c1_0.password,
2026-08-24 17:04:27.282 |         c1_0.risk_profile,
2026-08-24 17:04:27.282 |         c1_0.role,
2026-08-24 17:04:27.282 |         c1_0.source_of_funds 
2026-08-24 17:04:27.282 |     from
2026-08-24 17:04:27.282 |         customers c1_0 
2026-08-24 17:04:27.282 |     where
2026-08-24 17:04:27.282 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.293 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 1cae36b1-4e89-4a0a-9a3a-feb32cdec267] - Secured GET /api/v1/accounts
2026-08-24 17:04:27.297 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: 1cae36b1-4e89-4a0a-9a3a-feb32cdec267] - 
2026-08-24 17:04:27.297 |     select
2026-08-24 17:04:27.297 |         c1_0.id,
2026-08-24 17:04:27.297 |         c1_0.created_at,
2026-08-24 17:04:27.297 |         c1_0.email,
2026-08-24 17:04:27.297 |         c1_0.employment_status,
2026-08-24 17:04:27.297 |         c1_0.first_name,
2026-08-24 17:04:27.297 |         c1_0.job_title,
2026-08-24 17:04:27.297 |         c1_0.kyc_status,
2026-08-24 17:04:27.297 |         c1_0.last_name,
2026-08-24 17:04:27.297 |         c1_0.locked,
2026-08-24 17:04:27.297 |         c1_0.monthly_income,
2026-08-24 17:04:27.297 |         c1_0.password,
2026-08-24 17:04:27.297 |         c1_0.risk_profile,
2026-08-24 17:04:27.297 |         c1_0.role,
2026-08-24 17:04:27.297 |         c1_0.source_of_funds 
2026-08-24 17:04:27.297 |     from
2026-08-24 17:04:27.297 |         customers c1_0 
2026-08-24 17:04:27.297 |     where
2026-08-24 17:04:27.297 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.297 | Hibernate: 
2026-08-24 17:04:27.297 |     select
2026-08-24 17:04:27.297 |         c1_0.id,
2026-08-24 17:04:27.297 |         c1_0.created_at,
2026-08-24 17:04:27.297 |         c1_0.email,
2026-08-24 17:04:27.297 |         c1_0.employment_status,
2026-08-24 17:04:27.297 |         c1_0.first_name,
2026-08-24 17:04:27.297 |         c1_0.job_title,
2026-08-24 17:04:27.297 |         c1_0.kyc_status,
2026-08-24 17:04:27.297 |         c1_0.last_name,
2026-08-24 17:04:27.297 |         c1_0.locked,
2026-08-24 17:04:27.297 |         c1_0.monthly_income,
2026-08-24 17:04:27.297 |         c1_0.password,
2026-08-24 17:04:27.297 |         c1_0.risk_profile,
2026-08-24 17:04:27.297 |         c1_0.role,
2026-08-24 17:04:27.297 |         c1_0.source_of_funds 
2026-08-24 17:04:27.297 |     from
2026-08-24 17:04:27.297 |         customers c1_0 
2026-08-24 17:04:27.297 |     where
2026-08-24 17:04:27.297 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:27.304 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: 1cae36b1-4e89-4a0a-9a3a-feb32cdec267] - 
2026-08-24 17:04:27.304 |     select
2026-08-24 17:04:27.304 |         a1_0.id,
2026-08-24 17:04:27.304 |         a1_0.account_name,
2026-08-24 17:04:27.304 |         a1_0.account_number,
2026-08-24 17:04:27.304 |         a1_0.account_type,
2026-08-24 17:04:27.304 |         a1_0.allow_incoming,
2026-08-24 17:04:27.304 |         a1_0.allow_outgoing,
2026-08-24 17:04:27.304 |         a1_0.balance,
2026-08-24 17:04:27.304 |         a1_0.card_cvv,
2026-08-24 17:04:27.304 |         a1_0.card_expiry,
2026-08-24 17:04:27.304 |         a1_0.created_at,
2026-08-24 17:04:27.304 |         a1_0.currency,
2026-08-24 17:04:27.304 |         a1_0.customer_id,
2026-08-24 17:04:27.304 |         a1_0.daily_limit,
2026-08-24 17:04:27.304 |         a1_0.frozen,
2026-08-24 17:04:27.304 |         a1_0.monthly_limit,
2026-08-24 17:04:27.304 |         a1_0.parent_account_id,
2026-08-24 17:04:27.304 |         a1_0.require_dual_approval,
2026-08-24 17:04:27.304 |         a1_0.status,
2026-08-24 17:04:27.304 |         a1_0.swift_code,
2026-08-24 17:04:27.304 |         a1_0.updated_at,
2026-08-24 17:04:27.304 |         a1_0.version 
2026-08-24 17:04:27.304 |     from
2026-08-24 17:04:27.304 |         accounts a1_0 
2026-08-24 17:04:27.304 |     where
2026-08-24 17:04:27.304 |         a1_0.customer_id=?
2026-08-24 17:04:27.304 | Hibernate: 
2026-08-24 17:04:27.304 |     select
2026-08-24 17:04:27.304 |         a1_0.id,
2026-08-24 17:04:27.304 |         a1_0.account_name,
2026-08-24 17:04:27.304 |         a1_0.account_number,
2026-08-24 17:04:27.304 |         a1_0.account_type,
2026-08-24 17:04:27.304 |         a1_0.allow_incoming,
2026-08-24 17:04:27.304 |         a1_0.allow_outgoing,
2026-08-24 17:04:27.304 |         a1_0.balance,
2026-08-24 17:04:27.304 |         a1_0.card_cvv,
2026-08-24 17:04:27.304 |         a1_0.card_expiry,
2026-08-24 17:04:27.304 |         a1_0.created_at,
2026-08-24 17:04:27.304 |         a1_0.currency,
2026-08-24 17:04:27.304 |         a1_0.customer_id,
2026-08-24 17:04:27.304 |         a1_0.daily_limit,
2026-08-24 17:04:27.304 |         a1_0.frozen,
2026-08-24 17:04:27.304 |         a1_0.monthly_limit,
2026-08-24 17:04:27.304 |         a1_0.parent_account_id,
2026-08-24 17:04:27.304 |         a1_0.require_dual_approval,
2026-08-24 17:04:27.304 |         a1_0.status,
2026-08-24 17:04:27.304 |         a1_0.swift_code,
2026-08-24 17:04:27.304 |         a1_0.updated_at,
2026-08-24 17:04:27.304 |         a1_0.version 
2026-08-24 17:04:27.304 |     from
2026-08-24 17:04:27.304 |         accounts a1_0 
2026-08-24 17:04:27.304 |     where
2026-08-24 17:04:27.304 |         a1_0.customer_id=?
2026-08-24 17:04:27.312 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 1cae36b1-4e89-4a0a-9a3a-feb32cdec267] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 19ms
2026-08-24 17:04:27.314 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:27.314 |     insert 
2026-08-24 17:04:27.314 |     into
2026-08-24 17:04:27.314 |         api_audit_events
2026-08-24 17:04:27.314 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:27.314 |     values
2026-08-24 17:04:27.314 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:27.314 | Hibernate: 
2026-08-24 17:04:27.314 |     insert 
2026-08-24 17:04:27.314 |     into
2026-08-24 17:04:27.314 |         api_audit_events
2026-08-24 17:04:27.314 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:27.314 |     values
2026-08-24 17:04:27.314 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:27.327 | 2026-08-24 09:04:27 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=37ms
2026-08-24 17:04:29.122 | 2026-08-24 09:04:29 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:29.122 |     SELECT
2026-08-24 17:04:29.122 |         o1.* 
2026-08-24 17:04:29.122 |     FROM
2026-08-24 17:04:29.122 |         payment_event_outbox o1 
2026-08-24 17:04:29.122 |     WHERE
2026-08-24 17:04:29.122 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:29.122 |         AND (
2026-08-24 17:04:29.122 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:29.122 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:29.122 |         )   
2026-08-24 17:04:29.122 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:29.122 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:29.122 |             1 
2026-08-24 17:04:29.122 |         FROM
2026-08-24 17:04:29.122 |             payment_event_outbox o2       
2026-08-24 17:04:29.122 |         WHERE
2026-08-24 17:04:29.122 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:29.122 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:29.122 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:29.122 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:29.122 |     ORDER BY
2026-08-24 17:04:29.122 |         o1.created_at ASC 
2026-08-24 17:04:29.122 |     LIMIT
2026-08-24 17:04:29.122 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:29.122 | Hibernate: 
2026-08-24 17:04:29.122 |     SELECT
2026-08-24 17:04:29.122 |         o1.* 
2026-08-24 17:04:29.122 |     FROM
2026-08-24 17:04:29.122 |         payment_event_outbox o1 
2026-08-24 17:04:29.122 |     WHERE
2026-08-24 17:04:29.122 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:29.122 |         AND (
2026-08-24 17:04:29.122 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:29.122 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:29.122 |         )   
2026-08-24 17:04:29.122 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:29.122 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:29.122 |             1 
2026-08-24 17:04:29.123 |         FROM
2026-08-24 17:04:29.123 |             payment_event_outbox o2       
2026-08-24 17:04:29.123 |         WHERE
2026-08-24 17:04:29.123 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:29.123 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:29.123 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:29.123 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:29.123 |     ORDER BY
2026-08-24 17:04:29.123 |         o1.created_at ASC 
2026-08-24 17:04:29.123 |     LIMIT
2026-08-24 17:04:29.123 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:33.864 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:04:33.869 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 74933ffd-d9e9-46c9-86bc-c2977a21f353] - 
2026-08-24 17:04:33.869 |     select
2026-08-24 17:04:33.869 |         c1_0.id,
2026-08-24 17:04:33.869 |         c1_0.created_at,
2026-08-24 17:04:33.869 |         c1_0.email,
2026-08-24 17:04:33.869 |         c1_0.employment_status,
2026-08-24 17:04:33.869 |         c1_0.first_name,
2026-08-24 17:04:33.869 |         c1_0.job_title,
2026-08-24 17:04:33.869 |         c1_0.kyc_status,
2026-08-24 17:04:33.869 |         c1_0.last_name,
2026-08-24 17:04:33.869 |         c1_0.locked,
2026-08-24 17:04:33.869 |         c1_0.monthly_income,
2026-08-24 17:04:33.869 |         c1_0.password,
2026-08-24 17:04:33.869 |         c1_0.risk_profile,
2026-08-24 17:04:33.869 |         c1_0.role,
2026-08-24 17:04:33.869 |         c1_0.source_of_funds 
2026-08-24 17:04:33.869 |     from
2026-08-24 17:04:33.869 |         customers c1_0 
2026-08-24 17:04:33.869 |     where
2026-08-24 17:04:33.869 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:33.869 | Hibernate: 
2026-08-24 17:04:33.869 |     select
2026-08-24 17:04:33.869 |         c1_0.id,
2026-08-24 17:04:33.869 |         c1_0.created_at,
2026-08-24 17:04:33.869 |         c1_0.email,
2026-08-24 17:04:33.869 |         c1_0.employment_status,
2026-08-24 17:04:33.869 |         c1_0.first_name,
2026-08-24 17:04:33.869 |         c1_0.job_title,
2026-08-24 17:04:33.869 |         c1_0.kyc_status,
2026-08-24 17:04:33.869 |         c1_0.last_name,
2026-08-24 17:04:33.869 |         c1_0.locked,
2026-08-24 17:04:33.869 |         c1_0.monthly_income,
2026-08-24 17:04:33.869 |         c1_0.password,
2026-08-24 17:04:33.869 |         c1_0.risk_profile,
2026-08-24 17:04:33.869 |         c1_0.role,
2026-08-24 17:04:33.869 |         c1_0.source_of_funds 
2026-08-24 17:04:33.869 |     from
2026-08-24 17:04:33.869 |         customers c1_0 
2026-08-24 17:04:33.869 |     where
2026-08-24 17:04:33.870 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:33.880 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 74933ffd-d9e9-46c9-86bc-c2977a21f353] - Secured GET /api/v1/accounts
2026-08-24 17:04:33.884 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 74933ffd-d9e9-46c9-86bc-c2977a21f353] - 
2026-08-24 17:04:33.884 |     select
2026-08-24 17:04:33.884 |         c1_0.id,
2026-08-24 17:04:33.884 |         c1_0.created_at,
2026-08-24 17:04:33.884 |         c1_0.email,
2026-08-24 17:04:33.884 |         c1_0.employment_status,
2026-08-24 17:04:33.884 |         c1_0.first_name,
2026-08-24 17:04:33.884 |         c1_0.job_title,
2026-08-24 17:04:33.884 |         c1_0.kyc_status,
2026-08-24 17:04:33.884 |         c1_0.last_name,
2026-08-24 17:04:33.884 |         c1_0.locked,
2026-08-24 17:04:33.884 |         c1_0.monthly_income,
2026-08-24 17:04:33.884 |         c1_0.password,
2026-08-24 17:04:33.884 |         c1_0.risk_profile,
2026-08-24 17:04:33.884 |         c1_0.role,
2026-08-24 17:04:33.884 |         c1_0.source_of_funds 
2026-08-24 17:04:33.884 |     from
2026-08-24 17:04:33.884 |         customers c1_0 
2026-08-24 17:04:33.884 |     where
2026-08-24 17:04:33.884 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:33.884 | Hibernate: 
2026-08-24 17:04:33.884 |     select
2026-08-24 17:04:33.884 |         c1_0.id,
2026-08-24 17:04:33.884 |         c1_0.created_at,
2026-08-24 17:04:33.884 |         c1_0.email,
2026-08-24 17:04:33.884 |         c1_0.employment_status,
2026-08-24 17:04:33.884 |         c1_0.first_name,
2026-08-24 17:04:33.884 |         c1_0.job_title,
2026-08-24 17:04:33.884 |         c1_0.kyc_status,
2026-08-24 17:04:33.884 |         c1_0.last_name,
2026-08-24 17:04:33.884 |         c1_0.locked,
2026-08-24 17:04:33.884 |         c1_0.monthly_income,
2026-08-24 17:04:33.884 |         c1_0.password,
2026-08-24 17:04:33.884 |         c1_0.risk_profile,
2026-08-24 17:04:33.884 |         c1_0.role,
2026-08-24 17:04:33.884 |         c1_0.source_of_funds 
2026-08-24 17:04:33.884 |     from
2026-08-24 17:04:33.884 |         customers c1_0 
2026-08-24 17:04:33.884 |     where
2026-08-24 17:04:33.884 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:33.890 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 74933ffd-d9e9-46c9-86bc-c2977a21f353] - 
2026-08-24 17:04:33.890 |     select
2026-08-24 17:04:33.890 |         a1_0.id,
2026-08-24 17:04:33.890 |         a1_0.account_name,
2026-08-24 17:04:33.890 |         a1_0.account_number,
2026-08-24 17:04:33.890 |         a1_0.account_type,
2026-08-24 17:04:33.890 |         a1_0.allow_incoming,
2026-08-24 17:04:33.890 |         a1_0.allow_outgoing,
2026-08-24 17:04:33.890 |         a1_0.balance,
2026-08-24 17:04:33.890 |         a1_0.card_cvv,
2026-08-24 17:04:33.890 |         a1_0.card_expiry,
2026-08-24 17:04:33.890 |         a1_0.created_at,
2026-08-24 17:04:33.890 |         a1_0.currency,
2026-08-24 17:04:33.890 |         a1_0.customer_id,
2026-08-24 17:04:33.890 |         a1_0.daily_limit,
2026-08-24 17:04:33.890 |         a1_0.frozen,
2026-08-24 17:04:33.890 |         a1_0.monthly_limit,
2026-08-24 17:04:33.890 |         a1_0.parent_account_id,
2026-08-24 17:04:33.890 |         a1_0.require_dual_approval,
2026-08-24 17:04:33.890 |         a1_0.status,
2026-08-24 17:04:33.890 |         a1_0.swift_code,
2026-08-24 17:04:33.890 |         a1_0.updated_at,
2026-08-24 17:04:33.890 |         a1_0.version 
2026-08-24 17:04:33.890 |     from
2026-08-24 17:04:33.890 |         accounts a1_0 
2026-08-24 17:04:33.890 |     where
2026-08-24 17:04:33.890 |         a1_0.customer_id=?
2026-08-24 17:04:33.890 | Hibernate: 
2026-08-24 17:04:33.890 |     select
2026-08-24 17:04:33.890 |         a1_0.id,
2026-08-24 17:04:33.890 |         a1_0.account_name,
2026-08-24 17:04:33.890 |         a1_0.account_number,
2026-08-24 17:04:33.890 |         a1_0.account_type,
2026-08-24 17:04:33.890 |         a1_0.allow_incoming,
2026-08-24 17:04:33.890 |         a1_0.allow_outgoing,
2026-08-24 17:04:33.890 |         a1_0.balance,
2026-08-24 17:04:33.890 |         a1_0.card_cvv,
2026-08-24 17:04:33.890 |         a1_0.card_expiry,
2026-08-24 17:04:33.890 |         a1_0.created_at,
2026-08-24 17:04:33.890 |         a1_0.currency,
2026-08-24 17:04:33.890 |         a1_0.customer_id,
2026-08-24 17:04:33.890 |         a1_0.daily_limit,
2026-08-24 17:04:33.890 |         a1_0.frozen,
2026-08-24 17:04:33.890 |         a1_0.monthly_limit,
2026-08-24 17:04:33.890 |         a1_0.parent_account_id,
2026-08-24 17:04:33.890 |         a1_0.require_dual_approval,
2026-08-24 17:04:33.890 |         a1_0.status,
2026-08-24 17:04:33.890 |         a1_0.swift_code,
2026-08-24 17:04:33.890 |         a1_0.updated_at,
2026-08-24 17:04:33.890 |         a1_0.version 
2026-08-24 17:04:33.890 |     from
2026-08-24 17:04:33.890 |         accounts a1_0 
2026-08-24 17:04:33.890 |     where
2026-08-24 17:04:33.890 |         a1_0.customer_id=?
2026-08-24 17:04:33.898 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 74933ffd-d9e9-46c9-86bc-c2977a21f353] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 17ms
2026-08-24 17:04:33.901 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:33.901 |     insert 
2026-08-24 17:04:33.901 |     into
2026-08-24 17:04:33.901 |         api_audit_events
2026-08-24 17:04:33.901 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:33.901 |     values
2026-08-24 17:04:33.901 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:33.901 | Hibernate: 
2026-08-24 17:04:33.901 |     insert 
2026-08-24 17:04:33.901 |     into
2026-08-24 17:04:33.901 |         api_audit_events
2026-08-24 17:04:33.901 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:33.901 |     values
2026-08-24 17:04:33.901 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:33.923 | 2026-08-24 09:04:33 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=36ms
2026-08-24 17:04:34.067 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:04:34.076 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 4bebd788-5da1-4b51-9688-69d400d5f9b3] - 
2026-08-24 17:04:34.076 |     select
2026-08-24 17:04:34.076 |         c1_0.id,
2026-08-24 17:04:34.076 |         c1_0.created_at,
2026-08-24 17:04:34.076 |         c1_0.email,
2026-08-24 17:04:34.076 |         c1_0.employment_status,
2026-08-24 17:04:34.076 |         c1_0.first_name,
2026-08-24 17:04:34.076 |         c1_0.job_title,
2026-08-24 17:04:34.076 |         c1_0.kyc_status,
2026-08-24 17:04:34.076 |         c1_0.last_name,
2026-08-24 17:04:34.076 |         c1_0.locked,
2026-08-24 17:04:34.076 |         c1_0.monthly_income,
2026-08-24 17:04:34.076 |         c1_0.password,
2026-08-24 17:04:34.076 |         c1_0.risk_profile,
2026-08-24 17:04:34.076 |         c1_0.role,
2026-08-24 17:04:34.076 |         c1_0.source_of_funds 
2026-08-24 17:04:34.076 |     from
2026-08-24 17:04:34.076 |         customers c1_0 
2026-08-24 17:04:34.076 |     where
2026-08-24 17:04:34.076 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:34.076 | Hibernate: 
2026-08-24 17:04:34.076 |     select
2026-08-24 17:04:34.076 |         c1_0.id,
2026-08-24 17:04:34.076 |         c1_0.created_at,
2026-08-24 17:04:34.076 |         c1_0.email,
2026-08-24 17:04:34.076 |         c1_0.employment_status,
2026-08-24 17:04:34.076 |         c1_0.first_name,
2026-08-24 17:04:34.076 |         c1_0.job_title,
2026-08-24 17:04:34.076 |         c1_0.kyc_status,
2026-08-24 17:04:34.076 |         c1_0.last_name,
2026-08-24 17:04:34.076 |         c1_0.locked,
2026-08-24 17:04:34.076 |         c1_0.monthly_income,
2026-08-24 17:04:34.076 |         c1_0.password,
2026-08-24 17:04:34.076 |         c1_0.risk_profile,
2026-08-24 17:04:34.076 |         c1_0.role,
2026-08-24 17:04:34.076 |         c1_0.source_of_funds 
2026-08-24 17:04:34.076 |     from
2026-08-24 17:04:34.076 |         customers c1_0 
2026-08-24 17:04:34.076 |     where
2026-08-24 17:04:34.076 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:34.090 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 4bebd788-5da1-4b51-9688-69d400d5f9b3] - Secured GET /api/v1/accounts
2026-08-24 17:04:34.096 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 4bebd788-5da1-4b51-9688-69d400d5f9b3] - 
2026-08-24 17:04:34.096 |     select
2026-08-24 17:04:34.096 |         c1_0.id,
2026-08-24 17:04:34.096 |         c1_0.created_at,
2026-08-24 17:04:34.096 |         c1_0.email,
2026-08-24 17:04:34.096 |         c1_0.employment_status,
2026-08-24 17:04:34.096 |         c1_0.first_name,
2026-08-24 17:04:34.096 |         c1_0.job_title,
2026-08-24 17:04:34.096 |         c1_0.kyc_status,
2026-08-24 17:04:34.096 |         c1_0.last_name,
2026-08-24 17:04:34.096 |         c1_0.locked,
2026-08-24 17:04:34.096 |         c1_0.monthly_income,
2026-08-24 17:04:34.096 |         c1_0.password,
2026-08-24 17:04:34.096 |         c1_0.risk_profile,
2026-08-24 17:04:34.096 |         c1_0.role,
2026-08-24 17:04:34.096 |         c1_0.source_of_funds 
2026-08-24 17:04:34.096 |     from
2026-08-24 17:04:34.096 |         customers c1_0 
2026-08-24 17:04:34.096 |     where
2026-08-24 17:04:34.096 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:34.096 | Hibernate: 
2026-08-24 17:04:34.096 |     select
2026-08-24 17:04:34.096 |         c1_0.id,
2026-08-24 17:04:34.096 |         c1_0.created_at,
2026-08-24 17:04:34.096 |         c1_0.email,
2026-08-24 17:04:34.096 |         c1_0.employment_status,
2026-08-24 17:04:34.096 |         c1_0.first_name,
2026-08-24 17:04:34.096 |         c1_0.job_title,
2026-08-24 17:04:34.096 |         c1_0.kyc_status,
2026-08-24 17:04:34.096 |         c1_0.last_name,
2026-08-24 17:04:34.096 |         c1_0.locked,
2026-08-24 17:04:34.096 |         c1_0.monthly_income,
2026-08-24 17:04:34.096 |         c1_0.password,
2026-08-24 17:04:34.096 |         c1_0.risk_profile,
2026-08-24 17:04:34.096 |         c1_0.role,
2026-08-24 17:04:34.096 |         c1_0.source_of_funds 
2026-08-24 17:04:34.096 |     from
2026-08-24 17:04:34.096 |         customers c1_0 
2026-08-24 17:04:34.096 |     where
2026-08-24 17:04:34.096 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:34.103 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 4bebd788-5da1-4b51-9688-69d400d5f9b3] - 
2026-08-24 17:04:34.103 |     select
2026-08-24 17:04:34.103 |         a1_0.id,
2026-08-24 17:04:34.103 |         a1_0.account_name,
2026-08-24 17:04:34.103 |         a1_0.account_number,
2026-08-24 17:04:34.104 |         a1_0.account_type,
2026-08-24 17:04:34.104 |         a1_0.allow_incoming,
2026-08-24 17:04:34.104 |         a1_0.allow_outgoing,
2026-08-24 17:04:34.104 |         a1_0.balance,
2026-08-24 17:04:34.104 |         a1_0.card_cvv,
2026-08-24 17:04:34.104 |         a1_0.card_expiry,
2026-08-24 17:04:34.104 |         a1_0.created_at,
2026-08-24 17:04:34.104 |         a1_0.currency,
2026-08-24 17:04:34.104 |         a1_0.customer_id,
2026-08-24 17:04:34.104 |         a1_0.daily_limit,
2026-08-24 17:04:34.104 |         a1_0.frozen,
2026-08-24 17:04:34.104 |         a1_0.monthly_limit,
2026-08-24 17:04:34.104 |         a1_0.parent_account_id,
2026-08-24 17:04:34.104 |         a1_0.require_dual_approval,
2026-08-24 17:04:34.104 |         a1_0.status,
2026-08-24 17:04:34.104 |         a1_0.swift_code,
2026-08-24 17:04:34.104 |         a1_0.updated_at,
2026-08-24 17:04:34.104 |         a1_0.version 
2026-08-24 17:04:34.104 |     from
2026-08-24 17:04:34.104 |         accounts a1_0 
2026-08-24 17:04:34.104 |     where
2026-08-24 17:04:34.104 |         a1_0.customer_id=?
2026-08-24 17:04:34.104 | Hibernate: 
2026-08-24 17:04:34.104 |     select
2026-08-24 17:04:34.104 |         a1_0.id,
2026-08-24 17:04:34.104 |         a1_0.account_name,
2026-08-24 17:04:34.104 |         a1_0.account_number,
2026-08-24 17:04:34.104 |         a1_0.account_type,
2026-08-24 17:04:34.104 |         a1_0.allow_incoming,
2026-08-24 17:04:34.104 |         a1_0.allow_outgoing,
2026-08-24 17:04:34.104 |         a1_0.balance,
2026-08-24 17:04:34.104 |         a1_0.card_cvv,
2026-08-24 17:04:34.104 |         a1_0.card_expiry,
2026-08-24 17:04:34.104 |         a1_0.created_at,
2026-08-24 17:04:34.104 |         a1_0.currency,
2026-08-24 17:04:34.104 |         a1_0.customer_id,
2026-08-24 17:04:34.104 |         a1_0.daily_limit,
2026-08-24 17:04:34.104 |         a1_0.frozen,
2026-08-24 17:04:34.104 |         a1_0.monthly_limit,
2026-08-24 17:04:34.104 |         a1_0.parent_account_id,
2026-08-24 17:04:34.104 |         a1_0.require_dual_approval,
2026-08-24 17:04:34.104 |         a1_0.status,
2026-08-24 17:04:34.104 |         a1_0.swift_code,
2026-08-24 17:04:34.105 |         a1_0.updated_at,
2026-08-24 17:04:34.105 |         a1_0.version 
2026-08-24 17:04:34.105 |     from
2026-08-24 17:04:34.105 |         accounts a1_0 
2026-08-24 17:04:34.105 |     where
2026-08-24 17:04:34.105 |         a1_0.customer_id=?
2026-08-24 17:04:34.116 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 4bebd788-5da1-4b51-9688-69d400d5f9b3] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 25ms
2026-08-24 17:04:34.120 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:34.120 |     insert 
2026-08-24 17:04:34.120 |     into
2026-08-24 17:04:34.120 |         api_audit_events
2026-08-24 17:04:34.120 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:34.120 |     values
2026-08-24 17:04:34.120 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:34.120 | Hibernate: 
2026-08-24 17:04:34.120 |     insert 
2026-08-24 17:04:34.120 |     into
2026-08-24 17:04:34.120 |         api_audit_events
2026-08-24 17:04:34.120 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:34.120 |     values
2026-08-24 17:04:34.120 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:34.130 | 2026-08-24 09:04:34 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:34.130 |     SELECT
2026-08-24 17:04:34.130 |         o1.* 
2026-08-24 17:04:34.130 |     FROM
2026-08-24 17:04:34.130 |         payment_event_outbox o1 
2026-08-24 17:04:34.130 |     WHERE
2026-08-24 17:04:34.130 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:34.130 |         AND (
2026-08-24 17:04:34.130 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:34.130 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:34.130 |         )   
2026-08-24 17:04:34.130 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:34.130 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:34.130 |             1 
2026-08-24 17:04:34.130 |         FROM
2026-08-24 17:04:34.130 |             payment_event_outbox o2       
2026-08-24 17:04:34.130 |         WHERE
2026-08-24 17:04:34.130 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:34.130 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:34.130 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:34.130 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:34.130 |     ORDER BY
2026-08-24 17:04:34.130 |         o1.created_at ASC 
2026-08-24 17:04:34.130 |     LIMIT
2026-08-24 17:04:34.130 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:34.130 | Hibernate: 
2026-08-24 17:04:34.130 |     SELECT
2026-08-24 17:04:34.130 |         o1.* 
2026-08-24 17:04:34.130 |     FROM
2026-08-24 17:04:34.130 |         payment_event_outbox o1 
2026-08-24 17:04:34.130 |     WHERE
2026-08-24 17:04:34.130 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:34.130 |         AND (
2026-08-24 17:04:34.130 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:34.130 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:34.130 |         )   
2026-08-24 17:04:34.130 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:34.130 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:34.130 |             1 
2026-08-24 17:04:34.130 |         FROM
2026-08-24 17:04:34.130 |             payment_event_outbox o2       
2026-08-24 17:04:34.130 |         WHERE
2026-08-24 17:04:34.130 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:34.130 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:34.130 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:34.130 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:34.130 |     ORDER BY
2026-08-24 17:04:34.130 |         o1.created_at ASC 
2026-08-24 17:04:34.130 |     LIMIT
2026-08-24 17:04:34.130 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:34.135 | 2026-08-24 09:04:34 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=52ms
2026-08-24 17:04:35.888 | 2026-08-24 09:04:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/statements/account/4859228705057459
2026-08-24 17:04:35.895 | 2026-08-24 09:04:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 8e22afa1-6e09-4e07-b5f9-ec5a22a9e69e] - 
2026-08-24 17:04:35.895 |     select
2026-08-24 17:04:35.895 |         c1_0.id,
2026-08-24 17:04:35.895 |         c1_0.created_at,
2026-08-24 17:04:35.895 |         c1_0.email,
2026-08-24 17:04:35.895 |         c1_0.employment_status,
2026-08-24 17:04:35.895 |         c1_0.first_name,
2026-08-24 17:04:35.895 |         c1_0.job_title,
2026-08-24 17:04:35.895 |         c1_0.kyc_status,
2026-08-24 17:04:35.895 |         c1_0.last_name,
2026-08-24 17:04:35.895 |         c1_0.locked,
2026-08-24 17:04:35.895 |         c1_0.monthly_income,
2026-08-24 17:04:35.895 |         c1_0.password,
2026-08-24 17:04:35.895 |         c1_0.risk_profile,
2026-08-24 17:04:35.895 |         c1_0.role,
2026-08-24 17:04:35.895 |         c1_0.source_of_funds 
2026-08-24 17:04:35.895 |     from
2026-08-24 17:04:35.895 |         customers c1_0 
2026-08-24 17:04:35.895 |     where
2026-08-24 17:04:35.895 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:35.895 | Hibernate: 
2026-08-24 17:04:35.895 |     select
2026-08-24 17:04:35.895 |         c1_0.id,
2026-08-24 17:04:35.895 |         c1_0.created_at,
2026-08-24 17:04:35.895 |         c1_0.email,
2026-08-24 17:04:35.895 |         c1_0.employment_status,
2026-08-24 17:04:35.895 |         c1_0.first_name,
2026-08-24 17:04:35.895 |         c1_0.job_title,
2026-08-24 17:04:35.895 |         c1_0.kyc_status,
2026-08-24 17:04:35.895 |         c1_0.last_name,
2026-08-24 17:04:35.895 |         c1_0.locked,
2026-08-24 17:04:35.895 |         c1_0.monthly_income,
2026-08-24 17:04:35.895 |         c1_0.password,
2026-08-24 17:04:35.895 |         c1_0.risk_profile,
2026-08-24 17:04:35.895 |         c1_0.role,
2026-08-24 17:04:35.895 |         c1_0.source_of_funds 
2026-08-24 17:04:35.895 |     from
2026-08-24 17:04:35.895 |         customers c1_0 
2026-08-24 17:04:35.895 |     where
2026-08-24 17:04:35.895 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:35.905 | 2026-08-24 09:04:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 8e22afa1-6e09-4e07-b5f9-ec5a22a9e69e] - Secured GET /api/v1/statements/account/4859228705057459
2026-08-24 17:04:35.927 | 2026-08-24 09:04:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 8e22afa1-6e09-4e07-b5f9-ec5a22a9e69e] - 
2026-08-24 17:04:35.927 |     select
2026-08-24 17:04:35.927 |         s1_0.id,
2026-08-24 17:04:35.927 |         s1_0.account_number,
2026-08-24 17:04:35.927 |         s1_0.end_date,
2026-08-24 17:04:35.927 |         s1_0.generated_at,
2026-08-24 17:04:35.927 |         s1_0.pdf_storage_path,
2026-08-24 17:04:35.927 |         s1_0.start_date 
2026-08-24 17:04:35.927 |     from
2026-08-24 17:04:35.927 |         statements s1_0 
2026-08-24 17:04:35.927 |     where
2026-08-24 17:04:35.927 |         s1_0.account_number=?
2026-08-24 17:04:35.927 | Hibernate: 
2026-08-24 17:04:35.927 |     select
2026-08-24 17:04:35.927 |         s1_0.id,
2026-08-24 17:04:35.927 |         s1_0.account_number,
2026-08-24 17:04:35.927 |         s1_0.end_date,
2026-08-24 17:04:35.927 |         s1_0.generated_at,
2026-08-24 17:04:35.927 |         s1_0.pdf_storage_path,
2026-08-24 17:04:35.927 |         s1_0.start_date 
2026-08-24 17:04:35.927 |     from
2026-08-24 17:04:35.927 |         statements s1_0 
2026-08-24 17:04:35.927 |     where
2026-08-24 17:04:35.927 |         s1_0.account_number=?
2026-08-24 17:04:35.966 | 2026-08-24 09:04:35 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 8e22afa1-6e09-4e07-b5f9-ec5a22a9e69e] - [HTTP LOG] GET /api/v1/statements/account/4859228705057459 - Status: 200 - Duration: 60ms
2026-08-24 17:04:35.968 | 2026-08-24 09:04:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:35.969 |     insert 
2026-08-24 17:04:35.969 |     into
2026-08-24 17:04:35.969 |         api_audit_events
2026-08-24 17:04:35.969 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:35.969 |     values
2026-08-24 17:04:35.969 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:35.969 | Hibernate: 
2026-08-24 17:04:35.969 |     insert 
2026-08-24 17:04:35.969 |     into
2026-08-24 17:04:35.969 |         api_audit_events
2026-08-24 17:04:35.969 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:35.969 |     values
2026-08-24 17:04:35.969 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:35.981 | 2026-08-24 09:04:35 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/statements/account/4859228705057459 → 200 | stage=COMPLETED | keyId=null | acct=null | latency=80ms
2026-08-24 17:04:36.251 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/statements/account/4859228705057459
2026-08-24 17:04:36.259 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 3e347e41-062c-4e0c-a7fa-266f5a452cf0] - 
2026-08-24 17:04:36.259 |     select
2026-08-24 17:04:36.259 |         c1_0.id,
2026-08-24 17:04:36.259 |         c1_0.created_at,
2026-08-24 17:04:36.259 |         c1_0.email,
2026-08-24 17:04:36.259 |         c1_0.employment_status,
2026-08-24 17:04:36.259 |         c1_0.first_name,
2026-08-24 17:04:36.259 |         c1_0.job_title,
2026-08-24 17:04:36.259 |         c1_0.kyc_status,
2026-08-24 17:04:36.259 |         c1_0.last_name,
2026-08-24 17:04:36.259 |         c1_0.locked,
2026-08-24 17:04:36.259 |         c1_0.monthly_income,
2026-08-24 17:04:36.259 |         c1_0.password,
2026-08-24 17:04:36.259 |         c1_0.risk_profile,
2026-08-24 17:04:36.259 |         c1_0.role,
2026-08-24 17:04:36.259 |         c1_0.source_of_funds 
2026-08-24 17:04:36.259 |     from
2026-08-24 17:04:36.259 |         customers c1_0 
2026-08-24 17:04:36.259 |     where
2026-08-24 17:04:36.259 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:36.259 | Hibernate: 
2026-08-24 17:04:36.259 |     select
2026-08-24 17:04:36.259 |         c1_0.id,
2026-08-24 17:04:36.259 |         c1_0.created_at,
2026-08-24 17:04:36.259 |         c1_0.email,
2026-08-24 17:04:36.259 |         c1_0.employment_status,
2026-08-24 17:04:36.259 |         c1_0.first_name,
2026-08-24 17:04:36.259 |         c1_0.job_title,
2026-08-24 17:04:36.259 |         c1_0.kyc_status,
2026-08-24 17:04:36.259 |         c1_0.last_name,
2026-08-24 17:04:36.259 |         c1_0.locked,
2026-08-24 17:04:36.259 |         c1_0.monthly_income,
2026-08-24 17:04:36.259 |         c1_0.password,
2026-08-24 17:04:36.259 |         c1_0.risk_profile,
2026-08-24 17:04:36.259 |         c1_0.role,
2026-08-24 17:04:36.259 |         c1_0.source_of_funds 
2026-08-24 17:04:36.259 |     from
2026-08-24 17:04:36.259 |         customers c1_0 
2026-08-24 17:04:36.259 |     where
2026-08-24 17:04:36.259 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:36.273 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 3e347e41-062c-4e0c-a7fa-266f5a452cf0] - Secured GET /api/v1/statements/account/4859228705057459
2026-08-24 17:04:36.283 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 3e347e41-062c-4e0c-a7fa-266f5a452cf0] - 
2026-08-24 17:04:36.283 |     select
2026-08-24 17:04:36.283 |         s1_0.id,
2026-08-24 17:04:36.283 |         s1_0.account_number,
2026-08-24 17:04:36.283 |         s1_0.end_date,
2026-08-24 17:04:36.283 |         s1_0.generated_at,
2026-08-24 17:04:36.283 |         s1_0.pdf_storage_path,
2026-08-24 17:04:36.283 |         s1_0.start_date 
2026-08-24 17:04:36.283 |     from
2026-08-24 17:04:36.283 |         statements s1_0 
2026-08-24 17:04:36.283 |     where
2026-08-24 17:04:36.283 |         s1_0.account_number=?
2026-08-24 17:04:36.283 | Hibernate: 
2026-08-24 17:04:36.283 |     select
2026-08-24 17:04:36.283 |         s1_0.id,
2026-08-24 17:04:36.283 |         s1_0.account_number,
2026-08-24 17:04:36.283 |         s1_0.end_date,
2026-08-24 17:04:36.283 |         s1_0.generated_at,
2026-08-24 17:04:36.283 |         s1_0.pdf_storage_path,
2026-08-24 17:04:36.283 |         s1_0.start_date 
2026-08-24 17:04:36.283 |     from
2026-08-24 17:04:36.283 |         statements s1_0 
2026-08-24 17:04:36.283 |     where
2026-08-24 17:04:36.283 |         s1_0.account_number=?
2026-08-24 17:04:36.291 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 3e347e41-062c-4e0c-a7fa-266f5a452cf0] - [HTTP LOG] GET /api/v1/statements/account/4859228705057459 - Status: 200 - Duration: 17ms
2026-08-24 17:04:36.294 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:36.294 |     insert 
2026-08-24 17:04:36.294 |     into
2026-08-24 17:04:36.294 |         api_audit_events
2026-08-24 17:04:36.294 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:36.294 |     values
2026-08-24 17:04:36.294 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:36.294 | Hibernate: 
2026-08-24 17:04:36.294 |     insert 
2026-08-24 17:04:36.294 |     into
2026-08-24 17:04:36.294 |         api_audit_events
2026-08-24 17:04:36.294 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:36.294 |     values
2026-08-24 17:04:36.294 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:36.303 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/statements/account/4859228705057459 → 200 | stage=COMPLETED | keyId=null | acct=null | latency=42ms
2026-08-24 17:04:36.908 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/apikeys
2026-08-24 17:04:36.918 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: d32ce0d8-4410-44e3-af8e-1cb903a4d253] - 
2026-08-24 17:04:36.919 |     select
2026-08-24 17:04:36.919 |         c1_0.id,
2026-08-24 17:04:36.919 |         c1_0.created_at,
2026-08-24 17:04:36.919 |         c1_0.email,
2026-08-24 17:04:36.919 |         c1_0.employment_status,
2026-08-24 17:04:36.919 |         c1_0.first_name,
2026-08-24 17:04:36.919 |         c1_0.job_title,
2026-08-24 17:04:36.919 |         c1_0.kyc_status,
2026-08-24 17:04:36.919 |         c1_0.last_name,
2026-08-24 17:04:36.919 |         c1_0.locked,
2026-08-24 17:04:36.919 |         c1_0.monthly_income,
2026-08-24 17:04:36.919 |         c1_0.password,
2026-08-24 17:04:36.919 |         c1_0.risk_profile,
2026-08-24 17:04:36.919 |         c1_0.role,
2026-08-24 17:04:36.919 |         c1_0.source_of_funds 
2026-08-24 17:04:36.919 |     from
2026-08-24 17:04:36.919 |         customers c1_0 
2026-08-24 17:04:36.919 |     where
2026-08-24 17:04:36.919 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:36.919 | Hibernate: 
2026-08-24 17:04:36.919 |     select
2026-08-24 17:04:36.919 |         c1_0.id,
2026-08-24 17:04:36.919 |         c1_0.created_at,
2026-08-24 17:04:36.919 |         c1_0.email,
2026-08-24 17:04:36.919 |         c1_0.employment_status,
2026-08-24 17:04:36.919 |         c1_0.first_name,
2026-08-24 17:04:36.919 |         c1_0.job_title,
2026-08-24 17:04:36.919 |         c1_0.kyc_status,
2026-08-24 17:04:36.919 |         c1_0.last_name,
2026-08-24 17:04:36.919 |         c1_0.locked,
2026-08-24 17:04:36.919 |         c1_0.monthly_income,
2026-08-24 17:04:36.919 |         c1_0.password,
2026-08-24 17:04:36.919 |         c1_0.risk_profile,
2026-08-24 17:04:36.919 |         c1_0.role,
2026-08-24 17:04:36.919 |         c1_0.source_of_funds 
2026-08-24 17:04:36.919 |     from
2026-08-24 17:04:36.919 |         customers c1_0 
2026-08-24 17:04:36.919 |     where
2026-08-24 17:04:36.919 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:36.931 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: d32ce0d8-4410-44e3-af8e-1cb903a4d253] - Secured GET /api/v1/apikeys
2026-08-24 17:04:36.938 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: d32ce0d8-4410-44e3-af8e-1cb903a4d253] - 
2026-08-24 17:04:36.938 |     select
2026-08-24 17:04:36.938 |         akje1_0.id,
2026-08-24 17:04:36.938 |         akje1_0.cidr_whitelist,
2026-08-24 17:04:36.938 |         akje1_0.created_at,
2026-08-24 17:04:36.938 |         akje1_0.environment,
2026-08-24 17:04:36.938 |         akje1_0.expires_at,
2026-08-24 17:04:36.938 |         akje1_0.key_hash,
2026-08-24 17:04:36.938 |         akje1_0.key_prefix,
2026-08-24 17:04:36.938 |         akje1_0.last_used_at,
2026-08-24 17:04:36.938 |         akje1_0.linked_account_id,
2026-08-24 17:04:36.938 |         akje1_0.merchant_id,
2026-08-24 17:04:36.938 |         akje1_0.name,
2026-08-24 17:04:36.938 |         akje1_0.revoked_at,
2026-08-24 17:04:36.938 |         akje1_0.scopes 
2026-08-24 17:04:36.938 |     from
2026-08-24 17:04:36.938 |         api_keys akje1_0 
2026-08-24 17:04:36.938 |     where
2026-08-24 17:04:36.938 |         akje1_0.merchant_id=?
2026-08-24 17:04:36.938 | Hibernate: 
2026-08-24 17:04:36.938 |     select
2026-08-24 17:04:36.938 |         akje1_0.id,
2026-08-24 17:04:36.938 |         akje1_0.cidr_whitelist,
2026-08-24 17:04:36.938 |         akje1_0.created_at,
2026-08-24 17:04:36.938 |         akje1_0.environment,
2026-08-24 17:04:36.938 |         akje1_0.expires_at,
2026-08-24 17:04:36.938 |         akje1_0.key_hash,
2026-08-24 17:04:36.938 |         akje1_0.key_prefix,
2026-08-24 17:04:36.938 |         akje1_0.last_used_at,
2026-08-24 17:04:36.938 |         akje1_0.linked_account_id,
2026-08-24 17:04:36.938 |         akje1_0.merchant_id,
2026-08-24 17:04:36.938 |         akje1_0.name,
2026-08-24 17:04:36.938 |         akje1_0.revoked_at,
2026-08-24 17:04:36.938 |         akje1_0.scopes 
2026-08-24 17:04:36.938 |     from
2026-08-24 17:04:36.938 |         api_keys akje1_0 
2026-08-24 17:04:36.938 |     where
2026-08-24 17:04:36.938 |         akje1_0.merchant_id=?
2026-08-24 17:04:36.970 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d32ce0d8-4410-44e3-af8e-1cb903a4d253] - [HTTP LOG] GET /api/v1/apikeys - Status: 200 - Duration: 38ms
2026-08-24 17:04:36.973 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:36.973 |     insert 
2026-08-24 17:04:36.973 |     into
2026-08-24 17:04:36.973 |         api_audit_events
2026-08-24 17:04:36.973 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:36.973 |     values
2026-08-24 17:04:36.973 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:36.973 | Hibernate: 
2026-08-24 17:04:36.973 |     insert 
2026-08-24 17:04:36.973 |     into
2026-08-24 17:04:36.973 |         api_audit_events
2026-08-24 17:04:36.973 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:36.973 |     values
2026-08-24 17:04:36.973 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:36.985 | 2026-08-24 09:04:36 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/apikeys → 200 | stage=COMPLETED | keyId=null | acct=null | latency=63ms
2026-08-24 17:04:37.003 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:04:37.005 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:04:37.006 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: a7d6cd26-8070-4bae-80c1-3ce96796fe29] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:37.014 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: a7d6cd26-8070-4bae-80c1-3ce96796fe29] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 9ms
2026-08-24 17:04:37.021 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:04:37.022 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/webhooks
2026-08-24 17:04:37.028 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: 01cff503-a6b8-48c7-96bc-65df531d7807] - 
2026-08-24 17:04:37.028 |     select
2026-08-24 17:04:37.028 |         c1_0.id,
2026-08-24 17:04:37.028 |         c1_0.created_at,
2026-08-24 17:04:37.028 |         c1_0.email,
2026-08-24 17:04:37.028 |         c1_0.employment_status,
2026-08-24 17:04:37.028 |         c1_0.first_name,
2026-08-24 17:04:37.028 |         c1_0.job_title,
2026-08-24 17:04:37.028 |         c1_0.kyc_status,
2026-08-24 17:04:37.028 |         c1_0.last_name,
2026-08-24 17:04:37.028 |         c1_0.locked,
2026-08-24 17:04:37.028 |         c1_0.monthly_income,
2026-08-24 17:04:37.028 |         c1_0.password,
2026-08-24 17:04:37.028 |         c1_0.risk_profile,
2026-08-24 17:04:37.028 |         c1_0.role,
2026-08-24 17:04:37.029 |         c1_0.source_of_funds 
2026-08-24 17:04:37.029 |     from
2026-08-24 17:04:37.029 |         customers c1_0 
2026-08-24 17:04:37.029 |     where
2026-08-24 17:04:37.029 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.029 | Hibernate: 
2026-08-24 17:04:37.029 |     select
2026-08-24 17:04:37.029 |         c1_0.id,
2026-08-24 17:04:37.029 |         c1_0.created_at,
2026-08-24 17:04:37.029 |         c1_0.email,
2026-08-24 17:04:37.029 |         c1_0.employment_status,
2026-08-24 17:04:37.029 |         c1_0.first_name,
2026-08-24 17:04:37.029 |         c1_0.job_title,
2026-08-24 17:04:37.029 |         c1_0.kyc_status,
2026-08-24 17:04:37.029 |         c1_0.last_name,
2026-08-24 17:04:37.029 |         c1_0.locked,
2026-08-24 17:04:37.029 |         c1_0.monthly_income,
2026-08-24 17:04:37.029 |         c1_0.password,
2026-08-24 17:04:37.029 |         c1_0.risk_profile,
2026-08-24 17:04:37.029 |         c1_0.role,
2026-08-24 17:04:37.029 |         c1_0.source_of_funds 
2026-08-24 17:04:37.029 |     from
2026-08-24 17:04:37.029 |         customers c1_0 
2026-08-24 17:04:37.029 |     where
2026-08-24 17:04:37.029 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.029 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 7624d15b-d4d7-482a-a682-c5a522aac223] - 
2026-08-24 17:04:37.029 |     select
2026-08-24 17:04:37.029 |         c1_0.id,
2026-08-24 17:04:37.029 |         c1_0.created_at,
2026-08-24 17:04:37.029 |         c1_0.email,
2026-08-24 17:04:37.029 |         c1_0.employment_status,
2026-08-24 17:04:37.029 |         c1_0.first_name,
2026-08-24 17:04:37.029 |         c1_0.job_title,
2026-08-24 17:04:37.029 |         c1_0.kyc_status,
2026-08-24 17:04:37.029 |         c1_0.last_name,
2026-08-24 17:04:37.029 |         c1_0.locked,
2026-08-24 17:04:37.029 |         c1_0.monthly_income,
2026-08-24 17:04:37.029 |         c1_0.password,
2026-08-24 17:04:37.029 |         c1_0.risk_profile,
2026-08-24 17:04:37.029 |         c1_0.role,
2026-08-24 17:04:37.029 |         c1_0.source_of_funds 
2026-08-24 17:04:37.029 |     from
2026-08-24 17:04:37.029 |         customers c1_0 
2026-08-24 17:04:37.029 |     where
2026-08-24 17:04:37.029 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.029 | Hibernate: 
2026-08-24 17:04:37.029 |     select
2026-08-24 17:04:37.029 |         c1_0.id,
2026-08-24 17:04:37.029 |         c1_0.created_at,
2026-08-24 17:04:37.029 |         c1_0.email,
2026-08-24 17:04:37.029 |         c1_0.employment_status,
2026-08-24 17:04:37.029 |         c1_0.first_name,
2026-08-24 17:04:37.029 |         c1_0.job_title,
2026-08-24 17:04:37.029 |         c1_0.kyc_status,
2026-08-24 17:04:37.029 |         c1_0.last_name,
2026-08-24 17:04:37.029 |         c1_0.locked,
2026-08-24 17:04:37.029 |         c1_0.monthly_income,
2026-08-24 17:04:37.029 |         c1_0.password,
2026-08-24 17:04:37.029 |         c1_0.risk_profile,
2026-08-24 17:04:37.029 |         c1_0.role,
2026-08-24 17:04:37.029 |         c1_0.source_of_funds 
2026-08-24 17:04:37.029 |     from
2026-08-24 17:04:37.029 |         customers c1_0 
2026-08-24 17:04:37.029 |     where
2026-08-24 17:04:37.029 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.041 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 01cff503-a6b8-48c7-96bc-65df531d7807] - Secured GET /api/v1/webhooks
2026-08-24 17:04:37.044 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 7624d15b-d4d7-482a-a682-c5a522aac223] - Secured GET /api/v1/accounts
2026-08-24 17:04:37.048 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: 01cff503-a6b8-48c7-96bc-65df531d7807] - 
2026-08-24 17:04:37.048 |     select
2026-08-24 17:04:37.048 |         we1_0.id,
2026-08-24 17:04:37.048 |         we1_0.created_at,
2026-08-24 17:04:37.048 |         we1_0.environment,
2026-08-24 17:04:37.048 |         we1_0.events,
2026-08-24 17:04:37.048 |         we1_0.merchant_id,
2026-08-24 17:04:37.048 |         we1_0.secret_hash,
2026-08-24 17:04:37.048 |         we1_0.status,
2026-08-24 17:04:37.048 |         we1_0.updated_at,
2026-08-24 17:04:37.048 |         we1_0.url 
2026-08-24 17:04:37.048 |     from
2026-08-24 17:04:37.048 |         webhook_endpoints we1_0 
2026-08-24 17:04:37.048 |     where
2026-08-24 17:04:37.048 |         we1_0.merchant_id=?
2026-08-24 17:04:37.048 | Hibernate: 
2026-08-24 17:04:37.048 |     select
2026-08-24 17:04:37.048 |         we1_0.id,
2026-08-24 17:04:37.048 |         we1_0.created_at,
2026-08-24 17:04:37.048 |         we1_0.environment,
2026-08-24 17:04:37.048 |         we1_0.events,
2026-08-24 17:04:37.048 |         we1_0.merchant_id,
2026-08-24 17:04:37.048 |         we1_0.secret_hash,
2026-08-24 17:04:37.048 |         we1_0.status,
2026-08-24 17:04:37.048 |         we1_0.updated_at,
2026-08-24 17:04:37.048 |         we1_0.url 
2026-08-24 17:04:37.048 |     from
2026-08-24 17:04:37.048 |         webhook_endpoints we1_0 
2026-08-24 17:04:37.048 |     where
2026-08-24 17:04:37.048 |         we1_0.merchant_id=?
2026-08-24 17:04:37.050 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 7624d15b-d4d7-482a-a682-c5a522aac223] - 
2026-08-24 17:04:37.050 |     select
2026-08-24 17:04:37.050 |         c1_0.id,
2026-08-24 17:04:37.050 |         c1_0.created_at,
2026-08-24 17:04:37.050 |         c1_0.email,
2026-08-24 17:04:37.050 |         c1_0.employment_status,
2026-08-24 17:04:37.050 |         c1_0.first_name,
2026-08-24 17:04:37.050 |         c1_0.job_title,
2026-08-24 17:04:37.050 |         c1_0.kyc_status,
2026-08-24 17:04:37.050 |         c1_0.last_name,
2026-08-24 17:04:37.050 |         c1_0.locked,
2026-08-24 17:04:37.050 |         c1_0.monthly_income,
2026-08-24 17:04:37.050 |         c1_0.password,
2026-08-24 17:04:37.050 |         c1_0.risk_profile,
2026-08-24 17:04:37.050 |         c1_0.role,
2026-08-24 17:04:37.050 |         c1_0.source_of_funds 
2026-08-24 17:04:37.050 |     from
2026-08-24 17:04:37.050 |         customers c1_0 
2026-08-24 17:04:37.050 |     where
2026-08-24 17:04:37.050 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.050 | Hibernate: 
2026-08-24 17:04:37.050 |     select
2026-08-24 17:04:37.050 |         c1_0.id,
2026-08-24 17:04:37.050 |         c1_0.created_at,
2026-08-24 17:04:37.050 |         c1_0.email,
2026-08-24 17:04:37.050 |         c1_0.employment_status,
2026-08-24 17:04:37.050 |         c1_0.first_name,
2026-08-24 17:04:37.050 |         c1_0.job_title,
2026-08-24 17:04:37.050 |         c1_0.kyc_status,
2026-08-24 17:04:37.050 |         c1_0.last_name,
2026-08-24 17:04:37.050 |         c1_0.locked,
2026-08-24 17:04:37.050 |         c1_0.monthly_income,
2026-08-24 17:04:37.050 |         c1_0.password,
2026-08-24 17:04:37.050 |         c1_0.risk_profile,
2026-08-24 17:04:37.050 |         c1_0.role,
2026-08-24 17:04:37.050 |         c1_0.source_of_funds 
2026-08-24 17:04:37.050 |     from
2026-08-24 17:04:37.050 |         customers c1_0 
2026-08-24 17:04:37.050 |     where
2026-08-24 17:04:37.050 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.058 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 7624d15b-d4d7-482a-a682-c5a522aac223] - 
2026-08-24 17:04:37.058 |     select
2026-08-24 17:04:37.058 |         a1_0.id,
2026-08-24 17:04:37.058 |         a1_0.account_name,
2026-08-24 17:04:37.058 |         a1_0.account_number,
2026-08-24 17:04:37.058 |         a1_0.account_type,
2026-08-24 17:04:37.058 |         a1_0.allow_incoming,
2026-08-24 17:04:37.058 |         a1_0.allow_outgoing,
2026-08-24 17:04:37.058 |         a1_0.balance,
2026-08-24 17:04:37.058 |         a1_0.card_cvv,
2026-08-24 17:04:37.058 |         a1_0.card_expiry,
2026-08-24 17:04:37.058 |         a1_0.created_at,
2026-08-24 17:04:37.058 |         a1_0.currency,
2026-08-24 17:04:37.058 |         a1_0.customer_id,
2026-08-24 17:04:37.058 |         a1_0.daily_limit,
2026-08-24 17:04:37.058 |         a1_0.frozen,
2026-08-24 17:04:37.058 |         a1_0.monthly_limit,
2026-08-24 17:04:37.058 |         a1_0.parent_account_id,
2026-08-24 17:04:37.058 |         a1_0.require_dual_approval,
2026-08-24 17:04:37.058 |         a1_0.status,
2026-08-24 17:04:37.058 |         a1_0.swift_code,
2026-08-24 17:04:37.058 |         a1_0.updated_at,
2026-08-24 17:04:37.058 |         a1_0.version 
2026-08-24 17:04:37.058 |     from
2026-08-24 17:04:37.058 |         accounts a1_0 
2026-08-24 17:04:37.058 |     where
2026-08-24 17:04:37.058 |         a1_0.customer_id=?
2026-08-24 17:04:37.058 | Hibernate: 
2026-08-24 17:04:37.058 |     select
2026-08-24 17:04:37.058 |         a1_0.id,
2026-08-24 17:04:37.058 |         a1_0.account_name,
2026-08-24 17:04:37.058 |         a1_0.account_number,
2026-08-24 17:04:37.058 |         a1_0.account_type,
2026-08-24 17:04:37.058 |         a1_0.allow_incoming,
2026-08-24 17:04:37.058 |         a1_0.allow_outgoing,
2026-08-24 17:04:37.058 |         a1_0.balance,
2026-08-24 17:04:37.058 |         a1_0.card_cvv,
2026-08-24 17:04:37.058 |         a1_0.card_expiry,
2026-08-24 17:04:37.058 |         a1_0.created_at,
2026-08-24 17:04:37.058 |         a1_0.currency,
2026-08-24 17:04:37.058 |         a1_0.customer_id,
2026-08-24 17:04:37.058 |         a1_0.daily_limit,
2026-08-24 17:04:37.058 |         a1_0.frozen,
2026-08-24 17:04:37.058 |         a1_0.monthly_limit,
2026-08-24 17:04:37.058 |         a1_0.parent_account_id,
2026-08-24 17:04:37.058 |         a1_0.require_dual_approval,
2026-08-24 17:04:37.058 |         a1_0.status,
2026-08-24 17:04:37.058 |         a1_0.swift_code,
2026-08-24 17:04:37.058 |         a1_0.updated_at,
2026-08-24 17:04:37.058 |         a1_0.version 
2026-08-24 17:04:37.058 |     from
2026-08-24 17:04:37.058 |         accounts a1_0 
2026-08-24 17:04:37.058 |     where
2026-08-24 17:04:37.058 |         a1_0.customer_id=?
2026-08-24 17:04:37.068 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 01cff503-a6b8-48c7-96bc-65df531d7807] - [HTTP LOG] GET /api/v1/webhooks - Status: 200 - Duration: 27ms
2026-08-24 17:04:37.069 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 7624d15b-d4d7-482a-a682-c5a522aac223] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 25ms
2026-08-24 17:04:37.072 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:37.072 |     insert 
2026-08-24 17:04:37.072 |     into
2026-08-24 17:04:37.072 |         api_audit_events
2026-08-24 17:04:37.072 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.072 |     values
2026-08-24 17:04:37.072 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.072 | Hibernate: 
2026-08-24 17:04:37.072 |     insert 
2026-08-24 17:04:37.072 |     into
2026-08-24 17:04:37.072 |         api_audit_events
2026-08-24 17:04:37.072 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.072 |     values
2026-08-24 17:04:37.072 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.072 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:37.072 |     insert 
2026-08-24 17:04:37.072 |     into
2026-08-24 17:04:37.072 |         api_audit_events
2026-08-24 17:04:37.072 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.072 |     values
2026-08-24 17:04:37.072 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.073 | Hibernate: 
2026-08-24 17:04:37.073 |     insert 
2026-08-24 17:04:37.073 |     into
2026-08-24 17:04:37.073 |         api_audit_events
2026-08-24 17:04:37.073 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.073 |     values
2026-08-24 17:04:37.073 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.086 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/webhooks → 200 | stage=COMPLETED | keyId=null | acct=null | latency=49ms
2026-08-24 17:04:37.090 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=50ms
2026-08-24 17:04:37.148 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/apikeys
2026-08-24 17:04:37.157 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: a2d59c55-a46c-4fec-b23c-4ebd9976374f] - 
2026-08-24 17:04:37.157 |     select
2026-08-24 17:04:37.157 |         c1_0.id,
2026-08-24 17:04:37.157 |         c1_0.created_at,
2026-08-24 17:04:37.157 |         c1_0.email,
2026-08-24 17:04:37.157 |         c1_0.employment_status,
2026-08-24 17:04:37.157 |         c1_0.first_name,
2026-08-24 17:04:37.157 |         c1_0.job_title,
2026-08-24 17:04:37.157 |         c1_0.kyc_status,
2026-08-24 17:04:37.157 |         c1_0.last_name,
2026-08-24 17:04:37.157 |         c1_0.locked,
2026-08-24 17:04:37.157 |         c1_0.monthly_income,
2026-08-24 17:04:37.157 |         c1_0.password,
2026-08-24 17:04:37.157 |         c1_0.risk_profile,
2026-08-24 17:04:37.157 |         c1_0.role,
2026-08-24 17:04:37.157 |         c1_0.source_of_funds 
2026-08-24 17:04:37.157 |     from
2026-08-24 17:04:37.157 |         customers c1_0 
2026-08-24 17:04:37.157 |     where
2026-08-24 17:04:37.157 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.157 | Hibernate: 
2026-08-24 17:04:37.157 |     select
2026-08-24 17:04:37.157 |         c1_0.id,
2026-08-24 17:04:37.157 |         c1_0.created_at,
2026-08-24 17:04:37.157 |         c1_0.email,
2026-08-24 17:04:37.157 |         c1_0.employment_status,
2026-08-24 17:04:37.157 |         c1_0.first_name,
2026-08-24 17:04:37.157 |         c1_0.job_title,
2026-08-24 17:04:37.157 |         c1_0.kyc_status,
2026-08-24 17:04:37.157 |         c1_0.last_name,
2026-08-24 17:04:37.157 |         c1_0.locked,
2026-08-24 17:04:37.157 |         c1_0.monthly_income,
2026-08-24 17:04:37.157 |         c1_0.password,
2026-08-24 17:04:37.157 |         c1_0.risk_profile,
2026-08-24 17:04:37.157 |         c1_0.role,
2026-08-24 17:04:37.157 |         c1_0.source_of_funds 
2026-08-24 17:04:37.157 |     from
2026-08-24 17:04:37.157 |         customers c1_0 
2026-08-24 17:04:37.157 |     where
2026-08-24 17:04:37.157 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.168 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: a2d59c55-a46c-4fec-b23c-4ebd9976374f] - Secured GET /api/v1/apikeys
2026-08-24 17:04:37.174 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: a2d59c55-a46c-4fec-b23c-4ebd9976374f] - 
2026-08-24 17:04:37.174 |     select
2026-08-24 17:04:37.174 |         akje1_0.id,
2026-08-24 17:04:37.174 |         akje1_0.cidr_whitelist,
2026-08-24 17:04:37.174 |         akje1_0.created_at,
2026-08-24 17:04:37.174 |         akje1_0.environment,
2026-08-24 17:04:37.174 |         akje1_0.expires_at,
2026-08-24 17:04:37.174 |         akje1_0.key_hash,
2026-08-24 17:04:37.174 |         akje1_0.key_prefix,
2026-08-24 17:04:37.174 |         akje1_0.last_used_at,
2026-08-24 17:04:37.174 |         akje1_0.linked_account_id,
2026-08-24 17:04:37.174 |         akje1_0.merchant_id,
2026-08-24 17:04:37.174 |         akje1_0.name,
2026-08-24 17:04:37.174 |         akje1_0.revoked_at,
2026-08-24 17:04:37.174 |         akje1_0.scopes 
2026-08-24 17:04:37.174 |     from
2026-08-24 17:04:37.174 |         api_keys akje1_0 
2026-08-24 17:04:37.174 |     where
2026-08-24 17:04:37.174 |         akje1_0.merchant_id=?
2026-08-24 17:04:37.174 | Hibernate: 
2026-08-24 17:04:37.174 |     select
2026-08-24 17:04:37.175 |         akje1_0.id,
2026-08-24 17:04:37.175 |         akje1_0.cidr_whitelist,
2026-08-24 17:04:37.175 |         akje1_0.created_at,
2026-08-24 17:04:37.175 |         akje1_0.environment,
2026-08-24 17:04:37.175 |         akje1_0.expires_at,
2026-08-24 17:04:37.175 |         akje1_0.key_hash,
2026-08-24 17:04:37.175 |         akje1_0.key_prefix,
2026-08-24 17:04:37.175 |         akje1_0.last_used_at,
2026-08-24 17:04:37.175 |         akje1_0.linked_account_id,
2026-08-24 17:04:37.175 |         akje1_0.merchant_id,
2026-08-24 17:04:37.175 |         akje1_0.name,
2026-08-24 17:04:37.175 |         akje1_0.revoked_at,
2026-08-24 17:04:37.175 |         akje1_0.scopes 
2026-08-24 17:04:37.175 |     from
2026-08-24 17:04:37.175 |         api_keys akje1_0 
2026-08-24 17:04:37.175 |     where
2026-08-24 17:04:37.175 |         akje1_0.merchant_id=?
2026-08-24 17:04:37.184 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: a2d59c55-a46c-4fec-b23c-4ebd9976374f] - [HTTP LOG] GET /api/v1/apikeys - Status: 200 - Duration: 15ms
2026-08-24 17:04:37.187 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:37.187 |     insert 
2026-08-24 17:04:37.187 |     into
2026-08-24 17:04:37.187 |         api_audit_events
2026-08-24 17:04:37.187 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.187 |     values
2026-08-24 17:04:37.187 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.187 | Hibernate: 
2026-08-24 17:04:37.187 |     insert 
2026-08-24 17:04:37.187 |     into
2026-08-24 17:04:37.187 |         api_audit_events
2026-08-24 17:04:37.187 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.187 |     values
2026-08-24 17:04:37.187 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.197 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/apikeys → 200 | stage=COMPLETED | keyId=null | acct=null | latency=38ms
2026-08-24 17:04:37.214 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/webhooks
2026-08-24 17:04:37.223 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: b56d8dfc-eb54-40ba-a3a2-24896b171f66] - 
2026-08-24 17:04:37.223 |     select
2026-08-24 17:04:37.223 |         c1_0.id,
2026-08-24 17:04:37.223 |         c1_0.created_at,
2026-08-24 17:04:37.223 |         c1_0.email,
2026-08-24 17:04:37.223 |         c1_0.employment_status,
2026-08-24 17:04:37.223 |         c1_0.first_name,
2026-08-24 17:04:37.223 |         c1_0.job_title,
2026-08-24 17:04:37.223 |         c1_0.kyc_status,
2026-08-24 17:04:37.223 |         c1_0.last_name,
2026-08-24 17:04:37.223 |         c1_0.locked,
2026-08-24 17:04:37.223 |         c1_0.monthly_income,
2026-08-24 17:04:37.223 |         c1_0.password,
2026-08-24 17:04:37.223 |         c1_0.risk_profile,
2026-08-24 17:04:37.223 |         c1_0.role,
2026-08-24 17:04:37.223 |         c1_0.source_of_funds 
2026-08-24 17:04:37.223 |     from
2026-08-24 17:04:37.223 |         customers c1_0 
2026-08-24 17:04:37.223 |     where
2026-08-24 17:04:37.223 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.223 | Hibernate: 
2026-08-24 17:04:37.223 |     select
2026-08-24 17:04:37.223 |         c1_0.id,
2026-08-24 17:04:37.223 |         c1_0.created_at,
2026-08-24 17:04:37.223 |         c1_0.email,
2026-08-24 17:04:37.223 |         c1_0.employment_status,
2026-08-24 17:04:37.223 |         c1_0.first_name,
2026-08-24 17:04:37.223 |         c1_0.job_title,
2026-08-24 17:04:37.223 |         c1_0.kyc_status,
2026-08-24 17:04:37.223 |         c1_0.last_name,
2026-08-24 17:04:37.223 |         c1_0.locked,
2026-08-24 17:04:37.223 |         c1_0.monthly_income,
2026-08-24 17:04:37.223 |         c1_0.password,
2026-08-24 17:04:37.223 |         c1_0.risk_profile,
2026-08-24 17:04:37.223 |         c1_0.role,
2026-08-24 17:04:37.223 |         c1_0.source_of_funds 
2026-08-24 17:04:37.223 |     from
2026-08-24 17:04:37.223 |         customers c1_0 
2026-08-24 17:04:37.223 |     where
2026-08-24 17:04:37.223 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.237 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: b56d8dfc-eb54-40ba-a3a2-24896b171f66] - Secured GET /api/v1/webhooks
2026-08-24 17:04:37.242 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: b56d8dfc-eb54-40ba-a3a2-24896b171f66] - 
2026-08-24 17:04:37.242 |     select
2026-08-24 17:04:37.242 |         we1_0.id,
2026-08-24 17:04:37.242 |         we1_0.created_at,
2026-08-24 17:04:37.242 |         we1_0.environment,
2026-08-24 17:04:37.242 |         we1_0.events,
2026-08-24 17:04:37.242 |         we1_0.merchant_id,
2026-08-24 17:04:37.242 |         we1_0.secret_hash,
2026-08-24 17:04:37.242 |         we1_0.status,
2026-08-24 17:04:37.242 |         we1_0.updated_at,
2026-08-24 17:04:37.242 |         we1_0.url 
2026-08-24 17:04:37.242 |     from
2026-08-24 17:04:37.242 |         webhook_endpoints we1_0 
2026-08-24 17:04:37.242 |     where
2026-08-24 17:04:37.242 |         we1_0.merchant_id=?
2026-08-24 17:04:37.242 | Hibernate: 
2026-08-24 17:04:37.242 |     select
2026-08-24 17:04:37.242 |         we1_0.id,
2026-08-24 17:04:37.242 |         we1_0.created_at,
2026-08-24 17:04:37.242 |         we1_0.environment,
2026-08-24 17:04:37.242 |         we1_0.events,
2026-08-24 17:04:37.242 |         we1_0.merchant_id,
2026-08-24 17:04:37.242 |         we1_0.secret_hash,
2026-08-24 17:04:37.242 |         we1_0.status,
2026-08-24 17:04:37.242 |         we1_0.updated_at,
2026-08-24 17:04:37.242 |         we1_0.url 
2026-08-24 17:04:37.242 |     from
2026-08-24 17:04:37.242 |         webhook_endpoints we1_0 
2026-08-24 17:04:37.242 |     where
2026-08-24 17:04:37.242 |         we1_0.merchant_id=?
2026-08-24 17:04:37.252 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b56d8dfc-eb54-40ba-a3a2-24896b171f66] - [HTTP LOG] GET /api/v1/webhooks - Status: 200 - Duration: 15ms
2026-08-24 17:04:37.256 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:37.256 |     insert 
2026-08-24 17:04:37.256 |     into
2026-08-24 17:04:37.256 |         api_audit_events
2026-08-24 17:04:37.256 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.256 |     values
2026-08-24 17:04:37.256 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.256 | Hibernate: 
2026-08-24 17:04:37.256 |     insert 
2026-08-24 17:04:37.256 |     into
2026-08-24 17:04:37.256 |         api_audit_events
2026-08-24 17:04:37.256 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:04:37.256 |     values
2026-08-24 17:04:37.256 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:04:37.265 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/webhooks → 200 | stage=COMPLETED | keyId=null | acct=null | latency=41ms
2026-08-24 17:04:37.363 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /v3/api-docs/developer-gateway
2026-08-24 17:04:37.369 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-7] DEBUG org.hibernate.SQL [X-Request-Id: 628eef7b-4442-42d6-8bb1-568b13df1c7d] - 
2026-08-24 17:04:37.369 |     select
2026-08-24 17:04:37.369 |         c1_0.id,
2026-08-24 17:04:37.369 |         c1_0.created_at,
2026-08-24 17:04:37.369 |         c1_0.email,
2026-08-24 17:04:37.369 |         c1_0.employment_status,
2026-08-24 17:04:37.369 |         c1_0.first_name,
2026-08-24 17:04:37.369 |         c1_0.job_title,
2026-08-24 17:04:37.369 |         c1_0.kyc_status,
2026-08-24 17:04:37.369 |         c1_0.last_name,
2026-08-24 17:04:37.369 |         c1_0.locked,
2026-08-24 17:04:37.369 |         c1_0.monthly_income,
2026-08-24 17:04:37.369 |         c1_0.password,
2026-08-24 17:04:37.369 |         c1_0.risk_profile,
2026-08-24 17:04:37.369 |         c1_0.role,
2026-08-24 17:04:37.369 |         c1_0.source_of_funds 
2026-08-24 17:04:37.369 |     from
2026-08-24 17:04:37.369 |         customers c1_0 
2026-08-24 17:04:37.369 |     where
2026-08-24 17:04:37.369 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.369 | Hibernate: 
2026-08-24 17:04:37.369 |     select
2026-08-24 17:04:37.369 |         c1_0.id,
2026-08-24 17:04:37.369 |         c1_0.created_at,
2026-08-24 17:04:37.369 |         c1_0.email,
2026-08-24 17:04:37.369 |         c1_0.employment_status,
2026-08-24 17:04:37.369 |         c1_0.first_name,
2026-08-24 17:04:37.369 |         c1_0.job_title,
2026-08-24 17:04:37.369 |         c1_0.kyc_status,
2026-08-24 17:04:37.369 |         c1_0.last_name,
2026-08-24 17:04:37.369 |         c1_0.locked,
2026-08-24 17:04:37.369 |         c1_0.monthly_income,
2026-08-24 17:04:37.369 |         c1_0.password,
2026-08-24 17:04:37.369 |         c1_0.risk_profile,
2026-08-24 17:04:37.369 |         c1_0.role,
2026-08-24 17:04:37.369 |         c1_0.source_of_funds 
2026-08-24 17:04:37.369 |     from
2026-08-24 17:04:37.369 |         customers c1_0 
2026-08-24 17:04:37.369 |     where
2026-08-24 17:04:37.369 |         upper(c1_0.email)=upper(?)
2026-08-24 17:04:37.379 | 2026-08-24 09:04:37 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 628eef7b-4442-42d6-8bb1-568b13df1c7d] - Secured GET /v3/api-docs/developer-gateway
2026-08-24 17:04:38.352 | 2026-08-24 09:04:38 [http-nio-0.0.0.0-8080-exec-7] INFO  o.s.api.AbstractOpenApiResource [X-Request-Id: 628eef7b-4442-42d6-8bb1-568b13df1c7d] - Init duration for springdoc-openapi is: 960 ms
2026-08-24 17:04:38.393 | 2026-08-24 09:04:38 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 628eef7b-4442-42d6-8bb1-568b13df1c7d] - [HTTP LOG] GET /v3/api-docs/developer-gateway - Status: 200 - Duration: 1013ms
2026-08-24 17:04:39.144 | 2026-08-24 09:04:39 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:39.144 |     SELECT
2026-08-24 17:04:39.144 |         o1.* 
2026-08-24 17:04:39.144 |     FROM
2026-08-24 17:04:39.144 |         payment_event_outbox o1 
2026-08-24 17:04:39.144 |     WHERE
2026-08-24 17:04:39.145 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:39.145 |         AND (
2026-08-24 17:04:39.145 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:39.145 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:39.145 |         )   
2026-08-24 17:04:39.145 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:39.145 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:39.145 |             1 
2026-08-24 17:04:39.145 |         FROM
2026-08-24 17:04:39.145 |             payment_event_outbox o2       
2026-08-24 17:04:39.145 |         WHERE
2026-08-24 17:04:39.145 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:39.145 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:39.145 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:39.145 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:39.145 |     ORDER BY
2026-08-24 17:04:39.145 |         o1.created_at ASC 
2026-08-24 17:04:39.145 |     LIMIT
2026-08-24 17:04:39.145 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:39.145 | Hibernate: 
2026-08-24 17:04:39.145 |     SELECT
2026-08-24 17:04:39.145 |         o1.* 
2026-08-24 17:04:39.145 |     FROM
2026-08-24 17:04:39.145 |         payment_event_outbox o1 
2026-08-24 17:04:39.145 |     WHERE
2026-08-24 17:04:39.145 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:39.145 |         AND (
2026-08-24 17:04:39.145 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:39.145 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:39.145 |         )   
2026-08-24 17:04:39.145 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:39.145 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:39.145 |             1 
2026-08-24 17:04:39.145 |         FROM
2026-08-24 17:04:39.145 |             payment_event_outbox o2       
2026-08-24 17:04:39.145 |         WHERE
2026-08-24 17:04:39.145 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:39.145 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:39.145 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:39.145 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:39.145 |     ORDER BY
2026-08-24 17:04:39.145 |         o1.created_at ASC 
2026-08-24 17:04:39.145 |     LIMIT
2026-08-24 17:04:39.145 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:43.638 | 2026-08-24 09:04:43 [MessageBroker-4] INFO  o.s.w.s.c.WebSocketMessageBrokerStats [X-Request-Id: ] - WebSocketSession[0 current WS(0)-HttpStream(0)-HttpPoll(0), 0 total, 0 closed abnormally (0 connect failure, 0 send limit, 0 transport error)], stompSubProtocol[processed CONNECT(0)-CONNECTED(0)-DISCONNECT(0)], stompBrokerRelay[null], inboundChannel[pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0], outboundChannel[pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0], sockJsScheduler[pool size = 16, active threads = 1, queued tasks = 9, completed tasks = 14]
2026-08-24 17:04:44.057 | 2026-08-24 09:04:44 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:44.057 |     SELECT
2026-08-24 17:04:44.057 |         * 
2026-08-24 17:04:44.057 |     FROM
2026-08-24 17:04:44.057 |         payment_event_outbox 
2026-08-24 17:04:44.057 |     WHERE
2026-08-24 17:04:44.057 |         status = 'DELIVERING'   
2026-08-24 17:04:44.057 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:44.057 | Hibernate: 
2026-08-24 17:04:44.057 |     SELECT
2026-08-24 17:04:44.057 |         * 
2026-08-24 17:04:44.057 |     FROM
2026-08-24 17:04:44.057 |         payment_event_outbox 
2026-08-24 17:04:44.057 |     WHERE
2026-08-24 17:04:44.057 |         status = 'DELIVERING'   
2026-08-24 17:04:44.057 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:44.059 | 2026-08-24 09:04:44 [MessageBroker-11] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:44.059 |     select
2026-08-24 17:04:44.059 |         icl1_0.id,
2026-08-24 17:04:44.059 |         icl1_0.attempt_count,
2026-08-24 17:04:44.059 |         icl1_0.callback_url,
2026-08-24 17:04:44.059 |         icl1_0.created_at,
2026-08-24 17:04:44.059 |         icl1_0.next_retry_at,
2026-08-24 17:04:44.059 |         icl1_0.payload,
2026-08-24 17:04:44.059 |         icl1_0.payment_session_id,
2026-08-24 17:04:44.059 |         icl1_0.response_body,
2026-08-24 17:04:44.059 |         icl1_0.response_code,
2026-08-24 17:04:44.059 |         icl1_0.status,
2026-08-24 17:04:44.059 |         icl1_0.updated_at 
2026-08-24 17:04:44.059 |     from
2026-08-24 17:04:44.059 |         institution_callback_log icl1_0 
2026-08-24 17:04:44.059 |     where
2026-08-24 17:04:44.059 |         icl1_0.status=? 
2026-08-24 17:04:44.059 |         and icl1_0.next_retry_at<?
2026-08-24 17:04:44.059 | Hibernate: 
2026-08-24 17:04:44.059 |     select
2026-08-24 17:04:44.059 |         icl1_0.id,
2026-08-24 17:04:44.059 |         icl1_0.attempt_count,
2026-08-24 17:04:44.059 |         icl1_0.callback_url,
2026-08-24 17:04:44.059 |         icl1_0.created_at,
2026-08-24 17:04:44.059 |         icl1_0.next_retry_at,
2026-08-24 17:04:44.059 |         icl1_0.payload,
2026-08-24 17:04:44.059 |         icl1_0.payment_session_id,
2026-08-24 17:04:44.059 |         icl1_0.response_body,
2026-08-24 17:04:44.059 |         icl1_0.response_code,
2026-08-24 17:04:44.059 |         icl1_0.status,
2026-08-24 17:04:44.059 |         icl1_0.updated_at 
2026-08-24 17:04:44.059 |     from
2026-08-24 17:04:44.059 |         institution_callback_log icl1_0 
2026-08-24 17:04:44.059 |     where
2026-08-24 17:04:44.059 |         icl1_0.status=? 
2026-08-24 17:04:44.059 |         and icl1_0.next_retry_at<?
2026-08-24 17:04:44.150 | 2026-08-24 09:04:44 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:44.150 |     SELECT
2026-08-24 17:04:44.150 |         o1.* 
2026-08-24 17:04:44.150 |     FROM
2026-08-24 17:04:44.150 |         payment_event_outbox o1 
2026-08-24 17:04:44.150 |     WHERE
2026-08-24 17:04:44.150 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:44.150 |         AND (
2026-08-24 17:04:44.150 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:44.150 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:44.150 |         )   
2026-08-24 17:04:44.150 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:44.150 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:44.150 |             1 
2026-08-24 17:04:44.150 |         FROM
2026-08-24 17:04:44.150 |             payment_event_outbox o2       
2026-08-24 17:04:44.150 |         WHERE
2026-08-24 17:04:44.150 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:44.150 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:44.150 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:44.150 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:44.150 |     ORDER BY
2026-08-24 17:04:44.150 |         o1.created_at ASC 
2026-08-24 17:04:44.150 |     LIMIT
2026-08-24 17:04:44.150 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:44.150 | Hibernate: 
2026-08-24 17:04:44.150 |     SELECT
2026-08-24 17:04:44.150 |         o1.* 
2026-08-24 17:04:44.150 |     FROM
2026-08-24 17:04:44.150 |         payment_event_outbox o1 
2026-08-24 17:04:44.150 |     WHERE
2026-08-24 17:04:44.150 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:44.150 |         AND (
2026-08-24 17:04:44.150 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:44.150 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:44.150 |         )   
2026-08-24 17:04:44.150 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:44.150 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:44.150 |             1 
2026-08-24 17:04:44.150 |         FROM
2026-08-24 17:04:44.150 |             payment_event_outbox o2       
2026-08-24 17:04:44.150 |         WHERE
2026-08-24 17:04:44.150 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:44.150 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:44.150 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:44.150 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:44.150 |     ORDER BY
2026-08-24 17:04:44.150 |         o1.created_at ASC 
2026-08-24 17:04:44.150 |     LIMIT
2026-08-24 17:04:44.150 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:47.097 | 2026-08-24 09:04:47 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:04:47.098 | 2026-08-24 09:04:47 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:04:47.098 | 2026-08-24 09:04:47 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: c1078332-805b-40d4-b0f3-8ba1f3e8b761] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:47.104 | 2026-08-24 09:04:47 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: c1078332-805b-40d4-b0f3-8ba1f3e8b761] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:04:49.158 | 2026-08-24 09:04:49 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:49.158 |     SELECT
2026-08-24 17:04:49.158 |         o1.* 
2026-08-24 17:04:49.158 |     FROM
2026-08-24 17:04:49.158 |         payment_event_outbox o1 
2026-08-24 17:04:49.158 |     WHERE
2026-08-24 17:04:49.158 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:49.158 |         AND (
2026-08-24 17:04:49.158 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:49.158 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:49.158 |         )   
2026-08-24 17:04:49.158 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:49.158 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:49.158 |             1 
2026-08-24 17:04:49.158 |         FROM
2026-08-24 17:04:49.158 |             payment_event_outbox o2       
2026-08-24 17:04:49.158 |         WHERE
2026-08-24 17:04:49.158 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:49.158 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:49.158 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:49.158 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:49.158 |     ORDER BY
2026-08-24 17:04:49.158 |         o1.created_at ASC 
2026-08-24 17:04:49.158 |     LIMIT
2026-08-24 17:04:49.158 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:49.158 | Hibernate: 
2026-08-24 17:04:49.158 |     SELECT
2026-08-24 17:04:49.158 |         o1.* 
2026-08-24 17:04:49.158 |     FROM
2026-08-24 17:04:49.158 |         payment_event_outbox o1 
2026-08-24 17:04:49.158 |     WHERE
2026-08-24 17:04:49.158 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:49.158 |         AND (
2026-08-24 17:04:49.158 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:49.158 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:49.158 |         )   
2026-08-24 17:04:49.158 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:49.158 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:49.158 |             1 
2026-08-24 17:04:49.158 |         FROM
2026-08-24 17:04:49.158 |             payment_event_outbox o2       
2026-08-24 17:04:49.158 |         WHERE
2026-08-24 17:04:49.158 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:49.158 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:49.158 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:49.158 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:49.158 |     ORDER BY
2026-08-24 17:04:49.158 |         o1.created_at ASC 
2026-08-24 17:04:49.158 |     LIMIT
2026-08-24 17:04:49.158 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:54.164 | 2026-08-24 09:04:54 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:54.165 |     SELECT
2026-08-24 17:04:54.165 |         o1.* 
2026-08-24 17:04:54.165 |     FROM
2026-08-24 17:04:54.165 |         payment_event_outbox o1 
2026-08-24 17:04:54.165 |     WHERE
2026-08-24 17:04:54.165 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:54.165 |         AND (
2026-08-24 17:04:54.165 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:54.165 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:54.165 |         )   
2026-08-24 17:04:54.165 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:54.165 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:54.165 |             1 
2026-08-24 17:04:54.165 |         FROM
2026-08-24 17:04:54.165 |             payment_event_outbox o2       
2026-08-24 17:04:54.165 |         WHERE
2026-08-24 17:04:54.165 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:54.165 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:54.165 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:54.165 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:54.165 |     ORDER BY
2026-08-24 17:04:54.165 |         o1.created_at ASC 
2026-08-24 17:04:54.165 |     LIMIT
2026-08-24 17:04:54.165 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:54.165 | Hibernate: 
2026-08-24 17:04:54.165 |     SELECT
2026-08-24 17:04:54.165 |         o1.* 
2026-08-24 17:04:54.165 |     FROM
2026-08-24 17:04:54.165 |         payment_event_outbox o1 
2026-08-24 17:04:54.165 |     WHERE
2026-08-24 17:04:54.165 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:54.165 |         AND (
2026-08-24 17:04:54.165 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:54.165 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:54.165 |         )   
2026-08-24 17:04:54.165 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:54.165 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:54.165 |             1 
2026-08-24 17:04:54.165 |         FROM
2026-08-24 17:04:54.165 |             payment_event_outbox o2       
2026-08-24 17:04:54.165 |         WHERE
2026-08-24 17:04:54.165 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:54.165 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:54.165 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:54.165 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:54.165 |     ORDER BY
2026-08-24 17:04:54.165 |         o1.created_at ASC 
2026-08-24 17:04:54.165 |     LIMIT
2026-08-24 17:04:54.165 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:57.195 | 2026-08-24 09:04:57 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:04:57.196 | 2026-08-24 09:04:57 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:04:57.196 | 2026-08-24 09:04:57 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: ebb31328-a1d3-48d6-8459-e43abc35c341] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:04:57.203 | 2026-08-24 09:04:57 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ebb31328-a1d3-48d6-8459-e43abc35c341] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:04:59.174 | 2026-08-24 09:04:59 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:04:59.174 |     SELECT
2026-08-24 17:04:59.174 |         o1.* 
2026-08-24 17:04:59.175 |     FROM
2026-08-24 17:04:59.175 |         payment_event_outbox o1 
2026-08-24 17:04:59.175 |     WHERE
2026-08-24 17:04:59.175 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:59.175 |         AND (
2026-08-24 17:04:59.175 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:59.175 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:59.175 |         )   
2026-08-24 17:04:59.175 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:59.175 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:59.175 |             1 
2026-08-24 17:04:59.175 |         FROM
2026-08-24 17:04:59.175 |             payment_event_outbox o2       
2026-08-24 17:04:59.175 |         WHERE
2026-08-24 17:04:59.175 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:59.175 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:59.175 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:59.175 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:59.175 |     ORDER BY
2026-08-24 17:04:59.175 |         o1.created_at ASC 
2026-08-24 17:04:59.175 |     LIMIT
2026-08-24 17:04:59.175 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:04:59.175 | Hibernate: 
2026-08-24 17:04:59.175 |     SELECT
2026-08-24 17:04:59.175 |         o1.* 
2026-08-24 17:04:59.175 |     FROM
2026-08-24 17:04:59.175 |         payment_event_outbox o1 
2026-08-24 17:04:59.175 |     WHERE
2026-08-24 17:04:59.175 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:04:59.175 |         AND (
2026-08-24 17:04:59.175 |             o1.next_attempt_at IS NULL 
2026-08-24 17:04:59.175 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:04:59.175 |         )   
2026-08-24 17:04:59.175 |         AND o1.locked_at IS NULL   
2026-08-24 17:04:59.175 |         AND NOT EXISTS (       SELECT
2026-08-24 17:04:59.175 |             1 
2026-08-24 17:04:59.175 |         FROM
2026-08-24 17:04:59.175 |             payment_event_outbox o2       
2026-08-24 17:04:59.175 |         WHERE
2026-08-24 17:04:59.175 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:04:59.175 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:04:59.175 |             AND o2.sequence < o1.sequence         
2026-08-24 17:04:59.175 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:04:59.175 |     ORDER BY
2026-08-24 17:04:59.175 |         o1.created_at ASC 
2026-08-24 17:04:59.175 |     LIMIT
2026-08-24 17:04:59.175 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:04.182 | 2026-08-24 09:05:04 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:04.182 |     SELECT
2026-08-24 17:05:04.182 |         o1.* 
2026-08-24 17:05:04.182 |     FROM
2026-08-24 17:05:04.182 |         payment_event_outbox o1 
2026-08-24 17:05:04.182 |     WHERE
2026-08-24 17:05:04.182 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:04.182 |         AND (
2026-08-24 17:05:04.182 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:04.182 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:04.182 |         )   
2026-08-24 17:05:04.182 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:04.182 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:04.182 |             1 
2026-08-24 17:05:04.182 |         FROM
2026-08-24 17:05:04.182 |             payment_event_outbox o2       
2026-08-24 17:05:04.182 |         WHERE
2026-08-24 17:05:04.182 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:04.182 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:04.182 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:04.182 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:04.182 |     ORDER BY
2026-08-24 17:05:04.182 |         o1.created_at ASC 
2026-08-24 17:05:04.182 |     LIMIT
2026-08-24 17:05:04.182 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:04.182 | Hibernate: 
2026-08-24 17:05:04.182 |     SELECT
2026-08-24 17:05:04.182 |         o1.* 
2026-08-24 17:05:04.182 |     FROM
2026-08-24 17:05:04.182 |         payment_event_outbox o1 
2026-08-24 17:05:04.182 |     WHERE
2026-08-24 17:05:04.182 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:04.182 |         AND (
2026-08-24 17:05:04.182 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:04.182 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:04.182 |         )   
2026-08-24 17:05:04.182 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:04.182 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:04.182 |             1 
2026-08-24 17:05:04.182 |         FROM
2026-08-24 17:05:04.182 |             payment_event_outbox o2       
2026-08-24 17:05:04.182 |         WHERE
2026-08-24 17:05:04.182 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:04.182 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:04.182 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:04.182 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:04.182 |     ORDER BY
2026-08-24 17:05:04.182 |         o1.created_at ASC 
2026-08-24 17:05:04.182 |     LIMIT
2026-08-24 17:05:04.182 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:07.284 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/apikeys
2026-08-24 17:05:07.293 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 61dd0458-d352-467e-ab14-7162e036972b] - 
2026-08-24 17:05:07.293 |     select
2026-08-24 17:05:07.293 |         c1_0.id,
2026-08-24 17:05:07.293 |         c1_0.created_at,
2026-08-24 17:05:07.293 |         c1_0.email,
2026-08-24 17:05:07.293 |         c1_0.employment_status,
2026-08-24 17:05:07.293 |         c1_0.first_name,
2026-08-24 17:05:07.293 |         c1_0.job_title,
2026-08-24 17:05:07.293 |         c1_0.kyc_status,
2026-08-24 17:05:07.293 |         c1_0.last_name,
2026-08-24 17:05:07.293 |         c1_0.locked,
2026-08-24 17:05:07.293 |         c1_0.monthly_income,
2026-08-24 17:05:07.293 |         c1_0.password,
2026-08-24 17:05:07.293 |         c1_0.risk_profile,
2026-08-24 17:05:07.293 |         c1_0.role,
2026-08-24 17:05:07.293 |         c1_0.source_of_funds 
2026-08-24 17:05:07.293 |     from
2026-08-24 17:05:07.293 |         customers c1_0 
2026-08-24 17:05:07.293 |     where
2026-08-24 17:05:07.293 |         upper(c1_0.email)=upper(?)
2026-08-24 17:05:07.293 | Hibernate: 
2026-08-24 17:05:07.293 |     select
2026-08-24 17:05:07.293 |         c1_0.id,
2026-08-24 17:05:07.293 |         c1_0.created_at,
2026-08-24 17:05:07.293 |         c1_0.email,
2026-08-24 17:05:07.293 |         c1_0.employment_status,
2026-08-24 17:05:07.293 |         c1_0.first_name,
2026-08-24 17:05:07.293 |         c1_0.job_title,
2026-08-24 17:05:07.293 |         c1_0.kyc_status,
2026-08-24 17:05:07.293 |         c1_0.last_name,
2026-08-24 17:05:07.293 |         c1_0.locked,
2026-08-24 17:05:07.293 |         c1_0.monthly_income,
2026-08-24 17:05:07.293 |         c1_0.password,
2026-08-24 17:05:07.293 |         c1_0.risk_profile,
2026-08-24 17:05:07.293 |         c1_0.role,
2026-08-24 17:05:07.293 |         c1_0.source_of_funds 
2026-08-24 17:05:07.293 |     from
2026-08-24 17:05:07.293 |         customers c1_0 
2026-08-24 17:05:07.293 |     where
2026-08-24 17:05:07.293 |         upper(c1_0.email)=upper(?)
2026-08-24 17:05:07.300 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:05:07.301 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:05:07.302 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: f9ac3e86-e1e0-4aa4-888f-f0933dddbbde] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:05:07.305 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 61dd0458-d352-467e-ab14-7162e036972b] - Secured POST /api/v1/apikeys
2026-08-24 17:05:07.309 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: f9ac3e86-e1e0-4aa4-888f-f0933dddbbde] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 8ms
2026-08-24 17:05:07.322 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 61dd0458-d352-467e-ab14-7162e036972b] - 
2026-08-24 17:05:07.322 |     insert 
2026-08-24 17:05:07.322 |     into
2026-08-24 17:05:07.322 |         api_keys
2026-08-24 17:05:07.322 |         (cidr_whitelist, created_at, environment, expires_at, key_hash, key_prefix, last_used_at, linked_account_id, merchant_id, name, revoked_at, scopes) 
2026-08-24 17:05:07.322 |     values
2026-08-24 17:05:07.322 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:05:07.322 | Hibernate: 
2026-08-24 17:05:07.322 |     insert 
2026-08-24 17:05:07.322 |     into
2026-08-24 17:05:07.322 |         api_keys
2026-08-24 17:05:07.322 |         (cidr_whitelist, created_at, environment, expires_at, key_hash, key_prefix, last_used_at, linked_account_id, merchant_id, name, revoked_at, scopes) 
2026-08-24 17:05:07.322 |     values
2026-08-24 17:05:07.322 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:05:07.350 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 61dd0458-d352-467e-ab14-7162e036972b] - [HTTP LOG] POST /api/v1/apikeys - Status: 201 - Duration: 45ms
2026-08-24 17:05:07.354 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:07.354 |     insert 
2026-08-24 17:05:07.354 |     into
2026-08-24 17:05:07.354 |         api_audit_events
2026-08-24 17:05:07.354 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:05:07.354 |     values
2026-08-24 17:05:07.354 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:05:07.354 | Hibernate: 
2026-08-24 17:05:07.354 |     insert 
2026-08-24 17:05:07.354 |     into
2026-08-24 17:05:07.354 |         api_audit_events
2026-08-24 17:05:07.354 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:05:07.354 |     values
2026-08-24 17:05:07.354 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:05:07.365 | 2026-08-24 09:05:07 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/apikeys → 201 | stage=COMPLETED | keyId=null | acct=null | latency=68ms
2026-08-24 17:05:09.189 | 2026-08-24 09:05:09 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:09.189 |     SELECT
2026-08-24 17:05:09.189 |         o1.* 
2026-08-24 17:05:09.189 |     FROM
2026-08-24 17:05:09.189 |         payment_event_outbox o1 
2026-08-24 17:05:09.189 |     WHERE
2026-08-24 17:05:09.189 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:09.189 |         AND (
2026-08-24 17:05:09.189 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:09.189 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:09.189 |         )   
2026-08-24 17:05:09.189 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:09.189 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:09.189 |             1 
2026-08-24 17:05:09.189 |         FROM
2026-08-24 17:05:09.189 |             payment_event_outbox o2       
2026-08-24 17:05:09.189 |         WHERE
2026-08-24 17:05:09.189 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:09.189 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:09.189 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:09.189 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:09.189 |     ORDER BY
2026-08-24 17:05:09.189 |         o1.created_at ASC 
2026-08-24 17:05:09.189 |     LIMIT
2026-08-24 17:05:09.189 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:09.189 | Hibernate: 
2026-08-24 17:05:09.189 |     SELECT
2026-08-24 17:05:09.189 |         o1.* 
2026-08-24 17:05:09.189 |     FROM
2026-08-24 17:05:09.189 |         payment_event_outbox o1 
2026-08-24 17:05:09.189 |     WHERE
2026-08-24 17:05:09.189 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:09.189 |         AND (
2026-08-24 17:05:09.189 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:09.189 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:09.189 |         )   
2026-08-24 17:05:09.189 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:09.189 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:09.189 |             1 
2026-08-24 17:05:09.189 |         FROM
2026-08-24 17:05:09.189 |             payment_event_outbox o2       
2026-08-24 17:05:09.189 |         WHERE
2026-08-24 17:05:09.189 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:09.189 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:09.189 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:09.189 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:09.189 |     ORDER BY
2026-08-24 17:05:09.189 |         o1.created_at ASC 
2026-08-24 17:05:09.189 |     LIMIT
2026-08-24 17:05:09.189 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:14.192 | 2026-08-24 09:05:14 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:14.192 |     SELECT
2026-08-24 17:05:14.192 |         o1.* 
2026-08-24 17:05:14.192 |     FROM
2026-08-24 17:05:14.192 |         payment_event_outbox o1 
2026-08-24 17:05:14.192 |     WHERE
2026-08-24 17:05:14.192 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:14.192 |         AND (
2026-08-24 17:05:14.192 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:14.192 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:14.192 |         )   
2026-08-24 17:05:14.192 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:14.192 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:14.192 |             1 
2026-08-24 17:05:14.192 |         FROM
2026-08-24 17:05:14.192 |             payment_event_outbox o2       
2026-08-24 17:05:14.192 |         WHERE
2026-08-24 17:05:14.192 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:14.192 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:14.192 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:14.192 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:14.192 |     ORDER BY
2026-08-24 17:05:14.192 |         o1.created_at ASC 
2026-08-24 17:05:14.192 |     LIMIT
2026-08-24 17:05:14.192 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:14.192 | Hibernate: 
2026-08-24 17:05:14.192 |     SELECT
2026-08-24 17:05:14.192 |         o1.* 
2026-08-24 17:05:14.192 |     FROM
2026-08-24 17:05:14.192 |         payment_event_outbox o1 
2026-08-24 17:05:14.192 |     WHERE
2026-08-24 17:05:14.192 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:14.192 |         AND (
2026-08-24 17:05:14.192 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:14.192 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:14.192 |         )   
2026-08-24 17:05:14.192 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:14.192 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:14.192 |             1 
2026-08-24 17:05:14.192 |         FROM
2026-08-24 17:05:14.192 |             payment_event_outbox o2       
2026-08-24 17:05:14.192 |         WHERE
2026-08-24 17:05:14.192 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:14.192 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:14.192 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:14.192 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:14.192 |     ORDER BY
2026-08-24 17:05:14.192 |         o1.created_at ASC 
2026-08-24 17:05:14.192 |     LIMIT
2026-08-24 17:05:14.192 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:17.409 | 2026-08-24 09:05:17 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:05:17.409 | 2026-08-24 09:05:17 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:05:17.410 | 2026-08-24 09:05:17 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: fc85bc1e-a26c-4f4f-b7b3-9acf72430d8a] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:05:17.416 | 2026-08-24 09:05:17 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: fc85bc1e-a26c-4f4f-b7b3-9acf72430d8a] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:05:19.199 | 2026-08-24 09:05:19 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:19.199 |     SELECT
2026-08-24 17:05:19.199 |         o1.* 
2026-08-24 17:05:19.199 |     FROM
2026-08-24 17:05:19.199 |         payment_event_outbox o1 
2026-08-24 17:05:19.199 |     WHERE
2026-08-24 17:05:19.199 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:19.199 |         AND (
2026-08-24 17:05:19.199 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:19.199 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:19.199 |         )   
2026-08-24 17:05:19.199 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:19.199 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:19.199 |             1 
2026-08-24 17:05:19.199 |         FROM
2026-08-24 17:05:19.199 |             payment_event_outbox o2       
2026-08-24 17:05:19.199 |         WHERE
2026-08-24 17:05:19.199 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:19.199 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:19.199 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:19.199 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:19.199 |     ORDER BY
2026-08-24 17:05:19.199 |         o1.created_at ASC 
2026-08-24 17:05:19.199 |     LIMIT
2026-08-24 17:05:19.199 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:19.199 | Hibernate: 
2026-08-24 17:05:19.199 |     SELECT
2026-08-24 17:05:19.199 |         o1.* 
2026-08-24 17:05:19.199 |     FROM
2026-08-24 17:05:19.199 |         payment_event_outbox o1 
2026-08-24 17:05:19.199 |     WHERE
2026-08-24 17:05:19.199 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:19.199 |         AND (
2026-08-24 17:05:19.199 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:19.199 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:19.199 |         )   
2026-08-24 17:05:19.199 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:19.199 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:19.199 |             1 
2026-08-24 17:05:19.199 |         FROM
2026-08-24 17:05:19.199 |             payment_event_outbox o2       
2026-08-24 17:05:19.199 |         WHERE
2026-08-24 17:05:19.199 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:19.199 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:19.199 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:19.199 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:19.199 |     ORDER BY
2026-08-24 17:05:19.199 |         o1.created_at ASC 
2026-08-24 17:05:19.199 |     LIMIT
2026-08-24 17:05:19.199 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:24.204 | 2026-08-24 09:05:24 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:24.205 |     SELECT
2026-08-24 17:05:24.205 |         o1.* 
2026-08-24 17:05:24.205 |     FROM
2026-08-24 17:05:24.205 |         payment_event_outbox o1 
2026-08-24 17:05:24.205 |     WHERE
2026-08-24 17:05:24.205 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:24.205 |         AND (
2026-08-24 17:05:24.205 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:24.205 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:24.205 |         )   
2026-08-24 17:05:24.205 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:24.205 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:24.205 |             1 
2026-08-24 17:05:24.205 |         FROM
2026-08-24 17:05:24.205 |             payment_event_outbox o2       
2026-08-24 17:05:24.205 |         WHERE
2026-08-24 17:05:24.205 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:24.205 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:24.205 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:24.205 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:24.205 |     ORDER BY
2026-08-24 17:05:24.205 |         o1.created_at ASC 
2026-08-24 17:05:24.205 |     LIMIT
2026-08-24 17:05:24.205 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:24.205 | Hibernate: 
2026-08-24 17:05:24.205 |     SELECT
2026-08-24 17:05:24.205 |         o1.* 
2026-08-24 17:05:24.205 |     FROM
2026-08-24 17:05:24.205 |         payment_event_outbox o1 
2026-08-24 17:05:24.205 |     WHERE
2026-08-24 17:05:24.205 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:24.205 |         AND (
2026-08-24 17:05:24.205 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:24.205 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:24.205 |         )   
2026-08-24 17:05:24.205 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:24.205 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:24.205 |             1 
2026-08-24 17:05:24.205 |         FROM
2026-08-24 17:05:24.205 |             payment_event_outbox o2       
2026-08-24 17:05:24.205 |         WHERE
2026-08-24 17:05:24.205 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:24.205 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:24.205 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:24.205 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:24.205 |     ORDER BY
2026-08-24 17:05:24.205 |         o1.created_at ASC 
2026-08-24 17:05:24.205 |     LIMIT
2026-08-24 17:05:24.205 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:27.496 | 2026-08-24 09:05:27 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:05:27.498 | 2026-08-24 09:05:27 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:05:27.498 | 2026-08-24 09:05:27 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b10846a9-81d8-4cf2-a534-79ae58348870] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:05:27.506 | 2026-08-24 09:05:27 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b10846a9-81d8-4cf2-a534-79ae58348870] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:05:29.212 | 2026-08-24 09:05:29 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:29.212 |     SELECT
2026-08-24 17:05:29.212 |         o1.* 
2026-08-24 17:05:29.212 |     FROM
2026-08-24 17:05:29.212 |         payment_event_outbox o1 
2026-08-24 17:05:29.212 |     WHERE
2026-08-24 17:05:29.212 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:29.212 |         AND (
2026-08-24 17:05:29.212 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:29.212 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:29.212 |         )   
2026-08-24 17:05:29.212 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:29.212 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:29.212 |             1 
2026-08-24 17:05:29.212 |         FROM
2026-08-24 17:05:29.212 |             payment_event_outbox o2       
2026-08-24 17:05:29.212 |         WHERE
2026-08-24 17:05:29.212 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:29.212 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:29.212 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:29.212 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:29.212 |     ORDER BY
2026-08-24 17:05:29.212 |         o1.created_at ASC 
2026-08-24 17:05:29.212 |     LIMIT
2026-08-24 17:05:29.212 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:29.212 | Hibernate: 
2026-08-24 17:05:29.212 |     SELECT
2026-08-24 17:05:29.212 |         o1.* 
2026-08-24 17:05:29.212 |     FROM
2026-08-24 17:05:29.212 |         payment_event_outbox o1 
2026-08-24 17:05:29.212 |     WHERE
2026-08-24 17:05:29.212 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:29.212 |         AND (
2026-08-24 17:05:29.212 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:29.212 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:29.212 |         )   
2026-08-24 17:05:29.212 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:29.212 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:29.212 |             1 
2026-08-24 17:05:29.212 |         FROM
2026-08-24 17:05:29.212 |             payment_event_outbox o2       
2026-08-24 17:05:29.212 |         WHERE
2026-08-24 17:05:29.212 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:29.212 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:29.212 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:29.212 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:29.212 |     ORDER BY
2026-08-24 17:05:29.212 |         o1.created_at ASC 
2026-08-24 17:05:29.212 |     LIMIT
2026-08-24 17:05:29.212 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:34.217 | 2026-08-24 09:05:34 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:34.217 |     SELECT
2026-08-24 17:05:34.217 |         o1.* 
2026-08-24 17:05:34.217 |     FROM
2026-08-24 17:05:34.217 |         payment_event_outbox o1 
2026-08-24 17:05:34.217 |     WHERE
2026-08-24 17:05:34.217 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:34.217 |         AND (
2026-08-24 17:05:34.217 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:34.217 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:34.217 |         )   
2026-08-24 17:05:34.217 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:34.217 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:34.217 |             1 
2026-08-24 17:05:34.217 |         FROM
2026-08-24 17:05:34.217 |             payment_event_outbox o2       
2026-08-24 17:05:34.217 |         WHERE
2026-08-24 17:05:34.217 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:34.217 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:34.217 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:34.217 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:34.217 |     ORDER BY
2026-08-24 17:05:34.217 |         o1.created_at ASC 
2026-08-24 17:05:34.217 |     LIMIT
2026-08-24 17:05:34.217 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:34.217 | Hibernate: 
2026-08-24 17:05:34.217 |     SELECT
2026-08-24 17:05:34.217 |         o1.* 
2026-08-24 17:05:34.217 |     FROM
2026-08-24 17:05:34.217 |         payment_event_outbox o1 
2026-08-24 17:05:34.217 |     WHERE
2026-08-24 17:05:34.217 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:34.217 |         AND (
2026-08-24 17:05:34.217 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:34.217 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:34.217 |         )   
2026-08-24 17:05:34.217 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:34.217 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:34.217 |             1 
2026-08-24 17:05:34.217 |         FROM
2026-08-24 17:05:34.217 |             payment_event_outbox o2       
2026-08-24 17:05:34.217 |         WHERE
2026-08-24 17:05:34.217 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:34.217 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:34.217 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:34.217 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:34.217 |     ORDER BY
2026-08-24 17:05:34.217 |         o1.created_at ASC 
2026-08-24 17:05:34.217 |     LIMIT
2026-08-24 17:05:34.217 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:34.504 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/forgot-password
2026-08-24 17:05:34.505 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 1cfae029-a5f6-4b6a-a822-eb1867321e7d] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:05:34.506 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 1cfae029-a5f6-4b6a-a822-eb1867321e7d] - Secured POST /api/v1/auth/forgot-password
2026-08-24 17:05:34.510 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.s.a.AuthenticationController [X-Request-Id: 1cfae029-a5f6-4b6a-a822-eb1867321e7d] - [FORGOT-PASSWORD] Reset requested for email: wizaa@gmail.com
2026-08-24 17:05:34.513 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 1cfae029-a5f6-4b6a-a822-eb1867321e7d] - 
2026-08-24 17:05:34.513 |     select
2026-08-24 17:05:34.513 |         c1_0.id,
2026-08-24 17:05:34.513 |         c1_0.created_at,
2026-08-24 17:05:34.513 |         c1_0.email,
2026-08-24 17:05:34.513 |         c1_0.employment_status,
2026-08-24 17:05:34.513 |         c1_0.first_name,
2026-08-24 17:05:34.513 |         c1_0.job_title,
2026-08-24 17:05:34.513 |         c1_0.kyc_status,
2026-08-24 17:05:34.513 |         c1_0.last_name,
2026-08-24 17:05:34.513 |         c1_0.locked,
2026-08-24 17:05:34.513 |         c1_0.monthly_income,
2026-08-24 17:05:34.513 |         c1_0.password,
2026-08-24 17:05:34.513 |         c1_0.risk_profile,
2026-08-24 17:05:34.513 |         c1_0.role,
2026-08-24 17:05:34.513 |         c1_0.source_of_funds 
2026-08-24 17:05:34.513 |     from
2026-08-24 17:05:34.513 |         customers c1_0 
2026-08-24 17:05:34.513 |     where
2026-08-24 17:05:34.513 |         upper(c1_0.email)=upper(?)
2026-08-24 17:05:34.513 | Hibernate: 
2026-08-24 17:05:34.513 |     select
2026-08-24 17:05:34.513 |         c1_0.id,
2026-08-24 17:05:34.513 |         c1_0.created_at,
2026-08-24 17:05:34.513 |         c1_0.email,
2026-08-24 17:05:34.513 |         c1_0.employment_status,
2026-08-24 17:05:34.513 |         c1_0.first_name,
2026-08-24 17:05:34.513 |         c1_0.job_title,
2026-08-24 17:05:34.513 |         c1_0.kyc_status,
2026-08-24 17:05:34.513 |         c1_0.last_name,
2026-08-24 17:05:34.513 |         c1_0.locked,
2026-08-24 17:05:34.513 |         c1_0.monthly_income,
2026-08-24 17:05:34.513 |         c1_0.password,
2026-08-24 17:05:34.513 |         c1_0.risk_profile,
2026-08-24 17:05:34.513 |         c1_0.role,
2026-08-24 17:05:34.513 |         c1_0.source_of_funds 
2026-08-24 17:05:34.513 |     from
2026-08-24 17:05:34.513 |         customers c1_0 
2026-08-24 17:05:34.513 |     where
2026-08-24 17:05:34.513 |         upper(c1_0.email)=upper(?)
2026-08-24 17:05:34.518 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] WARN  c.c.b.s.a.AuthenticationController [X-Request-Id: 1cfae029-a5f6-4b6a-a822-eb1867321e7d] - [FORGOT-PASSWORD] No account found for email 'wizaa@gmail.com'. Returning silent 200.
2026-08-24 17:05:34.520 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 1cfae029-a5f6-4b6a-a822-eb1867321e7d] - [HTTP LOG] POST /api/v1/auth/forgot-password - Status: 200 - Duration: 14ms
2026-08-24 17:05:34.524 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:34.524 |     insert 
2026-08-24 17:05:34.524 |     into
2026-08-24 17:05:34.524 |         api_audit_events
2026-08-24 17:05:34.524 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:05:34.524 |     values
2026-08-24 17:05:34.524 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:05:34.524 | Hibernate: 
2026-08-24 17:05:34.524 |     insert 
2026-08-24 17:05:34.524 |     into
2026-08-24 17:05:34.524 |         api_audit_events
2026-08-24 17:05:34.524 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:05:34.524 |     values
2026-08-24 17:05:34.524 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:05:34.544 | 2026-08-24 09:05:34 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/forgot-password → 200 | stage=COMPLETED | keyId=null | acct=null | latency=19ms
2026-08-24 17:05:37.609 | 2026-08-24 09:05:37 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:05:37.612 | 2026-08-24 09:05:37 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:05:37.613 | 2026-08-24 09:05:37 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 8d1b8722-566d-4d1f-a871-ca62692e760c] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:05:37.624 | 2026-08-24 09:05:37 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 8d1b8722-566d-4d1f-a871-ca62692e760c] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 12ms
2026-08-24 17:05:39.222 | 2026-08-24 09:05:39 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:39.222 |     SELECT
2026-08-24 17:05:39.222 |         o1.* 
2026-08-24 17:05:39.222 |     FROM
2026-08-24 17:05:39.222 |         payment_event_outbox o1 
2026-08-24 17:05:39.222 |     WHERE
2026-08-24 17:05:39.222 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:39.222 |         AND (
2026-08-24 17:05:39.222 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:39.222 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:39.222 |         )   
2026-08-24 17:05:39.222 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:39.222 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:39.222 |             1 
2026-08-24 17:05:39.222 |         FROM
2026-08-24 17:05:39.222 |             payment_event_outbox o2       
2026-08-24 17:05:39.222 |         WHERE
2026-08-24 17:05:39.222 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:39.222 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:39.222 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:39.222 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:39.222 |     ORDER BY
2026-08-24 17:05:39.222 |         o1.created_at ASC 
2026-08-24 17:05:39.222 |     LIMIT
2026-08-24 17:05:39.222 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:39.222 | Hibernate: 
2026-08-24 17:05:39.222 |     SELECT
2026-08-24 17:05:39.222 |         o1.* 
2026-08-24 17:05:39.222 |     FROM
2026-08-24 17:05:39.222 |         payment_event_outbox o1 
2026-08-24 17:05:39.222 |     WHERE
2026-08-24 17:05:39.222 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:39.222 |         AND (
2026-08-24 17:05:39.222 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:39.222 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:39.222 |         )   
2026-08-24 17:05:39.222 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:39.222 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:39.222 |             1 
2026-08-24 17:05:39.222 |         FROM
2026-08-24 17:05:39.222 |             payment_event_outbox o2       
2026-08-24 17:05:39.222 |         WHERE
2026-08-24 17:05:39.222 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:39.222 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:39.222 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:39.222 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:39.222 |     ORDER BY
2026-08-24 17:05:39.222 |         o1.created_at ASC 
2026-08-24 17:05:39.222 |     LIMIT
2026-08-24 17:05:39.222 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:44.059 | 2026-08-24 09:05:44 [MessageBroker-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:44.059 |     SELECT
2026-08-24 17:05:44.059 |         * 
2026-08-24 17:05:44.059 |     FROM
2026-08-24 17:05:44.059 |         payment_event_outbox 
2026-08-24 17:05:44.059 |     WHERE
2026-08-24 17:05:44.059 |         status = 'DELIVERING'   
2026-08-24 17:05:44.059 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:44.059 | Hibernate: 
2026-08-24 17:05:44.059 |     SELECT
2026-08-24 17:05:44.059 |         * 
2026-08-24 17:05:44.059 |     FROM
2026-08-24 17:05:44.059 |         payment_event_outbox 
2026-08-24 17:05:44.059 |     WHERE
2026-08-24 17:05:44.059 |         status = 'DELIVERING'   
2026-08-24 17:05:44.059 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:44.064 | 2026-08-24 09:05:44 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:44.064 |     select
2026-08-24 17:05:44.064 |         icl1_0.id,
2026-08-24 17:05:44.064 |         icl1_0.attempt_count,
2026-08-24 17:05:44.064 |         icl1_0.callback_url,
2026-08-24 17:05:44.064 |         icl1_0.created_at,
2026-08-24 17:05:44.064 |         icl1_0.next_retry_at,
2026-08-24 17:05:44.064 |         icl1_0.payload,
2026-08-24 17:05:44.064 |         icl1_0.payment_session_id,
2026-08-24 17:05:44.064 |         icl1_0.response_body,
2026-08-24 17:05:44.064 |         icl1_0.response_code,
2026-08-24 17:05:44.064 |         icl1_0.status,
2026-08-24 17:05:44.064 |         icl1_0.updated_at 
2026-08-24 17:05:44.064 |     from
2026-08-24 17:05:44.064 |         institution_callback_log icl1_0 
2026-08-24 17:05:44.064 |     where
2026-08-24 17:05:44.064 |         icl1_0.status=? 
2026-08-24 17:05:44.064 |         and icl1_0.next_retry_at<?
2026-08-24 17:05:44.064 | Hibernate: 
2026-08-24 17:05:44.064 |     select
2026-08-24 17:05:44.064 |         icl1_0.id,
2026-08-24 17:05:44.064 |         icl1_0.attempt_count,
2026-08-24 17:05:44.064 |         icl1_0.callback_url,
2026-08-24 17:05:44.064 |         icl1_0.created_at,
2026-08-24 17:05:44.064 |         icl1_0.next_retry_at,
2026-08-24 17:05:44.064 |         icl1_0.payload,
2026-08-24 17:05:44.064 |         icl1_0.payment_session_id,
2026-08-24 17:05:44.064 |         icl1_0.response_body,
2026-08-24 17:05:44.064 |         icl1_0.response_code,
2026-08-24 17:05:44.064 |         icl1_0.status,
2026-08-24 17:05:44.064 |         icl1_0.updated_at 
2026-08-24 17:05:44.064 |     from
2026-08-24 17:05:44.064 |         institution_callback_log icl1_0 
2026-08-24 17:05:44.064 |     where
2026-08-24 17:05:44.064 |         icl1_0.status=? 
2026-08-24 17:05:44.064 |         and icl1_0.next_retry_at<?
2026-08-24 17:05:44.225 | 2026-08-24 09:05:44 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:44.225 |     SELECT
2026-08-24 17:05:44.225 |         o1.* 
2026-08-24 17:05:44.225 |     FROM
2026-08-24 17:05:44.225 |         payment_event_outbox o1 
2026-08-24 17:05:44.225 |     WHERE
2026-08-24 17:05:44.225 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:44.225 |         AND (
2026-08-24 17:05:44.225 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:44.225 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:44.225 |         )   
2026-08-24 17:05:44.225 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:44.225 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:44.225 |             1 
2026-08-24 17:05:44.225 |         FROM
2026-08-24 17:05:44.225 |             payment_event_outbox o2       
2026-08-24 17:05:44.225 |         WHERE
2026-08-24 17:05:44.225 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:44.225 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:44.225 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:44.225 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:44.225 |     ORDER BY
2026-08-24 17:05:44.225 |         o1.created_at ASC 
2026-08-24 17:05:44.225 |     LIMIT
2026-08-24 17:05:44.225 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:44.225 | Hibernate: 
2026-08-24 17:05:44.225 |     SELECT
2026-08-24 17:05:44.225 |         o1.* 
2026-08-24 17:05:44.225 |     FROM
2026-08-24 17:05:44.225 |         payment_event_outbox o1 
2026-08-24 17:05:44.225 |     WHERE
2026-08-24 17:05:44.225 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:44.225 |         AND (
2026-08-24 17:05:44.225 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:44.225 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:44.225 |         )   
2026-08-24 17:05:44.225 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:44.225 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:44.225 |             1 
2026-08-24 17:05:44.225 |         FROM
2026-08-24 17:05:44.225 |             payment_event_outbox o2       
2026-08-24 17:05:44.225 |         WHERE
2026-08-24 17:05:44.225 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:44.225 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:44.225 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:44.225 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:44.225 |     ORDER BY
2026-08-24 17:05:44.225 |         o1.created_at ASC 
2026-08-24 17:05:44.225 |     LIMIT
2026-08-24 17:05:44.225 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:47.730 | 2026-08-24 09:05:47 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:05:47.732 | 2026-08-24 09:05:47 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:05:47.733 | 2026-08-24 09:05:47 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 57b900cc-718e-4799-be03-444be317c32a] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:05:47.741 | 2026-08-24 09:05:47 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 57b900cc-718e-4799-be03-444be317c32a] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 8ms
2026-08-24 17:05:49.230 | 2026-08-24 09:05:49 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:49.230 |     SELECT
2026-08-24 17:05:49.230 |         o1.* 
2026-08-24 17:05:49.230 |     FROM
2026-08-24 17:05:49.230 |         payment_event_outbox o1 
2026-08-24 17:05:49.230 |     WHERE
2026-08-24 17:05:49.230 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:49.230 |         AND (
2026-08-24 17:05:49.230 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:49.230 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:49.230 |         )   
2026-08-24 17:05:49.230 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:49.230 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:49.230 |             1 
2026-08-24 17:05:49.230 |         FROM
2026-08-24 17:05:49.230 |             payment_event_outbox o2       
2026-08-24 17:05:49.230 |         WHERE
2026-08-24 17:05:49.230 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:49.230 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:49.230 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:49.230 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:49.230 |     ORDER BY
2026-08-24 17:05:49.230 |         o1.created_at ASC 
2026-08-24 17:05:49.230 |     LIMIT
2026-08-24 17:05:49.230 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:49.230 | Hibernate: 
2026-08-24 17:05:49.230 |     SELECT
2026-08-24 17:05:49.230 |         o1.* 
2026-08-24 17:05:49.230 |     FROM
2026-08-24 17:05:49.230 |         payment_event_outbox o1 
2026-08-24 17:05:49.230 |     WHERE
2026-08-24 17:05:49.230 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:49.230 |         AND (
2026-08-24 17:05:49.230 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:49.230 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:49.230 |         )   
2026-08-24 17:05:49.230 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:49.230 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:49.230 |             1 
2026-08-24 17:05:49.230 |         FROM
2026-08-24 17:05:49.230 |             payment_event_outbox o2       
2026-08-24 17:05:49.230 |         WHERE
2026-08-24 17:05:49.230 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:49.230 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:49.230 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:49.230 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:49.230 |     ORDER BY
2026-08-24 17:05:49.230 |         o1.created_at ASC 
2026-08-24 17:05:49.230 |     LIMIT
2026-08-24 17:05:49.230 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:54.239 | 2026-08-24 09:05:54 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:54.239 |     SELECT
2026-08-24 17:05:54.239 |         o1.* 
2026-08-24 17:05:54.239 |     FROM
2026-08-24 17:05:54.239 |         payment_event_outbox o1 
2026-08-24 17:05:54.239 |     WHERE
2026-08-24 17:05:54.239 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:54.239 |         AND (
2026-08-24 17:05:54.239 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:54.239 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:54.239 |         )   
2026-08-24 17:05:54.239 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:54.239 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:54.239 |             1 
2026-08-24 17:05:54.239 |         FROM
2026-08-24 17:05:54.239 |             payment_event_outbox o2       
2026-08-24 17:05:54.239 |         WHERE
2026-08-24 17:05:54.239 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:54.239 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:54.239 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:54.239 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:54.239 |     ORDER BY
2026-08-24 17:05:54.239 |         o1.created_at ASC 
2026-08-24 17:05:54.239 |     LIMIT
2026-08-24 17:05:54.239 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:54.239 | Hibernate: 
2026-08-24 17:05:54.239 |     SELECT
2026-08-24 17:05:54.239 |         o1.* 
2026-08-24 17:05:54.239 |     FROM
2026-08-24 17:05:54.239 |         payment_event_outbox o1 
2026-08-24 17:05:54.239 |     WHERE
2026-08-24 17:05:54.239 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:54.239 |         AND (
2026-08-24 17:05:54.239 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:54.239 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:54.239 |         )   
2026-08-24 17:05:54.239 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:54.239 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:54.239 |             1 
2026-08-24 17:05:54.239 |         FROM
2026-08-24 17:05:54.239 |             payment_event_outbox o2       
2026-08-24 17:05:54.239 |         WHERE
2026-08-24 17:05:54.239 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:54.239 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:54.239 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:54.239 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:54.239 |     ORDER BY
2026-08-24 17:05:54.239 |         o1.created_at ASC 
2026-08-24 17:05:54.239 |     LIMIT
2026-08-24 17:05:54.239 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:57.882 | 2026-08-24 09:05:57 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:05:57.883 | 2026-08-24 09:05:57 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:05:57.884 | 2026-08-24 09:05:57 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: fa0dd6df-c9bb-493b-92b1-46025a4728eb] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:05:57.891 | 2026-08-24 09:05:57 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: fa0dd6df-c9bb-493b-92b1-46025a4728eb] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:05:59.247 | 2026-08-24 09:05:59 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:05:59.248 |     SELECT
2026-08-24 17:05:59.248 |         o1.* 
2026-08-24 17:05:59.248 |     FROM
2026-08-24 17:05:59.248 |         payment_event_outbox o1 
2026-08-24 17:05:59.248 |     WHERE
2026-08-24 17:05:59.248 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:59.248 |         AND (
2026-08-24 17:05:59.248 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:59.248 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:59.248 |         )   
2026-08-24 17:05:59.248 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:59.248 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:59.248 |             1 
2026-08-24 17:05:59.248 |         FROM
2026-08-24 17:05:59.248 |             payment_event_outbox o2       
2026-08-24 17:05:59.248 |         WHERE
2026-08-24 17:05:59.248 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:59.248 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:59.248 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:59.248 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:59.248 |     ORDER BY
2026-08-24 17:05:59.248 |         o1.created_at ASC 
2026-08-24 17:05:59.248 |     LIMIT
2026-08-24 17:05:59.248 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:05:59.248 | Hibernate: 
2026-08-24 17:05:59.248 |     SELECT
2026-08-24 17:05:59.248 |         o1.* 
2026-08-24 17:05:59.248 |     FROM
2026-08-24 17:05:59.248 |         payment_event_outbox o1 
2026-08-24 17:05:59.248 |     WHERE
2026-08-24 17:05:59.248 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:05:59.248 |         AND (
2026-08-24 17:05:59.248 |             o1.next_attempt_at IS NULL 
2026-08-24 17:05:59.248 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:05:59.248 |         )   
2026-08-24 17:05:59.248 |         AND o1.locked_at IS NULL   
2026-08-24 17:05:59.248 |         AND NOT EXISTS (       SELECT
2026-08-24 17:05:59.248 |             1 
2026-08-24 17:05:59.248 |         FROM
2026-08-24 17:05:59.248 |             payment_event_outbox o2       
2026-08-24 17:05:59.248 |         WHERE
2026-08-24 17:05:59.248 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:05:59.248 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:05:59.248 |             AND o2.sequence < o1.sequence         
2026-08-24 17:05:59.248 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:05:59.248 |     ORDER BY
2026-08-24 17:05:59.248 |         o1.created_at ASC 
2026-08-24 17:05:59.248 |     LIMIT
2026-08-24 17:05:59.248 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:01.053 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/register
2026-08-24 17:06:01.054 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b5df9b13-73a5-4dd5-8be4-a859c222174c] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:01.055 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: b5df9b13-73a5-4dd5-8be4-a859c222174c] - Secured POST /api/v1/auth/register
2026-08-24 17:06:01.155 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: b5df9b13-73a5-4dd5-8be4-a859c222174c] - 
2026-08-24 17:06:01.155 |     insert 
2026-08-24 17:06:01.155 |     into
2026-08-24 17:06:01.155 |         customers
2026-08-24 17:06:01.155 |         (created_at, email, employment_status, first_name, job_title, kyc_status, last_name, locked, monthly_income, password, risk_profile, role, source_of_funds) 
2026-08-24 17:06:01.155 |     values
2026-08-24 17:06:01.155 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.155 | Hibernate: 
2026-08-24 17:06:01.155 |     insert 
2026-08-24 17:06:01.155 |     into
2026-08-24 17:06:01.155 |         customers
2026-08-24 17:06:01.155 |         (created_at, email, employment_status, first_name, job_title, kyc_status, last_name, locked, monthly_income, password, risk_profile, role, source_of_funds) 
2026-08-24 17:06:01.155 |     values
2026-08-24 17:06:01.155 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.180 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.a.a.AccountProvisioningService [X-Request-Id: b5df9b13-73a5-4dd5-8be4-a859c222174c] - [VAM PROVISIONING] Orchestrating creation of MAIN ledger for Customer 4
2026-08-24 17:06:01.198 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: b5df9b13-73a5-4dd5-8be4-a859c222174c] - 
2026-08-24 17:06:01.198 |     insert 
2026-08-24 17:06:01.198 |     into
2026-08-24 17:06:01.198 |         accounts
2026-08-24 17:06:01.198 |         (account_name, account_number, account_type, allow_incoming, allow_outgoing, balance, card_cvv, card_expiry, created_at, currency, customer_id, daily_limit, frozen, monthly_limit, parent_account_id, require_dual_approval, status, swift_code, updated_at, version) 
2026-08-24 17:06:01.198 |     values
2026-08-24 17:06:01.198 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.198 | Hibernate: 
2026-08-24 17:06:01.198 |     insert 
2026-08-24 17:06:01.198 |     into
2026-08-24 17:06:01.198 |         accounts
2026-08-24 17:06:01.198 |         (account_name, account_number, account_type, allow_incoming, allow_outgoing, balance, card_cvv, card_expiry, created_at, currency, customer_id, daily_limit, frozen, monthly_limit, parent_account_id, require_dual_approval, status, swift_code, updated_at, version) 
2026-08-24 17:06:01.198 |     values
2026-08-24 17:06:01.198 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.217 | 2026-08-24 09:06:01 [AsyncThread-2] INFO  c.c.b.c.audit.AuditEventPublisher [X-Request-Id: ] - [AUDIT EVENT] Action: VAM_ACCOUNT_PROVISIONED, User: Customer ID: 4, CorrelationID: req-92ea4163-50a7-43c9-951c-751da3bfc54d, Details: Provisioned MAIN account ending in 9884 under Parent null
2026-08-24 17:06:01.221 | 2026-08-24 09:06:01 [AsyncThread-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:01.221 |     insert 
2026-08-24 17:06:01.221 |     into
2026-08-24 17:06:01.221 |         audit_logs
2026-08-24 17:06:01.221 |         (action, actor, created_at, details, ip_address, resource_id) 
2026-08-24 17:06:01.221 |     values
2026-08-24 17:06:01.221 |         (?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.221 | Hibernate: 
2026-08-24 17:06:01.221 |     insert 
2026-08-24 17:06:01.221 |     into
2026-08-24 17:06:01.221 |         audit_logs
2026-08-24 17:06:01.221 |         (action, actor, created_at, details, ip_address, resource_id) 
2026-08-24 17:06:01.221 |     values
2026-08-24 17:06:01.221 |         (?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.226 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b5df9b13-73a5-4dd5-8be4-a859c222174c] - [HTTP LOG] POST /api/v1/auth/register - Status: 200 - Duration: 170ms
2026-08-24 17:06:01.228 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:01.228 |     insert 
2026-08-24 17:06:01.228 |     into
2026-08-24 17:06:01.228 |         api_audit_events
2026-08-24 17:06:01.228 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:01.228 |     values
2026-08-24 17:06:01.228 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.228 | Hibernate: 
2026-08-24 17:06:01.228 |     insert 
2026-08-24 17:06:01.228 |     into
2026-08-24 17:06:01.228 |         api_audit_events
2026-08-24 17:06:01.228 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:01.228 |     values
2026-08-24 17:06:01.228 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:01.236 | 2026-08-24 09:06:01 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/register → 200 | stage=COMPLETED | keyId=null | acct=null | latency=176ms
2026-08-24 17:06:02.513 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/otp/send
2026-08-24 17:06:02.514 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: cdd3830d-47e6-4e98-9444-d9d84763bba9] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:02.514 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: cdd3830d-47e6-4e98-9444-d9d84763bba9] - Secured POST /api/v1/auth/otp/send
2026-08-24 17:06:02.514 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/otp/send
2026-08-24 17:06:02.516 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 7f8055f3-7d2b-4437-90bc-d71a4960a9b2] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:02.517 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 7f8055f3-7d2b-4437-90bc-d71a4960a9b2] - Secured POST /api/v1/auth/otp/send
2026-08-24 17:06:02.524 | 2026-08-24 09:06:02 [AsyncThread-3] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Sending email to: wizaa@gmail.com
2026-08-24 17:06:02.524 | 2026-08-24 09:06:02 [AsyncThread-4] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Sending email to: wizaa@gmail.com
2026-08-24 17:06:02.527 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 7f8055f3-7d2b-4437-90bc-d71a4960a9b2] - [HTTP LOG] POST /api/v1/auth/otp/send - Status: 200 - Duration: 9ms
2026-08-24 17:06:02.527 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: cdd3830d-47e6-4e98-9444-d9d84763bba9] - [HTTP LOG] POST /api/v1/auth/otp/send - Status: 200 - Duration: 12ms
2026-08-24 17:06:02.530 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:02.530 |     insert 
2026-08-24 17:06:02.530 |     into
2026-08-24 17:06:02.530 |         api_audit_events
2026-08-24 17:06:02.530 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:02.530 |     values
2026-08-24 17:06:02.530 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:02.530 | Hibernate: 
2026-08-24 17:06:02.530 |     insert 
2026-08-24 17:06:02.530 |     into
2026-08-24 17:06:02.530 |         api_audit_events
2026-08-24 17:06:02.530 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:02.530 |     values
2026-08-24 17:06:02.530 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:02.531 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:02.531 |     insert 
2026-08-24 17:06:02.531 |     into
2026-08-24 17:06:02.531 |         api_audit_events
2026-08-24 17:06:02.531 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:02.531 |     values
2026-08-24 17:06:02.531 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:02.531 | Hibernate: 
2026-08-24 17:06:02.531 |     insert 
2026-08-24 17:06:02.531 |     into
2026-08-24 17:06:02.531 |         api_audit_events
2026-08-24 17:06:02.531 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:02.531 |     values
2026-08-24 17:06:02.531 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:02.542 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/otp/send → 200 | stage=COMPLETED | keyId=null | acct=null | latency=15ms
2026-08-24 17:06:02.542 | 2026-08-24 09:06:02 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/otp/send → 200 | stage=COMPLETED | keyId=null | acct=null | latency=13ms
2026-08-24 17:06:04.254 | 2026-08-24 09:06:04 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:04.254 |     SELECT
2026-08-24 17:06:04.254 |         o1.* 
2026-08-24 17:06:04.254 |     FROM
2026-08-24 17:06:04.254 |         payment_event_outbox o1 
2026-08-24 17:06:04.254 |     WHERE
2026-08-24 17:06:04.254 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:04.254 |         AND (
2026-08-24 17:06:04.254 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:04.254 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:04.254 |         )   
2026-08-24 17:06:04.254 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:04.254 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:04.254 |             1 
2026-08-24 17:06:04.254 |         FROM
2026-08-24 17:06:04.254 |             payment_event_outbox o2       
2026-08-24 17:06:04.254 |         WHERE
2026-08-24 17:06:04.254 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:04.254 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:04.254 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:04.254 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:04.254 |     ORDER BY
2026-08-24 17:06:04.254 |         o1.created_at ASC 
2026-08-24 17:06:04.254 |     LIMIT
2026-08-24 17:06:04.254 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:04.254 | Hibernate: 
2026-08-24 17:06:04.254 |     SELECT
2026-08-24 17:06:04.254 |         o1.* 
2026-08-24 17:06:04.254 |     FROM
2026-08-24 17:06:04.254 |         payment_event_outbox o1 
2026-08-24 17:06:04.254 |     WHERE
2026-08-24 17:06:04.254 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:04.254 |         AND (
2026-08-24 17:06:04.254 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:04.254 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:04.254 |         )   
2026-08-24 17:06:04.254 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:04.254 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:04.254 |             1 
2026-08-24 17:06:04.254 |         FROM
2026-08-24 17:06:04.254 |             payment_event_outbox o2       
2026-08-24 17:06:04.254 |         WHERE
2026-08-24 17:06:04.254 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:04.254 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:04.254 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:04.254 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:04.254 |     ORDER BY
2026-08-24 17:06:04.254 |         o1.created_at ASC 
2026-08-24 17:06:04.254 |     LIMIT
2026-08-24 17:06:04.254 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:07.514 | 2026-08-24 09:06:07 [AsyncThread-3] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Email dispatched successfully to wizaa@gmail.com
2026-08-24 17:06:07.791 | 2026-08-24 09:06:07 [AsyncThread-4] INFO  c.c.b.n.i.EmailProviderAdapter [X-Request-Id: ] - [NOTIFICATION ADAPTER] Email dispatched successfully to wizaa@gmail.com
2026-08-24 17:06:08.004 | 2026-08-24 09:06:08 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:06:08.005 | 2026-08-24 09:06:08 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:06:08.005 | 2026-08-24 09:06:08 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: c262d64c-903c-48cf-9391-9361f6ad806b] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:08.011 | 2026-08-24 09:06:08 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: c262d64c-903c-48cf-9391-9361f6ad806b] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:06:09.260 | 2026-08-24 09:06:09 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:09.260 |     SELECT
2026-08-24 17:06:09.260 |         o1.* 
2026-08-24 17:06:09.260 |     FROM
2026-08-24 17:06:09.260 |         payment_event_outbox o1 
2026-08-24 17:06:09.260 |     WHERE
2026-08-24 17:06:09.260 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:09.260 |         AND (
2026-08-24 17:06:09.260 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:09.260 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:09.260 |         )   
2026-08-24 17:06:09.260 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:09.260 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:09.260 |             1 
2026-08-24 17:06:09.260 |         FROM
2026-08-24 17:06:09.260 |             payment_event_outbox o2       
2026-08-24 17:06:09.260 |         WHERE
2026-08-24 17:06:09.260 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:09.260 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:09.260 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:09.260 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:09.260 |     ORDER BY
2026-08-24 17:06:09.260 |         o1.created_at ASC 
2026-08-24 17:06:09.260 |     LIMIT
2026-08-24 17:06:09.260 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:09.260 | Hibernate: 
2026-08-24 17:06:09.260 |     SELECT
2026-08-24 17:06:09.260 |         o1.* 
2026-08-24 17:06:09.260 |     FROM
2026-08-24 17:06:09.260 |         payment_event_outbox o1 
2026-08-24 17:06:09.260 |     WHERE
2026-08-24 17:06:09.260 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:09.260 |         AND (
2026-08-24 17:06:09.260 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:09.260 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:09.260 |         )   
2026-08-24 17:06:09.260 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:09.260 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:09.260 |             1 
2026-08-24 17:06:09.260 |         FROM
2026-08-24 17:06:09.260 |             payment_event_outbox o2       
2026-08-24 17:06:09.260 |         WHERE
2026-08-24 17:06:09.260 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:09.260 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:09.260 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:09.260 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:09.260 |     ORDER BY
2026-08-24 17:06:09.260 |         o1.created_at ASC 
2026-08-24 17:06:09.260 |     LIMIT
2026-08-24 17:06:09.260 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:14.264 | 2026-08-24 09:06:14 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:14.264 |     SELECT
2026-08-24 17:06:14.264 |         o1.* 
2026-08-24 17:06:14.264 |     FROM
2026-08-24 17:06:14.264 |         payment_event_outbox o1 
2026-08-24 17:06:14.264 |     WHERE
2026-08-24 17:06:14.264 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:14.264 |         AND (
2026-08-24 17:06:14.264 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:14.264 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:14.264 |         )   
2026-08-24 17:06:14.264 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:14.264 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:14.264 |             1 
2026-08-24 17:06:14.264 |         FROM
2026-08-24 17:06:14.264 |             payment_event_outbox o2       
2026-08-24 17:06:14.264 |         WHERE
2026-08-24 17:06:14.264 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:14.264 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:14.264 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:14.264 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:14.264 |     ORDER BY
2026-08-24 17:06:14.264 |         o1.created_at ASC 
2026-08-24 17:06:14.264 |     LIMIT
2026-08-24 17:06:14.264 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:14.264 | Hibernate: 
2026-08-24 17:06:14.264 |     SELECT
2026-08-24 17:06:14.264 |         o1.* 
2026-08-24 17:06:14.264 |     FROM
2026-08-24 17:06:14.264 |         payment_event_outbox o1 
2026-08-24 17:06:14.264 |     WHERE
2026-08-24 17:06:14.264 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:14.264 |         AND (
2026-08-24 17:06:14.264 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:14.264 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:14.264 |         )   
2026-08-24 17:06:14.264 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:14.264 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:14.264 |             1 
2026-08-24 17:06:14.264 |         FROM
2026-08-24 17:06:14.264 |             payment_event_outbox o2       
2026-08-24 17:06:14.264 |         WHERE
2026-08-24 17:06:14.264 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:14.264 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:14.264 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:14.264 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:14.264 |     ORDER BY
2026-08-24 17:06:14.264 |         o1.created_at ASC 
2026-08-24 17:06:14.264 |     LIMIT
2026-08-24 17:06:14.264 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:18.130 | 2026-08-24 09:06:18 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:06:18.131 | 2026-08-24 09:06:18 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:06:18.132 | 2026-08-24 09:06:18 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 660a2654-2238-4a7a-96e0-2b8c82a270b4] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:18.139 | 2026-08-24 09:06:18 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 660a2654-2238-4a7a-96e0-2b8c82a270b4] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:06:19.270 | 2026-08-24 09:06:19 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:19.271 |     SELECT
2026-08-24 17:06:19.271 |         o1.* 
2026-08-24 17:06:19.271 |     FROM
2026-08-24 17:06:19.271 |         payment_event_outbox o1 
2026-08-24 17:06:19.271 |     WHERE
2026-08-24 17:06:19.271 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:19.271 |         AND (
2026-08-24 17:06:19.271 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:19.271 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:19.271 |         )   
2026-08-24 17:06:19.271 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:19.271 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:19.271 |             1 
2026-08-24 17:06:19.271 |         FROM
2026-08-24 17:06:19.271 |             payment_event_outbox o2       
2026-08-24 17:06:19.271 |         WHERE
2026-08-24 17:06:19.271 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:19.271 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:19.271 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:19.271 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:19.271 |     ORDER BY
2026-08-24 17:06:19.271 |         o1.created_at ASC 
2026-08-24 17:06:19.271 |     LIMIT
2026-08-24 17:06:19.271 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:19.271 | Hibernate: 
2026-08-24 17:06:19.271 |     SELECT
2026-08-24 17:06:19.271 |         o1.* 
2026-08-24 17:06:19.271 |     FROM
2026-08-24 17:06:19.271 |         payment_event_outbox o1 
2026-08-24 17:06:19.271 |     WHERE
2026-08-24 17:06:19.271 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:19.271 |         AND (
2026-08-24 17:06:19.271 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:19.271 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:19.271 |         )   
2026-08-24 17:06:19.271 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:19.271 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:19.271 |             1 
2026-08-24 17:06:19.271 |         FROM
2026-08-24 17:06:19.271 |             payment_event_outbox o2       
2026-08-24 17:06:19.271 |         WHERE
2026-08-24 17:06:19.271 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:19.271 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:19.271 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:19.271 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:19.271 |     ORDER BY
2026-08-24 17:06:19.271 |         o1.created_at ASC 
2026-08-24 17:06:19.271 |     LIMIT
2026-08-24 17:06:19.271 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:24.276 | 2026-08-24 09:06:24 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:24.276 |     SELECT
2026-08-24 17:06:24.276 |         o1.* 
2026-08-24 17:06:24.276 |     FROM
2026-08-24 17:06:24.276 |         payment_event_outbox o1 
2026-08-24 17:06:24.276 |     WHERE
2026-08-24 17:06:24.276 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:24.276 |         AND (
2026-08-24 17:06:24.276 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:24.276 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:24.276 |         )   
2026-08-24 17:06:24.276 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:24.276 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:24.276 |             1 
2026-08-24 17:06:24.276 |         FROM
2026-08-24 17:06:24.276 |             payment_event_outbox o2       
2026-08-24 17:06:24.276 |         WHERE
2026-08-24 17:06:24.276 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:24.276 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:24.276 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:24.276 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:24.276 |     ORDER BY
2026-08-24 17:06:24.276 |         o1.created_at ASC 
2026-08-24 17:06:24.276 |     LIMIT
2026-08-24 17:06:24.276 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:24.276 | Hibernate: 
2026-08-24 17:06:24.276 |     SELECT
2026-08-24 17:06:24.276 |         o1.* 
2026-08-24 17:06:24.276 |     FROM
2026-08-24 17:06:24.276 |         payment_event_outbox o1 
2026-08-24 17:06:24.276 |     WHERE
2026-08-24 17:06:24.276 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:24.276 |         AND (
2026-08-24 17:06:24.276 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:24.276 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:24.276 |         )   
2026-08-24 17:06:24.276 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:24.276 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:24.276 |             1 
2026-08-24 17:06:24.276 |         FROM
2026-08-24 17:06:24.276 |             payment_event_outbox o2       
2026-08-24 17:06:24.276 |         WHERE
2026-08-24 17:06:24.276 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:24.276 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:24.276 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:24.276 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:24.276 |     ORDER BY
2026-08-24 17:06:24.276 |         o1.created_at ASC 
2026-08-24 17:06:24.276 |     LIMIT
2026-08-24 17:06:24.276 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:24.577 | 2026-08-24 09:06:24 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/otp/verify
2026-08-24 17:06:24.578 | 2026-08-24 09:06:24 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 8b12956a-ecf0-4154-9195-71ce306c3a32] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:24.579 | 2026-08-24 09:06:24 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 8b12956a-ecf0-4154-9195-71ce306c3a32] - Secured POST /api/v1/auth/otp/verify
2026-08-24 17:06:24.593 | 2026-08-24 09:06:24 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 8b12956a-ecf0-4154-9195-71ce306c3a32] - [HTTP LOG] POST /api/v1/auth/otp/verify - Status: 403 - Duration: 13ms
2026-08-24 17:06:24.595 | 2026-08-24 09:06:24 [http-nio-0.0.0.0-8080-exec-6] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:24.595 |     insert 
2026-08-24 17:06:24.595 |     into
2026-08-24 17:06:24.595 |         api_audit_events
2026-08-24 17:06:24.595 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:24.595 |     values
2026-08-24 17:06:24.595 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:24.595 | Hibernate: 
2026-08-24 17:06:24.595 |     insert 
2026-08-24 17:06:24.595 |     into
2026-08-24 17:06:24.595 |         api_audit_events
2026-08-24 17:06:24.596 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:24.596 |     values
2026-08-24 17:06:24.596 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:24.607 | 2026-08-24 09:06:24 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/otp/verify → 403 | stage=COMPLETED | keyId=null | acct=null | latency=17ms
2026-08-24 17:06:28.234 | 2026-08-24 09:06:28 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:06:28.237 | 2026-08-24 09:06:28 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:06:28.237 | 2026-08-24 09:06:28 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 83af604c-928f-4681-9c07-72ed881ebb74] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:28.245 | 2026-08-24 09:06:28 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 83af604c-928f-4681-9c07-72ed881ebb74] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:06:29.284 | 2026-08-24 09:06:29 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:29.284 |     SELECT
2026-08-24 17:06:29.284 |         o1.* 
2026-08-24 17:06:29.284 |     FROM
2026-08-24 17:06:29.284 |         payment_event_outbox o1 
2026-08-24 17:06:29.284 |     WHERE
2026-08-24 17:06:29.284 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:29.284 |         AND (
2026-08-24 17:06:29.284 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:29.284 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:29.284 |         )   
2026-08-24 17:06:29.284 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:29.284 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:29.284 |             1 
2026-08-24 17:06:29.284 |         FROM
2026-08-24 17:06:29.284 |             payment_event_outbox o2       
2026-08-24 17:06:29.284 |         WHERE
2026-08-24 17:06:29.284 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:29.284 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:29.284 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:29.284 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:29.284 |     ORDER BY
2026-08-24 17:06:29.284 |         o1.created_at ASC 
2026-08-24 17:06:29.284 |     LIMIT
2026-08-24 17:06:29.284 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:29.284 | Hibernate: 
2026-08-24 17:06:29.284 |     SELECT
2026-08-24 17:06:29.284 |         o1.* 
2026-08-24 17:06:29.284 |     FROM
2026-08-24 17:06:29.284 |         payment_event_outbox o1 
2026-08-24 17:06:29.284 |     WHERE
2026-08-24 17:06:29.284 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:29.284 |         AND (
2026-08-24 17:06:29.284 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:29.284 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:29.284 |         )   
2026-08-24 17:06:29.284 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:29.284 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:29.284 |             1 
2026-08-24 17:06:29.284 |         FROM
2026-08-24 17:06:29.284 |             payment_event_outbox o2       
2026-08-24 17:06:29.284 |         WHERE
2026-08-24 17:06:29.284 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:29.284 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:29.284 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:29.284 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:29.284 |     ORDER BY
2026-08-24 17:06:29.284 |         o1.created_at ASC 
2026-08-24 17:06:29.284 |     LIMIT
2026-08-24 17:06:29.284 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:31.963 | 2026-08-24 09:06:31 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/otp/verify
2026-08-24 17:06:31.964 | 2026-08-24 09:06:31 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 48df9e64-46b9-4dce-bf27-05b6ddd9d337] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:31.965 | 2026-08-24 09:06:31 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 48df9e64-46b9-4dce-bf27-05b6ddd9d337] - Secured POST /api/v1/auth/otp/verify
2026-08-24 17:06:31.974 | 2026-08-24 09:06:31 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 48df9e64-46b9-4dce-bf27-05b6ddd9d337] - [HTTP LOG] POST /api/v1/auth/otp/verify - Status: 200 - Duration: 8ms
2026-08-24 17:06:31.978 | 2026-08-24 09:06:31 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:31.978 |     insert 
2026-08-24 17:06:31.978 |     into
2026-08-24 17:06:31.978 |         api_audit_events
2026-08-24 17:06:31.978 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:31.978 |     values
2026-08-24 17:06:31.978 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:31.978 | Hibernate: 
2026-08-24 17:06:31.978 |     insert 
2026-08-24 17:06:31.978 |     into
2026-08-24 17:06:31.978 |         api_audit_events
2026-08-24 17:06:31.978 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:31.978 |     values
2026-08-24 17:06:31.978 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:32.002 | 2026-08-24 09:06:32 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/otp/verify → 200 | stage=COMPLETED | keyId=null | acct=null | latency=12ms
2026-08-24 17:06:34.290 | 2026-08-24 09:06:34 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:34.290 |     SELECT
2026-08-24 17:06:34.290 |         o1.* 
2026-08-24 17:06:34.290 |     FROM
2026-08-24 17:06:34.290 |         payment_event_outbox o1 
2026-08-24 17:06:34.290 |     WHERE
2026-08-24 17:06:34.290 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:34.290 |         AND (
2026-08-24 17:06:34.290 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:34.290 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:34.290 |         )   
2026-08-24 17:06:34.290 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:34.290 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:34.290 |             1 
2026-08-24 17:06:34.290 |         FROM
2026-08-24 17:06:34.290 |             payment_event_outbox o2       
2026-08-24 17:06:34.290 |         WHERE
2026-08-24 17:06:34.290 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:34.290 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:34.290 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:34.290 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:34.290 |     ORDER BY
2026-08-24 17:06:34.290 |         o1.created_at ASC 
2026-08-24 17:06:34.290 |     LIMIT
2026-08-24 17:06:34.290 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:34.290 | Hibernate: 
2026-08-24 17:06:34.290 |     SELECT
2026-08-24 17:06:34.290 |         o1.* 
2026-08-24 17:06:34.290 |     FROM
2026-08-24 17:06:34.290 |         payment_event_outbox o1 
2026-08-24 17:06:34.290 |     WHERE
2026-08-24 17:06:34.290 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:34.290 |         AND (
2026-08-24 17:06:34.290 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:34.290 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:34.290 |         )   
2026-08-24 17:06:34.290 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:34.290 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:34.290 |             1 
2026-08-24 17:06:34.290 |         FROM
2026-08-24 17:06:34.290 |             payment_event_outbox o2       
2026-08-24 17:06:34.290 |         WHERE
2026-08-24 17:06:34.290 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:34.290 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:34.290 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:34.290 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:34.290 |     ORDER BY
2026-08-24 17:06:34.290 |         o1.created_at ASC 
2026-08-24 17:06:34.290 |     LIMIT
2026-08-24 17:06:34.290 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:37.002 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:06:37.002 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 0493ae4a-8663-4311-8a04-681ea99b1cbd] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:37.003 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 0493ae4a-8663-4311-8a04-681ea99b1cbd] - Secured POST /api/v1/auth/login
2026-08-24 17:06:37.010 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 0493ae4a-8663-4311-8a04-681ea99b1cbd] - 
2026-08-24 17:06:37.010 |     select
2026-08-24 17:06:37.010 |         c1_0.id,
2026-08-24 17:06:37.010 |         c1_0.created_at,
2026-08-24 17:06:37.010 |         c1_0.email,
2026-08-24 17:06:37.010 |         c1_0.employment_status,
2026-08-24 17:06:37.010 |         c1_0.first_name,
2026-08-24 17:06:37.010 |         c1_0.job_title,
2026-08-24 17:06:37.010 |         c1_0.kyc_status,
2026-08-24 17:06:37.010 |         c1_0.last_name,
2026-08-24 17:06:37.010 |         c1_0.locked,
2026-08-24 17:06:37.010 |         c1_0.monthly_income,
2026-08-24 17:06:37.010 |         c1_0.password,
2026-08-24 17:06:37.010 |         c1_0.risk_profile,
2026-08-24 17:06:37.010 |         c1_0.role,
2026-08-24 17:06:37.010 |         c1_0.source_of_funds 
2026-08-24 17:06:37.010 |     from
2026-08-24 17:06:37.010 |         customers c1_0 
2026-08-24 17:06:37.010 |     where
2026-08-24 17:06:37.010 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:37.010 | Hibernate: 
2026-08-24 17:06:37.010 |     select
2026-08-24 17:06:37.010 |         c1_0.id,
2026-08-24 17:06:37.010 |         c1_0.created_at,
2026-08-24 17:06:37.010 |         c1_0.email,
2026-08-24 17:06:37.010 |         c1_0.employment_status,
2026-08-24 17:06:37.010 |         c1_0.first_name,
2026-08-24 17:06:37.010 |         c1_0.job_title,
2026-08-24 17:06:37.010 |         c1_0.kyc_status,
2026-08-24 17:06:37.010 |         c1_0.last_name,
2026-08-24 17:06:37.010 |         c1_0.locked,
2026-08-24 17:06:37.010 |         c1_0.monthly_income,
2026-08-24 17:06:37.010 |         c1_0.password,
2026-08-24 17:06:37.010 |         c1_0.risk_profile,
2026-08-24 17:06:37.010 |         c1_0.role,
2026-08-24 17:06:37.010 |         c1_0.source_of_funds 
2026-08-24 17:06:37.010 |     from
2026-08-24 17:06:37.010 |         customers c1_0 
2026-08-24 17:06:37.010 |     where
2026-08-24 17:06:37.010 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:37.110 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 0493ae4a-8663-4311-8a04-681ea99b1cbd] - Authenticated user
2026-08-24 17:06:37.113 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 0493ae4a-8663-4311-8a04-681ea99b1cbd] - 
2026-08-24 17:06:37.113 |     select
2026-08-24 17:06:37.113 |         c1_0.id,
2026-08-24 17:06:37.113 |         c1_0.created_at,
2026-08-24 17:06:37.113 |         c1_0.email,
2026-08-24 17:06:37.113 |         c1_0.employment_status,
2026-08-24 17:06:37.113 |         c1_0.first_name,
2026-08-24 17:06:37.113 |         c1_0.job_title,
2026-08-24 17:06:37.113 |         c1_0.kyc_status,
2026-08-24 17:06:37.113 |         c1_0.last_name,
2026-08-24 17:06:37.113 |         c1_0.locked,
2026-08-24 17:06:37.113 |         c1_0.monthly_income,
2026-08-24 17:06:37.113 |         c1_0.password,
2026-08-24 17:06:37.114 |         c1_0.risk_profile,
2026-08-24 17:06:37.114 |         c1_0.role,
2026-08-24 17:06:37.114 |         c1_0.source_of_funds 
2026-08-24 17:06:37.114 |     from
2026-08-24 17:06:37.114 |         customers c1_0 
2026-08-24 17:06:37.114 |     where
2026-08-24 17:06:37.114 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:37.114 | Hibernate: 
2026-08-24 17:06:37.114 |     select
2026-08-24 17:06:37.114 |         c1_0.id,
2026-08-24 17:06:37.114 |         c1_0.created_at,
2026-08-24 17:06:37.114 |         c1_0.email,
2026-08-24 17:06:37.114 |         c1_0.employment_status,
2026-08-24 17:06:37.114 |         c1_0.first_name,
2026-08-24 17:06:37.114 |         c1_0.job_title,
2026-08-24 17:06:37.114 |         c1_0.kyc_status,
2026-08-24 17:06:37.114 |         c1_0.last_name,
2026-08-24 17:06:37.114 |         c1_0.locked,
2026-08-24 17:06:37.114 |         c1_0.monthly_income,
2026-08-24 17:06:37.114 |         c1_0.password,
2026-08-24 17:06:37.114 |         c1_0.risk_profile,
2026-08-24 17:06:37.114 |         c1_0.role,
2026-08-24 17:06:37.114 |         c1_0.source_of_funds 
2026-08-24 17:06:37.114 |     from
2026-08-24 17:06:37.114 |         customers c1_0 
2026-08-24 17:06:37.114 |     where
2026-08-24 17:06:37.114 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:37.120 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 0493ae4a-8663-4311-8a04-681ea99b1cbd] - [HTTP LOG] POST /api/v1/auth/login - Status: 200 - Duration: 117ms
2026-08-24 17:06:37.123 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:37.123 |     insert 
2026-08-24 17:06:37.123 |     into
2026-08-24 17:06:37.123 |         api_audit_events
2026-08-24 17:06:37.123 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:37.123 |     values
2026-08-24 17:06:37.123 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:37.123 | Hibernate: 
2026-08-24 17:06:37.123 |     insert 
2026-08-24 17:06:37.123 |     into
2026-08-24 17:06:37.123 |         api_audit_events
2026-08-24 17:06:37.123 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:37.123 |     values
2026-08-24 17:06:37.123 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:37.134 | 2026-08-24 09:06:37 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 200 | stage=COMPLETED | keyId=null | acct=null | latency=119ms
2026-08-24 17:06:38.363 | 2026-08-24 09:06:38 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:06:38.365 | 2026-08-24 09:06:38 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:06:38.365 | 2026-08-24 09:06:38 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: f9beaefb-d63e-4067-97b8-9c2cc3ec5ea7] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:38.374 | 2026-08-24 09:06:38 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: f9beaefb-d63e-4067-97b8-9c2cc3ec5ea7] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:06:39.295 | 2026-08-24 09:06:39 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:39.295 |     SELECT
2026-08-24 17:06:39.295 |         o1.* 
2026-08-24 17:06:39.295 |     FROM
2026-08-24 17:06:39.295 |         payment_event_outbox o1 
2026-08-24 17:06:39.295 |     WHERE
2026-08-24 17:06:39.295 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:39.295 |         AND (
2026-08-24 17:06:39.295 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:39.295 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:39.295 |         )   
2026-08-24 17:06:39.295 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:39.295 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:39.295 |             1 
2026-08-24 17:06:39.295 |         FROM
2026-08-24 17:06:39.295 |             payment_event_outbox o2       
2026-08-24 17:06:39.295 |         WHERE
2026-08-24 17:06:39.295 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:39.295 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:39.295 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:39.295 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:39.295 |     ORDER BY
2026-08-24 17:06:39.295 |         o1.created_at ASC 
2026-08-24 17:06:39.295 |     LIMIT
2026-08-24 17:06:39.295 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:39.295 | Hibernate: 
2026-08-24 17:06:39.295 |     SELECT
2026-08-24 17:06:39.295 |         o1.* 
2026-08-24 17:06:39.295 |     FROM
2026-08-24 17:06:39.295 |         payment_event_outbox o1 
2026-08-24 17:06:39.295 |     WHERE
2026-08-24 17:06:39.295 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:39.295 |         AND (
2026-08-24 17:06:39.295 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:39.295 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:39.295 |         )   
2026-08-24 17:06:39.295 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:39.295 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:39.295 |             1 
2026-08-24 17:06:39.295 |         FROM
2026-08-24 17:06:39.295 |             payment_event_outbox o2       
2026-08-24 17:06:39.295 |         WHERE
2026-08-24 17:06:39.296 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:39.296 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:39.296 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:39.296 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:39.296 |     ORDER BY
2026-08-24 17:06:39.296 |         o1.created_at ASC 
2026-08-24 17:06:39.296 |     LIMIT
2026-08-24 17:06:39.296 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:41.501 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:06:41.501 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 490c1034-4938-4b76-8daf-7c07c3c4a126] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:41.502 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 490c1034-4938-4b76-8daf-7c07c3c4a126] - Secured POST /api/v1/auth/login
2026-08-24 17:06:41.507 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 490c1034-4938-4b76-8daf-7c07c3c4a126] - 
2026-08-24 17:06:41.510 |     select
2026-08-24 17:06:41.510 |         c1_0.id,
2026-08-24 17:06:41.510 |         c1_0.created_at,
2026-08-24 17:06:41.510 |         c1_0.email,
2026-08-24 17:06:41.510 |         c1_0.employment_status,
2026-08-24 17:06:41.510 |         c1_0.first_name,
2026-08-24 17:06:41.510 |         c1_0.job_title,
2026-08-24 17:06:41.510 |         c1_0.kyc_status,
2026-08-24 17:06:41.510 |         c1_0.last_name,
2026-08-24 17:06:41.510 |         c1_0.locked,
2026-08-24 17:06:41.510 |         c1_0.monthly_income,
2026-08-24 17:06:41.510 |         c1_0.password,
2026-08-24 17:06:41.510 |         c1_0.risk_profile,
2026-08-24 17:06:41.510 |         c1_0.role,
2026-08-24 17:06:41.510 |         c1_0.source_of_funds 
2026-08-24 17:06:41.510 |     from
2026-08-24 17:06:41.510 |         customers c1_0 
2026-08-24 17:06:41.510 |     where
2026-08-24 17:06:41.510 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:41.510 | Hibernate: 
2026-08-24 17:06:41.510 |     select
2026-08-24 17:06:41.510 |         c1_0.id,
2026-08-24 17:06:41.510 |         c1_0.created_at,
2026-08-24 17:06:41.510 |         c1_0.email,
2026-08-24 17:06:41.510 |         c1_0.employment_status,
2026-08-24 17:06:41.510 |         c1_0.first_name,
2026-08-24 17:06:41.510 |         c1_0.job_title,
2026-08-24 17:06:41.510 |         c1_0.kyc_status,
2026-08-24 17:06:41.510 |         c1_0.last_name,
2026-08-24 17:06:41.510 |         c1_0.locked,
2026-08-24 17:06:41.510 |         c1_0.monthly_income,
2026-08-24 17:06:41.510 |         c1_0.password,
2026-08-24 17:06:41.510 |         c1_0.risk_profile,
2026-08-24 17:06:41.511 |         c1_0.role,
2026-08-24 17:06:41.511 |         c1_0.source_of_funds 
2026-08-24 17:06:41.511 |     from
2026-08-24 17:06:41.511 |         customers c1_0 
2026-08-24 17:06:41.511 |     where
2026-08-24 17:06:41.511 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:41.613 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 490c1034-4938-4b76-8daf-7c07c3c4a126] - Authenticated user
2026-08-24 17:06:41.616 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 490c1034-4938-4b76-8daf-7c07c3c4a126] - 
2026-08-24 17:06:41.616 |     select
2026-08-24 17:06:41.616 |         c1_0.id,
2026-08-24 17:06:41.616 |         c1_0.created_at,
2026-08-24 17:06:41.616 |         c1_0.email,
2026-08-24 17:06:41.616 |         c1_0.employment_status,
2026-08-24 17:06:41.616 |         c1_0.first_name,
2026-08-24 17:06:41.616 |         c1_0.job_title,
2026-08-24 17:06:41.616 |         c1_0.kyc_status,
2026-08-24 17:06:41.616 |         c1_0.last_name,
2026-08-24 17:06:41.616 |         c1_0.locked,
2026-08-24 17:06:41.616 |         c1_0.monthly_income,
2026-08-24 17:06:41.616 |         c1_0.password,
2026-08-24 17:06:41.616 |         c1_0.risk_profile,
2026-08-24 17:06:41.616 |         c1_0.role,
2026-08-24 17:06:41.616 |         c1_0.source_of_funds 
2026-08-24 17:06:41.616 |     from
2026-08-24 17:06:41.616 |         customers c1_0 
2026-08-24 17:06:41.616 |     where
2026-08-24 17:06:41.616 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:41.616 | Hibernate: 
2026-08-24 17:06:41.616 |     select
2026-08-24 17:06:41.616 |         c1_0.id,
2026-08-24 17:06:41.616 |         c1_0.created_at,
2026-08-24 17:06:41.616 |         c1_0.email,
2026-08-24 17:06:41.616 |         c1_0.employment_status,
2026-08-24 17:06:41.616 |         c1_0.first_name,
2026-08-24 17:06:41.616 |         c1_0.job_title,
2026-08-24 17:06:41.616 |         c1_0.kyc_status,
2026-08-24 17:06:41.616 |         c1_0.last_name,
2026-08-24 17:06:41.616 |         c1_0.locked,
2026-08-24 17:06:41.616 |         c1_0.monthly_income,
2026-08-24 17:06:41.616 |         c1_0.password,
2026-08-24 17:06:41.616 |         c1_0.risk_profile,
2026-08-24 17:06:41.616 |         c1_0.role,
2026-08-24 17:06:41.616 |         c1_0.source_of_funds 
2026-08-24 17:06:41.616 |     from
2026-08-24 17:06:41.616 |         customers c1_0 
2026-08-24 17:06:41.616 |     where
2026-08-24 17:06:41.616 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:41.621 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 490c1034-4938-4b76-8daf-7c07c3c4a126] - [HTTP LOG] POST /api/v1/auth/login - Status: 200 - Duration: 120ms
2026-08-24 17:06:41.624 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:41.624 |     insert 
2026-08-24 17:06:41.624 |     into
2026-08-24 17:06:41.624 |         api_audit_events
2026-08-24 17:06:41.624 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:41.624 |     values
2026-08-24 17:06:41.624 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:41.624 | Hibernate: 
2026-08-24 17:06:41.624 |     insert 
2026-08-24 17:06:41.624 |     into
2026-08-24 17:06:41.624 |         api_audit_events
2026-08-24 17:06:41.624 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:41.624 |     values
2026-08-24 17:06:41.624 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:41.635 | 2026-08-24 09:06:41 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 200 | stage=COMPLETED | keyId=null | acct=null | latency=122ms
2026-08-24 17:06:44.065 | 2026-08-24 09:06:44 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:44.065 |     SELECT
2026-08-24 17:06:44.065 |         * 
2026-08-24 17:06:44.065 |     FROM
2026-08-24 17:06:44.065 |         payment_event_outbox 
2026-08-24 17:06:44.065 |     WHERE
2026-08-24 17:06:44.065 |         status = 'DELIVERING'   
2026-08-24 17:06:44.065 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:44.065 | Hibernate: 
2026-08-24 17:06:44.065 |     SELECT
2026-08-24 17:06:44.065 |         * 
2026-08-24 17:06:44.065 |     FROM
2026-08-24 17:06:44.065 |         payment_event_outbox 
2026-08-24 17:06:44.065 |     WHERE
2026-08-24 17:06:44.065 |         status = 'DELIVERING'   
2026-08-24 17:06:44.065 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:44.070 | 2026-08-24 09:06:44 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:44.070 |     select
2026-08-24 17:06:44.070 |         icl1_0.id,
2026-08-24 17:06:44.070 |         icl1_0.attempt_count,
2026-08-24 17:06:44.070 |         icl1_0.callback_url,
2026-08-24 17:06:44.070 |         icl1_0.created_at,
2026-08-24 17:06:44.070 |         icl1_0.next_retry_at,
2026-08-24 17:06:44.070 |         icl1_0.payload,
2026-08-24 17:06:44.070 |         icl1_0.payment_session_id,
2026-08-24 17:06:44.070 |         icl1_0.response_body,
2026-08-24 17:06:44.070 |         icl1_0.response_code,
2026-08-24 17:06:44.070 |         icl1_0.status,
2026-08-24 17:06:44.070 |         icl1_0.updated_at 
2026-08-24 17:06:44.070 |     from
2026-08-24 17:06:44.070 |         institution_callback_log icl1_0 
2026-08-24 17:06:44.070 |     where
2026-08-24 17:06:44.070 |         icl1_0.status=? 
2026-08-24 17:06:44.070 |         and icl1_0.next_retry_at<?
2026-08-24 17:06:44.070 | Hibernate: 
2026-08-24 17:06:44.070 |     select
2026-08-24 17:06:44.070 |         icl1_0.id,
2026-08-24 17:06:44.070 |         icl1_0.attempt_count,
2026-08-24 17:06:44.070 |         icl1_0.callback_url,
2026-08-24 17:06:44.070 |         icl1_0.created_at,
2026-08-24 17:06:44.070 |         icl1_0.next_retry_at,
2026-08-24 17:06:44.070 |         icl1_0.payload,
2026-08-24 17:06:44.070 |         icl1_0.payment_session_id,
2026-08-24 17:06:44.070 |         icl1_0.response_body,
2026-08-24 17:06:44.070 |         icl1_0.response_code,
2026-08-24 17:06:44.070 |         icl1_0.status,
2026-08-24 17:06:44.070 |         icl1_0.updated_at 
2026-08-24 17:06:44.070 |     from
2026-08-24 17:06:44.070 |         institution_callback_log icl1_0 
2026-08-24 17:06:44.070 |     where
2026-08-24 17:06:44.070 |         icl1_0.status=? 
2026-08-24 17:06:44.070 |         and icl1_0.next_retry_at<?
2026-08-24 17:06:44.299 | 2026-08-24 09:06:44 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:44.299 |     SELECT
2026-08-24 17:06:44.299 |         o1.* 
2026-08-24 17:06:44.299 |     FROM
2026-08-24 17:06:44.299 |         payment_event_outbox o1 
2026-08-24 17:06:44.299 |     WHERE
2026-08-24 17:06:44.299 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:44.299 |         AND (
2026-08-24 17:06:44.299 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:44.299 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:44.299 |         )   
2026-08-24 17:06:44.299 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:44.299 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:44.299 |             1 
2026-08-24 17:06:44.299 |         FROM
2026-08-24 17:06:44.299 |             payment_event_outbox o2       
2026-08-24 17:06:44.299 |         WHERE
2026-08-24 17:06:44.299 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:44.299 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:44.299 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:44.299 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:44.299 |     ORDER BY
2026-08-24 17:06:44.299 |         o1.created_at ASC 
2026-08-24 17:06:44.299 |     LIMIT
2026-08-24 17:06:44.299 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:44.299 | Hibernate: 
2026-08-24 17:06:44.299 |     SELECT
2026-08-24 17:06:44.299 |         o1.* 
2026-08-24 17:06:44.299 |     FROM
2026-08-24 17:06:44.299 |         payment_event_outbox o1 
2026-08-24 17:06:44.299 |     WHERE
2026-08-24 17:06:44.299 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:44.299 |         AND (
2026-08-24 17:06:44.299 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:44.299 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:44.299 |         )   
2026-08-24 17:06:44.299 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:44.299 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:44.299 |             1 
2026-08-24 17:06:44.299 |         FROM
2026-08-24 17:06:44.299 |             payment_event_outbox o2       
2026-08-24 17:06:44.299 |         WHERE
2026-08-24 17:06:44.299 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:44.299 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:44.299 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:44.299 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:44.299 |     ORDER BY
2026-08-24 17:06:44.299 |         o1.created_at ASC 
2026-08-24 17:06:44.299 |     LIMIT
2026-08-24 17:06:44.299 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:48.464 | 2026-08-24 09:06:48 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:06:48.465 | 2026-08-24 09:06:48 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:06:48.465 | 2026-08-24 09:06:48 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b7eb5c93-c1e9-4558-81fa-c7557bc785b9] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:48.471 | 2026-08-24 09:06:48 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b7eb5c93-c1e9-4558-81fa-c7557bc785b9] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:06:49.304 | 2026-08-24 09:06:49 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:49.304 |     SELECT
2026-08-24 17:06:49.304 |         o1.* 
2026-08-24 17:06:49.304 |     FROM
2026-08-24 17:06:49.304 |         payment_event_outbox o1 
2026-08-24 17:06:49.304 |     WHERE
2026-08-24 17:06:49.304 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:49.304 |         AND (
2026-08-24 17:06:49.304 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:49.304 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:49.304 |         )   
2026-08-24 17:06:49.304 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:49.304 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:49.304 |             1 
2026-08-24 17:06:49.304 |         FROM
2026-08-24 17:06:49.304 |             payment_event_outbox o2       
2026-08-24 17:06:49.304 |         WHERE
2026-08-24 17:06:49.304 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:49.304 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:49.304 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:49.304 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:49.304 |     ORDER BY
2026-08-24 17:06:49.304 |         o1.created_at ASC 
2026-08-24 17:06:49.304 |     LIMIT
2026-08-24 17:06:49.304 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:49.304 | Hibernate: 
2026-08-24 17:06:49.304 |     SELECT
2026-08-24 17:06:49.304 |         o1.* 
2026-08-24 17:06:49.304 |     FROM
2026-08-24 17:06:49.304 |         payment_event_outbox o1 
2026-08-24 17:06:49.304 |     WHERE
2026-08-24 17:06:49.304 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:49.304 |         AND (
2026-08-24 17:06:49.304 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:49.304 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:49.304 |         )   
2026-08-24 17:06:49.304 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:49.304 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:49.304 |             1 
2026-08-24 17:06:49.304 |         FROM
2026-08-24 17:06:49.304 |             payment_event_outbox o2       
2026-08-24 17:06:49.304 |         WHERE
2026-08-24 17:06:49.304 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:49.304 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:49.304 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:49.304 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:49.304 |     ORDER BY
2026-08-24 17:06:49.304 |         o1.created_at ASC 
2026-08-24 17:06:49.304 |     LIMIT
2026-08-24 17:06:49.304 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:52.437 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing POST /api/v1/auth/login
2026-08-24 17:06:52.438 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 24e4db14-272f-4ccb-9830-81fffbda4dc7] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:52.440 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 24e4db14-272f-4ccb-9830-81fffbda4dc7] - Secured POST /api/v1/auth/login
2026-08-24 17:06:52.449 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: 24e4db14-272f-4ccb-9830-81fffbda4dc7] - 
2026-08-24 17:06:52.449 |     select
2026-08-24 17:06:52.449 |         c1_0.id,
2026-08-24 17:06:52.449 |         c1_0.created_at,
2026-08-24 17:06:52.449 |         c1_0.email,
2026-08-24 17:06:52.449 |         c1_0.employment_status,
2026-08-24 17:06:52.449 |         c1_0.first_name,
2026-08-24 17:06:52.449 |         c1_0.job_title,
2026-08-24 17:06:52.449 |         c1_0.kyc_status,
2026-08-24 17:06:52.449 |         c1_0.last_name,
2026-08-24 17:06:52.449 |         c1_0.locked,
2026-08-24 17:06:52.449 |         c1_0.monthly_income,
2026-08-24 17:06:52.449 |         c1_0.password,
2026-08-24 17:06:52.449 |         c1_0.risk_profile,
2026-08-24 17:06:52.449 |         c1_0.role,
2026-08-24 17:06:52.449 |         c1_0.source_of_funds 
2026-08-24 17:06:52.449 |     from
2026-08-24 17:06:52.449 |         customers c1_0 
2026-08-24 17:06:52.449 |     where
2026-08-24 17:06:52.449 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:52.449 | Hibernate: 
2026-08-24 17:06:52.449 |     select
2026-08-24 17:06:52.449 |         c1_0.id,
2026-08-24 17:06:52.449 |         c1_0.created_at,
2026-08-24 17:06:52.449 |         c1_0.email,
2026-08-24 17:06:52.449 |         c1_0.employment_status,
2026-08-24 17:06:52.449 |         c1_0.first_name,
2026-08-24 17:06:52.449 |         c1_0.job_title,
2026-08-24 17:06:52.449 |         c1_0.kyc_status,
2026-08-24 17:06:52.449 |         c1_0.last_name,
2026-08-24 17:06:52.449 |         c1_0.locked,
2026-08-24 17:06:52.449 |         c1_0.monthly_income,
2026-08-24 17:06:52.449 |         c1_0.password,
2026-08-24 17:06:52.449 |         c1_0.risk_profile,
2026-08-24 17:06:52.449 |         c1_0.role,
2026-08-24 17:06:52.449 |         c1_0.source_of_funds 
2026-08-24 17:06:52.449 |     from
2026-08-24 17:06:52.449 |         customers c1_0 
2026-08-24 17:06:52.449 |     where
2026-08-24 17:06:52.449 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:52.569 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.a.d.DaoAuthenticationProvider [X-Request-Id: 24e4db14-272f-4ccb-9830-81fffbda4dc7] - Authenticated user
2026-08-24 17:06:52.571 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: 24e4db14-272f-4ccb-9830-81fffbda4dc7] - 
2026-08-24 17:06:52.571 |     select
2026-08-24 17:06:52.571 |         c1_0.id,
2026-08-24 17:06:52.571 |         c1_0.created_at,
2026-08-24 17:06:52.571 |         c1_0.email,
2026-08-24 17:06:52.571 |         c1_0.employment_status,
2026-08-24 17:06:52.571 |         c1_0.first_name,
2026-08-24 17:06:52.571 |         c1_0.job_title,
2026-08-24 17:06:52.571 |         c1_0.kyc_status,
2026-08-24 17:06:52.571 |         c1_0.last_name,
2026-08-24 17:06:52.571 |         c1_0.locked,
2026-08-24 17:06:52.571 |         c1_0.monthly_income,
2026-08-24 17:06:52.571 |         c1_0.password,
2026-08-24 17:06:52.571 |         c1_0.risk_profile,
2026-08-24 17:06:52.571 |         c1_0.role,
2026-08-24 17:06:52.571 |         c1_0.source_of_funds 
2026-08-24 17:06:52.571 |     from
2026-08-24 17:06:52.571 |         customers c1_0 
2026-08-24 17:06:52.571 |     where
2026-08-24 17:06:52.571 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:52.571 | Hibernate: 
2026-08-24 17:06:52.571 |     select
2026-08-24 17:06:52.571 |         c1_0.id,
2026-08-24 17:06:52.571 |         c1_0.created_at,
2026-08-24 17:06:52.571 |         c1_0.email,
2026-08-24 17:06:52.571 |         c1_0.employment_status,
2026-08-24 17:06:52.571 |         c1_0.first_name,
2026-08-24 17:06:52.571 |         c1_0.job_title,
2026-08-24 17:06:52.571 |         c1_0.kyc_status,
2026-08-24 17:06:52.571 |         c1_0.last_name,
2026-08-24 17:06:52.571 |         c1_0.locked,
2026-08-24 17:06:52.571 |         c1_0.monthly_income,
2026-08-24 17:06:52.571 |         c1_0.password,
2026-08-24 17:06:52.571 |         c1_0.risk_profile,
2026-08-24 17:06:52.571 |         c1_0.role,
2026-08-24 17:06:52.571 |         c1_0.source_of_funds 
2026-08-24 17:06:52.571 |     from
2026-08-24 17:06:52.571 |         customers c1_0 
2026-08-24 17:06:52.571 |     where
2026-08-24 17:06:52.571 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:52.577 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 24e4db14-272f-4ccb-9830-81fffbda4dc7] - [HTTP LOG] POST /api/v1/auth/login - Status: 200 - Duration: 138ms
2026-08-24 17:06:52.580 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:52.581 |     insert 
2026-08-24 17:06:52.581 |     into
2026-08-24 17:06:52.581 |         api_audit_events
2026-08-24 17:06:52.581 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:52.581 |     values
2026-08-24 17:06:52.581 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:52.581 | Hibernate: 
2026-08-24 17:06:52.581 |     insert 
2026-08-24 17:06:52.581 |     into
2026-08-24 17:06:52.581 |         api_audit_events
2026-08-24 17:06:52.581 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:52.581 |     values
2026-08-24 17:06:52.581 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:52.601 | 2026-08-24 09:06:52 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] POST /api/v1/auth/login → 200 | stage=COMPLETED | keyId=null | acct=null | latency=142ms
2026-08-24 17:06:53.105 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:06:53.111 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: f8bb21ce-5701-404f-8a60-bc827a97e5a5] - 
2026-08-24 17:06:53.111 |     select
2026-08-24 17:06:53.111 |         c1_0.id,
2026-08-24 17:06:53.111 |         c1_0.created_at,
2026-08-24 17:06:53.111 |         c1_0.email,
2026-08-24 17:06:53.111 |         c1_0.employment_status,
2026-08-24 17:06:53.111 |         c1_0.first_name,
2026-08-24 17:06:53.111 |         c1_0.job_title,
2026-08-24 17:06:53.111 |         c1_0.kyc_status,
2026-08-24 17:06:53.111 |         c1_0.last_name,
2026-08-24 17:06:53.111 |         c1_0.locked,
2026-08-24 17:06:53.111 |         c1_0.monthly_income,
2026-08-24 17:06:53.111 |         c1_0.password,
2026-08-24 17:06:53.111 |         c1_0.risk_profile,
2026-08-24 17:06:53.111 |         c1_0.role,
2026-08-24 17:06:53.111 |         c1_0.source_of_funds 
2026-08-24 17:06:53.111 |     from
2026-08-24 17:06:53.111 |         customers c1_0 
2026-08-24 17:06:53.111 |     where
2026-08-24 17:06:53.111 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.111 | Hibernate: 
2026-08-24 17:06:53.111 |     select
2026-08-24 17:06:53.111 |         c1_0.id,
2026-08-24 17:06:53.111 |         c1_0.created_at,
2026-08-24 17:06:53.111 |         c1_0.email,
2026-08-24 17:06:53.111 |         c1_0.employment_status,
2026-08-24 17:06:53.111 |         c1_0.first_name,
2026-08-24 17:06:53.111 |         c1_0.job_title,
2026-08-24 17:06:53.111 |         c1_0.kyc_status,
2026-08-24 17:06:53.111 |         c1_0.last_name,
2026-08-24 17:06:53.111 |         c1_0.locked,
2026-08-24 17:06:53.111 |         c1_0.monthly_income,
2026-08-24 17:06:53.111 |         c1_0.password,
2026-08-24 17:06:53.111 |         c1_0.risk_profile,
2026-08-24 17:06:53.111 |         c1_0.role,
2026-08-24 17:06:53.111 |         c1_0.source_of_funds 
2026-08-24 17:06:53.111 |     from
2026-08-24 17:06:53.111 |         customers c1_0 
2026-08-24 17:06:53.111 |     where
2026-08-24 17:06:53.111 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.122 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: f8bb21ce-5701-404f-8a60-bc827a97e5a5] - Secured GET /api/v1/accounts
2026-08-24 17:06:53.127 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: f8bb21ce-5701-404f-8a60-bc827a97e5a5] - 
2026-08-24 17:06:53.127 |     select
2026-08-24 17:06:53.127 |         c1_0.id,
2026-08-24 17:06:53.127 |         c1_0.created_at,
2026-08-24 17:06:53.127 |         c1_0.email,
2026-08-24 17:06:53.127 |         c1_0.employment_status,
2026-08-24 17:06:53.127 |         c1_0.first_name,
2026-08-24 17:06:53.127 |         c1_0.job_title,
2026-08-24 17:06:53.127 |         c1_0.kyc_status,
2026-08-24 17:06:53.127 |         c1_0.last_name,
2026-08-24 17:06:53.127 |         c1_0.locked,
2026-08-24 17:06:53.127 |         c1_0.monthly_income,
2026-08-24 17:06:53.127 |         c1_0.password,
2026-08-24 17:06:53.127 |         c1_0.risk_profile,
2026-08-24 17:06:53.127 |         c1_0.role,
2026-08-24 17:06:53.127 |         c1_0.source_of_funds 
2026-08-24 17:06:53.127 |     from
2026-08-24 17:06:53.127 |         customers c1_0 
2026-08-24 17:06:53.127 |     where
2026-08-24 17:06:53.127 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.127 | Hibernate: 
2026-08-24 17:06:53.127 |     select
2026-08-24 17:06:53.127 |         c1_0.id,
2026-08-24 17:06:53.127 |         c1_0.created_at,
2026-08-24 17:06:53.127 |         c1_0.email,
2026-08-24 17:06:53.127 |         c1_0.employment_status,
2026-08-24 17:06:53.127 |         c1_0.first_name,
2026-08-24 17:06:53.127 |         c1_0.job_title,
2026-08-24 17:06:53.127 |         c1_0.kyc_status,
2026-08-24 17:06:53.127 |         c1_0.last_name,
2026-08-24 17:06:53.127 |         c1_0.locked,
2026-08-24 17:06:53.127 |         c1_0.monthly_income,
2026-08-24 17:06:53.127 |         c1_0.password,
2026-08-24 17:06:53.127 |         c1_0.risk_profile,
2026-08-24 17:06:53.127 |         c1_0.role,
2026-08-24 17:06:53.127 |         c1_0.source_of_funds 
2026-08-24 17:06:53.127 |     from
2026-08-24 17:06:53.127 |         customers c1_0 
2026-08-24 17:06:53.127 |     where
2026-08-24 17:06:53.127 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.133 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: f8bb21ce-5701-404f-8a60-bc827a97e5a5] - 
2026-08-24 17:06:53.133 |     select
2026-08-24 17:06:53.133 |         a1_0.id,
2026-08-24 17:06:53.133 |         a1_0.account_name,
2026-08-24 17:06:53.133 |         a1_0.account_number,
2026-08-24 17:06:53.133 |         a1_0.account_type,
2026-08-24 17:06:53.133 |         a1_0.allow_incoming,
2026-08-24 17:06:53.133 |         a1_0.allow_outgoing,
2026-08-24 17:06:53.133 |         a1_0.balance,
2026-08-24 17:06:53.133 |         a1_0.card_cvv,
2026-08-24 17:06:53.133 |         a1_0.card_expiry,
2026-08-24 17:06:53.133 |         a1_0.created_at,
2026-08-24 17:06:53.133 |         a1_0.currency,
2026-08-24 17:06:53.133 |         a1_0.customer_id,
2026-08-24 17:06:53.133 |         a1_0.daily_limit,
2026-08-24 17:06:53.133 |         a1_0.frozen,
2026-08-24 17:06:53.133 |         a1_0.monthly_limit,
2026-08-24 17:06:53.133 |         a1_0.parent_account_id,
2026-08-24 17:06:53.133 |         a1_0.require_dual_approval,
2026-08-24 17:06:53.133 |         a1_0.status,
2026-08-24 17:06:53.133 |         a1_0.swift_code,
2026-08-24 17:06:53.133 |         a1_0.updated_at,
2026-08-24 17:06:53.133 |         a1_0.version 
2026-08-24 17:06:53.133 |     from
2026-08-24 17:06:53.133 |         accounts a1_0 
2026-08-24 17:06:53.133 |     where
2026-08-24 17:06:53.133 |         a1_0.customer_id=?
2026-08-24 17:06:53.133 | Hibernate: 
2026-08-24 17:06:53.133 |     select
2026-08-24 17:06:53.133 |         a1_0.id,
2026-08-24 17:06:53.133 |         a1_0.account_name,
2026-08-24 17:06:53.133 |         a1_0.account_number,
2026-08-24 17:06:53.133 |         a1_0.account_type,
2026-08-24 17:06:53.133 |         a1_0.allow_incoming,
2026-08-24 17:06:53.133 |         a1_0.allow_outgoing,
2026-08-24 17:06:53.133 |         a1_0.balance,
2026-08-24 17:06:53.133 |         a1_0.card_cvv,
2026-08-24 17:06:53.133 |         a1_0.card_expiry,
2026-08-24 17:06:53.133 |         a1_0.created_at,
2026-08-24 17:06:53.133 |         a1_0.currency,
2026-08-24 17:06:53.133 |         a1_0.customer_id,
2026-08-24 17:06:53.133 |         a1_0.daily_limit,
2026-08-24 17:06:53.133 |         a1_0.frozen,
2026-08-24 17:06:53.133 |         a1_0.monthly_limit,
2026-08-24 17:06:53.133 |         a1_0.parent_account_id,
2026-08-24 17:06:53.133 |         a1_0.require_dual_approval,
2026-08-24 17:06:53.133 |         a1_0.status,
2026-08-24 17:06:53.133 |         a1_0.swift_code,
2026-08-24 17:06:53.133 |         a1_0.updated_at,
2026-08-24 17:06:53.133 |         a1_0.version 
2026-08-24 17:06:53.133 |     from
2026-08-24 17:06:53.133 |         accounts a1_0 
2026-08-24 17:06:53.133 |     where
2026-08-24 17:06:53.133 |         a1_0.customer_id=?
2026-08-24 17:06:53.140 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: f8bb21ce-5701-404f-8a60-bc827a97e5a5] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 17ms
2026-08-24 17:06:53.143 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:53.143 |     insert 
2026-08-24 17:06:53.143 |     into
2026-08-24 17:06:53.143 |         api_audit_events
2026-08-24 17:06:53.143 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:53.143 |     values
2026-08-24 17:06:53.143 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:53.143 | Hibernate: 
2026-08-24 17:06:53.143 |     insert 
2026-08-24 17:06:53.144 |     into
2026-08-24 17:06:53.144 |         api_audit_events
2026-08-24 17:06:53.144 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:53.144 |     values
2026-08-24 17:06:53.144 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:53.160 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=37ms
2026-08-24 17:06:53.321 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:06:53.327 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 7bf99f4b-19ba-4a4b-b865-d325d42b35e3] - 
2026-08-24 17:06:53.327 |     select
2026-08-24 17:06:53.327 |         c1_0.id,
2026-08-24 17:06:53.327 |         c1_0.created_at,
2026-08-24 17:06:53.327 |         c1_0.email,
2026-08-24 17:06:53.327 |         c1_0.employment_status,
2026-08-24 17:06:53.327 |         c1_0.first_name,
2026-08-24 17:06:53.327 |         c1_0.job_title,
2026-08-24 17:06:53.327 |         c1_0.kyc_status,
2026-08-24 17:06:53.327 |         c1_0.last_name,
2026-08-24 17:06:53.327 |         c1_0.locked,
2026-08-24 17:06:53.327 |         c1_0.monthly_income,
2026-08-24 17:06:53.327 |         c1_0.password,
2026-08-24 17:06:53.327 |         c1_0.risk_profile,
2026-08-24 17:06:53.327 |         c1_0.role,
2026-08-24 17:06:53.327 |         c1_0.source_of_funds 
2026-08-24 17:06:53.327 |     from
2026-08-24 17:06:53.327 |         customers c1_0 
2026-08-24 17:06:53.327 |     where
2026-08-24 17:06:53.327 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.327 | Hibernate: 
2026-08-24 17:06:53.327 |     select
2026-08-24 17:06:53.327 |         c1_0.id,
2026-08-24 17:06:53.327 |         c1_0.created_at,
2026-08-24 17:06:53.327 |         c1_0.email,
2026-08-24 17:06:53.327 |         c1_0.employment_status,
2026-08-24 17:06:53.327 |         c1_0.first_name,
2026-08-24 17:06:53.327 |         c1_0.job_title,
2026-08-24 17:06:53.327 |         c1_0.kyc_status,
2026-08-24 17:06:53.327 |         c1_0.last_name,
2026-08-24 17:06:53.327 |         c1_0.locked,
2026-08-24 17:06:53.327 |         c1_0.monthly_income,
2026-08-24 17:06:53.327 |         c1_0.password,
2026-08-24 17:06:53.327 |         c1_0.risk_profile,
2026-08-24 17:06:53.327 |         c1_0.role,
2026-08-24 17:06:53.327 |         c1_0.source_of_funds 
2026-08-24 17:06:53.327 |     from
2026-08-24 17:06:53.327 |         customers c1_0 
2026-08-24 17:06:53.327 |     where
2026-08-24 17:06:53.327 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.336 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 7bf99f4b-19ba-4a4b-b865-d325d42b35e3] - Secured GET /api/v1/accounts
2026-08-24 17:06:53.340 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 7bf99f4b-19ba-4a4b-b865-d325d42b35e3] - 
2026-08-24 17:06:53.340 |     select
2026-08-24 17:06:53.340 |         c1_0.id,
2026-08-24 17:06:53.340 |         c1_0.created_at,
2026-08-24 17:06:53.340 |         c1_0.email,
2026-08-24 17:06:53.340 |         c1_0.employment_status,
2026-08-24 17:06:53.340 |         c1_0.first_name,
2026-08-24 17:06:53.340 |         c1_0.job_title,
2026-08-24 17:06:53.340 |         c1_0.kyc_status,
2026-08-24 17:06:53.340 |         c1_0.last_name,
2026-08-24 17:06:53.340 |         c1_0.locked,
2026-08-24 17:06:53.340 |         c1_0.monthly_income,
2026-08-24 17:06:53.340 |         c1_0.password,
2026-08-24 17:06:53.340 |         c1_0.risk_profile,
2026-08-24 17:06:53.340 |         c1_0.role,
2026-08-24 17:06:53.340 |         c1_0.source_of_funds 
2026-08-24 17:06:53.340 |     from
2026-08-24 17:06:53.340 |         customers c1_0 
2026-08-24 17:06:53.340 |     where
2026-08-24 17:06:53.340 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.340 | Hibernate: 
2026-08-24 17:06:53.340 |     select
2026-08-24 17:06:53.340 |         c1_0.id,
2026-08-24 17:06:53.340 |         c1_0.created_at,
2026-08-24 17:06:53.340 |         c1_0.email,
2026-08-24 17:06:53.340 |         c1_0.employment_status,
2026-08-24 17:06:53.340 |         c1_0.first_name,
2026-08-24 17:06:53.340 |         c1_0.job_title,
2026-08-24 17:06:53.340 |         c1_0.kyc_status,
2026-08-24 17:06:53.340 |         c1_0.last_name,
2026-08-24 17:06:53.340 |         c1_0.locked,
2026-08-24 17:06:53.340 |         c1_0.monthly_income,
2026-08-24 17:06:53.340 |         c1_0.password,
2026-08-24 17:06:53.340 |         c1_0.risk_profile,
2026-08-24 17:06:53.340 |         c1_0.role,
2026-08-24 17:06:53.340 |         c1_0.source_of_funds 
2026-08-24 17:06:53.340 |     from
2026-08-24 17:06:53.340 |         customers c1_0 
2026-08-24 17:06:53.341 |     where
2026-08-24 17:06:53.341 |         upper(c1_0.email)=upper(?)
2026-08-24 17:06:53.345 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 7bf99f4b-19ba-4a4b-b865-d325d42b35e3] - 
2026-08-24 17:06:53.346 |     select
2026-08-24 17:06:53.346 |         a1_0.id,
2026-08-24 17:06:53.346 |         a1_0.account_name,
2026-08-24 17:06:53.346 |         a1_0.account_number,
2026-08-24 17:06:53.346 |         a1_0.account_type,
2026-08-24 17:06:53.346 |         a1_0.allow_incoming,
2026-08-24 17:06:53.346 |         a1_0.allow_outgoing,
2026-08-24 17:06:53.346 |         a1_0.balance,
2026-08-24 17:06:53.346 |         a1_0.card_cvv,
2026-08-24 17:06:53.346 |         a1_0.card_expiry,
2026-08-24 17:06:53.346 |         a1_0.created_at,
2026-08-24 17:06:53.346 |         a1_0.currency,
2026-08-24 17:06:53.346 |         a1_0.customer_id,
2026-08-24 17:06:53.346 |         a1_0.daily_limit,
2026-08-24 17:06:53.346 |         a1_0.frozen,
2026-08-24 17:06:53.346 |         a1_0.monthly_limit,
2026-08-24 17:06:53.346 |         a1_0.parent_account_id,
2026-08-24 17:06:53.346 |         a1_0.require_dual_approval,
2026-08-24 17:06:53.346 |         a1_0.status,
2026-08-24 17:06:53.346 |         a1_0.swift_code,
2026-08-24 17:06:53.346 |         a1_0.updated_at,
2026-08-24 17:06:53.346 |         a1_0.version 
2026-08-24 17:06:53.346 |     from
2026-08-24 17:06:53.346 |         accounts a1_0 
2026-08-24 17:06:53.346 |     where
2026-08-24 17:06:53.346 |         a1_0.customer_id=?
2026-08-24 17:06:53.346 | Hibernate: 
2026-08-24 17:06:53.346 |     select
2026-08-24 17:06:53.346 |         a1_0.id,
2026-08-24 17:06:53.346 |         a1_0.account_name,
2026-08-24 17:06:53.346 |         a1_0.account_number,
2026-08-24 17:06:53.346 |         a1_0.account_type,
2026-08-24 17:06:53.346 |         a1_0.allow_incoming,
2026-08-24 17:06:53.346 |         a1_0.allow_outgoing,
2026-08-24 17:06:53.346 |         a1_0.balance,
2026-08-24 17:06:53.346 |         a1_0.card_cvv,
2026-08-24 17:06:53.346 |         a1_0.card_expiry,
2026-08-24 17:06:53.346 |         a1_0.created_at,
2026-08-24 17:06:53.346 |         a1_0.currency,
2026-08-24 17:06:53.346 |         a1_0.customer_id,
2026-08-24 17:06:53.346 |         a1_0.daily_limit,
2026-08-24 17:06:53.346 |         a1_0.frozen,
2026-08-24 17:06:53.346 |         a1_0.monthly_limit,
2026-08-24 17:06:53.346 |         a1_0.parent_account_id,
2026-08-24 17:06:53.346 |         a1_0.require_dual_approval,
2026-08-24 17:06:53.346 |         a1_0.status,
2026-08-24 17:06:53.346 |         a1_0.swift_code,
2026-08-24 17:06:53.346 |         a1_0.updated_at,
2026-08-24 17:06:53.346 |         a1_0.version 
2026-08-24 17:06:53.346 |     from
2026-08-24 17:06:53.346 |         accounts a1_0 
2026-08-24 17:06:53.346 |     where
2026-08-24 17:06:53.346 |         a1_0.customer_id=?
2026-08-24 17:06:53.352 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 7bf99f4b-19ba-4a4b-b865-d325d42b35e3] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 16ms
2026-08-24 17:06:53.354 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:53.354 |     insert 
2026-08-24 17:06:53.354 |     into
2026-08-24 17:06:53.354 |         api_audit_events
2026-08-24 17:06:53.354 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:53.354 |     values
2026-08-24 17:06:53.354 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:53.354 | Hibernate: 
2026-08-24 17:06:53.354 |     insert 
2026-08-24 17:06:53.354 |     into
2026-08-24 17:06:53.354 |         api_audit_events
2026-08-24 17:06:53.354 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:06:53.354 |     values
2026-08-24 17:06:53.354 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:06:53.363 | 2026-08-24 09:06:53 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=32ms
2026-08-24 17:06:54.309 | 2026-08-24 09:06:54 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:54.309 |     SELECT
2026-08-24 17:06:54.309 |         o1.* 
2026-08-24 17:06:54.309 |     FROM
2026-08-24 17:06:54.309 |         payment_event_outbox o1 
2026-08-24 17:06:54.309 |     WHERE
2026-08-24 17:06:54.309 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:54.309 |         AND (
2026-08-24 17:06:54.309 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:54.309 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:54.309 |         )   
2026-08-24 17:06:54.309 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:54.309 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:54.309 |             1 
2026-08-24 17:06:54.309 |         FROM
2026-08-24 17:06:54.309 |             payment_event_outbox o2       
2026-08-24 17:06:54.309 |         WHERE
2026-08-24 17:06:54.309 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:54.309 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:54.309 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:54.309 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:54.309 |     ORDER BY
2026-08-24 17:06:54.309 |         o1.created_at ASC 
2026-08-24 17:06:54.309 |     LIMIT
2026-08-24 17:06:54.309 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:54.309 | Hibernate: 
2026-08-24 17:06:54.309 |     SELECT
2026-08-24 17:06:54.309 |         o1.* 
2026-08-24 17:06:54.309 |     FROM
2026-08-24 17:06:54.309 |         payment_event_outbox o1 
2026-08-24 17:06:54.309 |     WHERE
2026-08-24 17:06:54.309 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:54.309 |         AND (
2026-08-24 17:06:54.309 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:54.309 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:54.309 |         )   
2026-08-24 17:06:54.309 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:54.309 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:54.309 |             1 
2026-08-24 17:06:54.309 |         FROM
2026-08-24 17:06:54.309 |             payment_event_outbox o2       
2026-08-24 17:06:54.309 |         WHERE
2026-08-24 17:06:54.309 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:54.309 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:54.309 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:54.309 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:54.309 |     ORDER BY
2026-08-24 17:06:54.309 |         o1.created_at ASC 
2026-08-24 17:06:54.309 |     LIMIT
2026-08-24 17:06:54.309 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:58.552 | 2026-08-24 09:06:58 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:06:58.552 | 2026-08-24 09:06:58 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:06:58.553 | 2026-08-24 09:06:58 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 23f50079-d6bf-4e37-b082-03a189d43d02] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:06:58.558 | 2026-08-24 09:06:58 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 23f50079-d6bf-4e37-b082-03a189d43d02] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:06:59.314 | 2026-08-24 09:06:59 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:06:59.314 |     SELECT
2026-08-24 17:06:59.314 |         o1.* 
2026-08-24 17:06:59.314 |     FROM
2026-08-24 17:06:59.314 |         payment_event_outbox o1 
2026-08-24 17:06:59.314 |     WHERE
2026-08-24 17:06:59.314 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:59.314 |         AND (
2026-08-24 17:06:59.314 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:59.314 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:59.314 |         )   
2026-08-24 17:06:59.314 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:59.314 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:59.314 |             1 
2026-08-24 17:06:59.314 |         FROM
2026-08-24 17:06:59.314 |             payment_event_outbox o2       
2026-08-24 17:06:59.314 |         WHERE
2026-08-24 17:06:59.314 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:59.314 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:59.314 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:59.314 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:59.314 |     ORDER BY
2026-08-24 17:06:59.314 |         o1.created_at ASC 
2026-08-24 17:06:59.314 |     LIMIT
2026-08-24 17:06:59.314 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:06:59.314 | Hibernate: 
2026-08-24 17:06:59.314 |     SELECT
2026-08-24 17:06:59.314 |         o1.* 
2026-08-24 17:06:59.314 |     FROM
2026-08-24 17:06:59.314 |         payment_event_outbox o1 
2026-08-24 17:06:59.314 |     WHERE
2026-08-24 17:06:59.314 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:06:59.314 |         AND (
2026-08-24 17:06:59.314 |             o1.next_attempt_at IS NULL 
2026-08-24 17:06:59.314 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:06:59.314 |         )   
2026-08-24 17:06:59.314 |         AND o1.locked_at IS NULL   
2026-08-24 17:06:59.314 |         AND NOT EXISTS (       SELECT
2026-08-24 17:06:59.314 |             1 
2026-08-24 17:06:59.314 |         FROM
2026-08-24 17:06:59.314 |             payment_event_outbox o2       
2026-08-24 17:06:59.314 |         WHERE
2026-08-24 17:06:59.314 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:06:59.314 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:06:59.314 |             AND o2.sequence < o1.sequence         
2026-08-24 17:06:59.314 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:06:59.314 |     ORDER BY
2026-08-24 17:06:59.314 |         o1.created_at ASC 
2026-08-24 17:06:59.314 |     LIMIT
2026-08-24 17:06:59.314 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:04.319 | 2026-08-24 09:07:04 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:04.319 |     SELECT
2026-08-24 17:07:04.319 |         o1.* 
2026-08-24 17:07:04.319 |     FROM
2026-08-24 17:07:04.319 |         payment_event_outbox o1 
2026-08-24 17:07:04.319 |     WHERE
2026-08-24 17:07:04.319 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:04.319 |         AND (
2026-08-24 17:07:04.319 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:04.319 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:04.319 |         )   
2026-08-24 17:07:04.319 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:04.319 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:04.319 |             1 
2026-08-24 17:07:04.319 |         FROM
2026-08-24 17:07:04.319 |             payment_event_outbox o2       
2026-08-24 17:07:04.319 |         WHERE
2026-08-24 17:07:04.319 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:04.319 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:04.319 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:04.319 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:04.319 |     ORDER BY
2026-08-24 17:07:04.319 |         o1.created_at ASC 
2026-08-24 17:07:04.319 |     LIMIT
2026-08-24 17:07:04.319 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:04.319 | Hibernate: 
2026-08-24 17:07:04.319 |     SELECT
2026-08-24 17:07:04.319 |         o1.* 
2026-08-24 17:07:04.319 |     FROM
2026-08-24 17:07:04.319 |         payment_event_outbox o1 
2026-08-24 17:07:04.319 |     WHERE
2026-08-24 17:07:04.319 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:04.319 |         AND (
2026-08-24 17:07:04.319 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:04.319 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:04.319 |         )   
2026-08-24 17:07:04.319 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:04.319 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:04.319 |             1 
2026-08-24 17:07:04.319 |         FROM
2026-08-24 17:07:04.319 |             payment_event_outbox o2       
2026-08-24 17:07:04.319 |         WHERE
2026-08-24 17:07:04.319 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:04.319 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:04.319 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:04.319 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:04.319 |     ORDER BY
2026-08-24 17:07:04.319 |         o1.created_at ASC 
2026-08-24 17:07:04.319 |     LIMIT
2026-08-24 17:07:04.319 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:08.652 | 2026-08-24 09:07:08 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:07:08.652 | 2026-08-24 09:07:08 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:07:08.653 | 2026-08-24 09:07:08 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b09cf488-d970-4a1e-b5c5-42168805d96e] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:07:08.658 | 2026-08-24 09:07:08 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b09cf488-d970-4a1e-b5c5-42168805d96e] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:07:09.326 | 2026-08-24 09:07:09 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:09.326 |     SELECT
2026-08-24 17:07:09.326 |         o1.* 
2026-08-24 17:07:09.326 |     FROM
2026-08-24 17:07:09.327 |         payment_event_outbox o1 
2026-08-24 17:07:09.327 |     WHERE
2026-08-24 17:07:09.327 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:09.327 |         AND (
2026-08-24 17:07:09.327 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:09.327 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:09.327 |         )   
2026-08-24 17:07:09.327 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:09.327 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:09.327 |             1 
2026-08-24 17:07:09.327 |         FROM
2026-08-24 17:07:09.327 |             payment_event_outbox o2       
2026-08-24 17:07:09.327 |         WHERE
2026-08-24 17:07:09.327 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:09.327 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:09.327 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:09.327 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:09.327 |     ORDER BY
2026-08-24 17:07:09.327 |         o1.created_at ASC 
2026-08-24 17:07:09.327 |     LIMIT
2026-08-24 17:07:09.327 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:09.327 | Hibernate: 
2026-08-24 17:07:09.327 |     SELECT
2026-08-24 17:07:09.327 |         o1.* 
2026-08-24 17:07:09.327 |     FROM
2026-08-24 17:07:09.327 |         payment_event_outbox o1 
2026-08-24 17:07:09.327 |     WHERE
2026-08-24 17:07:09.327 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:09.327 |         AND (
2026-08-24 17:07:09.327 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:09.327 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:09.327 |         )   
2026-08-24 17:07:09.327 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:09.327 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:09.327 |             1 
2026-08-24 17:07:09.327 |         FROM
2026-08-24 17:07:09.327 |             payment_event_outbox o2       
2026-08-24 17:07:09.327 |         WHERE
2026-08-24 17:07:09.327 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:09.327 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:09.327 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:09.327 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:09.327 |     ORDER BY
2026-08-24 17:07:09.327 |         o1.created_at ASC 
2026-08-24 17:07:09.327 |     LIMIT
2026-08-24 17:07:09.327 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:14.328 | 2026-08-24 09:07:14 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:14.328 |     SELECT
2026-08-24 17:07:14.328 |         o1.* 
2026-08-24 17:07:14.328 |     FROM
2026-08-24 17:07:14.328 |         payment_event_outbox o1 
2026-08-24 17:07:14.328 |     WHERE
2026-08-24 17:07:14.328 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:14.328 |         AND (
2026-08-24 17:07:14.328 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:14.328 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:14.328 |         )   
2026-08-24 17:07:14.328 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:14.328 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:14.328 |             1 
2026-08-24 17:07:14.328 |         FROM
2026-08-24 17:07:14.328 |             payment_event_outbox o2       
2026-08-24 17:07:14.328 |         WHERE
2026-08-24 17:07:14.328 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:14.328 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:14.328 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:14.328 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:14.328 |     ORDER BY
2026-08-24 17:07:14.328 |         o1.created_at ASC 
2026-08-24 17:07:14.328 |     LIMIT
2026-08-24 17:07:14.328 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:14.328 | Hibernate: 
2026-08-24 17:07:14.328 |     SELECT
2026-08-24 17:07:14.328 |         o1.* 
2026-08-24 17:07:14.328 |     FROM
2026-08-24 17:07:14.328 |         payment_event_outbox o1 
2026-08-24 17:07:14.328 |     WHERE
2026-08-24 17:07:14.328 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:14.328 |         AND (
2026-08-24 17:07:14.328 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:14.328 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:14.328 |         )   
2026-08-24 17:07:14.328 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:14.328 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:14.328 |             1 
2026-08-24 17:07:14.328 |         FROM
2026-08-24 17:07:14.328 |             payment_event_outbox o2       
2026-08-24 17:07:14.328 |         WHERE
2026-08-24 17:07:14.328 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:14.328 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:14.328 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:14.328 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:14.328 |     ORDER BY
2026-08-24 17:07:14.328 |         o1.created_at ASC 
2026-08-24 17:07:14.328 |     LIMIT
2026-08-24 17:07:14.328 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:18.780 | 2026-08-24 09:07:18 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:07:18.781 | 2026-08-24 09:07:18 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:07:18.781 | 2026-08-24 09:07:18 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: d90d6102-544c-452e-8c20-8651b037e490] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:07:18.791 | 2026-08-24 09:07:18 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d90d6102-544c-452e-8c20-8651b037e490] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 10ms
2026-08-24 17:07:19.333 | 2026-08-24 09:07:19 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:19.333 |     SELECT
2026-08-24 17:07:19.333 |         o1.* 
2026-08-24 17:07:19.333 |     FROM
2026-08-24 17:07:19.333 |         payment_event_outbox o1 
2026-08-24 17:07:19.333 |     WHERE
2026-08-24 17:07:19.333 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:19.333 |         AND (
2026-08-24 17:07:19.333 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:19.333 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:19.333 |         )   
2026-08-24 17:07:19.333 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:19.333 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:19.333 |             1 
2026-08-24 17:07:19.333 |         FROM
2026-08-24 17:07:19.333 |             payment_event_outbox o2       
2026-08-24 17:07:19.333 |         WHERE
2026-08-24 17:07:19.333 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:19.333 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:19.333 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:19.333 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:19.333 |     ORDER BY
2026-08-24 17:07:19.333 |         o1.created_at ASC 
2026-08-24 17:07:19.333 |     LIMIT
2026-08-24 17:07:19.333 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:19.333 | Hibernate: 
2026-08-24 17:07:19.333 |     SELECT
2026-08-24 17:07:19.333 |         o1.* 
2026-08-24 17:07:19.333 |     FROM
2026-08-24 17:07:19.333 |         payment_event_outbox o1 
2026-08-24 17:07:19.333 |     WHERE
2026-08-24 17:07:19.333 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:19.333 |         AND (
2026-08-24 17:07:19.333 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:19.333 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:19.333 |         )   
2026-08-24 17:07:19.333 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:19.333 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:19.333 |             1 
2026-08-24 17:07:19.333 |         FROM
2026-08-24 17:07:19.333 |             payment_event_outbox o2       
2026-08-24 17:07:19.333 |         WHERE
2026-08-24 17:07:19.333 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:19.333 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:19.333 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:19.333 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:19.333 |     ORDER BY
2026-08-24 17:07:19.333 |         o1.created_at ASC 
2026-08-24 17:07:19.333 |     LIMIT
2026-08-24 17:07:19.333 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:24.338 | 2026-08-24 09:07:24 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:24.338 |     SELECT
2026-08-24 17:07:24.338 |         o1.* 
2026-08-24 17:07:24.338 |     FROM
2026-08-24 17:07:24.338 |         payment_event_outbox o1 
2026-08-24 17:07:24.338 |     WHERE
2026-08-24 17:07:24.338 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:24.338 |         AND (
2026-08-24 17:07:24.338 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:24.338 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:24.338 |         )   
2026-08-24 17:07:24.338 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:24.338 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:24.338 |             1 
2026-08-24 17:07:24.338 |         FROM
2026-08-24 17:07:24.338 |             payment_event_outbox o2       
2026-08-24 17:07:24.338 |         WHERE
2026-08-24 17:07:24.338 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:24.338 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:24.338 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:24.338 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:24.338 |     ORDER BY
2026-08-24 17:07:24.338 |         o1.created_at ASC 
2026-08-24 17:07:24.338 |     LIMIT
2026-08-24 17:07:24.338 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:24.338 | Hibernate: 
2026-08-24 17:07:24.338 |     SELECT
2026-08-24 17:07:24.338 |         o1.* 
2026-08-24 17:07:24.338 |     FROM
2026-08-24 17:07:24.338 |         payment_event_outbox o1 
2026-08-24 17:07:24.338 |     WHERE
2026-08-24 17:07:24.338 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:24.338 |         AND (
2026-08-24 17:07:24.338 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:24.338 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:24.338 |         )   
2026-08-24 17:07:24.338 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:24.338 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:24.338 |             1 
2026-08-24 17:07:24.338 |         FROM
2026-08-24 17:07:24.338 |             payment_event_outbox o2       
2026-08-24 17:07:24.338 |         WHERE
2026-08-24 17:07:24.338 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:24.338 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:24.338 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:24.338 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:24.338 |     ORDER BY
2026-08-24 17:07:24.338 |         o1.created_at ASC 
2026-08-24 17:07:24.338 |     LIMIT
2026-08-24 17:07:24.338 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:27.734 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:07:27.739 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: c8edbc7f-136b-4dac-a967-9a90ebea1d9f] - 
2026-08-24 17:07:27.739 |     select
2026-08-24 17:07:27.739 |         c1_0.id,
2026-08-24 17:07:27.739 |         c1_0.created_at,
2026-08-24 17:07:27.739 |         c1_0.email,
2026-08-24 17:07:27.739 |         c1_0.employment_status,
2026-08-24 17:07:27.739 |         c1_0.first_name,
2026-08-24 17:07:27.739 |         c1_0.job_title,
2026-08-24 17:07:27.739 |         c1_0.kyc_status,
2026-08-24 17:07:27.739 |         c1_0.last_name,
2026-08-24 17:07:27.739 |         c1_0.locked,
2026-08-24 17:07:27.739 |         c1_0.monthly_income,
2026-08-24 17:07:27.739 |         c1_0.password,
2026-08-24 17:07:27.739 |         c1_0.risk_profile,
2026-08-24 17:07:27.739 |         c1_0.role,
2026-08-24 17:07:27.739 |         c1_0.source_of_funds 
2026-08-24 17:07:27.739 |     from
2026-08-24 17:07:27.739 |         customers c1_0 
2026-08-24 17:07:27.739 |     where
2026-08-24 17:07:27.739 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.739 | Hibernate: 
2026-08-24 17:07:27.739 |     select
2026-08-24 17:07:27.739 |         c1_0.id,
2026-08-24 17:07:27.739 |         c1_0.created_at,
2026-08-24 17:07:27.739 |         c1_0.email,
2026-08-24 17:07:27.739 |         c1_0.employment_status,
2026-08-24 17:07:27.739 |         c1_0.first_name,
2026-08-24 17:07:27.739 |         c1_0.job_title,
2026-08-24 17:07:27.739 |         c1_0.kyc_status,
2026-08-24 17:07:27.739 |         c1_0.last_name,
2026-08-24 17:07:27.739 |         c1_0.locked,
2026-08-24 17:07:27.739 |         c1_0.monthly_income,
2026-08-24 17:07:27.739 |         c1_0.password,
2026-08-24 17:07:27.739 |         c1_0.risk_profile,
2026-08-24 17:07:27.739 |         c1_0.role,
2026-08-24 17:07:27.739 |         c1_0.source_of_funds 
2026-08-24 17:07:27.739 |     from
2026-08-24 17:07:27.739 |         customers c1_0 
2026-08-24 17:07:27.739 |     where
2026-08-24 17:07:27.739 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.748 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: c8edbc7f-136b-4dac-a967-9a90ebea1d9f] - Secured GET /api/v1/accounts
2026-08-24 17:07:27.751 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: c8edbc7f-136b-4dac-a967-9a90ebea1d9f] - 
2026-08-24 17:07:27.751 |     select
2026-08-24 17:07:27.751 |         c1_0.id,
2026-08-24 17:07:27.751 |         c1_0.created_at,
2026-08-24 17:07:27.751 |         c1_0.email,
2026-08-24 17:07:27.751 |         c1_0.employment_status,
2026-08-24 17:07:27.751 |         c1_0.first_name,
2026-08-24 17:07:27.751 |         c1_0.job_title,
2026-08-24 17:07:27.751 |         c1_0.kyc_status,
2026-08-24 17:07:27.751 |         c1_0.last_name,
2026-08-24 17:07:27.751 |         c1_0.locked,
2026-08-24 17:07:27.751 |         c1_0.monthly_income,
2026-08-24 17:07:27.751 |         c1_0.password,
2026-08-24 17:07:27.751 |         c1_0.risk_profile,
2026-08-24 17:07:27.751 |         c1_0.role,
2026-08-24 17:07:27.751 |         c1_0.source_of_funds 
2026-08-24 17:07:27.751 |     from
2026-08-24 17:07:27.751 |         customers c1_0 
2026-08-24 17:07:27.751 |     where
2026-08-24 17:07:27.751 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.751 | Hibernate: 
2026-08-24 17:07:27.751 |     select
2026-08-24 17:07:27.751 |         c1_0.id,
2026-08-24 17:07:27.751 |         c1_0.created_at,
2026-08-24 17:07:27.751 |         c1_0.email,
2026-08-24 17:07:27.751 |         c1_0.employment_status,
2026-08-24 17:07:27.751 |         c1_0.first_name,
2026-08-24 17:07:27.751 |         c1_0.job_title,
2026-08-24 17:07:27.751 |         c1_0.kyc_status,
2026-08-24 17:07:27.751 |         c1_0.last_name,
2026-08-24 17:07:27.751 |         c1_0.locked,
2026-08-24 17:07:27.751 |         c1_0.monthly_income,
2026-08-24 17:07:27.751 |         c1_0.password,
2026-08-24 17:07:27.751 |         c1_0.risk_profile,
2026-08-24 17:07:27.751 |         c1_0.role,
2026-08-24 17:07:27.751 |         c1_0.source_of_funds 
2026-08-24 17:07:27.751 |     from
2026-08-24 17:07:27.751 |         customers c1_0 
2026-08-24 17:07:27.751 |     where
2026-08-24 17:07:27.751 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.757 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: c8edbc7f-136b-4dac-a967-9a90ebea1d9f] - 
2026-08-24 17:07:27.757 |     select
2026-08-24 17:07:27.757 |         a1_0.id,
2026-08-24 17:07:27.757 |         a1_0.account_name,
2026-08-24 17:07:27.757 |         a1_0.account_number,
2026-08-24 17:07:27.757 |         a1_0.account_type,
2026-08-24 17:07:27.757 |         a1_0.allow_incoming,
2026-08-24 17:07:27.757 |         a1_0.allow_outgoing,
2026-08-24 17:07:27.757 |         a1_0.balance,
2026-08-24 17:07:27.757 |         a1_0.card_cvv,
2026-08-24 17:07:27.757 |         a1_0.card_expiry,
2026-08-24 17:07:27.757 |         a1_0.created_at,
2026-08-24 17:07:27.757 |         a1_0.currency,
2026-08-24 17:07:27.757 |         a1_0.customer_id,
2026-08-24 17:07:27.757 |         a1_0.daily_limit,
2026-08-24 17:07:27.757 |         a1_0.frozen,
2026-08-24 17:07:27.757 |         a1_0.monthly_limit,
2026-08-24 17:07:27.757 |         a1_0.parent_account_id,
2026-08-24 17:07:27.757 |         a1_0.require_dual_approval,
2026-08-24 17:07:27.757 |         a1_0.status,
2026-08-24 17:07:27.757 |         a1_0.swift_code,
2026-08-24 17:07:27.757 |         a1_0.updated_at,
2026-08-24 17:07:27.757 |         a1_0.version 
2026-08-24 17:07:27.757 |     from
2026-08-24 17:07:27.757 |         accounts a1_0 
2026-08-24 17:07:27.757 |     where
2026-08-24 17:07:27.757 |         a1_0.customer_id=?
2026-08-24 17:07:27.757 | Hibernate: 
2026-08-24 17:07:27.757 |     select
2026-08-24 17:07:27.757 |         a1_0.id,
2026-08-24 17:07:27.757 |         a1_0.account_name,
2026-08-24 17:07:27.757 |         a1_0.account_number,
2026-08-24 17:07:27.757 |         a1_0.account_type,
2026-08-24 17:07:27.757 |         a1_0.allow_incoming,
2026-08-24 17:07:27.757 |         a1_0.allow_outgoing,
2026-08-24 17:07:27.757 |         a1_0.balance,
2026-08-24 17:07:27.757 |         a1_0.card_cvv,
2026-08-24 17:07:27.757 |         a1_0.card_expiry,
2026-08-24 17:07:27.757 |         a1_0.created_at,
2026-08-24 17:07:27.757 |         a1_0.currency,
2026-08-24 17:07:27.757 |         a1_0.customer_id,
2026-08-24 17:07:27.757 |         a1_0.daily_limit,
2026-08-24 17:07:27.757 |         a1_0.frozen,
2026-08-24 17:07:27.757 |         a1_0.monthly_limit,
2026-08-24 17:07:27.757 |         a1_0.parent_account_id,
2026-08-24 17:07:27.757 |         a1_0.require_dual_approval,
2026-08-24 17:07:27.757 |         a1_0.status,
2026-08-24 17:07:27.757 |         a1_0.swift_code,
2026-08-24 17:07:27.757 |         a1_0.updated_at,
2026-08-24 17:07:27.757 |         a1_0.version 
2026-08-24 17:07:27.757 |     from
2026-08-24 17:07:27.757 |         accounts a1_0 
2026-08-24 17:07:27.757 |     where
2026-08-24 17:07:27.757 |         a1_0.customer_id=?
2026-08-24 17:07:27.764 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: c8edbc7f-136b-4dac-a967-9a90ebea1d9f] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 17ms
2026-08-24 17:07:27.766 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:27.766 |     insert 
2026-08-24 17:07:27.766 |     into
2026-08-24 17:07:27.766 |         api_audit_events
2026-08-24 17:07:27.766 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:07:27.766 |     values
2026-08-24 17:07:27.766 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:07:27.767 | Hibernate: 
2026-08-24 17:07:27.767 |     insert 
2026-08-24 17:07:27.767 |     into
2026-08-24 17:07:27.767 |         api_audit_events
2026-08-24 17:07:27.767 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:07:27.767 |     values
2026-08-24 17:07:27.767 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:07:27.791 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=32ms
2026-08-24 17:07:27.925 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:07:27.932 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 9d4012a7-207a-4914-be4b-6b7e3e3fef01] - 
2026-08-24 17:07:27.932 |     select
2026-08-24 17:07:27.932 |         c1_0.id,
2026-08-24 17:07:27.932 |         c1_0.created_at,
2026-08-24 17:07:27.932 |         c1_0.email,
2026-08-24 17:07:27.932 |         c1_0.employment_status,
2026-08-24 17:07:27.932 |         c1_0.first_name,
2026-08-24 17:07:27.932 |         c1_0.job_title,
2026-08-24 17:07:27.932 |         c1_0.kyc_status,
2026-08-24 17:07:27.932 |         c1_0.last_name,
2026-08-24 17:07:27.932 |         c1_0.locked,
2026-08-24 17:07:27.932 |         c1_0.monthly_income,
2026-08-24 17:07:27.932 |         c1_0.password,
2026-08-24 17:07:27.932 |         c1_0.risk_profile,
2026-08-24 17:07:27.932 |         c1_0.role,
2026-08-24 17:07:27.932 |         c1_0.source_of_funds 
2026-08-24 17:07:27.932 |     from
2026-08-24 17:07:27.932 |         customers c1_0 
2026-08-24 17:07:27.932 |     where
2026-08-24 17:07:27.932 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.932 | Hibernate: 
2026-08-24 17:07:27.932 |     select
2026-08-24 17:07:27.932 |         c1_0.id,
2026-08-24 17:07:27.932 |         c1_0.created_at,
2026-08-24 17:07:27.932 |         c1_0.email,
2026-08-24 17:07:27.932 |         c1_0.employment_status,
2026-08-24 17:07:27.932 |         c1_0.first_name,
2026-08-24 17:07:27.932 |         c1_0.job_title,
2026-08-24 17:07:27.932 |         c1_0.kyc_status,
2026-08-24 17:07:27.932 |         c1_0.last_name,
2026-08-24 17:07:27.932 |         c1_0.locked,
2026-08-24 17:07:27.932 |         c1_0.monthly_income,
2026-08-24 17:07:27.932 |         c1_0.password,
2026-08-24 17:07:27.932 |         c1_0.risk_profile,
2026-08-24 17:07:27.932 |         c1_0.role,
2026-08-24 17:07:27.932 |         c1_0.source_of_funds 
2026-08-24 17:07:27.932 |     from
2026-08-24 17:07:27.932 |         customers c1_0 
2026-08-24 17:07:27.932 |     where
2026-08-24 17:07:27.932 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.940 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 9d4012a7-207a-4914-be4b-6b7e3e3fef01] - Secured GET /api/v1/accounts
2026-08-24 17:07:27.945 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 9d4012a7-207a-4914-be4b-6b7e3e3fef01] - 
2026-08-24 17:07:27.945 |     select
2026-08-24 17:07:27.945 |         c1_0.id,
2026-08-24 17:07:27.945 |         c1_0.created_at,
2026-08-24 17:07:27.945 |         c1_0.email,
2026-08-24 17:07:27.945 |         c1_0.employment_status,
2026-08-24 17:07:27.945 |         c1_0.first_name,
2026-08-24 17:07:27.945 |         c1_0.job_title,
2026-08-24 17:07:27.945 |         c1_0.kyc_status,
2026-08-24 17:07:27.945 |         c1_0.last_name,
2026-08-24 17:07:27.945 |         c1_0.locked,
2026-08-24 17:07:27.945 |         c1_0.monthly_income,
2026-08-24 17:07:27.945 |         c1_0.password,
2026-08-24 17:07:27.945 |         c1_0.risk_profile,
2026-08-24 17:07:27.945 |         c1_0.role,
2026-08-24 17:07:27.945 |         c1_0.source_of_funds 
2026-08-24 17:07:27.945 |     from
2026-08-24 17:07:27.945 |         customers c1_0 
2026-08-24 17:07:27.945 |     where
2026-08-24 17:07:27.945 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.945 | Hibernate: 
2026-08-24 17:07:27.945 |     select
2026-08-24 17:07:27.945 |         c1_0.id,
2026-08-24 17:07:27.945 |         c1_0.created_at,
2026-08-24 17:07:27.945 |         c1_0.email,
2026-08-24 17:07:27.945 |         c1_0.employment_status,
2026-08-24 17:07:27.945 |         c1_0.first_name,
2026-08-24 17:07:27.945 |         c1_0.job_title,
2026-08-24 17:07:27.945 |         c1_0.kyc_status,
2026-08-24 17:07:27.945 |         c1_0.last_name,
2026-08-24 17:07:27.945 |         c1_0.locked,
2026-08-24 17:07:27.945 |         c1_0.monthly_income,
2026-08-24 17:07:27.945 |         c1_0.password,
2026-08-24 17:07:27.945 |         c1_0.risk_profile,
2026-08-24 17:07:27.945 |         c1_0.role,
2026-08-24 17:07:27.945 |         c1_0.source_of_funds 
2026-08-24 17:07:27.945 |     from
2026-08-24 17:07:27.945 |         customers c1_0 
2026-08-24 17:07:27.945 |     where
2026-08-24 17:07:27.945 |         upper(c1_0.email)=upper(?)
2026-08-24 17:07:27.950 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 9d4012a7-207a-4914-be4b-6b7e3e3fef01] - 
2026-08-24 17:07:27.950 |     select
2026-08-24 17:07:27.950 |         a1_0.id,
2026-08-24 17:07:27.950 |         a1_0.account_name,
2026-08-24 17:07:27.950 |         a1_0.account_number,
2026-08-24 17:07:27.950 |         a1_0.account_type,
2026-08-24 17:07:27.950 |         a1_0.allow_incoming,
2026-08-24 17:07:27.950 |         a1_0.allow_outgoing,
2026-08-24 17:07:27.950 |         a1_0.balance,
2026-08-24 17:07:27.950 |         a1_0.card_cvv,
2026-08-24 17:07:27.950 |         a1_0.card_expiry,
2026-08-24 17:07:27.950 |         a1_0.created_at,
2026-08-24 17:07:27.950 |         a1_0.currency,
2026-08-24 17:07:27.950 |         a1_0.customer_id,
2026-08-24 17:07:27.950 |         a1_0.daily_limit,
2026-08-24 17:07:27.950 |         a1_0.frozen,
2026-08-24 17:07:27.950 |         a1_0.monthly_limit,
2026-08-24 17:07:27.950 |         a1_0.parent_account_id,
2026-08-24 17:07:27.950 |         a1_0.require_dual_approval,
2026-08-24 17:07:27.950 |         a1_0.status,
2026-08-24 17:07:27.950 |         a1_0.swift_code,
2026-08-24 17:07:27.950 |         a1_0.updated_at,
2026-08-24 17:07:27.950 |         a1_0.version 
2026-08-24 17:07:27.950 |     from
2026-08-24 17:07:27.950 |         accounts a1_0 
2026-08-24 17:07:27.950 |     where
2026-08-24 17:07:27.950 |         a1_0.customer_id=?
2026-08-24 17:07:27.950 | Hibernate: 
2026-08-24 17:07:27.950 |     select
2026-08-24 17:07:27.950 |         a1_0.id,
2026-08-24 17:07:27.950 |         a1_0.account_name,
2026-08-24 17:07:27.950 |         a1_0.account_number,
2026-08-24 17:07:27.950 |         a1_0.account_type,
2026-08-24 17:07:27.950 |         a1_0.allow_incoming,
2026-08-24 17:07:27.950 |         a1_0.allow_outgoing,
2026-08-24 17:07:27.950 |         a1_0.balance,
2026-08-24 17:07:27.950 |         a1_0.card_cvv,
2026-08-24 17:07:27.950 |         a1_0.card_expiry,
2026-08-24 17:07:27.950 |         a1_0.created_at,
2026-08-24 17:07:27.950 |         a1_0.currency,
2026-08-24 17:07:27.950 |         a1_0.customer_id,
2026-08-24 17:07:27.950 |         a1_0.daily_limit,
2026-08-24 17:07:27.950 |         a1_0.frozen,
2026-08-24 17:07:27.950 |         a1_0.monthly_limit,
2026-08-24 17:07:27.950 |         a1_0.parent_account_id,
2026-08-24 17:07:27.950 |         a1_0.require_dual_approval,
2026-08-24 17:07:27.950 |         a1_0.status,
2026-08-24 17:07:27.950 |         a1_0.swift_code,
2026-08-24 17:07:27.950 |         a1_0.updated_at,
2026-08-24 17:07:27.950 |         a1_0.version 
2026-08-24 17:07:27.950 |     from
2026-08-24 17:07:27.950 |         accounts a1_0 
2026-08-24 17:07:27.950 |     where
2026-08-24 17:07:27.950 |         a1_0.customer_id=?
2026-08-24 17:07:27.956 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 9d4012a7-207a-4914-be4b-6b7e3e3fef01] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 14ms
2026-08-24 17:07:27.958 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:27.958 |     insert 
2026-08-24 17:07:27.958 |     into
2026-08-24 17:07:27.958 |         api_audit_events
2026-08-24 17:07:27.958 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:07:27.958 |     values
2026-08-24 17:07:27.958 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:07:27.958 | Hibernate: 
2026-08-24 17:07:27.958 |     insert 
2026-08-24 17:07:27.958 |     into
2026-08-24 17:07:27.958 |         api_audit_events
2026-08-24 17:07:27.958 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:07:27.958 |     values
2026-08-24 17:07:27.958 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:07:27.969 | 2026-08-24 09:07:27 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=32ms
2026-08-24 17:07:28.934 | 2026-08-24 09:07:28 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:07:28.935 | 2026-08-24 09:07:28 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:07:28.936 | 2026-08-24 09:07:28 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b7adacf5-c285-4a91-99b4-7e501c115135] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:07:28.942 | 2026-08-24 09:07:28 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b7adacf5-c285-4a91-99b4-7e501c115135] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:07:29.344 | 2026-08-24 09:07:29 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:29.344 |     SELECT
2026-08-24 17:07:29.344 |         o1.* 
2026-08-24 17:07:29.344 |     FROM
2026-08-24 17:07:29.344 |         payment_event_outbox o1 
2026-08-24 17:07:29.345 |     WHERE
2026-08-24 17:07:29.345 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:29.345 |         AND (
2026-08-24 17:07:29.345 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:29.345 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:29.345 |         )   
2026-08-24 17:07:29.345 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:29.345 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:29.345 |             1 
2026-08-24 17:07:29.345 |         FROM
2026-08-24 17:07:29.345 |             payment_event_outbox o2       
2026-08-24 17:07:29.345 |         WHERE
2026-08-24 17:07:29.345 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:29.345 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:29.345 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:29.345 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:29.345 |     ORDER BY
2026-08-24 17:07:29.345 |         o1.created_at ASC 
2026-08-24 17:07:29.345 |     LIMIT
2026-08-24 17:07:29.345 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:29.345 | Hibernate: 
2026-08-24 17:07:29.345 |     SELECT
2026-08-24 17:07:29.345 |         o1.* 
2026-08-24 17:07:29.345 |     FROM
2026-08-24 17:07:29.345 |         payment_event_outbox o1 
2026-08-24 17:07:29.345 |     WHERE
2026-08-24 17:07:29.345 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:29.345 |         AND (
2026-08-24 17:07:29.345 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:29.345 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:29.345 |         )   
2026-08-24 17:07:29.345 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:29.345 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:29.345 |             1 
2026-08-24 17:07:29.345 |         FROM
2026-08-24 17:07:29.345 |             payment_event_outbox o2       
2026-08-24 17:07:29.345 |         WHERE
2026-08-24 17:07:29.345 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:29.345 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:29.345 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:29.345 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:29.345 |     ORDER BY
2026-08-24 17:07:29.345 |         o1.created_at ASC 
2026-08-24 17:07:29.345 |     LIMIT
2026-08-24 17:07:29.345 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:34.350 | 2026-08-24 09:07:34 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:34.350 |     SELECT
2026-08-24 17:07:34.350 |         o1.* 
2026-08-24 17:07:34.350 |     FROM
2026-08-24 17:07:34.350 |         payment_event_outbox o1 
2026-08-24 17:07:34.350 |     WHERE
2026-08-24 17:07:34.350 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:34.350 |         AND (
2026-08-24 17:07:34.350 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:34.350 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:34.350 |         )   
2026-08-24 17:07:34.350 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:34.350 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:34.350 |             1 
2026-08-24 17:07:34.350 |         FROM
2026-08-24 17:07:34.350 |             payment_event_outbox o2       
2026-08-24 17:07:34.350 |         WHERE
2026-08-24 17:07:34.350 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:34.350 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:34.350 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:34.350 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:34.350 |     ORDER BY
2026-08-24 17:07:34.350 |         o1.created_at ASC 
2026-08-24 17:07:34.350 |     LIMIT
2026-08-24 17:07:34.350 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:34.350 | Hibernate: 
2026-08-24 17:07:34.350 |     SELECT
2026-08-24 17:07:34.350 |         o1.* 
2026-08-24 17:07:34.350 |     FROM
2026-08-24 17:07:34.350 |         payment_event_outbox o1 
2026-08-24 17:07:34.350 |     WHERE
2026-08-24 17:07:34.350 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:34.350 |         AND (
2026-08-24 17:07:34.350 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:34.350 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:34.350 |         )   
2026-08-24 17:07:34.350 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:34.350 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:34.350 |             1 
2026-08-24 17:07:34.350 |         FROM
2026-08-24 17:07:34.350 |             payment_event_outbox o2       
2026-08-24 17:07:34.350 |         WHERE
2026-08-24 17:07:34.350 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:34.350 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:34.350 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:34.350 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:34.350 |     ORDER BY
2026-08-24 17:07:34.350 |         o1.created_at ASC 
2026-08-24 17:07:34.350 |     LIMIT
2026-08-24 17:07:34.350 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:39.059 | 2026-08-24 09:07:39 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:07:39.060 | 2026-08-24 09:07:39 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:07:39.061 | 2026-08-24 09:07:39 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 74278e9a-1721-4a35-a263-2d5082d0d5ba] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:07:39.067 | 2026-08-24 09:07:39 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 74278e9a-1721-4a35-a263-2d5082d0d5ba] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:07:39.355 | 2026-08-24 09:07:39 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:39.355 |     SELECT
2026-08-24 17:07:39.355 |         o1.* 
2026-08-24 17:07:39.355 |     FROM
2026-08-24 17:07:39.355 |         payment_event_outbox o1 
2026-08-24 17:07:39.355 |     WHERE
2026-08-24 17:07:39.355 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:39.355 |         AND (
2026-08-24 17:07:39.355 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:39.355 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:39.355 |         )   
2026-08-24 17:07:39.355 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:39.355 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:39.355 |             1 
2026-08-24 17:07:39.355 |         FROM
2026-08-24 17:07:39.355 |             payment_event_outbox o2       
2026-08-24 17:07:39.355 |         WHERE
2026-08-24 17:07:39.355 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:39.355 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:39.355 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:39.355 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:39.355 |     ORDER BY
2026-08-24 17:07:39.355 |         o1.created_at ASC 
2026-08-24 17:07:39.355 |     LIMIT
2026-08-24 17:07:39.355 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:39.355 | Hibernate: 
2026-08-24 17:07:39.355 |     SELECT
2026-08-24 17:07:39.355 |         o1.* 
2026-08-24 17:07:39.355 |     FROM
2026-08-24 17:07:39.355 |         payment_event_outbox o1 
2026-08-24 17:07:39.355 |     WHERE
2026-08-24 17:07:39.355 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:39.355 |         AND (
2026-08-24 17:07:39.355 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:39.355 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:39.355 |         )   
2026-08-24 17:07:39.355 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:39.355 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:39.355 |             1 
2026-08-24 17:07:39.355 |         FROM
2026-08-24 17:07:39.355 |             payment_event_outbox o2       
2026-08-24 17:07:39.355 |         WHERE
2026-08-24 17:07:39.355 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:39.355 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:39.355 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:39.355 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:39.355 |     ORDER BY
2026-08-24 17:07:39.355 |         o1.created_at ASC 
2026-08-24 17:07:39.355 |     LIMIT
2026-08-24 17:07:39.355 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:44.066 | 2026-08-24 09:07:44 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:44.066 |     SELECT
2026-08-24 17:07:44.066 |         * 
2026-08-24 17:07:44.066 |     FROM
2026-08-24 17:07:44.066 |         payment_event_outbox 
2026-08-24 17:07:44.066 |     WHERE
2026-08-24 17:07:44.066 |         status = 'DELIVERING'   
2026-08-24 17:07:44.066 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:44.066 | Hibernate: 
2026-08-24 17:07:44.066 |     SELECT
2026-08-24 17:07:44.066 |         * 
2026-08-24 17:07:44.066 |     FROM
2026-08-24 17:07:44.066 |         payment_event_outbox 
2026-08-24 17:07:44.066 |     WHERE
2026-08-24 17:07:44.066 |         status = 'DELIVERING'   
2026-08-24 17:07:44.066 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:44.075 | 2026-08-24 09:07:44 [MessageBroker-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:44.075 |     select
2026-08-24 17:07:44.075 |         icl1_0.id,
2026-08-24 17:07:44.075 |         icl1_0.attempt_count,
2026-08-24 17:07:44.075 |         icl1_0.callback_url,
2026-08-24 17:07:44.075 |         icl1_0.created_at,
2026-08-24 17:07:44.075 |         icl1_0.next_retry_at,
2026-08-24 17:07:44.075 |         icl1_0.payload,
2026-08-24 17:07:44.075 |         icl1_0.payment_session_id,
2026-08-24 17:07:44.075 |         icl1_0.response_body,
2026-08-24 17:07:44.075 |         icl1_0.response_code,
2026-08-24 17:07:44.075 |         icl1_0.status,
2026-08-24 17:07:44.075 |         icl1_0.updated_at 
2026-08-24 17:07:44.075 |     from
2026-08-24 17:07:44.075 |         institution_callback_log icl1_0 
2026-08-24 17:07:44.075 |     where
2026-08-24 17:07:44.075 |         icl1_0.status=? 
2026-08-24 17:07:44.075 |         and icl1_0.next_retry_at<?
2026-08-24 17:07:44.075 | Hibernate: 
2026-08-24 17:07:44.075 |     select
2026-08-24 17:07:44.075 |         icl1_0.id,
2026-08-24 17:07:44.075 |         icl1_0.attempt_count,
2026-08-24 17:07:44.075 |         icl1_0.callback_url,
2026-08-24 17:07:44.075 |         icl1_0.created_at,
2026-08-24 17:07:44.075 |         icl1_0.next_retry_at,
2026-08-24 17:07:44.075 |         icl1_0.payload,
2026-08-24 17:07:44.075 |         icl1_0.payment_session_id,
2026-08-24 17:07:44.075 |         icl1_0.response_body,
2026-08-24 17:07:44.075 |         icl1_0.response_code,
2026-08-24 17:07:44.075 |         icl1_0.status,
2026-08-24 17:07:44.075 |         icl1_0.updated_at 
2026-08-24 17:07:44.075 |     from
2026-08-24 17:07:44.075 |         institution_callback_log icl1_0 
2026-08-24 17:07:44.075 |     where
2026-08-24 17:07:44.075 |         icl1_0.status=? 
2026-08-24 17:07:44.075 |         and icl1_0.next_retry_at<?
2026-08-24 17:07:44.356 | 2026-08-24 09:07:44 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:44.356 |     SELECT
2026-08-24 17:07:44.356 |         o1.* 
2026-08-24 17:07:44.356 |     FROM
2026-08-24 17:07:44.356 |         payment_event_outbox o1 
2026-08-24 17:07:44.356 |     WHERE
2026-08-24 17:07:44.356 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:44.356 |         AND (
2026-08-24 17:07:44.356 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:44.356 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:44.356 |         )   
2026-08-24 17:07:44.356 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:44.356 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:44.356 |             1 
2026-08-24 17:07:44.356 |         FROM
2026-08-24 17:07:44.356 |             payment_event_outbox o2       
2026-08-24 17:07:44.356 |         WHERE
2026-08-24 17:07:44.356 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:44.356 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:44.356 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:44.356 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:44.356 |     ORDER BY
2026-08-24 17:07:44.356 |         o1.created_at ASC 
2026-08-24 17:07:44.356 |     LIMIT
2026-08-24 17:07:44.356 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:44.356 | Hibernate: 
2026-08-24 17:07:44.356 |     SELECT
2026-08-24 17:07:44.356 |         o1.* 
2026-08-24 17:07:44.356 |     FROM
2026-08-24 17:07:44.356 |         payment_event_outbox o1 
2026-08-24 17:07:44.356 |     WHERE
2026-08-24 17:07:44.356 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:44.356 |         AND (
2026-08-24 17:07:44.356 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:44.356 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:44.356 |         )   
2026-08-24 17:07:44.356 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:44.356 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:44.356 |             1 
2026-08-24 17:07:44.356 |         FROM
2026-08-24 17:07:44.356 |             payment_event_outbox o2       
2026-08-24 17:07:44.356 |         WHERE
2026-08-24 17:07:44.356 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:44.356 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:44.356 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:44.356 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:44.356 |     ORDER BY
2026-08-24 17:07:44.356 |         o1.created_at ASC 
2026-08-24 17:07:44.356 |     LIMIT
2026-08-24 17:07:44.356 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:49.178 | 2026-08-24 09:07:49 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:07:49.179 | 2026-08-24 09:07:49 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:07:49.179 | 2026-08-24 09:07:49 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 01f560e9-497a-4b38-9cc5-5aaa6b729cdf] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:07:49.185 | 2026-08-24 09:07:49 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 01f560e9-497a-4b38-9cc5-5aaa6b729cdf] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:07:49.362 | 2026-08-24 09:07:49 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:49.362 |     SELECT
2026-08-24 17:07:49.362 |         o1.* 
2026-08-24 17:07:49.362 |     FROM
2026-08-24 17:07:49.362 |         payment_event_outbox o1 
2026-08-24 17:07:49.362 |     WHERE
2026-08-24 17:07:49.362 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:49.362 |         AND (
2026-08-24 17:07:49.362 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:49.362 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:49.362 |         )   
2026-08-24 17:07:49.362 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:49.362 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:49.362 |             1 
2026-08-24 17:07:49.362 |         FROM
2026-08-24 17:07:49.362 |             payment_event_outbox o2       
2026-08-24 17:07:49.362 |         WHERE
2026-08-24 17:07:49.362 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:49.362 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:49.363 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:49.363 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:49.363 |     ORDER BY
2026-08-24 17:07:49.363 |         o1.created_at ASC 
2026-08-24 17:07:49.363 |     LIMIT
2026-08-24 17:07:49.363 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:49.363 | Hibernate: 
2026-08-24 17:07:49.363 |     SELECT
2026-08-24 17:07:49.363 |         o1.* 
2026-08-24 17:07:49.363 |     FROM
2026-08-24 17:07:49.363 |         payment_event_outbox o1 
2026-08-24 17:07:49.363 |     WHERE
2026-08-24 17:07:49.363 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:49.363 |         AND (
2026-08-24 17:07:49.363 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:49.363 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:49.363 |         )   
2026-08-24 17:07:49.363 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:49.363 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:49.363 |             1 
2026-08-24 17:07:49.363 |         FROM
2026-08-24 17:07:49.363 |             payment_event_outbox o2       
2026-08-24 17:07:49.363 |         WHERE
2026-08-24 17:07:49.363 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:49.363 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:49.363 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:49.363 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:49.363 |     ORDER BY
2026-08-24 17:07:49.363 |         o1.created_at ASC 
2026-08-24 17:07:49.363 |     LIMIT
2026-08-24 17:07:49.363 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:54.369 | 2026-08-24 09:07:54 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:54.369 |     SELECT
2026-08-24 17:07:54.369 |         o1.* 
2026-08-24 17:07:54.369 |     FROM
2026-08-24 17:07:54.369 |         payment_event_outbox o1 
2026-08-24 17:07:54.369 |     WHERE
2026-08-24 17:07:54.369 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:54.369 |         AND (
2026-08-24 17:07:54.369 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:54.369 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:54.369 |         )   
2026-08-24 17:07:54.369 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:54.369 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:54.369 |             1 
2026-08-24 17:07:54.369 |         FROM
2026-08-24 17:07:54.369 |             payment_event_outbox o2       
2026-08-24 17:07:54.369 |         WHERE
2026-08-24 17:07:54.369 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:54.369 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:54.369 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:54.369 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:54.369 |     ORDER BY
2026-08-24 17:07:54.369 |         o1.created_at ASC 
2026-08-24 17:07:54.369 |     LIMIT
2026-08-24 17:07:54.369 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:54.369 | Hibernate: 
2026-08-24 17:07:54.369 |     SELECT
2026-08-24 17:07:54.369 |         o1.* 
2026-08-24 17:07:54.369 |     FROM
2026-08-24 17:07:54.369 |         payment_event_outbox o1 
2026-08-24 17:07:54.369 |     WHERE
2026-08-24 17:07:54.369 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:54.369 |         AND (
2026-08-24 17:07:54.369 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:54.369 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:54.369 |         )   
2026-08-24 17:07:54.369 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:54.369 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:54.369 |             1 
2026-08-24 17:07:54.369 |         FROM
2026-08-24 17:07:54.369 |             payment_event_outbox o2       
2026-08-24 17:07:54.369 |         WHERE
2026-08-24 17:07:54.369 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:54.369 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:54.369 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:54.369 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:54.369 |     ORDER BY
2026-08-24 17:07:54.369 |         o1.created_at ASC 
2026-08-24 17:07:54.369 |     LIMIT
2026-08-24 17:07:54.369 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:59.286 | 2026-08-24 09:07:59 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:07:59.287 | 2026-08-24 09:07:59 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:07:59.287 | 2026-08-24 09:07:59 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 5f06ca19-e5e0-48bd-9fac-de6c06853357] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:07:59.293 | 2026-08-24 09:07:59 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 5f06ca19-e5e0-48bd-9fac-de6c06853357] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:07:59.375 | 2026-08-24 09:07:59 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:07:59.375 |     SELECT
2026-08-24 17:07:59.375 |         o1.* 
2026-08-24 17:07:59.375 |     FROM
2026-08-24 17:07:59.375 |         payment_event_outbox o1 
2026-08-24 17:07:59.375 |     WHERE
2026-08-24 17:07:59.375 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:59.375 |         AND (
2026-08-24 17:07:59.375 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:59.375 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:59.375 |         )   
2026-08-24 17:07:59.375 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:59.375 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:59.375 |             1 
2026-08-24 17:07:59.375 |         FROM
2026-08-24 17:07:59.375 |             payment_event_outbox o2       
2026-08-24 17:07:59.375 |         WHERE
2026-08-24 17:07:59.375 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:59.375 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:59.375 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:59.375 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:59.375 |     ORDER BY
2026-08-24 17:07:59.375 |         o1.created_at ASC 
2026-08-24 17:07:59.375 |     LIMIT
2026-08-24 17:07:59.375 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:07:59.375 | Hibernate: 
2026-08-24 17:07:59.375 |     SELECT
2026-08-24 17:07:59.375 |         o1.* 
2026-08-24 17:07:59.375 |     FROM
2026-08-24 17:07:59.375 |         payment_event_outbox o1 
2026-08-24 17:07:59.375 |     WHERE
2026-08-24 17:07:59.375 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:07:59.375 |         AND (
2026-08-24 17:07:59.375 |             o1.next_attempt_at IS NULL 
2026-08-24 17:07:59.375 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:07:59.375 |         )   
2026-08-24 17:07:59.375 |         AND o1.locked_at IS NULL   
2026-08-24 17:07:59.375 |         AND NOT EXISTS (       SELECT
2026-08-24 17:07:59.375 |             1 
2026-08-24 17:07:59.375 |         FROM
2026-08-24 17:07:59.375 |             payment_event_outbox o2       
2026-08-24 17:07:59.375 |         WHERE
2026-08-24 17:07:59.375 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:07:59.375 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:07:59.375 |             AND o2.sequence < o1.sequence         
2026-08-24 17:07:59.375 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:07:59.375 |     ORDER BY
2026-08-24 17:07:59.375 |         o1.created_at ASC 
2026-08-24 17:07:59.375 |     LIMIT
2026-08-24 17:07:59.375 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:04.380 | 2026-08-24 09:08:04 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:04.380 |     SELECT
2026-08-24 17:08:04.380 |         o1.* 
2026-08-24 17:08:04.380 |     FROM
2026-08-24 17:08:04.380 |         payment_event_outbox o1 
2026-08-24 17:08:04.380 |     WHERE
2026-08-24 17:08:04.380 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:04.380 |         AND (
2026-08-24 17:08:04.380 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:04.380 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:04.380 |         )   
2026-08-24 17:08:04.380 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:04.380 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:04.380 |             1 
2026-08-24 17:08:04.380 |         FROM
2026-08-24 17:08:04.380 |             payment_event_outbox o2       
2026-08-24 17:08:04.380 |         WHERE
2026-08-24 17:08:04.380 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:04.380 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:04.380 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:04.380 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:04.380 |     ORDER BY
2026-08-24 17:08:04.380 |         o1.created_at ASC 
2026-08-24 17:08:04.380 |     LIMIT
2026-08-24 17:08:04.380 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:04.380 | Hibernate: 
2026-08-24 17:08:04.380 |     SELECT
2026-08-24 17:08:04.380 |         o1.* 
2026-08-24 17:08:04.380 |     FROM
2026-08-24 17:08:04.380 |         payment_event_outbox o1 
2026-08-24 17:08:04.380 |     WHERE
2026-08-24 17:08:04.380 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:04.380 |         AND (
2026-08-24 17:08:04.380 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:04.380 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:04.380 |         )   
2026-08-24 17:08:04.380 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:04.380 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:04.380 |             1 
2026-08-24 17:08:04.380 |         FROM
2026-08-24 17:08:04.380 |             payment_event_outbox o2       
2026-08-24 17:08:04.380 |         WHERE
2026-08-24 17:08:04.381 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:04.381 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:04.381 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:04.381 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:04.381 |     ORDER BY
2026-08-24 17:08:04.381 |         o1.created_at ASC 
2026-08-24 17:08:04.381 |     LIMIT
2026-08-24 17:08:04.381 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:09.387 | 2026-08-24 09:08:09 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:09.387 |     SELECT
2026-08-24 17:08:09.387 |         o1.* 
2026-08-24 17:08:09.387 |     FROM
2026-08-24 17:08:09.387 |         payment_event_outbox o1 
2026-08-24 17:08:09.387 |     WHERE
2026-08-24 17:08:09.387 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:09.387 |         AND (
2026-08-24 17:08:09.387 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:09.387 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:09.387 |         )   
2026-08-24 17:08:09.387 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:09.387 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:09.387 |             1 
2026-08-24 17:08:09.387 |         FROM
2026-08-24 17:08:09.387 |             payment_event_outbox o2       
2026-08-24 17:08:09.387 |         WHERE
2026-08-24 17:08:09.387 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:09.387 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:09.387 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:09.387 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:09.387 |     ORDER BY
2026-08-24 17:08:09.387 |         o1.created_at ASC 
2026-08-24 17:08:09.387 |     LIMIT
2026-08-24 17:08:09.387 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:09.387 | Hibernate: 
2026-08-24 17:08:09.387 |     SELECT
2026-08-24 17:08:09.387 |         o1.* 
2026-08-24 17:08:09.387 |     FROM
2026-08-24 17:08:09.387 |         payment_event_outbox o1 
2026-08-24 17:08:09.387 |     WHERE
2026-08-24 17:08:09.387 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:09.387 |         AND (
2026-08-24 17:08:09.387 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:09.387 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:09.387 |         )   
2026-08-24 17:08:09.387 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:09.387 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:09.387 |             1 
2026-08-24 17:08:09.387 |         FROM
2026-08-24 17:08:09.387 |             payment_event_outbox o2       
2026-08-24 17:08:09.387 |         WHERE
2026-08-24 17:08:09.387 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:09.387 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:09.387 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:09.387 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:09.387 |     ORDER BY
2026-08-24 17:08:09.387 |         o1.created_at ASC 
2026-08-24 17:08:09.388 |     LIMIT
2026-08-24 17:08:09.388 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:09.409 | 2026-08-24 09:08:09 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:08:09.410 | 2026-08-24 09:08:09 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:08:09.411 | 2026-08-24 09:08:09 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b96dd750-f1e4-455f-8044-6275b6627df1] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:08:09.416 | 2026-08-24 09:08:09 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b96dd750-f1e4-455f-8044-6275b6627df1] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:08:14.392 | 2026-08-24 09:08:14 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:14.392 |     SELECT
2026-08-24 17:08:14.392 |         o1.* 
2026-08-24 17:08:14.392 |     FROM
2026-08-24 17:08:14.392 |         payment_event_outbox o1 
2026-08-24 17:08:14.392 |     WHERE
2026-08-24 17:08:14.392 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:14.392 |         AND (
2026-08-24 17:08:14.392 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:14.392 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:14.392 |         )   
2026-08-24 17:08:14.392 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:14.392 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:14.392 |             1 
2026-08-24 17:08:14.392 |         FROM
2026-08-24 17:08:14.392 |             payment_event_outbox o2       
2026-08-24 17:08:14.392 |         WHERE
2026-08-24 17:08:14.392 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:14.392 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:14.392 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:14.392 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:14.392 |     ORDER BY
2026-08-24 17:08:14.392 |         o1.created_at ASC 
2026-08-24 17:08:14.392 |     LIMIT
2026-08-24 17:08:14.392 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:14.392 | Hibernate: 
2026-08-24 17:08:14.392 |     SELECT
2026-08-24 17:08:14.392 |         o1.* 
2026-08-24 17:08:14.392 |     FROM
2026-08-24 17:08:14.392 |         payment_event_outbox o1 
2026-08-24 17:08:14.392 |     WHERE
2026-08-24 17:08:14.392 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:14.392 |         AND (
2026-08-24 17:08:14.392 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:14.392 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:14.392 |         )   
2026-08-24 17:08:14.392 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:14.392 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:14.392 |             1 
2026-08-24 17:08:14.392 |         FROM
2026-08-24 17:08:14.392 |             payment_event_outbox o2       
2026-08-24 17:08:14.392 |         WHERE
2026-08-24 17:08:14.392 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:14.392 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:14.392 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:14.392 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:14.392 |     ORDER BY
2026-08-24 17:08:14.392 |         o1.created_at ASC 
2026-08-24 17:08:14.392 |     LIMIT
2026-08-24 17:08:14.392 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:19.398 | 2026-08-24 09:08:19 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:19.398 |     SELECT
2026-08-24 17:08:19.398 |         o1.* 
2026-08-24 17:08:19.398 |     FROM
2026-08-24 17:08:19.398 |         payment_event_outbox o1 
2026-08-24 17:08:19.398 |     WHERE
2026-08-24 17:08:19.398 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:19.398 |         AND (
2026-08-24 17:08:19.398 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:19.398 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:19.398 |         )   
2026-08-24 17:08:19.398 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:19.398 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:19.398 |             1 
2026-08-24 17:08:19.398 |         FROM
2026-08-24 17:08:19.398 |             payment_event_outbox o2       
2026-08-24 17:08:19.398 |         WHERE
2026-08-24 17:08:19.398 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:19.398 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:19.398 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:19.398 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:19.398 |     ORDER BY
2026-08-24 17:08:19.398 |         o1.created_at ASC 
2026-08-24 17:08:19.398 |     LIMIT
2026-08-24 17:08:19.398 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:19.398 | Hibernate: 
2026-08-24 17:08:19.398 |     SELECT
2026-08-24 17:08:19.398 |         o1.* 
2026-08-24 17:08:19.398 |     FROM
2026-08-24 17:08:19.398 |         payment_event_outbox o1 
2026-08-24 17:08:19.398 |     WHERE
2026-08-24 17:08:19.398 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:19.398 |         AND (
2026-08-24 17:08:19.398 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:19.398 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:19.398 |         )   
2026-08-24 17:08:19.398 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:19.398 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:19.398 |             1 
2026-08-24 17:08:19.398 |         FROM
2026-08-24 17:08:19.398 |             payment_event_outbox o2       
2026-08-24 17:08:19.398 |         WHERE
2026-08-24 17:08:19.398 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:19.398 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:19.398 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:19.398 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:19.398 |     ORDER BY
2026-08-24 17:08:19.398 |         o1.created_at ASC 
2026-08-24 17:08:19.398 |     LIMIT
2026-08-24 17:08:19.398 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:19.515 | 2026-08-24 09:08:19 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:08:19.516 | 2026-08-24 09:08:19 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:08:19.516 | 2026-08-24 09:08:19 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: e39c48cd-3ee9-431b-82d7-b4b20364d2d8] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:08:19.522 | 2026-08-24 09:08:19 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: e39c48cd-3ee9-431b-82d7-b4b20364d2d8] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:08:22.778 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:08:22.785 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 41aec3a1-65f9-4098-ab03-1d49683a7f5a] - 
2026-08-24 17:08:22.785 |     select
2026-08-24 17:08:22.785 |         c1_0.id,
2026-08-24 17:08:22.785 |         c1_0.created_at,
2026-08-24 17:08:22.785 |         c1_0.email,
2026-08-24 17:08:22.785 |         c1_0.employment_status,
2026-08-24 17:08:22.785 |         c1_0.first_name,
2026-08-24 17:08:22.785 |         c1_0.job_title,
2026-08-24 17:08:22.785 |         c1_0.kyc_status,
2026-08-24 17:08:22.785 |         c1_0.last_name,
2026-08-24 17:08:22.785 |         c1_0.locked,
2026-08-24 17:08:22.785 |         c1_0.monthly_income,
2026-08-24 17:08:22.785 |         c1_0.password,
2026-08-24 17:08:22.785 |         c1_0.risk_profile,
2026-08-24 17:08:22.785 |         c1_0.role,
2026-08-24 17:08:22.785 |         c1_0.source_of_funds 
2026-08-24 17:08:22.785 |     from
2026-08-24 17:08:22.785 |         customers c1_0 
2026-08-24 17:08:22.785 |     where
2026-08-24 17:08:22.785 |         upper(c1_0.email)=upper(?)
2026-08-24 17:08:22.785 | Hibernate: 
2026-08-24 17:08:22.785 |     select
2026-08-24 17:08:22.785 |         c1_0.id,
2026-08-24 17:08:22.785 |         c1_0.created_at,
2026-08-24 17:08:22.785 |         c1_0.email,
2026-08-24 17:08:22.785 |         c1_0.employment_status,
2026-08-24 17:08:22.785 |         c1_0.first_name,
2026-08-24 17:08:22.785 |         c1_0.job_title,
2026-08-24 17:08:22.785 |         c1_0.kyc_status,
2026-08-24 17:08:22.785 |         c1_0.last_name,
2026-08-24 17:08:22.785 |         c1_0.locked,
2026-08-24 17:08:22.785 |         c1_0.monthly_income,
2026-08-24 17:08:22.785 |         c1_0.password,
2026-08-24 17:08:22.785 |         c1_0.risk_profile,
2026-08-24 17:08:22.785 |         c1_0.role,
2026-08-24 17:08:22.785 |         c1_0.source_of_funds 
2026-08-24 17:08:22.785 |     from
2026-08-24 17:08:22.785 |         customers c1_0 
2026-08-24 17:08:22.785 |     where
2026-08-24 17:08:22.785 |         upper(c1_0.email)=upper(?)
2026-08-24 17:08:22.796 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 41aec3a1-65f9-4098-ab03-1d49683a7f5a] - Secured GET /api/v1/accounts
2026-08-24 17:08:22.801 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 41aec3a1-65f9-4098-ab03-1d49683a7f5a] - 
2026-08-24 17:08:22.801 |     select
2026-08-24 17:08:22.801 |         c1_0.id,
2026-08-24 17:08:22.801 |         c1_0.created_at,
2026-08-24 17:08:22.801 |         c1_0.email,
2026-08-24 17:08:22.801 |         c1_0.employment_status,
2026-08-24 17:08:22.801 |         c1_0.first_name,
2026-08-24 17:08:22.801 |         c1_0.job_title,
2026-08-24 17:08:22.801 |         c1_0.kyc_status,
2026-08-24 17:08:22.801 |         c1_0.last_name,
2026-08-24 17:08:22.801 |         c1_0.locked,
2026-08-24 17:08:22.801 |         c1_0.monthly_income,
2026-08-24 17:08:22.801 |         c1_0.password,
2026-08-24 17:08:22.801 |         c1_0.risk_profile,
2026-08-24 17:08:22.801 |         c1_0.role,
2026-08-24 17:08:22.801 |         c1_0.source_of_funds 
2026-08-24 17:08:22.801 |     from
2026-08-24 17:08:22.801 |         customers c1_0 
2026-08-24 17:08:22.801 |     where
2026-08-24 17:08:22.801 |         upper(c1_0.email)=upper(?)
2026-08-24 17:08:22.801 | Hibernate: 
2026-08-24 17:08:22.801 |     select
2026-08-24 17:08:22.801 |         c1_0.id,
2026-08-24 17:08:22.801 |         c1_0.created_at,
2026-08-24 17:08:22.801 |         c1_0.email,
2026-08-24 17:08:22.801 |         c1_0.employment_status,
2026-08-24 17:08:22.801 |         c1_0.first_name,
2026-08-24 17:08:22.801 |         c1_0.job_title,
2026-08-24 17:08:22.801 |         c1_0.kyc_status,
2026-08-24 17:08:22.801 |         c1_0.last_name,
2026-08-24 17:08:22.801 |         c1_0.locked,
2026-08-24 17:08:22.801 |         c1_0.monthly_income,
2026-08-24 17:08:22.801 |         c1_0.password,
2026-08-24 17:08:22.801 |         c1_0.risk_profile,
2026-08-24 17:08:22.801 |         c1_0.role,
2026-08-24 17:08:22.801 |         c1_0.source_of_funds 
2026-08-24 17:08:22.801 |     from
2026-08-24 17:08:22.801 |         customers c1_0 
2026-08-24 17:08:22.801 |     where
2026-08-24 17:08:22.801 |         upper(c1_0.email)=upper(?)
2026-08-24 17:08:22.807 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 41aec3a1-65f9-4098-ab03-1d49683a7f5a] - 
2026-08-24 17:08:22.807 |     select
2026-08-24 17:08:22.807 |         a1_0.id,
2026-08-24 17:08:22.807 |         a1_0.account_name,
2026-08-24 17:08:22.807 |         a1_0.account_number,
2026-08-24 17:08:22.807 |         a1_0.account_type,
2026-08-24 17:08:22.807 |         a1_0.allow_incoming,
2026-08-24 17:08:22.807 |         a1_0.allow_outgoing,
2026-08-24 17:08:22.807 |         a1_0.balance,
2026-08-24 17:08:22.807 |         a1_0.card_cvv,
2026-08-24 17:08:22.807 |         a1_0.card_expiry,
2026-08-24 17:08:22.807 |         a1_0.created_at,
2026-08-24 17:08:22.807 |         a1_0.currency,
2026-08-24 17:08:22.807 |         a1_0.customer_id,
2026-08-24 17:08:22.807 |         a1_0.daily_limit,
2026-08-24 17:08:22.807 |         a1_0.frozen,
2026-08-24 17:08:22.807 |         a1_0.monthly_limit,
2026-08-24 17:08:22.807 |         a1_0.parent_account_id,
2026-08-24 17:08:22.807 |         a1_0.require_dual_approval,
2026-08-24 17:08:22.807 |         a1_0.status,
2026-08-24 17:08:22.807 |         a1_0.swift_code,
2026-08-24 17:08:22.807 |         a1_0.updated_at,
2026-08-24 17:08:22.807 |         a1_0.version 
2026-08-24 17:08:22.807 |     from
2026-08-24 17:08:22.807 |         accounts a1_0 
2026-08-24 17:08:22.807 |     where
2026-08-24 17:08:22.807 |         a1_0.customer_id=?
2026-08-24 17:08:22.807 | Hibernate: 
2026-08-24 17:08:22.807 |     select
2026-08-24 17:08:22.807 |         a1_0.id,
2026-08-24 17:08:22.807 |         a1_0.account_name,
2026-08-24 17:08:22.807 |         a1_0.account_number,
2026-08-24 17:08:22.807 |         a1_0.account_type,
2026-08-24 17:08:22.807 |         a1_0.allow_incoming,
2026-08-24 17:08:22.807 |         a1_0.allow_outgoing,
2026-08-24 17:08:22.807 |         a1_0.balance,
2026-08-24 17:08:22.807 |         a1_0.card_cvv,
2026-08-24 17:08:22.807 |         a1_0.card_expiry,
2026-08-24 17:08:22.807 |         a1_0.created_at,
2026-08-24 17:08:22.807 |         a1_0.currency,
2026-08-24 17:08:22.807 |         a1_0.customer_id,
2026-08-24 17:08:22.807 |         a1_0.daily_limit,
2026-08-24 17:08:22.807 |         a1_0.frozen,
2026-08-24 17:08:22.807 |         a1_0.monthly_limit,
2026-08-24 17:08:22.807 |         a1_0.parent_account_id,
2026-08-24 17:08:22.807 |         a1_0.require_dual_approval,
2026-08-24 17:08:22.807 |         a1_0.status,
2026-08-24 17:08:22.807 |         a1_0.swift_code,
2026-08-24 17:08:22.807 |         a1_0.updated_at,
2026-08-24 17:08:22.807 |         a1_0.version 
2026-08-24 17:08:22.807 |     from
2026-08-24 17:08:22.807 |         accounts a1_0 
2026-08-24 17:08:22.807 |     where
2026-08-24 17:08:22.807 |         a1_0.customer_id=?
2026-08-24 17:08:22.816 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 41aec3a1-65f9-4098-ab03-1d49683a7f5a] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 19ms
2026-08-24 17:08:22.822 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:22.822 |     insert 
2026-08-24 17:08:22.822 |     into
2026-08-24 17:08:22.822 |         api_audit_events
2026-08-24 17:08:22.822 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:08:22.822 |     values
2026-08-24 17:08:22.822 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:08:22.822 | Hibernate: 
2026-08-24 17:08:22.822 |     insert 
2026-08-24 17:08:22.822 |     into
2026-08-24 17:08:22.822 |         api_audit_events
2026-08-24 17:08:22.822 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:08:22.822 |     values
2026-08-24 17:08:22.822 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:08:22.833 | 2026-08-24 09:08:22 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=42ms
2026-08-24 17:08:24.404 | 2026-08-24 09:08:24 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:24.404 |     SELECT
2026-08-24 17:08:24.404 |         o1.* 
2026-08-24 17:08:24.404 |     FROM
2026-08-24 17:08:24.404 |         payment_event_outbox o1 
2026-08-24 17:08:24.404 |     WHERE
2026-08-24 17:08:24.404 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:24.404 |         AND (
2026-08-24 17:08:24.404 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:24.404 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:24.404 |         )   
2026-08-24 17:08:24.404 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:24.404 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:24.404 |             1 
2026-08-24 17:08:24.404 |         FROM
2026-08-24 17:08:24.404 |             payment_event_outbox o2       
2026-08-24 17:08:24.404 |         WHERE
2026-08-24 17:08:24.404 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:24.404 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:24.404 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:24.404 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:24.404 |     ORDER BY
2026-08-24 17:08:24.404 |         o1.created_at ASC 
2026-08-24 17:08:24.404 |     LIMIT
2026-08-24 17:08:24.404 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:24.405 | Hibernate: 
2026-08-24 17:08:24.405 |     SELECT
2026-08-24 17:08:24.405 |         o1.* 
2026-08-24 17:08:24.405 |     FROM
2026-08-24 17:08:24.405 |         payment_event_outbox o1 
2026-08-24 17:08:24.405 |     WHERE
2026-08-24 17:08:24.405 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:24.405 |         AND (
2026-08-24 17:08:24.405 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:24.405 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:24.405 |         )   
2026-08-24 17:08:24.405 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:24.405 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:24.405 |             1 
2026-08-24 17:08:24.406 |         FROM
2026-08-24 17:08:24.406 |             payment_event_outbox o2       
2026-08-24 17:08:24.406 |         WHERE
2026-08-24 17:08:24.406 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:24.406 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:24.406 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:24.406 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:24.406 |     ORDER BY
2026-08-24 17:08:24.406 |         o1.created_at ASC 
2026-08-24 17:08:24.406 |     LIMIT
2026-08-24 17:08:24.407 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:29.410 | 2026-08-24 09:08:29 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:29.410 |     SELECT
2026-08-24 17:08:29.410 |         o1.* 
2026-08-24 17:08:29.410 |     FROM
2026-08-24 17:08:29.410 |         payment_event_outbox o1 
2026-08-24 17:08:29.410 |     WHERE
2026-08-24 17:08:29.410 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:29.410 |         AND (
2026-08-24 17:08:29.410 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:29.410 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:29.410 |         )   
2026-08-24 17:08:29.410 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:29.410 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:29.410 |             1 
2026-08-24 17:08:29.410 |         FROM
2026-08-24 17:08:29.410 |             payment_event_outbox o2       
2026-08-24 17:08:29.410 |         WHERE
2026-08-24 17:08:29.410 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:29.410 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:29.410 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:29.410 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:29.410 |     ORDER BY
2026-08-24 17:08:29.410 |         o1.created_at ASC 
2026-08-24 17:08:29.410 |     LIMIT
2026-08-24 17:08:29.410 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:29.410 | Hibernate: 
2026-08-24 17:08:29.410 |     SELECT
2026-08-24 17:08:29.410 |         o1.* 
2026-08-24 17:08:29.410 |     FROM
2026-08-24 17:08:29.411 |         payment_event_outbox o1 
2026-08-24 17:08:29.411 |     WHERE
2026-08-24 17:08:29.411 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:29.411 |         AND (
2026-08-24 17:08:29.411 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:29.411 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:29.411 |         )   
2026-08-24 17:08:29.411 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:29.411 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:29.411 |             1 
2026-08-24 17:08:29.411 |         FROM
2026-08-24 17:08:29.411 |             payment_event_outbox o2       
2026-08-24 17:08:29.411 |         WHERE
2026-08-24 17:08:29.411 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:29.411 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:29.411 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:29.411 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:29.411 |     ORDER BY
2026-08-24 17:08:29.411 |         o1.created_at ASC 
2026-08-24 17:08:29.411 |     LIMIT
2026-08-24 17:08:29.411 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:29.610 | 2026-08-24 09:08:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:08:29.611 | 2026-08-24 09:08:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:08:29.611 | 2026-08-24 09:08:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 212075a6-5622-401e-ab8f-6200d71ec28b] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:08:29.617 | 2026-08-24 09:08:29 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 212075a6-5622-401e-ab8f-6200d71ec28b] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:08:34.416 | 2026-08-24 09:08:34 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:34.416 |     SELECT
2026-08-24 17:08:34.416 |         o1.* 
2026-08-24 17:08:34.416 |     FROM
2026-08-24 17:08:34.416 |         payment_event_outbox o1 
2026-08-24 17:08:34.416 |     WHERE
2026-08-24 17:08:34.416 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:34.416 |         AND (
2026-08-24 17:08:34.416 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:34.416 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:34.416 |         )   
2026-08-24 17:08:34.416 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:34.416 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:34.416 |             1 
2026-08-24 17:08:34.416 |         FROM
2026-08-24 17:08:34.416 |             payment_event_outbox o2       
2026-08-24 17:08:34.416 |         WHERE
2026-08-24 17:08:34.416 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:34.416 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:34.416 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:34.416 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:34.416 |     ORDER BY
2026-08-24 17:08:34.416 |         o1.created_at ASC 
2026-08-24 17:08:34.416 |     LIMIT
2026-08-24 17:08:34.416 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:34.416 | Hibernate: 
2026-08-24 17:08:34.416 |     SELECT
2026-08-24 17:08:34.416 |         o1.* 
2026-08-24 17:08:34.416 |     FROM
2026-08-24 17:08:34.416 |         payment_event_outbox o1 
2026-08-24 17:08:34.416 |     WHERE
2026-08-24 17:08:34.416 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:34.416 |         AND (
2026-08-24 17:08:34.416 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:34.416 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:34.416 |         )   
2026-08-24 17:08:34.416 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:34.416 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:34.416 |             1 
2026-08-24 17:08:34.416 |         FROM
2026-08-24 17:08:34.416 |             payment_event_outbox o2       
2026-08-24 17:08:34.416 |         WHERE
2026-08-24 17:08:34.416 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:34.416 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:34.416 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:34.416 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:34.416 |     ORDER BY
2026-08-24 17:08:34.416 |         o1.created_at ASC 
2026-08-24 17:08:34.416 |     LIMIT
2026-08-24 17:08:34.417 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:39.422 | 2026-08-24 09:08:39 [MessageBroker-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:39.422 |     SELECT
2026-08-24 17:08:39.422 |         o1.* 
2026-08-24 17:08:39.422 |     FROM
2026-08-24 17:08:39.422 |         payment_event_outbox o1 
2026-08-24 17:08:39.422 |     WHERE
2026-08-24 17:08:39.422 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:39.422 |         AND (
2026-08-24 17:08:39.422 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:39.422 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:39.422 |         )   
2026-08-24 17:08:39.422 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:39.422 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:39.422 |             1 
2026-08-24 17:08:39.422 |         FROM
2026-08-24 17:08:39.422 |             payment_event_outbox o2       
2026-08-24 17:08:39.422 |         WHERE
2026-08-24 17:08:39.422 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:39.422 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:39.422 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:39.422 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:39.422 |     ORDER BY
2026-08-24 17:08:39.422 |         o1.created_at ASC 
2026-08-24 17:08:39.422 |     LIMIT
2026-08-24 17:08:39.422 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:39.422 | Hibernate: 
2026-08-24 17:08:39.422 |     SELECT
2026-08-24 17:08:39.422 |         o1.* 
2026-08-24 17:08:39.422 |     FROM
2026-08-24 17:08:39.422 |         payment_event_outbox o1 
2026-08-24 17:08:39.422 |     WHERE
2026-08-24 17:08:39.422 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:39.422 |         AND (
2026-08-24 17:08:39.422 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:39.422 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:39.422 |         )   
2026-08-24 17:08:39.422 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:39.422 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:39.422 |             1 
2026-08-24 17:08:39.422 |         FROM
2026-08-24 17:08:39.422 |             payment_event_outbox o2       
2026-08-24 17:08:39.422 |         WHERE
2026-08-24 17:08:39.422 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:39.422 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:39.422 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:39.422 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:39.422 |     ORDER BY
2026-08-24 17:08:39.422 |         o1.created_at ASC 
2026-08-24 17:08:39.422 |     LIMIT
2026-08-24 17:08:39.422 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:39.743 | 2026-08-24 09:08:39 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:08:39.744 | 2026-08-24 09:08:39 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:08:39.744 | 2026-08-24 09:08:39 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 5e9f342b-7e3a-4f15-bc0d-9c648b788b6f] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:08:39.750 | 2026-08-24 09:08:39 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 5e9f342b-7e3a-4f15-bc0d-9c648b788b6f] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:08:44.066 | 2026-08-24 09:08:44 [MessageBroker-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:44.067 |     SELECT
2026-08-24 17:08:44.067 |         * 
2026-08-24 17:08:44.067 |     FROM
2026-08-24 17:08:44.067 |         payment_event_outbox 
2026-08-24 17:08:44.067 |     WHERE
2026-08-24 17:08:44.067 |         status = 'DELIVERING'   
2026-08-24 17:08:44.067 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:44.067 | Hibernate: 
2026-08-24 17:08:44.067 |     SELECT
2026-08-24 17:08:44.067 |         * 
2026-08-24 17:08:44.067 |     FROM
2026-08-24 17:08:44.067 |         payment_event_outbox 
2026-08-24 17:08:44.067 |     WHERE
2026-08-24 17:08:44.067 |         status = 'DELIVERING'   
2026-08-24 17:08:44.067 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:44.077 | 2026-08-24 09:08:44 [MessageBroker-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:44.077 |     select
2026-08-24 17:08:44.077 |         icl1_0.id,
2026-08-24 17:08:44.077 |         icl1_0.attempt_count,
2026-08-24 17:08:44.077 |         icl1_0.callback_url,
2026-08-24 17:08:44.077 |         icl1_0.created_at,
2026-08-24 17:08:44.077 |         icl1_0.next_retry_at,
2026-08-24 17:08:44.077 |         icl1_0.payload,
2026-08-24 17:08:44.077 |         icl1_0.payment_session_id,
2026-08-24 17:08:44.077 |         icl1_0.response_body,
2026-08-24 17:08:44.077 |         icl1_0.response_code,
2026-08-24 17:08:44.077 |         icl1_0.status,
2026-08-24 17:08:44.077 |         icl1_0.updated_at 
2026-08-24 17:08:44.077 |     from
2026-08-24 17:08:44.077 |         institution_callback_log icl1_0 
2026-08-24 17:08:44.077 |     where
2026-08-24 17:08:44.078 |         icl1_0.status=? 
2026-08-24 17:08:44.078 |         and icl1_0.next_retry_at<?
2026-08-24 17:08:44.078 | Hibernate: 
2026-08-24 17:08:44.078 |     select
2026-08-24 17:08:44.078 |         icl1_0.id,
2026-08-24 17:08:44.078 |         icl1_0.attempt_count,
2026-08-24 17:08:44.078 |         icl1_0.callback_url,
2026-08-24 17:08:44.078 |         icl1_0.created_at,
2026-08-24 17:08:44.078 |         icl1_0.next_retry_at,
2026-08-24 17:08:44.078 |         icl1_0.payload,
2026-08-24 17:08:44.078 |         icl1_0.payment_session_id,
2026-08-24 17:08:44.078 |         icl1_0.response_body,
2026-08-24 17:08:44.078 |         icl1_0.response_code,
2026-08-24 17:08:44.078 |         icl1_0.status,
2026-08-24 17:08:44.078 |         icl1_0.updated_at 
2026-08-24 17:08:44.078 |     from
2026-08-24 17:08:44.078 |         institution_callback_log icl1_0 
2026-08-24 17:08:44.078 |     where
2026-08-24 17:08:44.078 |         icl1_0.status=? 
2026-08-24 17:08:44.078 |         and icl1_0.next_retry_at<?
2026-08-24 17:08:44.424 | 2026-08-24 09:08:44 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:44.424 |     SELECT
2026-08-24 17:08:44.424 |         o1.* 
2026-08-24 17:08:44.424 |     FROM
2026-08-24 17:08:44.424 |         payment_event_outbox o1 
2026-08-24 17:08:44.424 |     WHERE
2026-08-24 17:08:44.424 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:44.424 |         AND (
2026-08-24 17:08:44.424 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:44.424 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:44.424 |         )   
2026-08-24 17:08:44.424 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:44.424 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:44.424 |             1 
2026-08-24 17:08:44.424 |         FROM
2026-08-24 17:08:44.424 |             payment_event_outbox o2       
2026-08-24 17:08:44.424 |         WHERE
2026-08-24 17:08:44.424 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:44.424 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:44.424 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:44.424 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:44.424 |     ORDER BY
2026-08-24 17:08:44.424 |         o1.created_at ASC 
2026-08-24 17:08:44.424 |     LIMIT
2026-08-24 17:08:44.424 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:44.424 | Hibernate: 
2026-08-24 17:08:44.424 |     SELECT
2026-08-24 17:08:44.424 |         o1.* 
2026-08-24 17:08:44.424 |     FROM
2026-08-24 17:08:44.424 |         payment_event_outbox o1 
2026-08-24 17:08:44.424 |     WHERE
2026-08-24 17:08:44.424 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:44.424 |         AND (
2026-08-24 17:08:44.424 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:44.424 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:44.424 |         )   
2026-08-24 17:08:44.424 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:44.424 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:44.424 |             1 
2026-08-24 17:08:44.424 |         FROM
2026-08-24 17:08:44.424 |             payment_event_outbox o2       
2026-08-24 17:08:44.424 |         WHERE
2026-08-24 17:08:44.424 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:44.424 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:44.424 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:44.424 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:44.424 |     ORDER BY
2026-08-24 17:08:44.424 |         o1.created_at ASC 
2026-08-24 17:08:44.424 |     LIMIT
2026-08-24 17:08:44.424 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:49.429 | 2026-08-24 09:08:49 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:49.429 |     SELECT
2026-08-24 17:08:49.429 |         o1.* 
2026-08-24 17:08:49.429 |     FROM
2026-08-24 17:08:49.429 |         payment_event_outbox o1 
2026-08-24 17:08:49.429 |     WHERE
2026-08-24 17:08:49.429 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:49.429 |         AND (
2026-08-24 17:08:49.429 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:49.429 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:49.429 |         )   
2026-08-24 17:08:49.429 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:49.429 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:49.429 |             1 
2026-08-24 17:08:49.429 |         FROM
2026-08-24 17:08:49.429 |             payment_event_outbox o2       
2026-08-24 17:08:49.429 |         WHERE
2026-08-24 17:08:49.429 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:49.429 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:49.429 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:49.429 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:49.429 |     ORDER BY
2026-08-24 17:08:49.429 |         o1.created_at ASC 
2026-08-24 17:08:49.429 |     LIMIT
2026-08-24 17:08:49.429 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:49.429 | Hibernate: 
2026-08-24 17:08:49.429 |     SELECT
2026-08-24 17:08:49.429 |         o1.* 
2026-08-24 17:08:49.429 |     FROM
2026-08-24 17:08:49.429 |         payment_event_outbox o1 
2026-08-24 17:08:49.429 |     WHERE
2026-08-24 17:08:49.429 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:49.429 |         AND (
2026-08-24 17:08:49.429 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:49.429 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:49.429 |         )   
2026-08-24 17:08:49.429 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:49.429 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:49.429 |             1 
2026-08-24 17:08:49.429 |         FROM
2026-08-24 17:08:49.429 |             payment_event_outbox o2       
2026-08-24 17:08:49.429 |         WHERE
2026-08-24 17:08:49.429 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:49.429 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:49.429 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:49.429 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:49.429 |     ORDER BY
2026-08-24 17:08:49.429 |         o1.created_at ASC 
2026-08-24 17:08:49.429 |     LIMIT
2026-08-24 17:08:49.429 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:49.846 | 2026-08-24 09:08:49 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:08:49.848 | 2026-08-24 09:08:49 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:08:49.848 | 2026-08-24 09:08:49 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: aada6aa8-ec65-4625-a27c-e725946c1570] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:08:49.854 | 2026-08-24 09:08:49 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: aada6aa8-ec65-4625-a27c-e725946c1570] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:08:54.434 | 2026-08-24 09:08:54 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:54.434 |     SELECT
2026-08-24 17:08:54.434 |         o1.* 
2026-08-24 17:08:54.434 |     FROM
2026-08-24 17:08:54.434 |         payment_event_outbox o1 
2026-08-24 17:08:54.434 |     WHERE
2026-08-24 17:08:54.434 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:54.434 |         AND (
2026-08-24 17:08:54.434 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:54.434 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:54.434 |         )   
2026-08-24 17:08:54.434 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:54.434 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:54.434 |             1 
2026-08-24 17:08:54.434 |         FROM
2026-08-24 17:08:54.434 |             payment_event_outbox o2       
2026-08-24 17:08:54.434 |         WHERE
2026-08-24 17:08:54.434 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:54.434 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:54.434 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:54.434 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:54.434 |     ORDER BY
2026-08-24 17:08:54.434 |         o1.created_at ASC 
2026-08-24 17:08:54.434 |     LIMIT
2026-08-24 17:08:54.434 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:54.434 | Hibernate: 
2026-08-24 17:08:54.434 |     SELECT
2026-08-24 17:08:54.434 |         o1.* 
2026-08-24 17:08:54.434 |     FROM
2026-08-24 17:08:54.434 |         payment_event_outbox o1 
2026-08-24 17:08:54.434 |     WHERE
2026-08-24 17:08:54.434 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:54.434 |         AND (
2026-08-24 17:08:54.434 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:54.434 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:54.434 |         )   
2026-08-24 17:08:54.434 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:54.434 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:54.434 |             1 
2026-08-24 17:08:54.434 |         FROM
2026-08-24 17:08:54.434 |             payment_event_outbox o2       
2026-08-24 17:08:54.434 |         WHERE
2026-08-24 17:08:54.434 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:54.434 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:54.434 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:54.434 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:54.434 |     ORDER BY
2026-08-24 17:08:54.434 |         o1.created_at ASC 
2026-08-24 17:08:54.434 |     LIMIT
2026-08-24 17:08:54.434 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:59.440 | 2026-08-24 09:08:59 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:08:59.441 |     SELECT
2026-08-24 17:08:59.441 |         o1.* 
2026-08-24 17:08:59.441 |     FROM
2026-08-24 17:08:59.441 |         payment_event_outbox o1 
2026-08-24 17:08:59.441 |     WHERE
2026-08-24 17:08:59.441 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:59.441 |         AND (
2026-08-24 17:08:59.441 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:59.441 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:59.441 |         )   
2026-08-24 17:08:59.441 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:59.441 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:59.441 |             1 
2026-08-24 17:08:59.441 |         FROM
2026-08-24 17:08:59.441 |             payment_event_outbox o2       
2026-08-24 17:08:59.441 |         WHERE
2026-08-24 17:08:59.441 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:59.441 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:59.441 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:59.441 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:59.441 |     ORDER BY
2026-08-24 17:08:59.441 |         o1.created_at ASC 
2026-08-24 17:08:59.441 |     LIMIT
2026-08-24 17:08:59.441 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:59.441 | Hibernate: 
2026-08-24 17:08:59.441 |     SELECT
2026-08-24 17:08:59.441 |         o1.* 
2026-08-24 17:08:59.441 |     FROM
2026-08-24 17:08:59.441 |         payment_event_outbox o1 
2026-08-24 17:08:59.441 |     WHERE
2026-08-24 17:08:59.441 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:08:59.441 |         AND (
2026-08-24 17:08:59.441 |             o1.next_attempt_at IS NULL 
2026-08-24 17:08:59.441 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:08:59.441 |         )   
2026-08-24 17:08:59.441 |         AND o1.locked_at IS NULL   
2026-08-24 17:08:59.441 |         AND NOT EXISTS (       SELECT
2026-08-24 17:08:59.441 |             1 
2026-08-24 17:08:59.441 |         FROM
2026-08-24 17:08:59.441 |             payment_event_outbox o2       
2026-08-24 17:08:59.441 |         WHERE
2026-08-24 17:08:59.441 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:08:59.441 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:08:59.441 |             AND o2.sequence < o1.sequence         
2026-08-24 17:08:59.441 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:08:59.441 |     ORDER BY
2026-08-24 17:08:59.441 |         o1.created_at ASC 
2026-08-24 17:08:59.441 |     LIMIT
2026-08-24 17:08:59.441 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:08:59.972 | 2026-08-24 09:08:59 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:08:59.973 | 2026-08-24 09:08:59 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:08:59.973 | 2026-08-24 09:08:59 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 9d918af3-259c-4229-99a1-df23ecccd222] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:08:59.979 | 2026-08-24 09:08:59 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 9d918af3-259c-4229-99a1-df23ecccd222] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:09:04.449 | 2026-08-24 09:09:04 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:04.449 |     SELECT
2026-08-24 17:09:04.449 |         o1.* 
2026-08-24 17:09:04.449 |     FROM
2026-08-24 17:09:04.449 |         payment_event_outbox o1 
2026-08-24 17:09:04.449 |     WHERE
2026-08-24 17:09:04.449 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:04.449 |         AND (
2026-08-24 17:09:04.449 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:04.449 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:04.449 |         )   
2026-08-24 17:09:04.449 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:04.449 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:04.449 |             1 
2026-08-24 17:09:04.449 |         FROM
2026-08-24 17:09:04.449 |             payment_event_outbox o2       
2026-08-24 17:09:04.449 |         WHERE
2026-08-24 17:09:04.449 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:04.449 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:04.449 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:04.449 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:04.449 |     ORDER BY
2026-08-24 17:09:04.449 |         o1.created_at ASC 
2026-08-24 17:09:04.449 |     LIMIT
2026-08-24 17:09:04.449 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:04.449 | Hibernate: 
2026-08-24 17:09:04.449 |     SELECT
2026-08-24 17:09:04.449 |         o1.* 
2026-08-24 17:09:04.449 |     FROM
2026-08-24 17:09:04.449 |         payment_event_outbox o1 
2026-08-24 17:09:04.449 |     WHERE
2026-08-24 17:09:04.449 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:04.449 |         AND (
2026-08-24 17:09:04.449 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:04.449 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:04.449 |         )   
2026-08-24 17:09:04.449 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:04.449 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:04.449 |             1 
2026-08-24 17:09:04.449 |         FROM
2026-08-24 17:09:04.449 |             payment_event_outbox o2       
2026-08-24 17:09:04.449 |         WHERE
2026-08-24 17:09:04.449 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:04.449 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:04.449 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:04.449 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:04.449 |     ORDER BY
2026-08-24 17:09:04.449 |         o1.created_at ASC 
2026-08-24 17:09:04.449 |     LIMIT
2026-08-24 17:09:04.449 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:09.454 | 2026-08-24 09:09:09 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:09.454 |     SELECT
2026-08-24 17:09:09.454 |         o1.* 
2026-08-24 17:09:09.454 |     FROM
2026-08-24 17:09:09.454 |         payment_event_outbox o1 
2026-08-24 17:09:09.454 |     WHERE
2026-08-24 17:09:09.454 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:09.454 |         AND (
2026-08-24 17:09:09.454 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:09.454 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:09.454 |         )   
2026-08-24 17:09:09.454 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:09.454 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:09.454 |             1 
2026-08-24 17:09:09.454 |         FROM
2026-08-24 17:09:09.454 |             payment_event_outbox o2       
2026-08-24 17:09:09.454 |         WHERE
2026-08-24 17:09:09.455 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:09.455 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:09.455 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:09.455 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:09.455 |     ORDER BY
2026-08-24 17:09:09.455 |         o1.created_at ASC 
2026-08-24 17:09:09.455 |     LIMIT
2026-08-24 17:09:09.455 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:09.455 | Hibernate: 
2026-08-24 17:09:09.455 |     SELECT
2026-08-24 17:09:09.455 |         o1.* 
2026-08-24 17:09:09.455 |     FROM
2026-08-24 17:09:09.455 |         payment_event_outbox o1 
2026-08-24 17:09:09.455 |     WHERE
2026-08-24 17:09:09.455 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:09.455 |         AND (
2026-08-24 17:09:09.455 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:09.455 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:09.455 |         )   
2026-08-24 17:09:09.455 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:09.455 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:09.455 |             1 
2026-08-24 17:09:09.455 |         FROM
2026-08-24 17:09:09.455 |             payment_event_outbox o2       
2026-08-24 17:09:09.455 |         WHERE
2026-08-24 17:09:09.455 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:09.455 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:09.455 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:09.455 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:09.455 |     ORDER BY
2026-08-24 17:09:09.455 |         o1.created_at ASC 
2026-08-24 17:09:09.455 |     LIMIT
2026-08-24 17:09:09.455 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:10.060 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:09:10.061 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:09:10.061 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 2b00f791-d18e-4601-8a87-f0940d25759f] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:09:10.068 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 2b00f791-d18e-4601-8a87-f0940d25759f] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:09:10.642 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:09:10.647 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: dc8d157c-8b5b-4557-9e50-53534ed3cbfb] - 
2026-08-24 17:09:10.647 |     select
2026-08-24 17:09:10.647 |         c1_0.id,
2026-08-24 17:09:10.647 |         c1_0.created_at,
2026-08-24 17:09:10.647 |         c1_0.email,
2026-08-24 17:09:10.647 |         c1_0.employment_status,
2026-08-24 17:09:10.647 |         c1_0.first_name,
2026-08-24 17:09:10.647 |         c1_0.job_title,
2026-08-24 17:09:10.647 |         c1_0.kyc_status,
2026-08-24 17:09:10.647 |         c1_0.last_name,
2026-08-24 17:09:10.647 |         c1_0.locked,
2026-08-24 17:09:10.647 |         c1_0.monthly_income,
2026-08-24 17:09:10.647 |         c1_0.password,
2026-08-24 17:09:10.647 |         c1_0.risk_profile,
2026-08-24 17:09:10.647 |         c1_0.role,
2026-08-24 17:09:10.647 |         c1_0.source_of_funds 
2026-08-24 17:09:10.647 |     from
2026-08-24 17:09:10.647 |         customers c1_0 
2026-08-24 17:09:10.647 |     where
2026-08-24 17:09:10.647 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.647 | Hibernate: 
2026-08-24 17:09:10.647 |     select
2026-08-24 17:09:10.647 |         c1_0.id,
2026-08-24 17:09:10.647 |         c1_0.created_at,
2026-08-24 17:09:10.647 |         c1_0.email,
2026-08-24 17:09:10.647 |         c1_0.employment_status,
2026-08-24 17:09:10.647 |         c1_0.first_name,
2026-08-24 17:09:10.647 |         c1_0.job_title,
2026-08-24 17:09:10.647 |         c1_0.kyc_status,
2026-08-24 17:09:10.647 |         c1_0.last_name,
2026-08-24 17:09:10.647 |         c1_0.locked,
2026-08-24 17:09:10.647 |         c1_0.monthly_income,
2026-08-24 17:09:10.647 |         c1_0.password,
2026-08-24 17:09:10.647 |         c1_0.risk_profile,
2026-08-24 17:09:10.647 |         c1_0.role,
2026-08-24 17:09:10.647 |         c1_0.source_of_funds 
2026-08-24 17:09:10.647 |     from
2026-08-24 17:09:10.647 |         customers c1_0 
2026-08-24 17:09:10.647 |     where
2026-08-24 17:09:10.647 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.657 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: dc8d157c-8b5b-4557-9e50-53534ed3cbfb] - Secured GET /api/v1/accounts
2026-08-24 17:09:10.662 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: dc8d157c-8b5b-4557-9e50-53534ed3cbfb] - 
2026-08-24 17:09:10.662 |     select
2026-08-24 17:09:10.662 |         c1_0.id,
2026-08-24 17:09:10.662 |         c1_0.created_at,
2026-08-24 17:09:10.662 |         c1_0.email,
2026-08-24 17:09:10.662 |         c1_0.employment_status,
2026-08-24 17:09:10.662 |         c1_0.first_name,
2026-08-24 17:09:10.662 |         c1_0.job_title,
2026-08-24 17:09:10.662 |         c1_0.kyc_status,
2026-08-24 17:09:10.662 |         c1_0.last_name,
2026-08-24 17:09:10.662 |         c1_0.locked,
2026-08-24 17:09:10.662 |         c1_0.monthly_income,
2026-08-24 17:09:10.662 |         c1_0.password,
2026-08-24 17:09:10.662 |         c1_0.risk_profile,
2026-08-24 17:09:10.662 |         c1_0.role,
2026-08-24 17:09:10.662 |         c1_0.source_of_funds 
2026-08-24 17:09:10.662 |     from
2026-08-24 17:09:10.662 |         customers c1_0 
2026-08-24 17:09:10.662 |     where
2026-08-24 17:09:10.662 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.662 | Hibernate: 
2026-08-24 17:09:10.662 |     select
2026-08-24 17:09:10.662 |         c1_0.id,
2026-08-24 17:09:10.662 |         c1_0.created_at,
2026-08-24 17:09:10.662 |         c1_0.email,
2026-08-24 17:09:10.662 |         c1_0.employment_status,
2026-08-24 17:09:10.662 |         c1_0.first_name,
2026-08-24 17:09:10.662 |         c1_0.job_title,
2026-08-24 17:09:10.662 |         c1_0.kyc_status,
2026-08-24 17:09:10.662 |         c1_0.last_name,
2026-08-24 17:09:10.662 |         c1_0.locked,
2026-08-24 17:09:10.662 |         c1_0.monthly_income,
2026-08-24 17:09:10.662 |         c1_0.password,
2026-08-24 17:09:10.662 |         c1_0.risk_profile,
2026-08-24 17:09:10.662 |         c1_0.role,
2026-08-24 17:09:10.662 |         c1_0.source_of_funds 
2026-08-24 17:09:10.662 |     from
2026-08-24 17:09:10.662 |         customers c1_0 
2026-08-24 17:09:10.662 |     where
2026-08-24 17:09:10.662 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.669 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: dc8d157c-8b5b-4557-9e50-53534ed3cbfb] - 
2026-08-24 17:09:10.669 |     select
2026-08-24 17:09:10.669 |         a1_0.id,
2026-08-24 17:09:10.669 |         a1_0.account_name,
2026-08-24 17:09:10.669 |         a1_0.account_number,
2026-08-24 17:09:10.669 |         a1_0.account_type,
2026-08-24 17:09:10.669 |         a1_0.allow_incoming,
2026-08-24 17:09:10.669 |         a1_0.allow_outgoing,
2026-08-24 17:09:10.669 |         a1_0.balance,
2026-08-24 17:09:10.669 |         a1_0.card_cvv,
2026-08-24 17:09:10.669 |         a1_0.card_expiry,
2026-08-24 17:09:10.669 |         a1_0.created_at,
2026-08-24 17:09:10.669 |         a1_0.currency,
2026-08-24 17:09:10.669 |         a1_0.customer_id,
2026-08-24 17:09:10.669 |         a1_0.daily_limit,
2026-08-24 17:09:10.669 |         a1_0.frozen,
2026-08-24 17:09:10.669 |         a1_0.monthly_limit,
2026-08-24 17:09:10.669 |         a1_0.parent_account_id,
2026-08-24 17:09:10.669 |         a1_0.require_dual_approval,
2026-08-24 17:09:10.669 |         a1_0.status,
2026-08-24 17:09:10.669 |         a1_0.swift_code,
2026-08-24 17:09:10.669 |         a1_0.updated_at,
2026-08-24 17:09:10.669 |         a1_0.version 
2026-08-24 17:09:10.669 |     from
2026-08-24 17:09:10.669 |         accounts a1_0 
2026-08-24 17:09:10.669 |     where
2026-08-24 17:09:10.669 |         a1_0.customer_id=?
2026-08-24 17:09:10.669 | Hibernate: 
2026-08-24 17:09:10.669 |     select
2026-08-24 17:09:10.669 |         a1_0.id,
2026-08-24 17:09:10.669 |         a1_0.account_name,
2026-08-24 17:09:10.669 |         a1_0.account_number,
2026-08-24 17:09:10.669 |         a1_0.account_type,
2026-08-24 17:09:10.669 |         a1_0.allow_incoming,
2026-08-24 17:09:10.669 |         a1_0.allow_outgoing,
2026-08-24 17:09:10.669 |         a1_0.balance,
2026-08-24 17:09:10.669 |         a1_0.card_cvv,
2026-08-24 17:09:10.669 |         a1_0.card_expiry,
2026-08-24 17:09:10.669 |         a1_0.created_at,
2026-08-24 17:09:10.669 |         a1_0.currency,
2026-08-24 17:09:10.669 |         a1_0.customer_id,
2026-08-24 17:09:10.669 |         a1_0.daily_limit,
2026-08-24 17:09:10.669 |         a1_0.frozen,
2026-08-24 17:09:10.669 |         a1_0.monthly_limit,
2026-08-24 17:09:10.669 |         a1_0.parent_account_id,
2026-08-24 17:09:10.669 |         a1_0.require_dual_approval,
2026-08-24 17:09:10.669 |         a1_0.status,
2026-08-24 17:09:10.669 |         a1_0.swift_code,
2026-08-24 17:09:10.669 |         a1_0.updated_at,
2026-08-24 17:09:10.669 |         a1_0.version 
2026-08-24 17:09:10.669 |     from
2026-08-24 17:09:10.669 |         accounts a1_0 
2026-08-24 17:09:10.669 |     where
2026-08-24 17:09:10.669 |         a1_0.customer_id=?
2026-08-24 17:09:10.678 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: dc8d157c-8b5b-4557-9e50-53534ed3cbfb] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 20ms
2026-08-24 17:09:10.680 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:10.680 |     insert 
2026-08-24 17:09:10.680 |     into
2026-08-24 17:09:10.680 |         api_audit_events
2026-08-24 17:09:10.680 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:10.680 |     values
2026-08-24 17:09:10.680 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:10.680 | Hibernate: 
2026-08-24 17:09:10.680 |     insert 
2026-08-24 17:09:10.680 |     into
2026-08-24 17:09:10.680 |         api_audit_events
2026-08-24 17:09:10.680 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:10.680 |     values
2026-08-24 17:09:10.680 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:10.702 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=38ms
2026-08-24 17:09:10.897 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:09:10.903 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: e7dc66b7-7caa-4184-bba5-7e2fe0ffe1ac] - 
2026-08-24 17:09:10.903 |     select
2026-08-24 17:09:10.903 |         c1_0.id,
2026-08-24 17:09:10.903 |         c1_0.created_at,
2026-08-24 17:09:10.903 |         c1_0.email,
2026-08-24 17:09:10.903 |         c1_0.employment_status,
2026-08-24 17:09:10.903 |         c1_0.first_name,
2026-08-24 17:09:10.903 |         c1_0.job_title,
2026-08-24 17:09:10.903 |         c1_0.kyc_status,
2026-08-24 17:09:10.903 |         c1_0.last_name,
2026-08-24 17:09:10.903 |         c1_0.locked,
2026-08-24 17:09:10.903 |         c1_0.monthly_income,
2026-08-24 17:09:10.903 |         c1_0.password,
2026-08-24 17:09:10.903 |         c1_0.risk_profile,
2026-08-24 17:09:10.903 |         c1_0.role,
2026-08-24 17:09:10.903 |         c1_0.source_of_funds 
2026-08-24 17:09:10.903 |     from
2026-08-24 17:09:10.903 |         customers c1_0 
2026-08-24 17:09:10.903 |     where
2026-08-24 17:09:10.903 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.903 | Hibernate: 
2026-08-24 17:09:10.903 |     select
2026-08-24 17:09:10.903 |         c1_0.id,
2026-08-24 17:09:10.903 |         c1_0.created_at,
2026-08-24 17:09:10.903 |         c1_0.email,
2026-08-24 17:09:10.903 |         c1_0.employment_status,
2026-08-24 17:09:10.903 |         c1_0.first_name,
2026-08-24 17:09:10.903 |         c1_0.job_title,
2026-08-24 17:09:10.903 |         c1_0.kyc_status,
2026-08-24 17:09:10.903 |         c1_0.last_name,
2026-08-24 17:09:10.903 |         c1_0.locked,
2026-08-24 17:09:10.903 |         c1_0.monthly_income,
2026-08-24 17:09:10.903 |         c1_0.password,
2026-08-24 17:09:10.903 |         c1_0.risk_profile,
2026-08-24 17:09:10.903 |         c1_0.role,
2026-08-24 17:09:10.903 |         c1_0.source_of_funds 
2026-08-24 17:09:10.903 |     from
2026-08-24 17:09:10.903 |         customers c1_0 
2026-08-24 17:09:10.903 |     where
2026-08-24 17:09:10.903 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.912 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: e7dc66b7-7caa-4184-bba5-7e2fe0ffe1ac] - Secured GET /api/v1/accounts
2026-08-24 17:09:10.916 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: e7dc66b7-7caa-4184-bba5-7e2fe0ffe1ac] - 
2026-08-24 17:09:10.916 |     select
2026-08-24 17:09:10.916 |         c1_0.id,
2026-08-24 17:09:10.916 |         c1_0.created_at,
2026-08-24 17:09:10.916 |         c1_0.email,
2026-08-24 17:09:10.916 |         c1_0.employment_status,
2026-08-24 17:09:10.916 |         c1_0.first_name,
2026-08-24 17:09:10.916 |         c1_0.job_title,
2026-08-24 17:09:10.916 |         c1_0.kyc_status,
2026-08-24 17:09:10.916 |         c1_0.last_name,
2026-08-24 17:09:10.916 |         c1_0.locked,
2026-08-24 17:09:10.916 |         c1_0.monthly_income,
2026-08-24 17:09:10.916 |         c1_0.password,
2026-08-24 17:09:10.916 |         c1_0.risk_profile,
2026-08-24 17:09:10.916 |         c1_0.role,
2026-08-24 17:09:10.916 |         c1_0.source_of_funds 
2026-08-24 17:09:10.916 |     from
2026-08-24 17:09:10.916 |         customers c1_0 
2026-08-24 17:09:10.916 |     where
2026-08-24 17:09:10.916 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.916 | Hibernate: 
2026-08-24 17:09:10.916 |     select
2026-08-24 17:09:10.916 |         c1_0.id,
2026-08-24 17:09:10.916 |         c1_0.created_at,
2026-08-24 17:09:10.916 |         c1_0.email,
2026-08-24 17:09:10.916 |         c1_0.employment_status,
2026-08-24 17:09:10.916 |         c1_0.first_name,
2026-08-24 17:09:10.916 |         c1_0.job_title,
2026-08-24 17:09:10.916 |         c1_0.kyc_status,
2026-08-24 17:09:10.916 |         c1_0.last_name,
2026-08-24 17:09:10.916 |         c1_0.locked,
2026-08-24 17:09:10.916 |         c1_0.monthly_income,
2026-08-24 17:09:10.916 |         c1_0.password,
2026-08-24 17:09:10.916 |         c1_0.risk_profile,
2026-08-24 17:09:10.916 |         c1_0.role,
2026-08-24 17:09:10.916 |         c1_0.source_of_funds 
2026-08-24 17:09:10.916 |     from
2026-08-24 17:09:10.916 |         customers c1_0 
2026-08-24 17:09:10.916 |     where
2026-08-24 17:09:10.916 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:10.921 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: e7dc66b7-7caa-4184-bba5-7e2fe0ffe1ac] - 
2026-08-24 17:09:10.922 |     select
2026-08-24 17:09:10.922 |         a1_0.id,
2026-08-24 17:09:10.922 |         a1_0.account_name,
2026-08-24 17:09:10.922 |         a1_0.account_number,
2026-08-24 17:09:10.922 |         a1_0.account_type,
2026-08-24 17:09:10.922 |         a1_0.allow_incoming,
2026-08-24 17:09:10.922 |         a1_0.allow_outgoing,
2026-08-24 17:09:10.922 |         a1_0.balance,
2026-08-24 17:09:10.922 |         a1_0.card_cvv,
2026-08-24 17:09:10.922 |         a1_0.card_expiry,
2026-08-24 17:09:10.922 |         a1_0.created_at,
2026-08-24 17:09:10.922 |         a1_0.currency,
2026-08-24 17:09:10.922 |         a1_0.customer_id,
2026-08-24 17:09:10.922 |         a1_0.daily_limit,
2026-08-24 17:09:10.922 |         a1_0.frozen,
2026-08-24 17:09:10.922 |         a1_0.monthly_limit,
2026-08-24 17:09:10.922 |         a1_0.parent_account_id,
2026-08-24 17:09:10.922 |         a1_0.require_dual_approval,
2026-08-24 17:09:10.922 |         a1_0.status,
2026-08-24 17:09:10.922 |         a1_0.swift_code,
2026-08-24 17:09:10.922 |         a1_0.updated_at,
2026-08-24 17:09:10.922 |         a1_0.version 
2026-08-24 17:09:10.922 |     from
2026-08-24 17:09:10.922 |         accounts a1_0 
2026-08-24 17:09:10.922 |     where
2026-08-24 17:09:10.922 |         a1_0.customer_id=?
2026-08-24 17:09:10.922 | Hibernate: 
2026-08-24 17:09:10.922 |     select
2026-08-24 17:09:10.922 |         a1_0.id,
2026-08-24 17:09:10.922 |         a1_0.account_name,
2026-08-24 17:09:10.922 |         a1_0.account_number,
2026-08-24 17:09:10.922 |         a1_0.account_type,
2026-08-24 17:09:10.922 |         a1_0.allow_incoming,
2026-08-24 17:09:10.922 |         a1_0.allow_outgoing,
2026-08-24 17:09:10.922 |         a1_0.balance,
2026-08-24 17:09:10.922 |         a1_0.card_cvv,
2026-08-24 17:09:10.922 |         a1_0.card_expiry,
2026-08-24 17:09:10.922 |         a1_0.created_at,
2026-08-24 17:09:10.922 |         a1_0.currency,
2026-08-24 17:09:10.922 |         a1_0.customer_id,
2026-08-24 17:09:10.922 |         a1_0.daily_limit,
2026-08-24 17:09:10.922 |         a1_0.frozen,
2026-08-24 17:09:10.922 |         a1_0.monthly_limit,
2026-08-24 17:09:10.922 |         a1_0.parent_account_id,
2026-08-24 17:09:10.922 |         a1_0.require_dual_approval,
2026-08-24 17:09:10.922 |         a1_0.status,
2026-08-24 17:09:10.922 |         a1_0.swift_code,
2026-08-24 17:09:10.922 |         a1_0.updated_at,
2026-08-24 17:09:10.922 |         a1_0.version 
2026-08-24 17:09:10.922 |     from
2026-08-24 17:09:10.922 |         accounts a1_0 
2026-08-24 17:09:10.922 |     where
2026-08-24 17:09:10.922 |         a1_0.customer_id=?
2026-08-24 17:09:10.927 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: e7dc66b7-7caa-4184-bba5-7e2fe0ffe1ac] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 15ms
2026-08-24 17:09:10.930 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:10.930 |     insert 
2026-08-24 17:09:10.930 |     into
2026-08-24 17:09:10.930 |         api_audit_events
2026-08-24 17:09:10.930 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:10.930 |     values
2026-08-24 17:09:10.930 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:10.930 | Hibernate: 
2026-08-24 17:09:10.930 |     insert 
2026-08-24 17:09:10.930 |     into
2026-08-24 17:09:10.930 |         api_audit_events
2026-08-24 17:09:10.930 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:10.930 |     values
2026-08-24 17:09:10.930 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:10.950 | 2026-08-24 09:09:10 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=32ms
2026-08-24 17:09:14.456 | 2026-08-24 09:09:14 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:14.456 |     SELECT
2026-08-24 17:09:14.456 |         o1.* 
2026-08-24 17:09:14.456 |     FROM
2026-08-24 17:09:14.456 |         payment_event_outbox o1 
2026-08-24 17:09:14.456 |     WHERE
2026-08-24 17:09:14.456 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:14.456 |         AND (
2026-08-24 17:09:14.456 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:14.456 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:14.456 |         )   
2026-08-24 17:09:14.456 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:14.456 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:14.456 |             1 
2026-08-24 17:09:14.456 |         FROM
2026-08-24 17:09:14.456 |             payment_event_outbox o2       
2026-08-24 17:09:14.456 |         WHERE
2026-08-24 17:09:14.456 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:14.456 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:14.456 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:14.456 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:14.456 |     ORDER BY
2026-08-24 17:09:14.456 |         o1.created_at ASC 
2026-08-24 17:09:14.456 |     LIMIT
2026-08-24 17:09:14.456 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:14.456 | Hibernate: 
2026-08-24 17:09:14.456 |     SELECT
2026-08-24 17:09:14.456 |         o1.* 
2026-08-24 17:09:14.456 |     FROM
2026-08-24 17:09:14.456 |         payment_event_outbox o1 
2026-08-24 17:09:14.456 |     WHERE
2026-08-24 17:09:14.456 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:14.456 |         AND (
2026-08-24 17:09:14.456 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:14.456 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:14.456 |         )   
2026-08-24 17:09:14.456 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:14.456 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:14.456 |             1 
2026-08-24 17:09:14.456 |         FROM
2026-08-24 17:09:14.456 |             payment_event_outbox o2       
2026-08-24 17:09:14.456 |         WHERE
2026-08-24 17:09:14.456 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:14.456 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:14.456 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:14.456 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:14.456 |     ORDER BY
2026-08-24 17:09:14.456 |         o1.created_at ASC 
2026-08-24 17:09:14.456 |     LIMIT
2026-08-24 17:09:14.456 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:19.462 | 2026-08-24 09:09:19 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:19.462 |     SELECT
2026-08-24 17:09:19.462 |         o1.* 
2026-08-24 17:09:19.462 |     FROM
2026-08-24 17:09:19.462 |         payment_event_outbox o1 
2026-08-24 17:09:19.462 |     WHERE
2026-08-24 17:09:19.462 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:19.462 |         AND (
2026-08-24 17:09:19.462 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:19.462 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:19.462 |         )   
2026-08-24 17:09:19.462 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:19.462 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:19.462 |             1 
2026-08-24 17:09:19.462 |         FROM
2026-08-24 17:09:19.462 |             payment_event_outbox o2       
2026-08-24 17:09:19.462 |         WHERE
2026-08-24 17:09:19.462 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:19.462 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:19.462 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:19.462 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:19.462 |     ORDER BY
2026-08-24 17:09:19.462 |         o1.created_at ASC 
2026-08-24 17:09:19.462 |     LIMIT
2026-08-24 17:09:19.462 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:19.462 | Hibernate: 
2026-08-24 17:09:19.462 |     SELECT
2026-08-24 17:09:19.462 |         o1.* 
2026-08-24 17:09:19.462 |     FROM
2026-08-24 17:09:19.462 |         payment_event_outbox o1 
2026-08-24 17:09:19.462 |     WHERE
2026-08-24 17:09:19.462 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:19.462 |         AND (
2026-08-24 17:09:19.462 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:19.462 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:19.462 |         )   
2026-08-24 17:09:19.462 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:19.462 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:19.462 |             1 
2026-08-24 17:09:19.462 |         FROM
2026-08-24 17:09:19.462 |             payment_event_outbox o2       
2026-08-24 17:09:19.462 |         WHERE
2026-08-24 17:09:19.462 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:19.462 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:19.462 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:19.462 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:19.462 |     ORDER BY
2026-08-24 17:09:19.462 |         o1.created_at ASC 
2026-08-24 17:09:19.462 |     LIMIT
2026-08-24 17:09:19.462 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:20.177 | 2026-08-24 09:09:20 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:09:20.178 | 2026-08-24 09:09:20 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:09:20.179 | 2026-08-24 09:09:20 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: c6373dc0-d2d1-4df0-8b51-ceb4ff436cca] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:09:20.185 | 2026-08-24 09:09:20 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: c6373dc0-d2d1-4df0-8b51-ceb4ff436cca] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:09:24.468 | 2026-08-24 09:09:24 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:24.468 |     SELECT
2026-08-24 17:09:24.468 |         o1.* 
2026-08-24 17:09:24.468 |     FROM
2026-08-24 17:09:24.468 |         payment_event_outbox o1 
2026-08-24 17:09:24.468 |     WHERE
2026-08-24 17:09:24.468 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:24.468 |         AND (
2026-08-24 17:09:24.468 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:24.468 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:24.468 |         )   
2026-08-24 17:09:24.468 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:24.468 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:24.468 |             1 
2026-08-24 17:09:24.468 |         FROM
2026-08-24 17:09:24.468 |             payment_event_outbox o2       
2026-08-24 17:09:24.468 |         WHERE
2026-08-24 17:09:24.468 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:24.468 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:24.468 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:24.468 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:24.468 |     ORDER BY
2026-08-24 17:09:24.468 |         o1.created_at ASC 
2026-08-24 17:09:24.468 |     LIMIT
2026-08-24 17:09:24.468 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:24.468 | Hibernate: 
2026-08-24 17:09:24.468 |     SELECT
2026-08-24 17:09:24.468 |         o1.* 
2026-08-24 17:09:24.468 |     FROM
2026-08-24 17:09:24.468 |         payment_event_outbox o1 
2026-08-24 17:09:24.468 |     WHERE
2026-08-24 17:09:24.468 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:24.468 |         AND (
2026-08-24 17:09:24.468 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:24.468 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:24.468 |         )   
2026-08-24 17:09:24.468 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:24.468 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:24.468 |             1 
2026-08-24 17:09:24.468 |         FROM
2026-08-24 17:09:24.468 |             payment_event_outbox o2       
2026-08-24 17:09:24.468 |         WHERE
2026-08-24 17:09:24.468 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:24.468 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:24.468 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:24.468 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:24.468 |     ORDER BY
2026-08-24 17:09:24.468 |         o1.created_at ASC 
2026-08-24 17:09:24.468 |     LIMIT
2026-08-24 17:09:24.468 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:29.473 | 2026-08-24 09:09:29 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:29.473 |     SELECT
2026-08-24 17:09:29.473 |         o1.* 
2026-08-24 17:09:29.473 |     FROM
2026-08-24 17:09:29.473 |         payment_event_outbox o1 
2026-08-24 17:09:29.473 |     WHERE
2026-08-24 17:09:29.473 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:29.473 |         AND (
2026-08-24 17:09:29.473 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:29.473 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:29.473 |         )   
2026-08-24 17:09:29.473 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:29.473 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:29.473 |             1 
2026-08-24 17:09:29.473 |         FROM
2026-08-24 17:09:29.473 |             payment_event_outbox o2       
2026-08-24 17:09:29.473 |         WHERE
2026-08-24 17:09:29.473 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:29.473 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:29.473 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:29.473 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:29.473 |     ORDER BY
2026-08-24 17:09:29.473 |         o1.created_at ASC 
2026-08-24 17:09:29.473 |     LIMIT
2026-08-24 17:09:29.473 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:29.473 | Hibernate: 
2026-08-24 17:09:29.473 |     SELECT
2026-08-24 17:09:29.473 |         o1.* 
2026-08-24 17:09:29.473 |     FROM
2026-08-24 17:09:29.473 |         payment_event_outbox o1 
2026-08-24 17:09:29.473 |     WHERE
2026-08-24 17:09:29.473 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:29.473 |         AND (
2026-08-24 17:09:29.473 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:29.473 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:29.473 |         )   
2026-08-24 17:09:29.473 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:29.473 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:29.473 |             1 
2026-08-24 17:09:29.473 |         FROM
2026-08-24 17:09:29.473 |             payment_event_outbox o2       
2026-08-24 17:09:29.473 |         WHERE
2026-08-24 17:09:29.473 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:29.473 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:29.473 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:29.473 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:29.473 |     ORDER BY
2026-08-24 17:09:29.473 |         o1.created_at ASC 
2026-08-24 17:09:29.473 |     LIMIT
2026-08-24 17:09:29.473 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:30.294 | 2026-08-24 09:09:30 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:09:30.295 | 2026-08-24 09:09:30 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:09:30.297 | 2026-08-24 09:09:30 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 4db56c99-4a47-4218-a06c-23cbf777bd81] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:09:30.304 | 2026-08-24 09:09:30 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 4db56c99-4a47-4218-a06c-23cbf777bd81] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 8ms
2026-08-24 17:09:34.479 | 2026-08-24 09:09:34 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:34.479 |     SELECT
2026-08-24 17:09:34.479 |         o1.* 
2026-08-24 17:09:34.479 |     FROM
2026-08-24 17:09:34.479 |         payment_event_outbox o1 
2026-08-24 17:09:34.479 |     WHERE
2026-08-24 17:09:34.479 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:34.479 |         AND (
2026-08-24 17:09:34.479 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:34.479 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:34.479 |         )   
2026-08-24 17:09:34.479 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:34.479 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:34.479 |             1 
2026-08-24 17:09:34.479 |         FROM
2026-08-24 17:09:34.479 |             payment_event_outbox o2       
2026-08-24 17:09:34.479 |         WHERE
2026-08-24 17:09:34.479 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:34.479 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:34.479 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:34.479 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:34.479 |     ORDER BY
2026-08-24 17:09:34.479 |         o1.created_at ASC 
2026-08-24 17:09:34.479 |     LIMIT
2026-08-24 17:09:34.479 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:34.479 | Hibernate: 
2026-08-24 17:09:34.479 |     SELECT
2026-08-24 17:09:34.479 |         o1.* 
2026-08-24 17:09:34.479 |     FROM
2026-08-24 17:09:34.479 |         payment_event_outbox o1 
2026-08-24 17:09:34.479 |     WHERE
2026-08-24 17:09:34.479 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:34.479 |         AND (
2026-08-24 17:09:34.479 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:34.479 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:34.479 |         )   
2026-08-24 17:09:34.479 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:34.479 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:34.479 |             1 
2026-08-24 17:09:34.479 |         FROM
2026-08-24 17:09:34.479 |             payment_event_outbox o2       
2026-08-24 17:09:34.479 |         WHERE
2026-08-24 17:09:34.479 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:34.479 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:34.479 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:34.479 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:34.479 |     ORDER BY
2026-08-24 17:09:34.479 |         o1.created_at ASC 
2026-08-24 17:09:34.479 |     LIMIT
2026-08-24 17:09:34.479 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:36.010 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:09:36.016 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 60f5cf85-5236-4822-962f-4140b34e4621] - 
2026-08-24 17:09:36.016 |     select
2026-08-24 17:09:36.016 |         c1_0.id,
2026-08-24 17:09:36.016 |         c1_0.created_at,
2026-08-24 17:09:36.016 |         c1_0.email,
2026-08-24 17:09:36.016 |         c1_0.employment_status,
2026-08-24 17:09:36.016 |         c1_0.first_name,
2026-08-24 17:09:36.016 |         c1_0.job_title,
2026-08-24 17:09:36.016 |         c1_0.kyc_status,
2026-08-24 17:09:36.016 |         c1_0.last_name,
2026-08-24 17:09:36.016 |         c1_0.locked,
2026-08-24 17:09:36.016 |         c1_0.monthly_income,
2026-08-24 17:09:36.016 |         c1_0.password,
2026-08-24 17:09:36.016 |         c1_0.risk_profile,
2026-08-24 17:09:36.016 |         c1_0.role,
2026-08-24 17:09:36.016 |         c1_0.source_of_funds 
2026-08-24 17:09:36.016 |     from
2026-08-24 17:09:36.016 |         customers c1_0 
2026-08-24 17:09:36.016 |     where
2026-08-24 17:09:36.016 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.016 | Hibernate: 
2026-08-24 17:09:36.016 |     select
2026-08-24 17:09:36.016 |         c1_0.id,
2026-08-24 17:09:36.016 |         c1_0.created_at,
2026-08-24 17:09:36.016 |         c1_0.email,
2026-08-24 17:09:36.016 |         c1_0.employment_status,
2026-08-24 17:09:36.016 |         c1_0.first_name,
2026-08-24 17:09:36.016 |         c1_0.job_title,
2026-08-24 17:09:36.016 |         c1_0.kyc_status,
2026-08-24 17:09:36.016 |         c1_0.last_name,
2026-08-24 17:09:36.016 |         c1_0.locked,
2026-08-24 17:09:36.016 |         c1_0.monthly_income,
2026-08-24 17:09:36.016 |         c1_0.password,
2026-08-24 17:09:36.016 |         c1_0.risk_profile,
2026-08-24 17:09:36.016 |         c1_0.role,
2026-08-24 17:09:36.016 |         c1_0.source_of_funds 
2026-08-24 17:09:36.016 |     from
2026-08-24 17:09:36.016 |         customers c1_0 
2026-08-24 17:09:36.016 |     where
2026-08-24 17:09:36.016 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.027 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 60f5cf85-5236-4822-962f-4140b34e4621] - Secured GET /api/v1/accounts
2026-08-24 17:09:36.030 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 60f5cf85-5236-4822-962f-4140b34e4621] - 
2026-08-24 17:09:36.030 |     select
2026-08-24 17:09:36.030 |         c1_0.id,
2026-08-24 17:09:36.030 |         c1_0.created_at,
2026-08-24 17:09:36.030 |         c1_0.email,
2026-08-24 17:09:36.030 |         c1_0.employment_status,
2026-08-24 17:09:36.030 |         c1_0.first_name,
2026-08-24 17:09:36.030 |         c1_0.job_title,
2026-08-24 17:09:36.030 |         c1_0.kyc_status,
2026-08-24 17:09:36.030 |         c1_0.last_name,
2026-08-24 17:09:36.030 |         c1_0.locked,
2026-08-24 17:09:36.030 |         c1_0.monthly_income,
2026-08-24 17:09:36.030 |         c1_0.password,
2026-08-24 17:09:36.030 |         c1_0.risk_profile,
2026-08-24 17:09:36.030 |         c1_0.role,
2026-08-24 17:09:36.030 |         c1_0.source_of_funds 
2026-08-24 17:09:36.030 |     from
2026-08-24 17:09:36.030 |         customers c1_0 
2026-08-24 17:09:36.030 |     where
2026-08-24 17:09:36.030 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.030 | Hibernate: 
2026-08-24 17:09:36.030 |     select
2026-08-24 17:09:36.030 |         c1_0.id,
2026-08-24 17:09:36.030 |         c1_0.created_at,
2026-08-24 17:09:36.030 |         c1_0.email,
2026-08-24 17:09:36.030 |         c1_0.employment_status,
2026-08-24 17:09:36.030 |         c1_0.first_name,
2026-08-24 17:09:36.030 |         c1_0.job_title,
2026-08-24 17:09:36.030 |         c1_0.kyc_status,
2026-08-24 17:09:36.030 |         c1_0.last_name,
2026-08-24 17:09:36.030 |         c1_0.locked,
2026-08-24 17:09:36.030 |         c1_0.monthly_income,
2026-08-24 17:09:36.030 |         c1_0.password,
2026-08-24 17:09:36.030 |         c1_0.risk_profile,
2026-08-24 17:09:36.030 |         c1_0.role,
2026-08-24 17:09:36.030 |         c1_0.source_of_funds 
2026-08-24 17:09:36.030 |     from
2026-08-24 17:09:36.030 |         customers c1_0 
2026-08-24 17:09:36.030 |     where
2026-08-24 17:09:36.030 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.035 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: 60f5cf85-5236-4822-962f-4140b34e4621] - 
2026-08-24 17:09:36.035 |     select
2026-08-24 17:09:36.035 |         a1_0.id,
2026-08-24 17:09:36.035 |         a1_0.account_name,
2026-08-24 17:09:36.035 |         a1_0.account_number,
2026-08-24 17:09:36.035 |         a1_0.account_type,
2026-08-24 17:09:36.035 |         a1_0.allow_incoming,
2026-08-24 17:09:36.035 |         a1_0.allow_outgoing,
2026-08-24 17:09:36.035 |         a1_0.balance,
2026-08-24 17:09:36.035 |         a1_0.card_cvv,
2026-08-24 17:09:36.035 |         a1_0.card_expiry,
2026-08-24 17:09:36.035 |         a1_0.created_at,
2026-08-24 17:09:36.035 |         a1_0.currency,
2026-08-24 17:09:36.035 |         a1_0.customer_id,
2026-08-24 17:09:36.035 |         a1_0.daily_limit,
2026-08-24 17:09:36.035 |         a1_0.frozen,
2026-08-24 17:09:36.035 |         a1_0.monthly_limit,
2026-08-24 17:09:36.035 |         a1_0.parent_account_id,
2026-08-24 17:09:36.035 |         a1_0.require_dual_approval,
2026-08-24 17:09:36.035 |         a1_0.status,
2026-08-24 17:09:36.035 |         a1_0.swift_code,
2026-08-24 17:09:36.035 |         a1_0.updated_at,
2026-08-24 17:09:36.035 |         a1_0.version 
2026-08-24 17:09:36.035 |     from
2026-08-24 17:09:36.035 |         accounts a1_0 
2026-08-24 17:09:36.035 |     where
2026-08-24 17:09:36.035 |         a1_0.customer_id=?
2026-08-24 17:09:36.035 | Hibernate: 
2026-08-24 17:09:36.035 |     select
2026-08-24 17:09:36.035 |         a1_0.id,
2026-08-24 17:09:36.035 |         a1_0.account_name,
2026-08-24 17:09:36.035 |         a1_0.account_number,
2026-08-24 17:09:36.035 |         a1_0.account_type,
2026-08-24 17:09:36.035 |         a1_0.allow_incoming,
2026-08-24 17:09:36.035 |         a1_0.allow_outgoing,
2026-08-24 17:09:36.035 |         a1_0.balance,
2026-08-24 17:09:36.035 |         a1_0.card_cvv,
2026-08-24 17:09:36.035 |         a1_0.card_expiry,
2026-08-24 17:09:36.035 |         a1_0.created_at,
2026-08-24 17:09:36.035 |         a1_0.currency,
2026-08-24 17:09:36.035 |         a1_0.customer_id,
2026-08-24 17:09:36.035 |         a1_0.daily_limit,
2026-08-24 17:09:36.035 |         a1_0.frozen,
2026-08-24 17:09:36.035 |         a1_0.monthly_limit,
2026-08-24 17:09:36.035 |         a1_0.parent_account_id,
2026-08-24 17:09:36.035 |         a1_0.require_dual_approval,
2026-08-24 17:09:36.035 |         a1_0.status,
2026-08-24 17:09:36.035 |         a1_0.swift_code,
2026-08-24 17:09:36.035 |         a1_0.updated_at,
2026-08-24 17:09:36.035 |         a1_0.version 
2026-08-24 17:09:36.035 |     from
2026-08-24 17:09:36.035 |         accounts a1_0 
2026-08-24 17:09:36.035 |     where
2026-08-24 17:09:36.035 |         a1_0.customer_id=?
2026-08-24 17:09:36.042 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 60f5cf85-5236-4822-962f-4140b34e4621] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 14ms
2026-08-24 17:09:36.045 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:36.045 |     insert 
2026-08-24 17:09:36.045 |     into
2026-08-24 17:09:36.045 |         api_audit_events
2026-08-24 17:09:36.045 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:36.045 |     values
2026-08-24 17:09:36.045 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:36.045 | Hibernate: 
2026-08-24 17:09:36.045 |     insert 
2026-08-24 17:09:36.045 |     into
2026-08-24 17:09:36.045 |         api_audit_events
2026-08-24 17:09:36.045 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:36.045 |     values
2026-08-24 17:09:36.045 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:36.056 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=33ms
2026-08-24 17:09:36.165 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:09:36.171 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 4e4e7ff2-bba8-4016-ab9f-d6e88c1c6868] - 
2026-08-24 17:09:36.172 |     select
2026-08-24 17:09:36.172 |         c1_0.id,
2026-08-24 17:09:36.172 |         c1_0.created_at,
2026-08-24 17:09:36.172 |         c1_0.email,
2026-08-24 17:09:36.172 |         c1_0.employment_status,
2026-08-24 17:09:36.172 |         c1_0.first_name,
2026-08-24 17:09:36.172 |         c1_0.job_title,
2026-08-24 17:09:36.172 |         c1_0.kyc_status,
2026-08-24 17:09:36.172 |         c1_0.last_name,
2026-08-24 17:09:36.172 |         c1_0.locked,
2026-08-24 17:09:36.172 |         c1_0.monthly_income,
2026-08-24 17:09:36.172 |         c1_0.password,
2026-08-24 17:09:36.172 |         c1_0.risk_profile,
2026-08-24 17:09:36.172 |         c1_0.role,
2026-08-24 17:09:36.172 |         c1_0.source_of_funds 
2026-08-24 17:09:36.172 |     from
2026-08-24 17:09:36.172 |         customers c1_0 
2026-08-24 17:09:36.172 |     where
2026-08-24 17:09:36.172 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.172 | Hibernate: 
2026-08-24 17:09:36.172 |     select
2026-08-24 17:09:36.172 |         c1_0.id,
2026-08-24 17:09:36.172 |         c1_0.created_at,
2026-08-24 17:09:36.172 |         c1_0.email,
2026-08-24 17:09:36.172 |         c1_0.employment_status,
2026-08-24 17:09:36.172 |         c1_0.first_name,
2026-08-24 17:09:36.172 |         c1_0.job_title,
2026-08-24 17:09:36.172 |         c1_0.kyc_status,
2026-08-24 17:09:36.172 |         c1_0.last_name,
2026-08-24 17:09:36.172 |         c1_0.locked,
2026-08-24 17:09:36.172 |         c1_0.monthly_income,
2026-08-24 17:09:36.172 |         c1_0.password,
2026-08-24 17:09:36.172 |         c1_0.risk_profile,
2026-08-24 17:09:36.172 |         c1_0.role,
2026-08-24 17:09:36.172 |         c1_0.source_of_funds 
2026-08-24 17:09:36.172 |     from
2026-08-24 17:09:36.172 |         customers c1_0 
2026-08-24 17:09:36.172 |     where
2026-08-24 17:09:36.172 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.182 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 4e4e7ff2-bba8-4016-ab9f-d6e88c1c6868] - Secured GET /api/v1/accounts
2026-08-24 17:09:36.186 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 4e4e7ff2-bba8-4016-ab9f-d6e88c1c6868] - 
2026-08-24 17:09:36.186 |     select
2026-08-24 17:09:36.186 |         c1_0.id,
2026-08-24 17:09:36.186 |         c1_0.created_at,
2026-08-24 17:09:36.186 |         c1_0.email,
2026-08-24 17:09:36.186 |         c1_0.employment_status,
2026-08-24 17:09:36.186 |         c1_0.first_name,
2026-08-24 17:09:36.186 |         c1_0.job_title,
2026-08-24 17:09:36.186 |         c1_0.kyc_status,
2026-08-24 17:09:36.186 |         c1_0.last_name,
2026-08-24 17:09:36.186 |         c1_0.locked,
2026-08-24 17:09:36.186 |         c1_0.monthly_income,
2026-08-24 17:09:36.186 |         c1_0.password,
2026-08-24 17:09:36.186 |         c1_0.risk_profile,
2026-08-24 17:09:36.186 |         c1_0.role,
2026-08-24 17:09:36.186 |         c1_0.source_of_funds 
2026-08-24 17:09:36.186 |     from
2026-08-24 17:09:36.186 |         customers c1_0 
2026-08-24 17:09:36.186 |     where
2026-08-24 17:09:36.186 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.186 | Hibernate: 
2026-08-24 17:09:36.186 |     select
2026-08-24 17:09:36.186 |         c1_0.id,
2026-08-24 17:09:36.186 |         c1_0.created_at,
2026-08-24 17:09:36.186 |         c1_0.email,
2026-08-24 17:09:36.186 |         c1_0.employment_status,
2026-08-24 17:09:36.186 |         c1_0.first_name,
2026-08-24 17:09:36.186 |         c1_0.job_title,
2026-08-24 17:09:36.186 |         c1_0.kyc_status,
2026-08-24 17:09:36.186 |         c1_0.last_name,
2026-08-24 17:09:36.186 |         c1_0.locked,
2026-08-24 17:09:36.186 |         c1_0.monthly_income,
2026-08-24 17:09:36.186 |         c1_0.password,
2026-08-24 17:09:36.186 |         c1_0.risk_profile,
2026-08-24 17:09:36.186 |         c1_0.role,
2026-08-24 17:09:36.186 |         c1_0.source_of_funds 
2026-08-24 17:09:36.186 |     from
2026-08-24 17:09:36.186 |         customers c1_0 
2026-08-24 17:09:36.186 |     where
2026-08-24 17:09:36.186 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:36.191 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 4e4e7ff2-bba8-4016-ab9f-d6e88c1c6868] - 
2026-08-24 17:09:36.191 |     select
2026-08-24 17:09:36.191 |         a1_0.id,
2026-08-24 17:09:36.191 |         a1_0.account_name,
2026-08-24 17:09:36.191 |         a1_0.account_number,
2026-08-24 17:09:36.191 |         a1_0.account_type,
2026-08-24 17:09:36.191 |         a1_0.allow_incoming,
2026-08-24 17:09:36.191 |         a1_0.allow_outgoing,
2026-08-24 17:09:36.191 |         a1_0.balance,
2026-08-24 17:09:36.191 |         a1_0.card_cvv,
2026-08-24 17:09:36.191 |         a1_0.card_expiry,
2026-08-24 17:09:36.191 |         a1_0.created_at,
2026-08-24 17:09:36.191 |         a1_0.currency,
2026-08-24 17:09:36.191 |         a1_0.customer_id,
2026-08-24 17:09:36.191 |         a1_0.daily_limit,
2026-08-24 17:09:36.191 |         a1_0.frozen,
2026-08-24 17:09:36.191 |         a1_0.monthly_limit,
2026-08-24 17:09:36.191 |         a1_0.parent_account_id,
2026-08-24 17:09:36.191 |         a1_0.require_dual_approval,
2026-08-24 17:09:36.191 |         a1_0.status,
2026-08-24 17:09:36.191 |         a1_0.swift_code,
2026-08-24 17:09:36.191 |         a1_0.updated_at,
2026-08-24 17:09:36.191 |         a1_0.version 
2026-08-24 17:09:36.191 |     from
2026-08-24 17:09:36.191 |         accounts a1_0 
2026-08-24 17:09:36.191 |     where
2026-08-24 17:09:36.191 |         a1_0.customer_id=?
2026-08-24 17:09:36.191 | Hibernate: 
2026-08-24 17:09:36.191 |     select
2026-08-24 17:09:36.191 |         a1_0.id,
2026-08-24 17:09:36.191 |         a1_0.account_name,
2026-08-24 17:09:36.191 |         a1_0.account_number,
2026-08-24 17:09:36.191 |         a1_0.account_type,
2026-08-24 17:09:36.191 |         a1_0.allow_incoming,
2026-08-24 17:09:36.191 |         a1_0.allow_outgoing,
2026-08-24 17:09:36.191 |         a1_0.balance,
2026-08-24 17:09:36.191 |         a1_0.card_cvv,
2026-08-24 17:09:36.191 |         a1_0.card_expiry,
2026-08-24 17:09:36.191 |         a1_0.created_at,
2026-08-24 17:09:36.191 |         a1_0.currency,
2026-08-24 17:09:36.191 |         a1_0.customer_id,
2026-08-24 17:09:36.191 |         a1_0.daily_limit,
2026-08-24 17:09:36.191 |         a1_0.frozen,
2026-08-24 17:09:36.191 |         a1_0.monthly_limit,
2026-08-24 17:09:36.191 |         a1_0.parent_account_id,
2026-08-24 17:09:36.191 |         a1_0.require_dual_approval,
2026-08-24 17:09:36.191 |         a1_0.status,
2026-08-24 17:09:36.191 |         a1_0.swift_code,
2026-08-24 17:09:36.191 |         a1_0.updated_at,
2026-08-24 17:09:36.191 |         a1_0.version 
2026-08-24 17:09:36.191 |     from
2026-08-24 17:09:36.191 |         accounts a1_0 
2026-08-24 17:09:36.191 |     where
2026-08-24 17:09:36.191 |         a1_0.customer_id=?
2026-08-24 17:09:36.199 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 4e4e7ff2-bba8-4016-ab9f-d6e88c1c6868] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 17ms
2026-08-24 17:09:36.202 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:36.202 |     insert 
2026-08-24 17:09:36.202 |     into
2026-08-24 17:09:36.202 |         api_audit_events
2026-08-24 17:09:36.202 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:36.202 |     values
2026-08-24 17:09:36.202 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:36.202 | Hibernate: 
2026-08-24 17:09:36.202 |     insert 
2026-08-24 17:09:36.202 |     into
2026-08-24 17:09:36.202 |         api_audit_events
2026-08-24 17:09:36.202 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:36.202 |     values
2026-08-24 17:09:36.202 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:36.212 | 2026-08-24 09:09:36 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=36ms
2026-08-24 17:09:39.484 | 2026-08-24 09:09:39 [MessageBroker-16] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:39.484 |     SELECT
2026-08-24 17:09:39.484 |         o1.* 
2026-08-24 17:09:39.484 |     FROM
2026-08-24 17:09:39.484 |         payment_event_outbox o1 
2026-08-24 17:09:39.484 |     WHERE
2026-08-24 17:09:39.484 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:39.485 |         AND (
2026-08-24 17:09:39.485 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:39.485 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:39.485 |         )   
2026-08-24 17:09:39.485 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:39.485 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:39.485 |             1 
2026-08-24 17:09:39.485 |         FROM
2026-08-24 17:09:39.485 |             payment_event_outbox o2       
2026-08-24 17:09:39.485 |         WHERE
2026-08-24 17:09:39.485 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:39.485 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:39.485 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:39.485 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:39.485 |     ORDER BY
2026-08-24 17:09:39.485 |         o1.created_at ASC 
2026-08-24 17:09:39.485 |     LIMIT
2026-08-24 17:09:39.485 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:39.485 | Hibernate: 
2026-08-24 17:09:39.485 |     SELECT
2026-08-24 17:09:39.485 |         o1.* 
2026-08-24 17:09:39.485 |     FROM
2026-08-24 17:09:39.485 |         payment_event_outbox o1 
2026-08-24 17:09:39.485 |     WHERE
2026-08-24 17:09:39.485 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:39.485 |         AND (
2026-08-24 17:09:39.485 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:39.485 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:39.485 |         )   
2026-08-24 17:09:39.485 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:39.485 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:39.485 |             1 
2026-08-24 17:09:39.485 |         FROM
2026-08-24 17:09:39.485 |             payment_event_outbox o2       
2026-08-24 17:09:39.485 |         WHERE
2026-08-24 17:09:39.485 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:39.485 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:39.485 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:39.485 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:39.485 |     ORDER BY
2026-08-24 17:09:39.485 |         o1.created_at ASC 
2026-08-24 17:09:39.485 |     LIMIT
2026-08-24 17:09:39.485 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:40.412 | 2026-08-24 09:09:40 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:09:40.413 | 2026-08-24 09:09:40 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:09:40.413 | 2026-08-24 09:09:40 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 65d15691-580c-40ef-886d-9943df0e55a6] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:09:40.419 | 2026-08-24 09:09:40 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 65d15691-580c-40ef-886d-9943df0e55a6] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:09:44.068 | 2026-08-24 09:09:44 [MessageBroker-12] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:44.069 |     SELECT
2026-08-24 17:09:44.069 |         * 
2026-08-24 17:09:44.069 |     FROM
2026-08-24 17:09:44.069 |         payment_event_outbox 
2026-08-24 17:09:44.069 |     WHERE
2026-08-24 17:09:44.069 |         status = 'DELIVERING'   
2026-08-24 17:09:44.069 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:44.069 | Hibernate: 
2026-08-24 17:09:44.069 |     SELECT
2026-08-24 17:09:44.069 |         * 
2026-08-24 17:09:44.069 |     FROM
2026-08-24 17:09:44.069 |         payment_event_outbox 
2026-08-24 17:09:44.069 |     WHERE
2026-08-24 17:09:44.069 |         status = 'DELIVERING'   
2026-08-24 17:09:44.069 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:44.082 | 2026-08-24 09:09:44 [MessageBroker-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:44.082 |     select
2026-08-24 17:09:44.082 |         icl1_0.id,
2026-08-24 17:09:44.082 |         icl1_0.attempt_count,
2026-08-24 17:09:44.082 |         icl1_0.callback_url,
2026-08-24 17:09:44.082 |         icl1_0.created_at,
2026-08-24 17:09:44.082 |         icl1_0.next_retry_at,
2026-08-24 17:09:44.082 |         icl1_0.payload,
2026-08-24 17:09:44.082 |         icl1_0.payment_session_id,
2026-08-24 17:09:44.082 |         icl1_0.response_body,
2026-08-24 17:09:44.082 |         icl1_0.response_code,
2026-08-24 17:09:44.082 |         icl1_0.status,
2026-08-24 17:09:44.082 |         icl1_0.updated_at 
2026-08-24 17:09:44.082 |     from
2026-08-24 17:09:44.082 |         institution_callback_log icl1_0 
2026-08-24 17:09:44.082 |     where
2026-08-24 17:09:44.082 |         icl1_0.status=? 
2026-08-24 17:09:44.082 |         and icl1_0.next_retry_at<?
2026-08-24 17:09:44.082 | Hibernate: 
2026-08-24 17:09:44.082 |     select
2026-08-24 17:09:44.082 |         icl1_0.id,
2026-08-24 17:09:44.082 |         icl1_0.attempt_count,
2026-08-24 17:09:44.082 |         icl1_0.callback_url,
2026-08-24 17:09:44.082 |         icl1_0.created_at,
2026-08-24 17:09:44.082 |         icl1_0.next_retry_at,
2026-08-24 17:09:44.082 |         icl1_0.payload,
2026-08-24 17:09:44.082 |         icl1_0.payment_session_id,
2026-08-24 17:09:44.082 |         icl1_0.response_body,
2026-08-24 17:09:44.082 |         icl1_0.response_code,
2026-08-24 17:09:44.082 |         icl1_0.status,
2026-08-24 17:09:44.082 |         icl1_0.updated_at 
2026-08-24 17:09:44.082 |     from
2026-08-24 17:09:44.082 |         institution_callback_log icl1_0 
2026-08-24 17:09:44.082 |     where
2026-08-24 17:09:44.082 |         icl1_0.status=? 
2026-08-24 17:09:44.082 |         and icl1_0.next_retry_at<?
2026-08-24 17:09:44.488 | 2026-08-24 09:09:44 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:44.488 |     SELECT
2026-08-24 17:09:44.488 |         o1.* 
2026-08-24 17:09:44.488 |     FROM
2026-08-24 17:09:44.488 |         payment_event_outbox o1 
2026-08-24 17:09:44.488 |     WHERE
2026-08-24 17:09:44.488 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:44.488 |         AND (
2026-08-24 17:09:44.488 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:44.488 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:44.488 |         )   
2026-08-24 17:09:44.488 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:44.488 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:44.488 |             1 
2026-08-24 17:09:44.488 |         FROM
2026-08-24 17:09:44.488 |             payment_event_outbox o2       
2026-08-24 17:09:44.488 |         WHERE
2026-08-24 17:09:44.488 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:44.488 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:44.488 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:44.488 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:44.488 |     ORDER BY
2026-08-24 17:09:44.488 |         o1.created_at ASC 
2026-08-24 17:09:44.488 |     LIMIT
2026-08-24 17:09:44.488 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:44.488 | Hibernate: 
2026-08-24 17:09:44.488 |     SELECT
2026-08-24 17:09:44.488 |         o1.* 
2026-08-24 17:09:44.488 |     FROM
2026-08-24 17:09:44.488 |         payment_event_outbox o1 
2026-08-24 17:09:44.488 |     WHERE
2026-08-24 17:09:44.488 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:44.488 |         AND (
2026-08-24 17:09:44.488 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:44.488 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:44.488 |         )   
2026-08-24 17:09:44.488 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:44.488 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:44.488 |             1 
2026-08-24 17:09:44.488 |         FROM
2026-08-24 17:09:44.488 |             payment_event_outbox o2       
2026-08-24 17:09:44.488 |         WHERE
2026-08-24 17:09:44.488 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:44.488 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:44.488 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:44.488 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:44.488 |     ORDER BY
2026-08-24 17:09:44.488 |         o1.created_at ASC 
2026-08-24 17:09:44.488 |     LIMIT
2026-08-24 17:09:44.488 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:49.494 | 2026-08-24 09:09:49 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:49.494 |     SELECT
2026-08-24 17:09:49.494 |         o1.* 
2026-08-24 17:09:49.494 |     FROM
2026-08-24 17:09:49.494 |         payment_event_outbox o1 
2026-08-24 17:09:49.494 |     WHERE
2026-08-24 17:09:49.494 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:49.494 |         AND (
2026-08-24 17:09:49.494 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:49.494 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:49.494 |         )   
2026-08-24 17:09:49.494 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:49.494 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:49.494 |             1 
2026-08-24 17:09:49.494 |         FROM
2026-08-24 17:09:49.494 |             payment_event_outbox o2       
2026-08-24 17:09:49.494 |         WHERE
2026-08-24 17:09:49.494 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:49.494 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:49.494 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:49.494 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:49.494 |     ORDER BY
2026-08-24 17:09:49.494 |         o1.created_at ASC 
2026-08-24 17:09:49.494 |     LIMIT
2026-08-24 17:09:49.494 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:49.494 | Hibernate: 
2026-08-24 17:09:49.494 |     SELECT
2026-08-24 17:09:49.494 |         o1.* 
2026-08-24 17:09:49.494 |     FROM
2026-08-24 17:09:49.494 |         payment_event_outbox o1 
2026-08-24 17:09:49.494 |     WHERE
2026-08-24 17:09:49.494 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:49.494 |         AND (
2026-08-24 17:09:49.494 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:49.494 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:49.494 |         )   
2026-08-24 17:09:49.494 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:49.494 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:49.494 |             1 
2026-08-24 17:09:49.494 |         FROM
2026-08-24 17:09:49.494 |             payment_event_outbox o2       
2026-08-24 17:09:49.494 |         WHERE
2026-08-24 17:09:49.494 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:49.494 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:49.494 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:49.494 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:49.494 |     ORDER BY
2026-08-24 17:09:49.494 |         o1.created_at ASC 
2026-08-24 17:09:49.494 |     LIMIT
2026-08-24 17:09:49.494 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:50.523 | 2026-08-24 09:09:50 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:09:50.524 | 2026-08-24 09:09:50 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:09:50.524 | 2026-08-24 09:09:50 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: ced81ef6-290c-4add-8702-e20426ea4f4e] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:09:50.529 | 2026-08-24 09:09:50 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ced81ef6-290c-4add-8702-e20426ea4f4e] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:09:54.499 | 2026-08-24 09:09:54 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:54.499 |     SELECT
2026-08-24 17:09:54.499 |         o1.* 
2026-08-24 17:09:54.499 |     FROM
2026-08-24 17:09:54.499 |         payment_event_outbox o1 
2026-08-24 17:09:54.499 |     WHERE
2026-08-24 17:09:54.499 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:54.499 |         AND (
2026-08-24 17:09:54.499 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:54.499 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:54.499 |         )   
2026-08-24 17:09:54.499 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:54.499 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:54.499 |             1 
2026-08-24 17:09:54.499 |         FROM
2026-08-24 17:09:54.499 |             payment_event_outbox o2       
2026-08-24 17:09:54.499 |         WHERE
2026-08-24 17:09:54.499 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:54.499 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:54.499 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:54.499 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:54.499 |     ORDER BY
2026-08-24 17:09:54.499 |         o1.created_at ASC 
2026-08-24 17:09:54.499 |     LIMIT
2026-08-24 17:09:54.499 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:54.499 | Hibernate: 
2026-08-24 17:09:54.499 |     SELECT
2026-08-24 17:09:54.499 |         o1.* 
2026-08-24 17:09:54.499 |     FROM
2026-08-24 17:09:54.499 |         payment_event_outbox o1 
2026-08-24 17:09:54.499 |     WHERE
2026-08-24 17:09:54.499 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:54.499 |         AND (
2026-08-24 17:09:54.499 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:54.499 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:54.499 |         )   
2026-08-24 17:09:54.499 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:54.499 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:54.499 |             1 
2026-08-24 17:09:54.499 |         FROM
2026-08-24 17:09:54.499 |             payment_event_outbox o2       
2026-08-24 17:09:54.499 |         WHERE
2026-08-24 17:09:54.499 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:54.499 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:54.499 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:54.499 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:54.499 |     ORDER BY
2026-08-24 17:09:54.500 |         o1.created_at ASC 
2026-08-24 17:09:54.500 |     LIMIT
2026-08-24 17:09:54.500 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:55.828 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:09:55.835 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: 5665a8b5-ece7-491d-86bd-f27c5d4f123c] - 
2026-08-24 17:09:55.836 |     select
2026-08-24 17:09:55.836 |         c1_0.id,
2026-08-24 17:09:55.836 |         c1_0.created_at,
2026-08-24 17:09:55.836 |         c1_0.email,
2026-08-24 17:09:55.836 |         c1_0.employment_status,
2026-08-24 17:09:55.836 |         c1_0.first_name,
2026-08-24 17:09:55.836 |         c1_0.job_title,
2026-08-24 17:09:55.836 |         c1_0.kyc_status,
2026-08-24 17:09:55.836 |         c1_0.last_name,
2026-08-24 17:09:55.836 |         c1_0.locked,
2026-08-24 17:09:55.836 |         c1_0.monthly_income,
2026-08-24 17:09:55.836 |         c1_0.password,
2026-08-24 17:09:55.836 |         c1_0.risk_profile,
2026-08-24 17:09:55.836 |         c1_0.role,
2026-08-24 17:09:55.836 |         c1_0.source_of_funds 
2026-08-24 17:09:55.836 |     from
2026-08-24 17:09:55.836 |         customers c1_0 
2026-08-24 17:09:55.836 |     where
2026-08-24 17:09:55.836 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:55.836 | Hibernate: 
2026-08-24 17:09:55.836 |     select
2026-08-24 17:09:55.836 |         c1_0.id,
2026-08-24 17:09:55.836 |         c1_0.created_at,
2026-08-24 17:09:55.836 |         c1_0.email,
2026-08-24 17:09:55.836 |         c1_0.employment_status,
2026-08-24 17:09:55.836 |         c1_0.first_name,
2026-08-24 17:09:55.836 |         c1_0.job_title,
2026-08-24 17:09:55.836 |         c1_0.kyc_status,
2026-08-24 17:09:55.836 |         c1_0.last_name,
2026-08-24 17:09:55.836 |         c1_0.locked,
2026-08-24 17:09:55.836 |         c1_0.monthly_income,
2026-08-24 17:09:55.836 |         c1_0.password,
2026-08-24 17:09:55.836 |         c1_0.risk_profile,
2026-08-24 17:09:55.836 |         c1_0.role,
2026-08-24 17:09:55.836 |         c1_0.source_of_funds 
2026-08-24 17:09:55.836 |     from
2026-08-24 17:09:55.836 |         customers c1_0 
2026-08-24 17:09:55.836 |     where
2026-08-24 17:09:55.836 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:55.844 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 5665a8b5-ece7-491d-86bd-f27c5d4f123c] - Secured GET /api/v1/accounts
2026-08-24 17:09:55.848 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: 5665a8b5-ece7-491d-86bd-f27c5d4f123c] - 
2026-08-24 17:09:55.848 |     select
2026-08-24 17:09:55.848 |         c1_0.id,
2026-08-24 17:09:55.848 |         c1_0.created_at,
2026-08-24 17:09:55.848 |         c1_0.email,
2026-08-24 17:09:55.848 |         c1_0.employment_status,
2026-08-24 17:09:55.848 |         c1_0.first_name,
2026-08-24 17:09:55.848 |         c1_0.job_title,
2026-08-24 17:09:55.848 |         c1_0.kyc_status,
2026-08-24 17:09:55.848 |         c1_0.last_name,
2026-08-24 17:09:55.848 |         c1_0.locked,
2026-08-24 17:09:55.848 |         c1_0.monthly_income,
2026-08-24 17:09:55.848 |         c1_0.password,
2026-08-24 17:09:55.848 |         c1_0.risk_profile,
2026-08-24 17:09:55.848 |         c1_0.role,
2026-08-24 17:09:55.848 |         c1_0.source_of_funds 
2026-08-24 17:09:55.848 |     from
2026-08-24 17:09:55.848 |         customers c1_0 
2026-08-24 17:09:55.848 |     where
2026-08-24 17:09:55.848 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:55.848 | Hibernate: 
2026-08-24 17:09:55.848 |     select
2026-08-24 17:09:55.848 |         c1_0.id,
2026-08-24 17:09:55.848 |         c1_0.created_at,
2026-08-24 17:09:55.848 |         c1_0.email,
2026-08-24 17:09:55.848 |         c1_0.employment_status,
2026-08-24 17:09:55.848 |         c1_0.first_name,
2026-08-24 17:09:55.848 |         c1_0.job_title,
2026-08-24 17:09:55.848 |         c1_0.kyc_status,
2026-08-24 17:09:55.848 |         c1_0.last_name,
2026-08-24 17:09:55.848 |         c1_0.locked,
2026-08-24 17:09:55.848 |         c1_0.monthly_income,
2026-08-24 17:09:55.848 |         c1_0.password,
2026-08-24 17:09:55.848 |         c1_0.risk_profile,
2026-08-24 17:09:55.848 |         c1_0.role,
2026-08-24 17:09:55.848 |         c1_0.source_of_funds 
2026-08-24 17:09:55.848 |     from
2026-08-24 17:09:55.848 |         customers c1_0 
2026-08-24 17:09:55.848 |     where
2026-08-24 17:09:55.848 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:55.855 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: 5665a8b5-ece7-491d-86bd-f27c5d4f123c] - 
2026-08-24 17:09:55.855 |     select
2026-08-24 17:09:55.855 |         a1_0.id,
2026-08-24 17:09:55.855 |         a1_0.account_name,
2026-08-24 17:09:55.855 |         a1_0.account_number,
2026-08-24 17:09:55.855 |         a1_0.account_type,
2026-08-24 17:09:55.855 |         a1_0.allow_incoming,
2026-08-24 17:09:55.855 |         a1_0.allow_outgoing,
2026-08-24 17:09:55.855 |         a1_0.balance,
2026-08-24 17:09:55.855 |         a1_0.card_cvv,
2026-08-24 17:09:55.855 |         a1_0.card_expiry,
2026-08-24 17:09:55.855 |         a1_0.created_at,
2026-08-24 17:09:55.855 |         a1_0.currency,
2026-08-24 17:09:55.855 |         a1_0.customer_id,
2026-08-24 17:09:55.855 |         a1_0.daily_limit,
2026-08-24 17:09:55.855 |         a1_0.frozen,
2026-08-24 17:09:55.855 |         a1_0.monthly_limit,
2026-08-24 17:09:55.855 |         a1_0.parent_account_id,
2026-08-24 17:09:55.855 |         a1_0.require_dual_approval,
2026-08-24 17:09:55.855 |         a1_0.status,
2026-08-24 17:09:55.855 |         a1_0.swift_code,
2026-08-24 17:09:55.855 |         a1_0.updated_at,
2026-08-24 17:09:55.855 |         a1_0.version 
2026-08-24 17:09:55.855 |     from
2026-08-24 17:09:55.855 |         accounts a1_0 
2026-08-24 17:09:55.855 |     where
2026-08-24 17:09:55.855 |         a1_0.customer_id=?
2026-08-24 17:09:55.855 | Hibernate: 
2026-08-24 17:09:55.855 |     select
2026-08-24 17:09:55.855 |         a1_0.id,
2026-08-24 17:09:55.855 |         a1_0.account_name,
2026-08-24 17:09:55.855 |         a1_0.account_number,
2026-08-24 17:09:55.855 |         a1_0.account_type,
2026-08-24 17:09:55.855 |         a1_0.allow_incoming,
2026-08-24 17:09:55.855 |         a1_0.allow_outgoing,
2026-08-24 17:09:55.855 |         a1_0.balance,
2026-08-24 17:09:55.855 |         a1_0.card_cvv,
2026-08-24 17:09:55.855 |         a1_0.card_expiry,
2026-08-24 17:09:55.855 |         a1_0.created_at,
2026-08-24 17:09:55.855 |         a1_0.currency,
2026-08-24 17:09:55.855 |         a1_0.customer_id,
2026-08-24 17:09:55.855 |         a1_0.daily_limit,
2026-08-24 17:09:55.855 |         a1_0.frozen,
2026-08-24 17:09:55.855 |         a1_0.monthly_limit,
2026-08-24 17:09:55.855 |         a1_0.parent_account_id,
2026-08-24 17:09:55.855 |         a1_0.require_dual_approval,
2026-08-24 17:09:55.855 |         a1_0.status,
2026-08-24 17:09:55.855 |         a1_0.swift_code,
2026-08-24 17:09:55.855 |         a1_0.updated_at,
2026-08-24 17:09:55.855 |         a1_0.version 
2026-08-24 17:09:55.855 |     from
2026-08-24 17:09:55.855 |         accounts a1_0 
2026-08-24 17:09:55.855 |     where
2026-08-24 17:09:55.855 |         a1_0.customer_id=?
2026-08-24 17:09:55.861 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 5665a8b5-ece7-491d-86bd-f27c5d4f123c] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 17ms
2026-08-24 17:09:55.865 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:55.865 |     insert 
2026-08-24 17:09:55.865 |     into
2026-08-24 17:09:55.865 |         api_audit_events
2026-08-24 17:09:55.865 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:55.865 |     values
2026-08-24 17:09:55.865 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:55.865 | Hibernate: 
2026-08-24 17:09:55.865 |     insert 
2026-08-24 17:09:55.865 |     into
2026-08-24 17:09:55.865 |         api_audit_events
2026-08-24 17:09:55.865 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:55.865 |     values
2026-08-24 17:09:55.865 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:55.875 | 2026-08-24 09:09:55 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=35ms
2026-08-24 17:09:56.091 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:09:56.099 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: b3010c5d-a192-405e-98dc-3818fed3fc9d] - 
2026-08-24 17:09:56.099 |     select
2026-08-24 17:09:56.099 |         c1_0.id,
2026-08-24 17:09:56.099 |         c1_0.created_at,
2026-08-24 17:09:56.099 |         c1_0.email,
2026-08-24 17:09:56.099 |         c1_0.employment_status,
2026-08-24 17:09:56.099 |         c1_0.first_name,
2026-08-24 17:09:56.099 |         c1_0.job_title,
2026-08-24 17:09:56.099 |         c1_0.kyc_status,
2026-08-24 17:09:56.099 |         c1_0.last_name,
2026-08-24 17:09:56.099 |         c1_0.locked,
2026-08-24 17:09:56.099 |         c1_0.monthly_income,
2026-08-24 17:09:56.099 |         c1_0.password,
2026-08-24 17:09:56.099 |         c1_0.risk_profile,
2026-08-24 17:09:56.099 |         c1_0.role,
2026-08-24 17:09:56.099 |         c1_0.source_of_funds 
2026-08-24 17:09:56.099 |     from
2026-08-24 17:09:56.099 |         customers c1_0 
2026-08-24 17:09:56.099 |     where
2026-08-24 17:09:56.099 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:56.099 | Hibernate: 
2026-08-24 17:09:56.099 |     select
2026-08-24 17:09:56.099 |         c1_0.id,
2026-08-24 17:09:56.099 |         c1_0.created_at,
2026-08-24 17:09:56.099 |         c1_0.email,
2026-08-24 17:09:56.099 |         c1_0.employment_status,
2026-08-24 17:09:56.099 |         c1_0.first_name,
2026-08-24 17:09:56.099 |         c1_0.job_title,
2026-08-24 17:09:56.099 |         c1_0.kyc_status,
2026-08-24 17:09:56.099 |         c1_0.last_name,
2026-08-24 17:09:56.099 |         c1_0.locked,
2026-08-24 17:09:56.099 |         c1_0.monthly_income,
2026-08-24 17:09:56.099 |         c1_0.password,
2026-08-24 17:09:56.099 |         c1_0.risk_profile,
2026-08-24 17:09:56.099 |         c1_0.role,
2026-08-24 17:09:56.099 |         c1_0.source_of_funds 
2026-08-24 17:09:56.099 |     from
2026-08-24 17:09:56.099 |         customers c1_0 
2026-08-24 17:09:56.099 |     where
2026-08-24 17:09:56.099 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:56.108 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: b3010c5d-a192-405e-98dc-3818fed3fc9d] - Secured GET /api/v1/accounts
2026-08-24 17:09:56.111 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: b3010c5d-a192-405e-98dc-3818fed3fc9d] - 
2026-08-24 17:09:56.111 |     select
2026-08-24 17:09:56.111 |         c1_0.id,
2026-08-24 17:09:56.111 |         c1_0.created_at,
2026-08-24 17:09:56.111 |         c1_0.email,
2026-08-24 17:09:56.111 |         c1_0.employment_status,
2026-08-24 17:09:56.111 |         c1_0.first_name,
2026-08-24 17:09:56.111 |         c1_0.job_title,
2026-08-24 17:09:56.111 |         c1_0.kyc_status,
2026-08-24 17:09:56.111 |         c1_0.last_name,
2026-08-24 17:09:56.111 |         c1_0.locked,
2026-08-24 17:09:56.111 |         c1_0.monthly_income,
2026-08-24 17:09:56.111 |         c1_0.password,
2026-08-24 17:09:56.111 |         c1_0.risk_profile,
2026-08-24 17:09:56.111 |         c1_0.role,
2026-08-24 17:09:56.111 |         c1_0.source_of_funds 
2026-08-24 17:09:56.111 |     from
2026-08-24 17:09:56.111 |         customers c1_0 
2026-08-24 17:09:56.111 |     where
2026-08-24 17:09:56.111 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:56.111 | Hibernate: 
2026-08-24 17:09:56.111 |     select
2026-08-24 17:09:56.111 |         c1_0.id,
2026-08-24 17:09:56.111 |         c1_0.created_at,
2026-08-24 17:09:56.111 |         c1_0.email,
2026-08-24 17:09:56.111 |         c1_0.employment_status,
2026-08-24 17:09:56.111 |         c1_0.first_name,
2026-08-24 17:09:56.111 |         c1_0.job_title,
2026-08-24 17:09:56.111 |         c1_0.kyc_status,
2026-08-24 17:09:56.111 |         c1_0.last_name,
2026-08-24 17:09:56.111 |         c1_0.locked,
2026-08-24 17:09:56.111 |         c1_0.monthly_income,
2026-08-24 17:09:56.111 |         c1_0.password,
2026-08-24 17:09:56.111 |         c1_0.risk_profile,
2026-08-24 17:09:56.111 |         c1_0.role,
2026-08-24 17:09:56.111 |         c1_0.source_of_funds 
2026-08-24 17:09:56.111 |     from
2026-08-24 17:09:56.111 |         customers c1_0 
2026-08-24 17:09:56.111 |     where
2026-08-24 17:09:56.111 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:56.116 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: b3010c5d-a192-405e-98dc-3818fed3fc9d] - 
2026-08-24 17:09:56.116 |     select
2026-08-24 17:09:56.116 |         a1_0.id,
2026-08-24 17:09:56.116 |         a1_0.account_name,
2026-08-24 17:09:56.116 |         a1_0.account_number,
2026-08-24 17:09:56.116 |         a1_0.account_type,
2026-08-24 17:09:56.116 |         a1_0.allow_incoming,
2026-08-24 17:09:56.116 |         a1_0.allow_outgoing,
2026-08-24 17:09:56.116 |         a1_0.balance,
2026-08-24 17:09:56.116 |         a1_0.card_cvv,
2026-08-24 17:09:56.116 |         a1_0.card_expiry,
2026-08-24 17:09:56.116 |         a1_0.created_at,
2026-08-24 17:09:56.116 |         a1_0.currency,
2026-08-24 17:09:56.116 |         a1_0.customer_id,
2026-08-24 17:09:56.116 |         a1_0.daily_limit,
2026-08-24 17:09:56.116 |         a1_0.frozen,
2026-08-24 17:09:56.116 |         a1_0.monthly_limit,
2026-08-24 17:09:56.116 |         a1_0.parent_account_id,
2026-08-24 17:09:56.116 |         a1_0.require_dual_approval,
2026-08-24 17:09:56.116 |         a1_0.status,
2026-08-24 17:09:56.116 |         a1_0.swift_code,
2026-08-24 17:09:56.116 |         a1_0.updated_at,
2026-08-24 17:09:56.116 |         a1_0.version 
2026-08-24 17:09:56.116 |     from
2026-08-24 17:09:56.116 |         accounts a1_0 
2026-08-24 17:09:56.116 |     where
2026-08-24 17:09:56.116 |         a1_0.customer_id=?
2026-08-24 17:09:56.116 | Hibernate: 
2026-08-24 17:09:56.116 |     select
2026-08-24 17:09:56.116 |         a1_0.id,
2026-08-24 17:09:56.116 |         a1_0.account_name,
2026-08-24 17:09:56.116 |         a1_0.account_number,
2026-08-24 17:09:56.116 |         a1_0.account_type,
2026-08-24 17:09:56.116 |         a1_0.allow_incoming,
2026-08-24 17:09:56.116 |         a1_0.allow_outgoing,
2026-08-24 17:09:56.116 |         a1_0.balance,
2026-08-24 17:09:56.116 |         a1_0.card_cvv,
2026-08-24 17:09:56.116 |         a1_0.card_expiry,
2026-08-24 17:09:56.116 |         a1_0.created_at,
2026-08-24 17:09:56.116 |         a1_0.currency,
2026-08-24 17:09:56.116 |         a1_0.customer_id,
2026-08-24 17:09:56.116 |         a1_0.daily_limit,
2026-08-24 17:09:56.116 |         a1_0.frozen,
2026-08-24 17:09:56.116 |         a1_0.monthly_limit,
2026-08-24 17:09:56.116 |         a1_0.parent_account_id,
2026-08-24 17:09:56.116 |         a1_0.require_dual_approval,
2026-08-24 17:09:56.116 |         a1_0.status,
2026-08-24 17:09:56.116 |         a1_0.swift_code,
2026-08-24 17:09:56.116 |         a1_0.updated_at,
2026-08-24 17:09:56.116 |         a1_0.version 
2026-08-24 17:09:56.116 |     from
2026-08-24 17:09:56.116 |         accounts a1_0 
2026-08-24 17:09:56.116 |     where
2026-08-24 17:09:56.116 |         a1_0.customer_id=?
2026-08-24 17:09:56.123 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b3010c5d-a192-405e-98dc-3818fed3fc9d] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 14ms
2026-08-24 17:09:56.126 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:56.126 |     insert 
2026-08-24 17:09:56.126 |     into
2026-08-24 17:09:56.126 |         api_audit_events
2026-08-24 17:09:56.126 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:56.126 |     values
2026-08-24 17:09:56.126 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:56.126 | Hibernate: 
2026-08-24 17:09:56.126 |     insert 
2026-08-24 17:09:56.126 |     into
2026-08-24 17:09:56.126 |         api_audit_events
2026-08-24 17:09:56.126 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:56.126 |     values
2026-08-24 17:09:56.126 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:56.146 | 2026-08-24 09:09:56 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=33ms
2026-08-24 17:09:57.430 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:09:57.439 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 42e6383e-2f00-44cb-b813-b3043fd80185] - 
2026-08-24 17:09:57.439 |     select
2026-08-24 17:09:57.439 |         c1_0.id,
2026-08-24 17:09:57.439 |         c1_0.created_at,
2026-08-24 17:09:57.439 |         c1_0.email,
2026-08-24 17:09:57.439 |         c1_0.employment_status,
2026-08-24 17:09:57.439 |         c1_0.first_name,
2026-08-24 17:09:57.439 |         c1_0.job_title,
2026-08-24 17:09:57.439 |         c1_0.kyc_status,
2026-08-24 17:09:57.439 |         c1_0.last_name,
2026-08-24 17:09:57.439 |         c1_0.locked,
2026-08-24 17:09:57.439 |         c1_0.monthly_income,
2026-08-24 17:09:57.439 |         c1_0.password,
2026-08-24 17:09:57.439 |         c1_0.risk_profile,
2026-08-24 17:09:57.439 |         c1_0.role,
2026-08-24 17:09:57.439 |         c1_0.source_of_funds 
2026-08-24 17:09:57.439 |     from
2026-08-24 17:09:57.439 |         customers c1_0 
2026-08-24 17:09:57.439 |     where
2026-08-24 17:09:57.439 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:57.439 | Hibernate: 
2026-08-24 17:09:57.439 |     select
2026-08-24 17:09:57.439 |         c1_0.id,
2026-08-24 17:09:57.439 |         c1_0.created_at,
2026-08-24 17:09:57.439 |         c1_0.email,
2026-08-24 17:09:57.439 |         c1_0.employment_status,
2026-08-24 17:09:57.439 |         c1_0.first_name,
2026-08-24 17:09:57.439 |         c1_0.job_title,
2026-08-24 17:09:57.439 |         c1_0.kyc_status,
2026-08-24 17:09:57.439 |         c1_0.last_name,
2026-08-24 17:09:57.439 |         c1_0.locked,
2026-08-24 17:09:57.439 |         c1_0.monthly_income,
2026-08-24 17:09:57.439 |         c1_0.password,
2026-08-24 17:09:57.439 |         c1_0.risk_profile,
2026-08-24 17:09:57.439 |         c1_0.role,
2026-08-24 17:09:57.439 |         c1_0.source_of_funds 
2026-08-24 17:09:57.439 |     from
2026-08-24 17:09:57.439 |         customers c1_0 
2026-08-24 17:09:57.439 |     where
2026-08-24 17:09:57.439 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:57.449 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 42e6383e-2f00-44cb-b813-b3043fd80185] - Secured GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:09:57.475 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 42e6383e-2f00-44cb-b813-b3043fd80185] - 
2026-08-24 17:09:57.475 |     select
2026-08-24 17:09:57.475 |         t1_0.id,
2026-08-24 17:09:57.475 |         t1_0.amount,
2026-08-24 17:09:57.475 |         t1_0.created_at,
2026-08-24 17:09:57.475 |         t1_0.currency,
2026-08-24 17:09:57.475 |         t1_0.description,
2026-08-24 17:09:57.475 |         t1_0.destination_account_number,
2026-08-24 17:09:57.475 |         t1_0.dispute_reason,
2026-08-24 17:09:57.476 |         t1_0.idempotency_key,
2026-08-24 17:09:57.476 |         t1_0.is_disputed,
2026-08-24 17:09:57.476 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:09:57.476 |         t1_0.settlement_batch_id,
2026-08-24 17:09:57.476 |         t1_0.source_account_number,
2026-08-24 17:09:57.476 |         t1_0.status,
2026-08-24 17:09:57.476 |         t1_0.transaction_reference,
2026-08-24 17:09:57.476 |         t1_0.version 
2026-08-24 17:09:57.476 |     from
2026-08-24 17:09:57.476 |         transactions t1_0 
2026-08-24 17:09:57.476 |     where
2026-08-24 17:09:57.476 |         t1_0.source_account_number=? 
2026-08-24 17:09:57.476 |         or t1_0.destination_account_number=? 
2026-08-24 17:09:57.476 |     order by
2026-08-24 17:09:57.476 |         t1_0.created_at desc 
2026-08-24 17:09:57.476 |     fetch
2026-08-24 17:09:57.476 |         first ? rows only
2026-08-24 17:09:57.476 | Hibernate: 
2026-08-24 17:09:57.476 |     select
2026-08-24 17:09:57.476 |         t1_0.id,
2026-08-24 17:09:57.476 |         t1_0.amount,
2026-08-24 17:09:57.476 |         t1_0.created_at,
2026-08-24 17:09:57.476 |         t1_0.currency,
2026-08-24 17:09:57.476 |         t1_0.description,
2026-08-24 17:09:57.476 |         t1_0.destination_account_number,
2026-08-24 17:09:57.476 |         t1_0.dispute_reason,
2026-08-24 17:09:57.476 |         t1_0.idempotency_key,
2026-08-24 17:09:57.476 |         t1_0.is_disputed,
2026-08-24 17:09:57.476 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:09:57.476 |         t1_0.settlement_batch_id,
2026-08-24 17:09:57.476 |         t1_0.source_account_number,
2026-08-24 17:09:57.476 |         t1_0.status,
2026-08-24 17:09:57.476 |         t1_0.transaction_reference,
2026-08-24 17:09:57.476 |         t1_0.version 
2026-08-24 17:09:57.476 |     from
2026-08-24 17:09:57.476 |         transactions t1_0 
2026-08-24 17:09:57.476 |     where
2026-08-24 17:09:57.476 |         t1_0.source_account_number=? 
2026-08-24 17:09:57.476 |         or t1_0.destination_account_number=? 
2026-08-24 17:09:57.476 |     order by
2026-08-24 17:09:57.476 |         t1_0.created_at desc 
2026-08-24 17:09:57.476 |     fetch
2026-08-24 17:09:57.476 |         first ? rows only
2026-08-24 17:09:57.537 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 42e6383e-2f00-44cb-b813-b3043fd80185] - [HTTP LOG] GET /api/v1/transactions/history/4859228705057459 - Status: 200 - Duration: 86ms
2026-08-24 17:09:57.540 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:57.540 |     insert 
2026-08-24 17:09:57.540 |     into
2026-08-24 17:09:57.541 |         api_audit_events
2026-08-24 17:09:57.541 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:57.541 |     values
2026-08-24 17:09:57.541 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:57.541 | Hibernate: 
2026-08-24 17:09:57.541 |     insert 
2026-08-24 17:09:57.541 |     into
2026-08-24 17:09:57.541 |         api_audit_events
2026-08-24 17:09:57.541 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:57.541 |     values
2026-08-24 17:09:57.541 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:57.554 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/transactions/history/4859228705057459 → 200 | stage=COMPLETED | keyId=null | acct=null | latency=110ms
2026-08-24 17:09:57.894 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:09:57.899 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 831f1030-34d8-431d-9287-106791bca0ed] - 
2026-08-24 17:09:57.899 |     select
2026-08-24 17:09:57.899 |         c1_0.id,
2026-08-24 17:09:57.899 |         c1_0.created_at,
2026-08-24 17:09:57.899 |         c1_0.email,
2026-08-24 17:09:57.899 |         c1_0.employment_status,
2026-08-24 17:09:57.899 |         c1_0.first_name,
2026-08-24 17:09:57.899 |         c1_0.job_title,
2026-08-24 17:09:57.899 |         c1_0.kyc_status,
2026-08-24 17:09:57.899 |         c1_0.last_name,
2026-08-24 17:09:57.899 |         c1_0.locked,
2026-08-24 17:09:57.899 |         c1_0.monthly_income,
2026-08-24 17:09:57.899 |         c1_0.password,
2026-08-24 17:09:57.899 |         c1_0.risk_profile,
2026-08-24 17:09:57.899 |         c1_0.role,
2026-08-24 17:09:57.899 |         c1_0.source_of_funds 
2026-08-24 17:09:57.899 |     from
2026-08-24 17:09:57.899 |         customers c1_0 
2026-08-24 17:09:57.899 |     where
2026-08-24 17:09:57.899 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:57.899 | Hibernate: 
2026-08-24 17:09:57.899 |     select
2026-08-24 17:09:57.899 |         c1_0.id,
2026-08-24 17:09:57.899 |         c1_0.created_at,
2026-08-24 17:09:57.899 |         c1_0.email,
2026-08-24 17:09:57.899 |         c1_0.employment_status,
2026-08-24 17:09:57.899 |         c1_0.first_name,
2026-08-24 17:09:57.899 |         c1_0.job_title,
2026-08-24 17:09:57.899 |         c1_0.kyc_status,
2026-08-24 17:09:57.899 |         c1_0.last_name,
2026-08-24 17:09:57.899 |         c1_0.locked,
2026-08-24 17:09:57.900 |         c1_0.monthly_income,
2026-08-24 17:09:57.900 |         c1_0.password,
2026-08-24 17:09:57.900 |         c1_0.risk_profile,
2026-08-24 17:09:57.900 |         c1_0.role,
2026-08-24 17:09:57.900 |         c1_0.source_of_funds 
2026-08-24 17:09:57.900 |     from
2026-08-24 17:09:57.900 |         customers c1_0 
2026-08-24 17:09:57.900 |     where
2026-08-24 17:09:57.900 |         upper(c1_0.email)=upper(?)
2026-08-24 17:09:57.908 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 831f1030-34d8-431d-9287-106791bca0ed] - Secured GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:09:57.915 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: 831f1030-34d8-431d-9287-106791bca0ed] - 
2026-08-24 17:09:57.915 |     select
2026-08-24 17:09:57.915 |         t1_0.id,
2026-08-24 17:09:57.915 |         t1_0.amount,
2026-08-24 17:09:57.915 |         t1_0.created_at,
2026-08-24 17:09:57.915 |         t1_0.currency,
2026-08-24 17:09:57.915 |         t1_0.description,
2026-08-24 17:09:57.915 |         t1_0.destination_account_number,
2026-08-24 17:09:57.915 |         t1_0.dispute_reason,
2026-08-24 17:09:57.916 |         t1_0.idempotency_key,
2026-08-24 17:09:57.916 |         t1_0.is_disputed,
2026-08-24 17:09:57.916 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:09:57.916 |         t1_0.settlement_batch_id,
2026-08-24 17:09:57.916 |         t1_0.source_account_number,
2026-08-24 17:09:57.916 |         t1_0.status,
2026-08-24 17:09:57.916 |         t1_0.transaction_reference,
2026-08-24 17:09:57.916 |         t1_0.version 
2026-08-24 17:09:57.916 |     from
2026-08-24 17:09:57.916 |         transactions t1_0 
2026-08-24 17:09:57.916 |     where
2026-08-24 17:09:57.916 |         t1_0.source_account_number=? 
2026-08-24 17:09:57.916 |         or t1_0.destination_account_number=? 
2026-08-24 17:09:57.916 |     order by
2026-08-24 17:09:57.916 |         t1_0.created_at desc 
2026-08-24 17:09:57.916 |     fetch
2026-08-24 17:09:57.916 |         first ? rows only
2026-08-24 17:09:57.916 | Hibernate: 
2026-08-24 17:09:57.916 |     select
2026-08-24 17:09:57.916 |         t1_0.id,
2026-08-24 17:09:57.916 |         t1_0.amount,
2026-08-24 17:09:57.916 |         t1_0.created_at,
2026-08-24 17:09:57.916 |         t1_0.currency,
2026-08-24 17:09:57.916 |         t1_0.description,
2026-08-24 17:09:57.916 |         t1_0.destination_account_number,
2026-08-24 17:09:57.916 |         t1_0.dispute_reason,
2026-08-24 17:09:57.916 |         t1_0.idempotency_key,
2026-08-24 17:09:57.916 |         t1_0.is_disputed,
2026-08-24 17:09:57.916 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:09:57.916 |         t1_0.settlement_batch_id,
2026-08-24 17:09:57.916 |         t1_0.source_account_number,
2026-08-24 17:09:57.916 |         t1_0.status,
2026-08-24 17:09:57.916 |         t1_0.transaction_reference,
2026-08-24 17:09:57.916 |         t1_0.version 
2026-08-24 17:09:57.916 |     from
2026-08-24 17:09:57.916 |         transactions t1_0 
2026-08-24 17:09:57.916 |     where
2026-08-24 17:09:57.916 |         t1_0.source_account_number=? 
2026-08-24 17:09:57.916 |         or t1_0.destination_account_number=? 
2026-08-24 17:09:57.916 |     order by
2026-08-24 17:09:57.916 |         t1_0.created_at desc 
2026-08-24 17:09:57.916 |     fetch
2026-08-24 17:09:57.916 |         first ? rows only
2026-08-24 17:09:57.924 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 831f1030-34d8-431d-9287-106791bca0ed] - [HTTP LOG] GET /api/v1/transactions/history/4859228705057459 - Status: 200 - Duration: 15ms
2026-08-24 17:09:57.928 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:57.928 |     insert 
2026-08-24 17:09:57.928 |     into
2026-08-24 17:09:57.928 |         api_audit_events
2026-08-24 17:09:57.928 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:57.928 |     values
2026-08-24 17:09:57.928 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:57.928 | Hibernate: 
2026-08-24 17:09:57.928 |     insert 
2026-08-24 17:09:57.928 |     into
2026-08-24 17:09:57.928 |         api_audit_events
2026-08-24 17:09:57.928 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:09:57.928 |     values
2026-08-24 17:09:57.928 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:09:57.951 | 2026-08-24 09:09:57 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/transactions/history/4859228705057459 → 200 | stage=COMPLETED | keyId=null | acct=null | latency=32ms
2026-08-24 17:09:59.505 | 2026-08-24 09:09:59 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:09:59.505 |     SELECT
2026-08-24 17:09:59.505 |         o1.* 
2026-08-24 17:09:59.505 |     FROM
2026-08-24 17:09:59.505 |         payment_event_outbox o1 
2026-08-24 17:09:59.505 |     WHERE
2026-08-24 17:09:59.505 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:59.505 |         AND (
2026-08-24 17:09:59.505 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:59.505 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:59.505 |         )   
2026-08-24 17:09:59.505 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:59.505 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:59.505 |             1 
2026-08-24 17:09:59.505 |         FROM
2026-08-24 17:09:59.505 |             payment_event_outbox o2       
2026-08-24 17:09:59.505 |         WHERE
2026-08-24 17:09:59.505 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:59.505 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:59.505 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:59.505 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:59.505 |     ORDER BY
2026-08-24 17:09:59.505 |         o1.created_at ASC 
2026-08-24 17:09:59.505 |     LIMIT
2026-08-24 17:09:59.505 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:09:59.505 | Hibernate: 
2026-08-24 17:09:59.505 |     SELECT
2026-08-24 17:09:59.505 |         o1.* 
2026-08-24 17:09:59.505 |     FROM
2026-08-24 17:09:59.505 |         payment_event_outbox o1 
2026-08-24 17:09:59.505 |     WHERE
2026-08-24 17:09:59.505 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:09:59.505 |         AND (
2026-08-24 17:09:59.505 |             o1.next_attempt_at IS NULL 
2026-08-24 17:09:59.505 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:09:59.505 |         )   
2026-08-24 17:09:59.505 |         AND o1.locked_at IS NULL   
2026-08-24 17:09:59.505 |         AND NOT EXISTS (       SELECT
2026-08-24 17:09:59.505 |             1 
2026-08-24 17:09:59.505 |         FROM
2026-08-24 17:09:59.505 |             payment_event_outbox o2       
2026-08-24 17:09:59.505 |         WHERE
2026-08-24 17:09:59.505 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:09:59.505 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:09:59.505 |             AND o2.sequence < o1.sequence         
2026-08-24 17:09:59.505 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:09:59.505 |     ORDER BY
2026-08-24 17:09:59.505 |         o1.created_at ASC 
2026-08-24 17:09:59.505 |     LIMIT
2026-08-24 17:09:59.505 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:00.627 | 2026-08-24 09:10:00 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:10:00.629 | 2026-08-24 09:10:00 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:10:00.629 | 2026-08-24 09:10:00 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: cddd6f65-5f1d-4659-adf7-3019eb6739f7] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:10:00.637 | 2026-08-24 09:10:00 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: cddd6f65-5f1d-4659-adf7-3019eb6739f7] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:10:04.510 | 2026-08-24 09:10:04 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:04.510 |     SELECT
2026-08-24 17:10:04.510 |         o1.* 
2026-08-24 17:10:04.510 |     FROM
2026-08-24 17:10:04.510 |         payment_event_outbox o1 
2026-08-24 17:10:04.510 |     WHERE
2026-08-24 17:10:04.510 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:04.510 |         AND (
2026-08-24 17:10:04.510 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:04.510 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:04.510 |         )   
2026-08-24 17:10:04.510 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:04.510 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:04.510 |             1 
2026-08-24 17:10:04.510 |         FROM
2026-08-24 17:10:04.510 |             payment_event_outbox o2       
2026-08-24 17:10:04.510 |         WHERE
2026-08-24 17:10:04.510 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:04.510 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:04.510 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:04.510 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:04.510 |     ORDER BY
2026-08-24 17:10:04.510 |         o1.created_at ASC 
2026-08-24 17:10:04.510 |     LIMIT
2026-08-24 17:10:04.510 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:04.510 | Hibernate: 
2026-08-24 17:10:04.510 |     SELECT
2026-08-24 17:10:04.510 |         o1.* 
2026-08-24 17:10:04.510 |     FROM
2026-08-24 17:10:04.510 |         payment_event_outbox o1 
2026-08-24 17:10:04.510 |     WHERE
2026-08-24 17:10:04.510 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:04.510 |         AND (
2026-08-24 17:10:04.510 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:04.510 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:04.510 |         )   
2026-08-24 17:10:04.510 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:04.510 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:04.510 |             1 
2026-08-24 17:10:04.510 |         FROM
2026-08-24 17:10:04.510 |             payment_event_outbox o2       
2026-08-24 17:10:04.510 |         WHERE
2026-08-24 17:10:04.510 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:04.510 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:04.510 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:04.510 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:04.510 |     ORDER BY
2026-08-24 17:10:04.510 |         o1.created_at ASC 
2026-08-24 17:10:04.510 |     LIMIT
2026-08-24 17:10:04.510 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:09.515 | 2026-08-24 09:10:09 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:09.515 |     SELECT
2026-08-24 17:10:09.515 |         o1.* 
2026-08-24 17:10:09.515 |     FROM
2026-08-24 17:10:09.515 |         payment_event_outbox o1 
2026-08-24 17:10:09.515 |     WHERE
2026-08-24 17:10:09.515 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:09.515 |         AND (
2026-08-24 17:10:09.515 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:09.515 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:09.515 |         )   
2026-08-24 17:10:09.515 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:09.515 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:09.515 |             1 
2026-08-24 17:10:09.515 |         FROM
2026-08-24 17:10:09.515 |             payment_event_outbox o2       
2026-08-24 17:10:09.515 |         WHERE
2026-08-24 17:10:09.515 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:09.515 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:09.515 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:09.515 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:09.515 |     ORDER BY
2026-08-24 17:10:09.515 |         o1.created_at ASC 
2026-08-24 17:10:09.515 |     LIMIT
2026-08-24 17:10:09.515 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:09.515 | Hibernate: 
2026-08-24 17:10:09.515 |     SELECT
2026-08-24 17:10:09.515 |         o1.* 
2026-08-24 17:10:09.515 |     FROM
2026-08-24 17:10:09.515 |         payment_event_outbox o1 
2026-08-24 17:10:09.515 |     WHERE
2026-08-24 17:10:09.515 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:09.515 |         AND (
2026-08-24 17:10:09.515 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:09.515 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:09.515 |         )   
2026-08-24 17:10:09.515 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:09.515 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:09.515 |             1 
2026-08-24 17:10:09.515 |         FROM
2026-08-24 17:10:09.515 |             payment_event_outbox o2       
2026-08-24 17:10:09.515 |         WHERE
2026-08-24 17:10:09.515 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:09.515 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:09.515 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:09.515 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:09.515 |     ORDER BY
2026-08-24 17:10:09.515 |         o1.created_at ASC 
2026-08-24 17:10:09.515 |     LIMIT
2026-08-24 17:10:09.515 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:10.739 | 2026-08-24 09:10:10 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:10:10.740 | 2026-08-24 09:10:10 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:10:10.741 | 2026-08-24 09:10:10 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 803b0f14-8361-4e4a-a5ea-adf86e7bb1e8] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:10:10.749 | 2026-08-24 09:10:10 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 803b0f14-8361-4e4a-a5ea-adf86e7bb1e8] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 9ms
2026-08-24 17:10:14.519 | 2026-08-24 09:10:14 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:14.519 |     SELECT
2026-08-24 17:10:14.519 |         o1.* 
2026-08-24 17:10:14.519 |     FROM
2026-08-24 17:10:14.519 |         payment_event_outbox o1 
2026-08-24 17:10:14.519 |     WHERE
2026-08-24 17:10:14.519 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:14.519 |         AND (
2026-08-24 17:10:14.519 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:14.519 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:14.519 |         )   
2026-08-24 17:10:14.519 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:14.519 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:14.519 |             1 
2026-08-24 17:10:14.519 |         FROM
2026-08-24 17:10:14.519 |             payment_event_outbox o2       
2026-08-24 17:10:14.519 |         WHERE
2026-08-24 17:10:14.519 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:14.519 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:14.519 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:14.519 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:14.519 |     ORDER BY
2026-08-24 17:10:14.519 |         o1.created_at ASC 
2026-08-24 17:10:14.519 |     LIMIT
2026-08-24 17:10:14.519 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:14.519 | Hibernate: 
2026-08-24 17:10:14.519 |     SELECT
2026-08-24 17:10:14.519 |         o1.* 
2026-08-24 17:10:14.519 |     FROM
2026-08-24 17:10:14.519 |         payment_event_outbox o1 
2026-08-24 17:10:14.519 |     WHERE
2026-08-24 17:10:14.519 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:14.519 |         AND (
2026-08-24 17:10:14.519 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:14.519 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:14.519 |         )   
2026-08-24 17:10:14.519 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:14.519 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:14.519 |             1 
2026-08-24 17:10:14.519 |         FROM
2026-08-24 17:10:14.519 |             payment_event_outbox o2       
2026-08-24 17:10:14.519 |         WHERE
2026-08-24 17:10:14.519 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:14.519 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:14.519 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:14.519 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:14.519 |     ORDER BY
2026-08-24 17:10:14.519 |         o1.created_at ASC 
2026-08-24 17:10:14.519 |     LIMIT
2026-08-24 17:10:14.519 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:19.524 | 2026-08-24 09:10:19 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:19.524 |     SELECT
2026-08-24 17:10:19.524 |         o1.* 
2026-08-24 17:10:19.524 |     FROM
2026-08-24 17:10:19.524 |         payment_event_outbox o1 
2026-08-24 17:10:19.524 |     WHERE
2026-08-24 17:10:19.524 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:19.524 |         AND (
2026-08-24 17:10:19.524 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:19.524 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:19.524 |         )   
2026-08-24 17:10:19.524 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:19.524 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:19.524 |             1 
2026-08-24 17:10:19.524 |         FROM
2026-08-24 17:10:19.524 |             payment_event_outbox o2       
2026-08-24 17:10:19.524 |         WHERE
2026-08-24 17:10:19.524 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:19.524 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:19.524 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:19.524 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:19.524 |     ORDER BY
2026-08-24 17:10:19.524 |         o1.created_at ASC 
2026-08-24 17:10:19.524 |     LIMIT
2026-08-24 17:10:19.524 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:19.524 | Hibernate: 
2026-08-24 17:10:19.524 |     SELECT
2026-08-24 17:10:19.524 |         o1.* 
2026-08-24 17:10:19.524 |     FROM
2026-08-24 17:10:19.524 |         payment_event_outbox o1 
2026-08-24 17:10:19.524 |     WHERE
2026-08-24 17:10:19.524 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:19.524 |         AND (
2026-08-24 17:10:19.524 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:19.524 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:19.524 |         )   
2026-08-24 17:10:19.524 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:19.524 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:19.524 |             1 
2026-08-24 17:10:19.524 |         FROM
2026-08-24 17:10:19.524 |             payment_event_outbox o2       
2026-08-24 17:10:19.524 |         WHERE
2026-08-24 17:10:19.524 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:19.524 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:19.524 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:19.524 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:19.524 |     ORDER BY
2026-08-24 17:10:19.524 |         o1.created_at ASC 
2026-08-24 17:10:19.524 |     LIMIT
2026-08-24 17:10:19.524 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:20.844 | 2026-08-24 09:10:20 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:10:20.845 | 2026-08-24 09:10:20 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:10:20.845 | 2026-08-24 09:10:20 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 3b386714-8ce1-4408-b67e-19fac9a92013] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:10:20.851 | 2026-08-24 09:10:20 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 3b386714-8ce1-4408-b67e-19fac9a92013] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:10:24.530 | 2026-08-24 09:10:24 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:24.530 |     SELECT
2026-08-24 17:10:24.530 |         o1.* 
2026-08-24 17:10:24.530 |     FROM
2026-08-24 17:10:24.530 |         payment_event_outbox o1 
2026-08-24 17:10:24.530 |     WHERE
2026-08-24 17:10:24.530 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:24.530 |         AND (
2026-08-24 17:10:24.530 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:24.530 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:24.530 |         )   
2026-08-24 17:10:24.530 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:24.530 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:24.530 |             1 
2026-08-24 17:10:24.530 |         FROM
2026-08-24 17:10:24.530 |             payment_event_outbox o2       
2026-08-24 17:10:24.530 |         WHERE
2026-08-24 17:10:24.530 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:24.530 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:24.530 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:24.530 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:24.530 |     ORDER BY
2026-08-24 17:10:24.530 |         o1.created_at ASC 
2026-08-24 17:10:24.530 |     LIMIT
2026-08-24 17:10:24.530 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:24.530 | Hibernate: 
2026-08-24 17:10:24.530 |     SELECT
2026-08-24 17:10:24.530 |         o1.* 
2026-08-24 17:10:24.530 |     FROM
2026-08-24 17:10:24.530 |         payment_event_outbox o1 
2026-08-24 17:10:24.530 |     WHERE
2026-08-24 17:10:24.530 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:24.530 |         AND (
2026-08-24 17:10:24.530 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:24.530 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:24.530 |         )   
2026-08-24 17:10:24.530 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:24.530 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:24.530 |             1 
2026-08-24 17:10:24.530 |         FROM
2026-08-24 17:10:24.530 |             payment_event_outbox o2       
2026-08-24 17:10:24.530 |         WHERE
2026-08-24 17:10:24.530 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:24.530 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:24.530 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:24.530 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:24.530 |     ORDER BY
2026-08-24 17:10:24.530 |         o1.created_at ASC 
2026-08-24 17:10:24.530 |     LIMIT
2026-08-24 17:10:24.530 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:29.534 | 2026-08-24 09:10:29 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:29.535 |     SELECT
2026-08-24 17:10:29.535 |         o1.* 
2026-08-24 17:10:29.535 |     FROM
2026-08-24 17:10:29.535 |         payment_event_outbox o1 
2026-08-24 17:10:29.535 |     WHERE
2026-08-24 17:10:29.535 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:29.535 |         AND (
2026-08-24 17:10:29.535 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:29.535 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:29.535 |         )   
2026-08-24 17:10:29.535 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:29.535 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:29.535 |             1 
2026-08-24 17:10:29.535 |         FROM
2026-08-24 17:10:29.535 |             payment_event_outbox o2       
2026-08-24 17:10:29.535 |         WHERE
2026-08-24 17:10:29.535 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:29.535 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:29.535 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:29.535 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:29.535 |     ORDER BY
2026-08-24 17:10:29.535 |         o1.created_at ASC 
2026-08-24 17:10:29.535 |     LIMIT
2026-08-24 17:10:29.535 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:29.535 | Hibernate: 
2026-08-24 17:10:29.535 |     SELECT
2026-08-24 17:10:29.535 |         o1.* 
2026-08-24 17:10:29.535 |     FROM
2026-08-24 17:10:29.535 |         payment_event_outbox o1 
2026-08-24 17:10:29.535 |     WHERE
2026-08-24 17:10:29.535 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:29.535 |         AND (
2026-08-24 17:10:29.535 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:29.535 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:29.535 |         )   
2026-08-24 17:10:29.535 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:29.535 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:29.535 |             1 
2026-08-24 17:10:29.535 |         FROM
2026-08-24 17:10:29.535 |             payment_event_outbox o2       
2026-08-24 17:10:29.535 |         WHERE
2026-08-24 17:10:29.535 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:29.535 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:29.535 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:29.535 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:29.535 |     ORDER BY
2026-08-24 17:10:29.535 |         o1.created_at ASC 
2026-08-24 17:10:29.535 |     LIMIT
2026-08-24 17:10:29.535 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:29.714 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:10:29.719 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 94600ddf-67b2-4651-988a-ef1c8223cbd4] - 
2026-08-24 17:10:29.719 |     select
2026-08-24 17:10:29.719 |         c1_0.id,
2026-08-24 17:10:29.719 |         c1_0.created_at,
2026-08-24 17:10:29.719 |         c1_0.email,
2026-08-24 17:10:29.719 |         c1_0.employment_status,
2026-08-24 17:10:29.719 |         c1_0.first_name,
2026-08-24 17:10:29.719 |         c1_0.job_title,
2026-08-24 17:10:29.719 |         c1_0.kyc_status,
2026-08-24 17:10:29.719 |         c1_0.last_name,
2026-08-24 17:10:29.719 |         c1_0.locked,
2026-08-24 17:10:29.719 |         c1_0.monthly_income,
2026-08-24 17:10:29.719 |         c1_0.password,
2026-08-24 17:10:29.719 |         c1_0.risk_profile,
2026-08-24 17:10:29.719 |         c1_0.role,
2026-08-24 17:10:29.719 |         c1_0.source_of_funds 
2026-08-24 17:10:29.719 |     from
2026-08-24 17:10:29.719 |         customers c1_0 
2026-08-24 17:10:29.719 |     where
2026-08-24 17:10:29.719 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.719 | Hibernate: 
2026-08-24 17:10:29.719 |     select
2026-08-24 17:10:29.719 |         c1_0.id,
2026-08-24 17:10:29.719 |         c1_0.created_at,
2026-08-24 17:10:29.719 |         c1_0.email,
2026-08-24 17:10:29.719 |         c1_0.employment_status,
2026-08-24 17:10:29.719 |         c1_0.first_name,
2026-08-24 17:10:29.719 |         c1_0.job_title,
2026-08-24 17:10:29.719 |         c1_0.kyc_status,
2026-08-24 17:10:29.719 |         c1_0.last_name,
2026-08-24 17:10:29.719 |         c1_0.locked,
2026-08-24 17:10:29.719 |         c1_0.monthly_income,
2026-08-24 17:10:29.719 |         c1_0.password,
2026-08-24 17:10:29.719 |         c1_0.risk_profile,
2026-08-24 17:10:29.719 |         c1_0.role,
2026-08-24 17:10:29.719 |         c1_0.source_of_funds 
2026-08-24 17:10:29.719 |     from
2026-08-24 17:10:29.719 |         customers c1_0 
2026-08-24 17:10:29.719 |     where
2026-08-24 17:10:29.719 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.729 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 94600ddf-67b2-4651-988a-ef1c8223cbd4] - Secured GET /api/v1/accounts
2026-08-24 17:10:29.735 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 94600ddf-67b2-4651-988a-ef1c8223cbd4] - 
2026-08-24 17:10:29.736 |     select
2026-08-24 17:10:29.736 |         c1_0.id,
2026-08-24 17:10:29.736 |         c1_0.created_at,
2026-08-24 17:10:29.736 |         c1_0.email,
2026-08-24 17:10:29.736 |         c1_0.employment_status,
2026-08-24 17:10:29.736 |         c1_0.first_name,
2026-08-24 17:10:29.736 |         c1_0.job_title,
2026-08-24 17:10:29.736 |         c1_0.kyc_status,
2026-08-24 17:10:29.736 |         c1_0.last_name,
2026-08-24 17:10:29.736 |         c1_0.locked,
2026-08-24 17:10:29.736 |         c1_0.monthly_income,
2026-08-24 17:10:29.736 |         c1_0.password,
2026-08-24 17:10:29.736 |         c1_0.risk_profile,
2026-08-24 17:10:29.736 |         c1_0.role,
2026-08-24 17:10:29.736 |         c1_0.source_of_funds 
2026-08-24 17:10:29.736 |     from
2026-08-24 17:10:29.736 |         customers c1_0 
2026-08-24 17:10:29.736 |     where
2026-08-24 17:10:29.736 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.736 | Hibernate: 
2026-08-24 17:10:29.736 |     select
2026-08-24 17:10:29.736 |         c1_0.id,
2026-08-24 17:10:29.736 |         c1_0.created_at,
2026-08-24 17:10:29.736 |         c1_0.email,
2026-08-24 17:10:29.736 |         c1_0.employment_status,
2026-08-24 17:10:29.736 |         c1_0.first_name,
2026-08-24 17:10:29.736 |         c1_0.job_title,
2026-08-24 17:10:29.736 |         c1_0.kyc_status,
2026-08-24 17:10:29.736 |         c1_0.last_name,
2026-08-24 17:10:29.736 |         c1_0.locked,
2026-08-24 17:10:29.736 |         c1_0.monthly_income,
2026-08-24 17:10:29.736 |         c1_0.password,
2026-08-24 17:10:29.736 |         c1_0.risk_profile,
2026-08-24 17:10:29.736 |         c1_0.role,
2026-08-24 17:10:29.736 |         c1_0.source_of_funds 
2026-08-24 17:10:29.736 |     from
2026-08-24 17:10:29.736 |         customers c1_0 
2026-08-24 17:10:29.736 |     where
2026-08-24 17:10:29.736 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.741 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 94600ddf-67b2-4651-988a-ef1c8223cbd4] - 
2026-08-24 17:10:29.741 |     select
2026-08-24 17:10:29.741 |         a1_0.id,
2026-08-24 17:10:29.741 |         a1_0.account_name,
2026-08-24 17:10:29.741 |         a1_0.account_number,
2026-08-24 17:10:29.741 |         a1_0.account_type,
2026-08-24 17:10:29.741 |         a1_0.allow_incoming,
2026-08-24 17:10:29.741 |         a1_0.allow_outgoing,
2026-08-24 17:10:29.741 |         a1_0.balance,
2026-08-24 17:10:29.741 |         a1_0.card_cvv,
2026-08-24 17:10:29.741 |         a1_0.card_expiry,
2026-08-24 17:10:29.741 |         a1_0.created_at,
2026-08-24 17:10:29.741 |         a1_0.currency,
2026-08-24 17:10:29.741 |         a1_0.customer_id,
2026-08-24 17:10:29.741 |         a1_0.daily_limit,
2026-08-24 17:10:29.741 |         a1_0.frozen,
2026-08-24 17:10:29.741 |         a1_0.monthly_limit,
2026-08-24 17:10:29.741 |         a1_0.parent_account_id,
2026-08-24 17:10:29.741 |         a1_0.require_dual_approval,
2026-08-24 17:10:29.741 |         a1_0.status,
2026-08-24 17:10:29.741 |         a1_0.swift_code,
2026-08-24 17:10:29.741 |         a1_0.updated_at,
2026-08-24 17:10:29.741 |         a1_0.version 
2026-08-24 17:10:29.741 |     from
2026-08-24 17:10:29.741 |         accounts a1_0 
2026-08-24 17:10:29.741 |     where
2026-08-24 17:10:29.741 |         a1_0.customer_id=?
2026-08-24 17:10:29.741 | Hibernate: 
2026-08-24 17:10:29.741 |     select
2026-08-24 17:10:29.741 |         a1_0.id,
2026-08-24 17:10:29.741 |         a1_0.account_name,
2026-08-24 17:10:29.741 |         a1_0.account_number,
2026-08-24 17:10:29.741 |         a1_0.account_type,
2026-08-24 17:10:29.741 |         a1_0.allow_incoming,
2026-08-24 17:10:29.741 |         a1_0.allow_outgoing,
2026-08-24 17:10:29.741 |         a1_0.balance,
2026-08-24 17:10:29.741 |         a1_0.card_cvv,
2026-08-24 17:10:29.741 |         a1_0.card_expiry,
2026-08-24 17:10:29.741 |         a1_0.created_at,
2026-08-24 17:10:29.741 |         a1_0.currency,
2026-08-24 17:10:29.741 |         a1_0.customer_id,
2026-08-24 17:10:29.741 |         a1_0.daily_limit,
2026-08-24 17:10:29.741 |         a1_0.frozen,
2026-08-24 17:10:29.741 |         a1_0.monthly_limit,
2026-08-24 17:10:29.741 |         a1_0.parent_account_id,
2026-08-24 17:10:29.741 |         a1_0.require_dual_approval,
2026-08-24 17:10:29.741 |         a1_0.status,
2026-08-24 17:10:29.741 |         a1_0.swift_code,
2026-08-24 17:10:29.741 |         a1_0.updated_at,
2026-08-24 17:10:29.741 |         a1_0.version 
2026-08-24 17:10:29.741 |     from
2026-08-24 17:10:29.741 |         accounts a1_0 
2026-08-24 17:10:29.741 |     where
2026-08-24 17:10:29.741 |         a1_0.customer_id=?
2026-08-24 17:10:29.747 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 94600ddf-67b2-4651-988a-ef1c8223cbd4] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 18ms
2026-08-24 17:10:29.751 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:29.751 |     insert 
2026-08-24 17:10:29.751 |     into
2026-08-24 17:10:29.751 |         api_audit_events
2026-08-24 17:10:29.751 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:29.751 |     values
2026-08-24 17:10:29.751 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:29.751 | Hibernate: 
2026-08-24 17:10:29.751 |     insert 
2026-08-24 17:10:29.751 |     into
2026-08-24 17:10:29.751 |         api_audit_events
2026-08-24 17:10:29.751 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:29.751 |     values
2026-08-24 17:10:29.751 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:29.771 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=36ms
2026-08-24 17:10:29.968 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:10:29.973 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: 9968557b-dfba-4807-a9c3-a3dbe85ece9f] - 
2026-08-24 17:10:29.973 |     select
2026-08-24 17:10:29.973 |         c1_0.id,
2026-08-24 17:10:29.973 |         c1_0.created_at,
2026-08-24 17:10:29.973 |         c1_0.email,
2026-08-24 17:10:29.973 |         c1_0.employment_status,
2026-08-24 17:10:29.973 |         c1_0.first_name,
2026-08-24 17:10:29.974 |         c1_0.job_title,
2026-08-24 17:10:29.974 |         c1_0.kyc_status,
2026-08-24 17:10:29.974 |         c1_0.last_name,
2026-08-24 17:10:29.974 |         c1_0.locked,
2026-08-24 17:10:29.974 |         c1_0.monthly_income,
2026-08-24 17:10:29.974 |         c1_0.password,
2026-08-24 17:10:29.974 |         c1_0.risk_profile,
2026-08-24 17:10:29.974 |         c1_0.role,
2026-08-24 17:10:29.974 |         c1_0.source_of_funds 
2026-08-24 17:10:29.974 |     from
2026-08-24 17:10:29.974 |         customers c1_0 
2026-08-24 17:10:29.974 |     where
2026-08-24 17:10:29.974 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.974 | Hibernate: 
2026-08-24 17:10:29.974 |     select
2026-08-24 17:10:29.974 |         c1_0.id,
2026-08-24 17:10:29.974 |         c1_0.created_at,
2026-08-24 17:10:29.974 |         c1_0.email,
2026-08-24 17:10:29.974 |         c1_0.employment_status,
2026-08-24 17:10:29.974 |         c1_0.first_name,
2026-08-24 17:10:29.974 |         c1_0.job_title,
2026-08-24 17:10:29.974 |         c1_0.kyc_status,
2026-08-24 17:10:29.974 |         c1_0.last_name,
2026-08-24 17:10:29.974 |         c1_0.locked,
2026-08-24 17:10:29.974 |         c1_0.monthly_income,
2026-08-24 17:10:29.974 |         c1_0.password,
2026-08-24 17:10:29.974 |         c1_0.risk_profile,
2026-08-24 17:10:29.974 |         c1_0.role,
2026-08-24 17:10:29.974 |         c1_0.source_of_funds 
2026-08-24 17:10:29.974 |     from
2026-08-24 17:10:29.974 |         customers c1_0 
2026-08-24 17:10:29.974 |     where
2026-08-24 17:10:29.974 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.982 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 9968557b-dfba-4807-a9c3-a3dbe85ece9f] - Secured GET /api/v1/accounts
2026-08-24 17:10:29.986 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: 9968557b-dfba-4807-a9c3-a3dbe85ece9f] - 
2026-08-24 17:10:29.986 |     select
2026-08-24 17:10:29.986 |         c1_0.id,
2026-08-24 17:10:29.986 |         c1_0.created_at,
2026-08-24 17:10:29.986 |         c1_0.email,
2026-08-24 17:10:29.986 |         c1_0.employment_status,
2026-08-24 17:10:29.986 |         c1_0.first_name,
2026-08-24 17:10:29.986 |         c1_0.job_title,
2026-08-24 17:10:29.986 |         c1_0.kyc_status,
2026-08-24 17:10:29.986 |         c1_0.last_name,
2026-08-24 17:10:29.986 |         c1_0.locked,
2026-08-24 17:10:29.986 |         c1_0.monthly_income,
2026-08-24 17:10:29.986 |         c1_0.password,
2026-08-24 17:10:29.986 |         c1_0.risk_profile,
2026-08-24 17:10:29.986 |         c1_0.role,
2026-08-24 17:10:29.986 |         c1_0.source_of_funds 
2026-08-24 17:10:29.986 |     from
2026-08-24 17:10:29.986 |         customers c1_0 
2026-08-24 17:10:29.986 |     where
2026-08-24 17:10:29.986 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.986 | Hibernate: 
2026-08-24 17:10:29.986 |     select
2026-08-24 17:10:29.986 |         c1_0.id,
2026-08-24 17:10:29.986 |         c1_0.created_at,
2026-08-24 17:10:29.986 |         c1_0.email,
2026-08-24 17:10:29.986 |         c1_0.employment_status,
2026-08-24 17:10:29.986 |         c1_0.first_name,
2026-08-24 17:10:29.986 |         c1_0.job_title,
2026-08-24 17:10:29.986 |         c1_0.kyc_status,
2026-08-24 17:10:29.986 |         c1_0.last_name,
2026-08-24 17:10:29.986 |         c1_0.locked,
2026-08-24 17:10:29.986 |         c1_0.monthly_income,
2026-08-24 17:10:29.986 |         c1_0.password,
2026-08-24 17:10:29.986 |         c1_0.risk_profile,
2026-08-24 17:10:29.986 |         c1_0.role,
2026-08-24 17:10:29.986 |         c1_0.source_of_funds 
2026-08-24 17:10:29.986 |     from
2026-08-24 17:10:29.986 |         customers c1_0 
2026-08-24 17:10:29.986 |     where
2026-08-24 17:10:29.986 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:29.990 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: 9968557b-dfba-4807-a9c3-a3dbe85ece9f] - 
2026-08-24 17:10:29.990 |     select
2026-08-24 17:10:29.990 |         a1_0.id,
2026-08-24 17:10:29.990 |         a1_0.account_name,
2026-08-24 17:10:29.990 |         a1_0.account_number,
2026-08-24 17:10:29.990 |         a1_0.account_type,
2026-08-24 17:10:29.990 |         a1_0.allow_incoming,
2026-08-24 17:10:29.990 |         a1_0.allow_outgoing,
2026-08-24 17:10:29.990 |         a1_0.balance,
2026-08-24 17:10:29.990 |         a1_0.card_cvv,
2026-08-24 17:10:29.990 |         a1_0.card_expiry,
2026-08-24 17:10:29.990 |         a1_0.created_at,
2026-08-24 17:10:29.990 |         a1_0.currency,
2026-08-24 17:10:29.990 |         a1_0.customer_id,
2026-08-24 17:10:29.990 |         a1_0.daily_limit,
2026-08-24 17:10:29.990 |         a1_0.frozen,
2026-08-24 17:10:29.990 |         a1_0.monthly_limit,
2026-08-24 17:10:29.990 |         a1_0.parent_account_id,
2026-08-24 17:10:29.990 |         a1_0.require_dual_approval,
2026-08-24 17:10:29.990 |         a1_0.status,
2026-08-24 17:10:29.990 |         a1_0.swift_code,
2026-08-24 17:10:29.990 |         a1_0.updated_at,
2026-08-24 17:10:29.990 |         a1_0.version 
2026-08-24 17:10:29.990 |     from
2026-08-24 17:10:29.990 |         accounts a1_0 
2026-08-24 17:10:29.990 |     where
2026-08-24 17:10:29.990 |         a1_0.customer_id=?
2026-08-24 17:10:29.990 | Hibernate: 
2026-08-24 17:10:29.990 |     select
2026-08-24 17:10:29.990 |         a1_0.id,
2026-08-24 17:10:29.990 |         a1_0.account_name,
2026-08-24 17:10:29.990 |         a1_0.account_number,
2026-08-24 17:10:29.990 |         a1_0.account_type,
2026-08-24 17:10:29.990 |         a1_0.allow_incoming,
2026-08-24 17:10:29.990 |         a1_0.allow_outgoing,
2026-08-24 17:10:29.990 |         a1_0.balance,
2026-08-24 17:10:29.990 |         a1_0.card_cvv,
2026-08-24 17:10:29.990 |         a1_0.card_expiry,
2026-08-24 17:10:29.990 |         a1_0.created_at,
2026-08-24 17:10:29.990 |         a1_0.currency,
2026-08-24 17:10:29.990 |         a1_0.customer_id,
2026-08-24 17:10:29.990 |         a1_0.daily_limit,
2026-08-24 17:10:29.990 |         a1_0.frozen,
2026-08-24 17:10:29.990 |         a1_0.monthly_limit,
2026-08-24 17:10:29.990 |         a1_0.parent_account_id,
2026-08-24 17:10:29.990 |         a1_0.require_dual_approval,
2026-08-24 17:10:29.990 |         a1_0.status,
2026-08-24 17:10:29.990 |         a1_0.swift_code,
2026-08-24 17:10:29.990 |         a1_0.updated_at,
2026-08-24 17:10:29.990 |         a1_0.version 
2026-08-24 17:10:29.990 |     from
2026-08-24 17:10:29.990 |         accounts a1_0 
2026-08-24 17:10:29.990 |     where
2026-08-24 17:10:29.990 |         a1_0.customer_id=?
2026-08-24 17:10:29.996 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 9968557b-dfba-4807-a9c3-a3dbe85ece9f] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 15ms
2026-08-24 17:10:29.999 | 2026-08-24 09:10:29 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:29.999 |     insert 
2026-08-24 17:10:29.999 |     into
2026-08-24 17:10:29.999 |         api_audit_events
2026-08-24 17:10:29.999 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:29.999 |     values
2026-08-24 17:10:29.999 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:29.999 | Hibernate: 
2026-08-24 17:10:29.999 |     insert 
2026-08-24 17:10:29.999 |     into
2026-08-24 17:10:29.999 |         api_audit_events
2026-08-24 17:10:29.999 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:29.999 |     values
2026-08-24 17:10:29.999 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:30.018 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=29ms
2026-08-24 17:10:30.090 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:10:30.096 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 621fb231-e1ba-4808-9370-d072c7e723ed] - 
2026-08-24 17:10:30.096 |     select
2026-08-24 17:10:30.096 |         c1_0.id,
2026-08-24 17:10:30.096 |         c1_0.created_at,
2026-08-24 17:10:30.096 |         c1_0.email,
2026-08-24 17:10:30.096 |         c1_0.employment_status,
2026-08-24 17:10:30.096 |         c1_0.first_name,
2026-08-24 17:10:30.096 |         c1_0.job_title,
2026-08-24 17:10:30.096 |         c1_0.kyc_status,
2026-08-24 17:10:30.096 |         c1_0.last_name,
2026-08-24 17:10:30.096 |         c1_0.locked,
2026-08-24 17:10:30.096 |         c1_0.monthly_income,
2026-08-24 17:10:30.096 |         c1_0.password,
2026-08-24 17:10:30.096 |         c1_0.risk_profile,
2026-08-24 17:10:30.096 |         c1_0.role,
2026-08-24 17:10:30.096 |         c1_0.source_of_funds 
2026-08-24 17:10:30.096 |     from
2026-08-24 17:10:30.096 |         customers c1_0 
2026-08-24 17:10:30.096 |     where
2026-08-24 17:10:30.096 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:30.096 | Hibernate: 
2026-08-24 17:10:30.096 |     select
2026-08-24 17:10:30.096 |         c1_0.id,
2026-08-24 17:10:30.096 |         c1_0.created_at,
2026-08-24 17:10:30.096 |         c1_0.email,
2026-08-24 17:10:30.096 |         c1_0.employment_status,
2026-08-24 17:10:30.096 |         c1_0.first_name,
2026-08-24 17:10:30.096 |         c1_0.job_title,
2026-08-24 17:10:30.096 |         c1_0.kyc_status,
2026-08-24 17:10:30.096 |         c1_0.last_name,
2026-08-24 17:10:30.096 |         c1_0.locked,
2026-08-24 17:10:30.096 |         c1_0.monthly_income,
2026-08-24 17:10:30.096 |         c1_0.password,
2026-08-24 17:10:30.096 |         c1_0.risk_profile,
2026-08-24 17:10:30.096 |         c1_0.role,
2026-08-24 17:10:30.096 |         c1_0.source_of_funds 
2026-08-24 17:10:30.096 |     from
2026-08-24 17:10:30.096 |         customers c1_0 
2026-08-24 17:10:30.096 |     where
2026-08-24 17:10:30.096 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:30.104 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 621fb231-e1ba-4808-9370-d072c7e723ed] - Secured GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:10:30.110 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: 621fb231-e1ba-4808-9370-d072c7e723ed] - 
2026-08-24 17:10:30.110 |     select
2026-08-24 17:10:30.110 |         t1_0.id,
2026-08-24 17:10:30.110 |         t1_0.amount,
2026-08-24 17:10:30.110 |         t1_0.created_at,
2026-08-24 17:10:30.110 |         t1_0.currency,
2026-08-24 17:10:30.110 |         t1_0.description,
2026-08-24 17:10:30.110 |         t1_0.destination_account_number,
2026-08-24 17:10:30.110 |         t1_0.dispute_reason,
2026-08-24 17:10:30.110 |         t1_0.idempotency_key,
2026-08-24 17:10:30.110 |         t1_0.is_disputed,
2026-08-24 17:10:30.110 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:10:30.110 |         t1_0.settlement_batch_id,
2026-08-24 17:10:30.110 |         t1_0.source_account_number,
2026-08-24 17:10:30.110 |         t1_0.status,
2026-08-24 17:10:30.110 |         t1_0.transaction_reference,
2026-08-24 17:10:30.110 |         t1_0.version 
2026-08-24 17:10:30.110 |     from
2026-08-24 17:10:30.110 |         transactions t1_0 
2026-08-24 17:10:30.110 |     where
2026-08-24 17:10:30.110 |         t1_0.source_account_number=? 
2026-08-24 17:10:30.110 |         or t1_0.destination_account_number=? 
2026-08-24 17:10:30.110 |     order by
2026-08-24 17:10:30.110 |         t1_0.created_at desc 
2026-08-24 17:10:30.110 |     fetch
2026-08-24 17:10:30.110 |         first ? rows only
2026-08-24 17:10:30.110 | Hibernate: 
2026-08-24 17:10:30.110 |     select
2026-08-24 17:10:30.110 |         t1_0.id,
2026-08-24 17:10:30.110 |         t1_0.amount,
2026-08-24 17:10:30.110 |         t1_0.created_at,
2026-08-24 17:10:30.110 |         t1_0.currency,
2026-08-24 17:10:30.110 |         t1_0.description,
2026-08-24 17:10:30.110 |         t1_0.destination_account_number,
2026-08-24 17:10:30.110 |         t1_0.dispute_reason,
2026-08-24 17:10:30.110 |         t1_0.idempotency_key,
2026-08-24 17:10:30.110 |         t1_0.is_disputed,
2026-08-24 17:10:30.110 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:10:30.110 |         t1_0.settlement_batch_id,
2026-08-24 17:10:30.110 |         t1_0.source_account_number,
2026-08-24 17:10:30.110 |         t1_0.status,
2026-08-24 17:10:30.110 |         t1_0.transaction_reference,
2026-08-24 17:10:30.110 |         t1_0.version 
2026-08-24 17:10:30.110 |     from
2026-08-24 17:10:30.110 |         transactions t1_0 
2026-08-24 17:10:30.110 |     where
2026-08-24 17:10:30.110 |         t1_0.source_account_number=? 
2026-08-24 17:10:30.110 |         or t1_0.destination_account_number=? 
2026-08-24 17:10:30.110 |     order by
2026-08-24 17:10:30.110 |         t1_0.created_at desc 
2026-08-24 17:10:30.110 |     fetch
2026-08-24 17:10:30.110 |         first ? rows only
2026-08-24 17:10:30.117 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 621fb231-e1ba-4808-9370-d072c7e723ed] - [HTTP LOG] GET /api/v1/transactions/history/4859228705057459 - Status: 200 - Duration: 13ms
2026-08-24 17:10:30.120 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:30.120 |     insert 
2026-08-24 17:10:30.120 |     into
2026-08-24 17:10:30.120 |         api_audit_events
2026-08-24 17:10:30.120 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:30.120 |     values
2026-08-24 17:10:30.120 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:30.120 | Hibernate: 
2026-08-24 17:10:30.120 |     insert 
2026-08-24 17:10:30.120 |     into
2026-08-24 17:10:30.120 |         api_audit_events
2026-08-24 17:10:30.120 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:30.120 |     values
2026-08-24 17:10:30.120 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:30.131 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/transactions/history/4859228705057459 → 200 | stage=COMPLETED | keyId=null | acct=null | latency=31ms
2026-08-24 17:10:30.409 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:10:30.415 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: ff8d5395-4951-46a2-b798-5b4f94fc1d8d] - 
2026-08-24 17:10:30.416 |     select
2026-08-24 17:10:30.416 |         c1_0.id,
2026-08-24 17:10:30.416 |         c1_0.created_at,
2026-08-24 17:10:30.416 |         c1_0.email,
2026-08-24 17:10:30.416 |         c1_0.employment_status,
2026-08-24 17:10:30.416 |         c1_0.first_name,
2026-08-24 17:10:30.416 |         c1_0.job_title,
2026-08-24 17:10:30.416 |         c1_0.kyc_status,
2026-08-24 17:10:30.416 |         c1_0.last_name,
2026-08-24 17:10:30.416 |         c1_0.locked,
2026-08-24 17:10:30.416 |         c1_0.monthly_income,
2026-08-24 17:10:30.416 |         c1_0.password,
2026-08-24 17:10:30.416 |         c1_0.risk_profile,
2026-08-24 17:10:30.416 |         c1_0.role,
2026-08-24 17:10:30.416 |         c1_0.source_of_funds 
2026-08-24 17:10:30.416 |     from
2026-08-24 17:10:30.416 |         customers c1_0 
2026-08-24 17:10:30.416 |     where
2026-08-24 17:10:30.416 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:30.416 | Hibernate: 
2026-08-24 17:10:30.416 |     select
2026-08-24 17:10:30.416 |         c1_0.id,
2026-08-24 17:10:30.416 |         c1_0.created_at,
2026-08-24 17:10:30.416 |         c1_0.email,
2026-08-24 17:10:30.416 |         c1_0.employment_status,
2026-08-24 17:10:30.416 |         c1_0.first_name,
2026-08-24 17:10:30.416 |         c1_0.job_title,
2026-08-24 17:10:30.416 |         c1_0.kyc_status,
2026-08-24 17:10:30.416 |         c1_0.last_name,
2026-08-24 17:10:30.416 |         c1_0.locked,
2026-08-24 17:10:30.416 |         c1_0.monthly_income,
2026-08-24 17:10:30.416 |         c1_0.password,
2026-08-24 17:10:30.416 |         c1_0.risk_profile,
2026-08-24 17:10:30.416 |         c1_0.role,
2026-08-24 17:10:30.416 |         c1_0.source_of_funds 
2026-08-24 17:10:30.416 |     from
2026-08-24 17:10:30.416 |         customers c1_0 
2026-08-24 17:10:30.416 |     where
2026-08-24 17:10:30.416 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:30.427 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ff8d5395-4951-46a2-b798-5b4f94fc1d8d] - Secured GET /api/v1/transactions/history/4859228705057459?page=0&size=20
2026-08-24 17:10:30.433 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: ff8d5395-4951-46a2-b798-5b4f94fc1d8d] - 
2026-08-24 17:10:30.434 |     select
2026-08-24 17:10:30.434 |         t1_0.id,
2026-08-24 17:10:30.434 |         t1_0.amount,
2026-08-24 17:10:30.434 |         t1_0.created_at,
2026-08-24 17:10:30.434 |         t1_0.currency,
2026-08-24 17:10:30.434 |         t1_0.description,
2026-08-24 17:10:30.434 |         t1_0.destination_account_number,
2026-08-24 17:10:30.434 |         t1_0.dispute_reason,
2026-08-24 17:10:30.434 |         t1_0.idempotency_key,
2026-08-24 17:10:30.434 |         t1_0.is_disputed,
2026-08-24 17:10:30.434 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:10:30.434 |         t1_0.settlement_batch_id,
2026-08-24 17:10:30.434 |         t1_0.source_account_number,
2026-08-24 17:10:30.434 |         t1_0.status,
2026-08-24 17:10:30.434 |         t1_0.transaction_reference,
2026-08-24 17:10:30.434 |         t1_0.version 
2026-08-24 17:10:30.434 |     from
2026-08-24 17:10:30.434 |         transactions t1_0 
2026-08-24 17:10:30.434 |     where
2026-08-24 17:10:30.434 |         t1_0.source_account_number=? 
2026-08-24 17:10:30.434 |         or t1_0.destination_account_number=? 
2026-08-24 17:10:30.434 |     order by
2026-08-24 17:10:30.434 |         t1_0.created_at desc 
2026-08-24 17:10:30.434 |     fetch
2026-08-24 17:10:30.434 |         first ? rows only
2026-08-24 17:10:30.434 | Hibernate: 
2026-08-24 17:10:30.434 |     select
2026-08-24 17:10:30.434 |         t1_0.id,
2026-08-24 17:10:30.434 |         t1_0.amount,
2026-08-24 17:10:30.434 |         t1_0.created_at,
2026-08-24 17:10:30.434 |         t1_0.currency,
2026-08-24 17:10:30.434 |         t1_0.description,
2026-08-24 17:10:30.434 |         t1_0.destination_account_number,
2026-08-24 17:10:30.434 |         t1_0.dispute_reason,
2026-08-24 17:10:30.434 |         t1_0.idempotency_key,
2026-08-24 17:10:30.434 |         t1_0.is_disputed,
2026-08-24 17:10:30.434 |         t1_0.scheduled_vam_restriction,
2026-08-24 17:10:30.434 |         t1_0.settlement_batch_id,
2026-08-24 17:10:30.434 |         t1_0.source_account_number,
2026-08-24 17:10:30.434 |         t1_0.status,
2026-08-24 17:10:30.434 |         t1_0.transaction_reference,
2026-08-24 17:10:30.434 |         t1_0.version 
2026-08-24 17:10:30.434 |     from
2026-08-24 17:10:30.434 |         transactions t1_0 
2026-08-24 17:10:30.434 |     where
2026-08-24 17:10:30.434 |         t1_0.source_account_number=? 
2026-08-24 17:10:30.434 |         or t1_0.destination_account_number=? 
2026-08-24 17:10:30.434 |     order by
2026-08-24 17:10:30.434 |         t1_0.created_at desc 
2026-08-24 17:10:30.434 |     fetch
2026-08-24 17:10:30.434 |         first ? rows only
2026-08-24 17:10:30.441 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ff8d5395-4951-46a2-b798-5b4f94fc1d8d] - [HTTP LOG] GET /api/v1/transactions/history/4859228705057459 - Status: 200 - Duration: 13ms
2026-08-24 17:10:30.443 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:30.443 |     insert 
2026-08-24 17:10:30.443 |     into
2026-08-24 17:10:30.443 |         api_audit_events
2026-08-24 17:10:30.443 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:30.443 |     values
2026-08-24 17:10:30.443 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:30.443 | Hibernate: 
2026-08-24 17:10:30.443 |     insert 
2026-08-24 17:10:30.443 |     into
2026-08-24 17:10:30.443 |         api_audit_events
2026-08-24 17:10:30.443 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:30.443 |     values
2026-08-24 17:10:30.443 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:30.464 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/transactions/history/4859228705057459 → 200 | stage=COMPLETED | keyId=null | acct=null | latency=34ms
2026-08-24 17:10:30.940 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:10:30.941 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:10:30.942 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 28bd70ba-dc13-4276-880e-b043f6238395] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:10:30.949 | 2026-08-24 09:10:30 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 28bd70ba-dc13-4276-880e-b043f6238395] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-24 17:10:34.540 | 2026-08-24 09:10:34 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:34.540 |     SELECT
2026-08-24 17:10:34.540 |         o1.* 
2026-08-24 17:10:34.540 |     FROM
2026-08-24 17:10:34.540 |         payment_event_outbox o1 
2026-08-24 17:10:34.540 |     WHERE
2026-08-24 17:10:34.540 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:34.540 |         AND (
2026-08-24 17:10:34.540 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:34.540 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:34.540 |         )   
2026-08-24 17:10:34.540 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:34.540 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:34.540 |             1 
2026-08-24 17:10:34.540 |         FROM
2026-08-24 17:10:34.540 |             payment_event_outbox o2       
2026-08-24 17:10:34.540 |         WHERE
2026-08-24 17:10:34.540 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:34.540 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:34.540 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:34.540 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:34.540 |     ORDER BY
2026-08-24 17:10:34.540 |         o1.created_at ASC 
2026-08-24 17:10:34.540 |     LIMIT
2026-08-24 17:10:34.540 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:34.540 | Hibernate: 
2026-08-24 17:10:34.540 |     SELECT
2026-08-24 17:10:34.540 |         o1.* 
2026-08-24 17:10:34.540 |     FROM
2026-08-24 17:10:34.540 |         payment_event_outbox o1 
2026-08-24 17:10:34.540 |     WHERE
2026-08-24 17:10:34.540 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:34.540 |         AND (
2026-08-24 17:10:34.540 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:34.540 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:34.540 |         )   
2026-08-24 17:10:34.540 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:34.540 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:34.540 |             1 
2026-08-24 17:10:34.540 |         FROM
2026-08-24 17:10:34.540 |             payment_event_outbox o2       
2026-08-24 17:10:34.540 |         WHERE
2026-08-24 17:10:34.540 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:34.540 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:34.540 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:34.540 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:34.540 |     ORDER BY
2026-08-24 17:10:34.540 |         o1.created_at ASC 
2026-08-24 17:10:34.540 |     LIMIT
2026-08-24 17:10:34.541 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:36.792 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:10:36.798 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 7ecbaac2-bb57-41d2-8c82-29a00f0cceee] - 
2026-08-24 17:10:36.798 |     select
2026-08-24 17:10:36.798 |         c1_0.id,
2026-08-24 17:10:36.798 |         c1_0.created_at,
2026-08-24 17:10:36.798 |         c1_0.email,
2026-08-24 17:10:36.798 |         c1_0.employment_status,
2026-08-24 17:10:36.798 |         c1_0.first_name,
2026-08-24 17:10:36.798 |         c1_0.job_title,
2026-08-24 17:10:36.798 |         c1_0.kyc_status,
2026-08-24 17:10:36.798 |         c1_0.last_name,
2026-08-24 17:10:36.798 |         c1_0.locked,
2026-08-24 17:10:36.798 |         c1_0.monthly_income,
2026-08-24 17:10:36.798 |         c1_0.password,
2026-08-24 17:10:36.798 |         c1_0.risk_profile,
2026-08-24 17:10:36.798 |         c1_0.role,
2026-08-24 17:10:36.798 |         c1_0.source_of_funds 
2026-08-24 17:10:36.798 |     from
2026-08-24 17:10:36.798 |         customers c1_0 
2026-08-24 17:10:36.798 |     where
2026-08-24 17:10:36.798 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:36.798 | Hibernate: 
2026-08-24 17:10:36.798 |     select
2026-08-24 17:10:36.798 |         c1_0.id,
2026-08-24 17:10:36.798 |         c1_0.created_at,
2026-08-24 17:10:36.798 |         c1_0.email,
2026-08-24 17:10:36.798 |         c1_0.employment_status,
2026-08-24 17:10:36.798 |         c1_0.first_name,
2026-08-24 17:10:36.798 |         c1_0.job_title,
2026-08-24 17:10:36.798 |         c1_0.kyc_status,
2026-08-24 17:10:36.798 |         c1_0.last_name,
2026-08-24 17:10:36.798 |         c1_0.locked,
2026-08-24 17:10:36.798 |         c1_0.monthly_income,
2026-08-24 17:10:36.798 |         c1_0.password,
2026-08-24 17:10:36.798 |         c1_0.risk_profile,
2026-08-24 17:10:36.798 |         c1_0.role,
2026-08-24 17:10:36.798 |         c1_0.source_of_funds 
2026-08-24 17:10:36.798 |     from
2026-08-24 17:10:36.798 |         customers c1_0 
2026-08-24 17:10:36.798 |     where
2026-08-24 17:10:36.798 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:36.807 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 7ecbaac2-bb57-41d2-8c82-29a00f0cceee] - Secured GET /api/v1/accounts
2026-08-24 17:10:36.810 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 7ecbaac2-bb57-41d2-8c82-29a00f0cceee] - 
2026-08-24 17:10:36.810 |     select
2026-08-24 17:10:36.810 |         c1_0.id,
2026-08-24 17:10:36.810 |         c1_0.created_at,
2026-08-24 17:10:36.810 |         c1_0.email,
2026-08-24 17:10:36.810 |         c1_0.employment_status,
2026-08-24 17:10:36.810 |         c1_0.first_name,
2026-08-24 17:10:36.810 |         c1_0.job_title,
2026-08-24 17:10:36.810 |         c1_0.kyc_status,
2026-08-24 17:10:36.810 |         c1_0.last_name,
2026-08-24 17:10:36.810 |         c1_0.locked,
2026-08-24 17:10:36.810 |         c1_0.monthly_income,
2026-08-24 17:10:36.810 |         c1_0.password,
2026-08-24 17:10:36.810 |         c1_0.risk_profile,
2026-08-24 17:10:36.810 |         c1_0.role,
2026-08-24 17:10:36.810 |         c1_0.source_of_funds 
2026-08-24 17:10:36.810 |     from
2026-08-24 17:10:36.810 |         customers c1_0 
2026-08-24 17:10:36.810 |     where
2026-08-24 17:10:36.810 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:36.810 | Hibernate: 
2026-08-24 17:10:36.810 |     select
2026-08-24 17:10:36.810 |         c1_0.id,
2026-08-24 17:10:36.810 |         c1_0.created_at,
2026-08-24 17:10:36.810 |         c1_0.email,
2026-08-24 17:10:36.810 |         c1_0.employment_status,
2026-08-24 17:10:36.810 |         c1_0.first_name,
2026-08-24 17:10:36.810 |         c1_0.job_title,
2026-08-24 17:10:36.810 |         c1_0.kyc_status,
2026-08-24 17:10:36.810 |         c1_0.last_name,
2026-08-24 17:10:36.810 |         c1_0.locked,
2026-08-24 17:10:36.810 |         c1_0.monthly_income,
2026-08-24 17:10:36.810 |         c1_0.password,
2026-08-24 17:10:36.810 |         c1_0.risk_profile,
2026-08-24 17:10:36.810 |         c1_0.role,
2026-08-24 17:10:36.810 |         c1_0.source_of_funds 
2026-08-24 17:10:36.810 |     from
2026-08-24 17:10:36.810 |         customers c1_0 
2026-08-24 17:10:36.810 |     where
2026-08-24 17:10:36.810 |         upper(c1_0.email)=upper(?)
2026-08-24 17:10:36.816 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: 7ecbaac2-bb57-41d2-8c82-29a00f0cceee] - 
2026-08-24 17:10:36.816 |     select
2026-08-24 17:10:36.816 |         a1_0.id,
2026-08-24 17:10:36.816 |         a1_0.account_name,
2026-08-24 17:10:36.816 |         a1_0.account_number,
2026-08-24 17:10:36.816 |         a1_0.account_type,
2026-08-24 17:10:36.816 |         a1_0.allow_incoming,
2026-08-24 17:10:36.816 |         a1_0.allow_outgoing,
2026-08-24 17:10:36.816 |         a1_0.balance,
2026-08-24 17:10:36.816 |         a1_0.card_cvv,
2026-08-24 17:10:36.816 |         a1_0.card_expiry,
2026-08-24 17:10:36.816 |         a1_0.created_at,
2026-08-24 17:10:36.816 |         a1_0.currency,
2026-08-24 17:10:36.816 |         a1_0.customer_id,
2026-08-24 17:10:36.816 |         a1_0.daily_limit,
2026-08-24 17:10:36.816 |         a1_0.frozen,
2026-08-24 17:10:36.816 |         a1_0.monthly_limit,
2026-08-24 17:10:36.816 |         a1_0.parent_account_id,
2026-08-24 17:10:36.816 |         a1_0.require_dual_approval,
2026-08-24 17:10:36.816 |         a1_0.status,
2026-08-24 17:10:36.816 |         a1_0.swift_code,
2026-08-24 17:10:36.816 |         a1_0.updated_at,
2026-08-24 17:10:36.816 |         a1_0.version 
2026-08-24 17:10:36.816 |     from
2026-08-24 17:10:36.816 |         accounts a1_0 
2026-08-24 17:10:36.816 |     where
2026-08-24 17:10:36.816 |         a1_0.customer_id=?
2026-08-24 17:10:36.816 | Hibernate: 
2026-08-24 17:10:36.816 |     select
2026-08-24 17:10:36.816 |         a1_0.id,
2026-08-24 17:10:36.816 |         a1_0.account_name,
2026-08-24 17:10:36.816 |         a1_0.account_number,
2026-08-24 17:10:36.816 |         a1_0.account_type,
2026-08-24 17:10:36.816 |         a1_0.allow_incoming,
2026-08-24 17:10:36.816 |         a1_0.allow_outgoing,
2026-08-24 17:10:36.816 |         a1_0.balance,
2026-08-24 17:10:36.816 |         a1_0.card_cvv,
2026-08-24 17:10:36.816 |         a1_0.card_expiry,
2026-08-24 17:10:36.816 |         a1_0.created_at,
2026-08-24 17:10:36.816 |         a1_0.currency,
2026-08-24 17:10:36.816 |         a1_0.customer_id,
2026-08-24 17:10:36.816 |         a1_0.daily_limit,
2026-08-24 17:10:36.816 |         a1_0.frozen,
2026-08-24 17:10:36.816 |         a1_0.monthly_limit,
2026-08-24 17:10:36.816 |         a1_0.parent_account_id,
2026-08-24 17:10:36.816 |         a1_0.require_dual_approval,
2026-08-24 17:10:36.816 |         a1_0.status,
2026-08-24 17:10:36.816 |         a1_0.swift_code,
2026-08-24 17:10:36.816 |         a1_0.updated_at,
2026-08-24 17:10:36.816 |         a1_0.version 
2026-08-24 17:10:36.816 |     from
2026-08-24 17:10:36.816 |         accounts a1_0 
2026-08-24 17:10:36.816 |     where
2026-08-24 17:10:36.816 |         a1_0.customer_id=?
2026-08-24 17:10:36.826 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 7ecbaac2-bb57-41d2-8c82-29a00f0cceee] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 18ms
2026-08-24 17:10:36.828 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:36.828 |     insert 
2026-08-24 17:10:36.828 |     into
2026-08-24 17:10:36.828 |         api_audit_events
2026-08-24 17:10:36.828 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:36.828 |     values
2026-08-24 17:10:36.828 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:36.828 | Hibernate: 
2026-08-24 17:10:36.828 |     insert 
2026-08-24 17:10:36.828 |     into
2026-08-24 17:10:36.828 |         api_audit_events
2026-08-24 17:10:36.828 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:10:36.828 |     values
2026-08-24 17:10:36.828 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:10:36.836 | 2026-08-24 09:10:36 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=35ms
2026-08-24 17:10:39.546 | 2026-08-24 09:10:39 [MessageBroker-8] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:39.546 |     SELECT
2026-08-24 17:10:39.546 |         o1.* 
2026-08-24 17:10:39.546 |     FROM
2026-08-24 17:10:39.546 |         payment_event_outbox o1 
2026-08-24 17:10:39.546 |     WHERE
2026-08-24 17:10:39.546 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:39.546 |         AND (
2026-08-24 17:10:39.546 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:39.546 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:39.546 |         )   
2026-08-24 17:10:39.546 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:39.546 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:39.546 |             1 
2026-08-24 17:10:39.546 |         FROM
2026-08-24 17:10:39.546 |             payment_event_outbox o2       
2026-08-24 17:10:39.546 |         WHERE
2026-08-24 17:10:39.546 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:39.546 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:39.546 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:39.546 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:39.546 |     ORDER BY
2026-08-24 17:10:39.546 |         o1.created_at ASC 
2026-08-24 17:10:39.546 |     LIMIT
2026-08-24 17:10:39.546 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:39.546 | Hibernate: 
2026-08-24 17:10:39.546 |     SELECT
2026-08-24 17:10:39.546 |         o1.* 
2026-08-24 17:10:39.546 |     FROM
2026-08-24 17:10:39.546 |         payment_event_outbox o1 
2026-08-24 17:10:39.546 |     WHERE
2026-08-24 17:10:39.546 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:39.546 |         AND (
2026-08-24 17:10:39.546 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:39.546 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:39.546 |         )   
2026-08-24 17:10:39.546 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:39.546 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:39.546 |             1 
2026-08-24 17:10:39.546 |         FROM
2026-08-24 17:10:39.546 |             payment_event_outbox o2       
2026-08-24 17:10:39.546 |         WHERE
2026-08-24 17:10:39.546 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:39.546 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:39.546 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:39.546 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:39.546 |     ORDER BY
2026-08-24 17:10:39.546 |         o1.created_at ASC 
2026-08-24 17:10:39.546 |     LIMIT
2026-08-24 17:10:39.546 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:41.064 | 2026-08-24 09:10:41 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:10:41.064 | 2026-08-24 09:10:41 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:10:41.064 | 2026-08-24 09:10:41 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: d97f35c8-4f3c-4790-92ce-d8be12aec9d1] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:10:41.069 | 2026-08-24 09:10:41 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d97f35c8-4f3c-4790-92ce-d8be12aec9d1] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-24 17:10:44.072 | 2026-08-24 09:10:44 [MessageBroker-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:44.072 |     SELECT
2026-08-24 17:10:44.072 |         * 
2026-08-24 17:10:44.072 |     FROM
2026-08-24 17:10:44.072 |         payment_event_outbox 
2026-08-24 17:10:44.072 |     WHERE
2026-08-24 17:10:44.072 |         status = 'DELIVERING'   
2026-08-24 17:10:44.072 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:44.072 | Hibernate: 
2026-08-24 17:10:44.072 |     SELECT
2026-08-24 17:10:44.072 |         * 
2026-08-24 17:10:44.072 |     FROM
2026-08-24 17:10:44.072 |         payment_event_outbox 
2026-08-24 17:10:44.072 |     WHERE
2026-08-24 17:10:44.072 |         status = 'DELIVERING'   
2026-08-24 17:10:44.072 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:44.087 | 2026-08-24 09:10:44 [MessageBroker-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:44.087 |     select
2026-08-24 17:10:44.087 |         icl1_0.id,
2026-08-24 17:10:44.087 |         icl1_0.attempt_count,
2026-08-24 17:10:44.087 |         icl1_0.callback_url,
2026-08-24 17:10:44.087 |         icl1_0.created_at,
2026-08-24 17:10:44.087 |         icl1_0.next_retry_at,
2026-08-24 17:10:44.087 |         icl1_0.payload,
2026-08-24 17:10:44.087 |         icl1_0.payment_session_id,
2026-08-24 17:10:44.087 |         icl1_0.response_body,
2026-08-24 17:10:44.087 |         icl1_0.response_code,
2026-08-24 17:10:44.087 |         icl1_0.status,
2026-08-24 17:10:44.087 |         icl1_0.updated_at 
2026-08-24 17:10:44.087 |     from
2026-08-24 17:10:44.087 |         institution_callback_log icl1_0 
2026-08-24 17:10:44.087 |     where
2026-08-24 17:10:44.087 |         icl1_0.status=? 
2026-08-24 17:10:44.087 |         and icl1_0.next_retry_at<?
2026-08-24 17:10:44.087 | Hibernate: 
2026-08-24 17:10:44.087 |     select
2026-08-24 17:10:44.087 |         icl1_0.id,
2026-08-24 17:10:44.087 |         icl1_0.attempt_count,
2026-08-24 17:10:44.087 |         icl1_0.callback_url,
2026-08-24 17:10:44.087 |         icl1_0.created_at,
2026-08-24 17:10:44.087 |         icl1_0.next_retry_at,
2026-08-24 17:10:44.087 |         icl1_0.payload,
2026-08-24 17:10:44.087 |         icl1_0.payment_session_id,
2026-08-24 17:10:44.087 |         icl1_0.response_body,
2026-08-24 17:10:44.087 |         icl1_0.response_code,
2026-08-24 17:10:44.087 |         icl1_0.status,
2026-08-24 17:10:44.087 |         icl1_0.updated_at 
2026-08-24 17:10:44.087 |     from
2026-08-24 17:10:44.087 |         institution_callback_log icl1_0 
2026-08-24 17:10:44.087 |     where
2026-08-24 17:10:44.087 |         icl1_0.status=? 
2026-08-24 17:10:44.087 |         and icl1_0.next_retry_at<?
2026-08-24 17:10:44.546 | 2026-08-24 09:10:44 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:44.546 |     SELECT
2026-08-24 17:10:44.546 |         o1.* 
2026-08-24 17:10:44.546 |     FROM
2026-08-24 17:10:44.546 |         payment_event_outbox o1 
2026-08-24 17:10:44.546 |     WHERE
2026-08-24 17:10:44.546 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:44.546 |         AND (
2026-08-24 17:10:44.546 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:44.546 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:44.546 |         )   
2026-08-24 17:10:44.546 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:44.546 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:44.546 |             1 
2026-08-24 17:10:44.546 |         FROM
2026-08-24 17:10:44.546 |             payment_event_outbox o2       
2026-08-24 17:10:44.546 |         WHERE
2026-08-24 17:10:44.546 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:44.546 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:44.546 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:44.546 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:44.546 |     ORDER BY
2026-08-24 17:10:44.546 |         o1.created_at ASC 
2026-08-24 17:10:44.546 |     LIMIT
2026-08-24 17:10:44.546 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:44.546 | Hibernate: 
2026-08-24 17:10:44.546 |     SELECT
2026-08-24 17:10:44.546 |         o1.* 
2026-08-24 17:10:44.546 |     FROM
2026-08-24 17:10:44.546 |         payment_event_outbox o1 
2026-08-24 17:10:44.546 |     WHERE
2026-08-24 17:10:44.546 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:44.546 |         AND (
2026-08-24 17:10:44.546 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:44.546 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:44.546 |         )   
2026-08-24 17:10:44.546 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:44.546 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:44.546 |             1 
2026-08-24 17:10:44.546 |         FROM
2026-08-24 17:10:44.546 |             payment_event_outbox o2       
2026-08-24 17:10:44.546 |         WHERE
2026-08-24 17:10:44.546 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:44.546 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:44.546 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:44.546 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:44.546 |     ORDER BY
2026-08-24 17:10:44.546 |         o1.created_at ASC 
2026-08-24 17:10:44.546 |     LIMIT
2026-08-24 17:10:44.546 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:49.552 | 2026-08-24 09:10:49 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:49.552 |     SELECT
2026-08-24 17:10:49.552 |         o1.* 
2026-08-24 17:10:49.552 |     FROM
2026-08-24 17:10:49.552 |         payment_event_outbox o1 
2026-08-24 17:10:49.552 |     WHERE
2026-08-24 17:10:49.552 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:49.552 |         AND (
2026-08-24 17:10:49.552 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:49.552 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:49.552 |         )   
2026-08-24 17:10:49.552 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:49.552 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:49.552 |             1 
2026-08-24 17:10:49.552 |         FROM
2026-08-24 17:10:49.552 |             payment_event_outbox o2       
2026-08-24 17:10:49.552 |         WHERE
2026-08-24 17:10:49.552 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:49.552 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:49.552 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:49.552 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:49.552 |     ORDER BY
2026-08-24 17:10:49.552 |         o1.created_at ASC 
2026-08-24 17:10:49.552 |     LIMIT
2026-08-24 17:10:49.552 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:49.552 | Hibernate: 
2026-08-24 17:10:49.552 |     SELECT
2026-08-24 17:10:49.552 |         o1.* 
2026-08-24 17:10:49.552 |     FROM
2026-08-24 17:10:49.552 |         payment_event_outbox o1 
2026-08-24 17:10:49.552 |     WHERE
2026-08-24 17:10:49.552 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:49.552 |         AND (
2026-08-24 17:10:49.552 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:49.552 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:49.552 |         )   
2026-08-24 17:10:49.552 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:49.552 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:49.552 |             1 
2026-08-24 17:10:49.552 |         FROM
2026-08-24 17:10:49.552 |             payment_event_outbox o2       
2026-08-24 17:10:49.552 |         WHERE
2026-08-24 17:10:49.552 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:49.552 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:49.552 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:49.552 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:49.552 |     ORDER BY
2026-08-24 17:10:49.552 |         o1.created_at ASC 
2026-08-24 17:10:49.552 |     LIMIT
2026-08-24 17:10:49.552 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:51.186 | 2026-08-24 09:10:51 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:10:51.186 | 2026-08-24 09:10:51 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:10:51.186 | 2026-08-24 09:10:51 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 35d01c33-2a44-45b8-98f7-ff7780061ff4] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:10:51.192 | 2026-08-24 09:10:51 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 35d01c33-2a44-45b8-98f7-ff7780061ff4] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:10:54.557 | 2026-08-24 09:10:54 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:54.557 |     SELECT
2026-08-24 17:10:54.557 |         o1.* 
2026-08-24 17:10:54.557 |     FROM
2026-08-24 17:10:54.557 |         payment_event_outbox o1 
2026-08-24 17:10:54.557 |     WHERE
2026-08-24 17:10:54.557 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:54.557 |         AND (
2026-08-24 17:10:54.557 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:54.557 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:54.557 |         )   
2026-08-24 17:10:54.557 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:54.557 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:54.557 |             1 
2026-08-24 17:10:54.557 |         FROM
2026-08-24 17:10:54.557 |             payment_event_outbox o2       
2026-08-24 17:10:54.557 |         WHERE
2026-08-24 17:10:54.557 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:54.557 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:54.557 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:54.557 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:54.557 |     ORDER BY
2026-08-24 17:10:54.557 |         o1.created_at ASC 
2026-08-24 17:10:54.557 |     LIMIT
2026-08-24 17:10:54.557 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:54.557 | Hibernate: 
2026-08-24 17:10:54.557 |     SELECT
2026-08-24 17:10:54.557 |         o1.* 
2026-08-24 17:10:54.557 |     FROM
2026-08-24 17:10:54.557 |         payment_event_outbox o1 
2026-08-24 17:10:54.557 |     WHERE
2026-08-24 17:10:54.557 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:54.557 |         AND (
2026-08-24 17:10:54.557 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:54.557 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:54.557 |         )   
2026-08-24 17:10:54.557 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:54.557 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:54.557 |             1 
2026-08-24 17:10:54.557 |         FROM
2026-08-24 17:10:54.557 |             payment_event_outbox o2       
2026-08-24 17:10:54.557 |         WHERE
2026-08-24 17:10:54.557 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:54.557 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:54.557 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:54.557 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:54.557 |     ORDER BY
2026-08-24 17:10:54.557 |         o1.created_at ASC 
2026-08-24 17:10:54.557 |     LIMIT
2026-08-24 17:10:54.557 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:59.562 | 2026-08-24 09:10:59 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:10:59.562 |     SELECT
2026-08-24 17:10:59.562 |         o1.* 
2026-08-24 17:10:59.562 |     FROM
2026-08-24 17:10:59.562 |         payment_event_outbox o1 
2026-08-24 17:10:59.562 |     WHERE
2026-08-24 17:10:59.562 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:59.562 |         AND (
2026-08-24 17:10:59.562 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:59.562 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:59.562 |         )   
2026-08-24 17:10:59.562 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:59.562 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:59.562 |             1 
2026-08-24 17:10:59.562 |         FROM
2026-08-24 17:10:59.562 |             payment_event_outbox o2       
2026-08-24 17:10:59.562 |         WHERE
2026-08-24 17:10:59.562 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:59.562 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:59.562 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:59.562 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:59.562 |     ORDER BY
2026-08-24 17:10:59.562 |         o1.created_at ASC 
2026-08-24 17:10:59.562 |     LIMIT
2026-08-24 17:10:59.562 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:10:59.562 | Hibernate: 
2026-08-24 17:10:59.562 |     SELECT
2026-08-24 17:10:59.562 |         o1.* 
2026-08-24 17:10:59.562 |     FROM
2026-08-24 17:10:59.562 |         payment_event_outbox o1 
2026-08-24 17:10:59.562 |     WHERE
2026-08-24 17:10:59.562 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:10:59.562 |         AND (
2026-08-24 17:10:59.562 |             o1.next_attempt_at IS NULL 
2026-08-24 17:10:59.562 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:10:59.562 |         )   
2026-08-24 17:10:59.562 |         AND o1.locked_at IS NULL   
2026-08-24 17:10:59.562 |         AND NOT EXISTS (       SELECT
2026-08-24 17:10:59.562 |             1 
2026-08-24 17:10:59.562 |         FROM
2026-08-24 17:10:59.562 |             payment_event_outbox o2       
2026-08-24 17:10:59.562 |         WHERE
2026-08-24 17:10:59.562 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:10:59.562 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:10:59.562 |             AND o2.sequence < o1.sequence         
2026-08-24 17:10:59.562 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:10:59.562 |     ORDER BY
2026-08-24 17:10:59.562 |         o1.created_at ASC 
2026-08-24 17:10:59.562 |     LIMIT
2026-08-24 17:10:59.562 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:01.285 | 2026-08-24 09:11:01 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:11:01.286 | 2026-08-24 09:11:01 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:11:01.286 | 2026-08-24 09:11:01 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 58c7b081-44fc-494b-b35f-1cf24d6b9728] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:11:01.292 | 2026-08-24 09:11:01 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 58c7b081-44fc-494b-b35f-1cf24d6b9728] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-24 17:11:04.568 | 2026-08-24 09:11:04 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:04.568 |     SELECT
2026-08-24 17:11:04.568 |         o1.* 
2026-08-24 17:11:04.568 |     FROM
2026-08-24 17:11:04.568 |         payment_event_outbox o1 
2026-08-24 17:11:04.568 |     WHERE
2026-08-24 17:11:04.568 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:04.568 |         AND (
2026-08-24 17:11:04.568 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:04.568 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:04.568 |         )   
2026-08-24 17:11:04.568 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:04.568 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:04.568 |             1 
2026-08-24 17:11:04.568 |         FROM
2026-08-24 17:11:04.568 |             payment_event_outbox o2       
2026-08-24 17:11:04.568 |         WHERE
2026-08-24 17:11:04.568 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:04.568 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:04.568 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:04.568 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:04.568 |     ORDER BY
2026-08-24 17:11:04.568 |         o1.created_at ASC 
2026-08-24 17:11:04.568 |     LIMIT
2026-08-24 17:11:04.568 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:04.568 | Hibernate: 
2026-08-24 17:11:04.568 |     SELECT
2026-08-24 17:11:04.568 |         o1.* 
2026-08-24 17:11:04.568 |     FROM
2026-08-24 17:11:04.568 |         payment_event_outbox o1 
2026-08-24 17:11:04.568 |     WHERE
2026-08-24 17:11:04.568 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:04.568 |         AND (
2026-08-24 17:11:04.568 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:04.568 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:04.568 |         )   
2026-08-24 17:11:04.568 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:04.568 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:04.568 |             1 
2026-08-24 17:11:04.568 |         FROM
2026-08-24 17:11:04.568 |             payment_event_outbox o2       
2026-08-24 17:11:04.568 |         WHERE
2026-08-24 17:11:04.568 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:04.568 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:04.568 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:04.568 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:04.568 |     ORDER BY
2026-08-24 17:11:04.568 |         o1.created_at ASC 
2026-08-24 17:11:04.568 |     LIMIT
2026-08-24 17:11:04.568 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:09.573 | 2026-08-24 09:11:09 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:09.574 |     SELECT
2026-08-24 17:11:09.574 |         o1.* 
2026-08-24 17:11:09.574 |     FROM
2026-08-24 17:11:09.574 |         payment_event_outbox o1 
2026-08-24 17:11:09.574 |     WHERE
2026-08-24 17:11:09.574 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:09.574 |         AND (
2026-08-24 17:11:09.574 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:09.574 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:09.574 |         )   
2026-08-24 17:11:09.574 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:09.574 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:09.574 |             1 
2026-08-24 17:11:09.574 |         FROM
2026-08-24 17:11:09.574 |             payment_event_outbox o2       
2026-08-24 17:11:09.574 |         WHERE
2026-08-24 17:11:09.574 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:09.574 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:09.574 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:09.574 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:09.574 |     ORDER BY
2026-08-24 17:11:09.574 |         o1.created_at ASC 
2026-08-24 17:11:09.574 |     LIMIT
2026-08-24 17:11:09.574 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:09.574 | Hibernate: 
2026-08-24 17:11:09.574 |     SELECT
2026-08-24 17:11:09.574 |         o1.* 
2026-08-24 17:11:09.574 |     FROM
2026-08-24 17:11:09.574 |         payment_event_outbox o1 
2026-08-24 17:11:09.574 |     WHERE
2026-08-24 17:11:09.574 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:09.574 |         AND (
2026-08-24 17:11:09.574 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:09.574 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:09.574 |         )   
2026-08-24 17:11:09.574 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:09.574 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:09.574 |             1 
2026-08-24 17:11:09.574 |         FROM
2026-08-24 17:11:09.574 |             payment_event_outbox o2       
2026-08-24 17:11:09.574 |         WHERE
2026-08-24 17:11:09.574 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:09.574 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:09.574 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:09.574 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:09.574 |     ORDER BY
2026-08-24 17:11:09.574 |         o1.created_at ASC 
2026-08-24 17:11:09.574 |     LIMIT
2026-08-24 17:11:09.574 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:11.383 | 2026-08-24 09:11:11 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:11:11.384 | 2026-08-24 09:11:11 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:11:11.384 | 2026-08-24 09:11:11 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 32e0cd7d-2d9e-43de-b63a-1440f8696ed9] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:11:11.389 | 2026-08-24 09:11:11 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 32e0cd7d-2d9e-43de-b63a-1440f8696ed9] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-24 17:11:12.458 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:11:12.464 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 7c6ad407-73f8-45fb-ba87-31a962c31b47] - 
2026-08-24 17:11:12.464 |     select
2026-08-24 17:11:12.464 |         c1_0.id,
2026-08-24 17:11:12.464 |         c1_0.created_at,
2026-08-24 17:11:12.464 |         c1_0.email,
2026-08-24 17:11:12.464 |         c1_0.employment_status,
2026-08-24 17:11:12.464 |         c1_0.first_name,
2026-08-24 17:11:12.464 |         c1_0.job_title,
2026-08-24 17:11:12.464 |         c1_0.kyc_status,
2026-08-24 17:11:12.464 |         c1_0.last_name,
2026-08-24 17:11:12.464 |         c1_0.locked,
2026-08-24 17:11:12.464 |         c1_0.monthly_income,
2026-08-24 17:11:12.464 |         c1_0.password,
2026-08-24 17:11:12.464 |         c1_0.risk_profile,
2026-08-24 17:11:12.464 |         c1_0.role,
2026-08-24 17:11:12.464 |         c1_0.source_of_funds 
2026-08-24 17:11:12.464 |     from
2026-08-24 17:11:12.464 |         customers c1_0 
2026-08-24 17:11:12.464 |     where
2026-08-24 17:11:12.464 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.464 | Hibernate: 
2026-08-24 17:11:12.464 |     select
2026-08-24 17:11:12.464 |         c1_0.id,
2026-08-24 17:11:12.464 |         c1_0.created_at,
2026-08-24 17:11:12.464 |         c1_0.email,
2026-08-24 17:11:12.464 |         c1_0.employment_status,
2026-08-24 17:11:12.464 |         c1_0.first_name,
2026-08-24 17:11:12.464 |         c1_0.job_title,
2026-08-24 17:11:12.464 |         c1_0.kyc_status,
2026-08-24 17:11:12.464 |         c1_0.last_name,
2026-08-24 17:11:12.464 |         c1_0.locked,
2026-08-24 17:11:12.464 |         c1_0.monthly_income,
2026-08-24 17:11:12.464 |         c1_0.password,
2026-08-24 17:11:12.464 |         c1_0.risk_profile,
2026-08-24 17:11:12.464 |         c1_0.role,
2026-08-24 17:11:12.464 |         c1_0.source_of_funds 
2026-08-24 17:11:12.464 |     from
2026-08-24 17:11:12.464 |         customers c1_0 
2026-08-24 17:11:12.464 |     where
2026-08-24 17:11:12.464 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.477 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: 7c6ad407-73f8-45fb-ba87-31a962c31b47] - Secured GET /api/v1/accounts
2026-08-24 17:11:12.481 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 7c6ad407-73f8-45fb-ba87-31a962c31b47] - 
2026-08-24 17:11:12.481 |     select
2026-08-24 17:11:12.481 |         c1_0.id,
2026-08-24 17:11:12.481 |         c1_0.created_at,
2026-08-24 17:11:12.481 |         c1_0.email,
2026-08-24 17:11:12.481 |         c1_0.employment_status,
2026-08-24 17:11:12.481 |         c1_0.first_name,
2026-08-24 17:11:12.481 |         c1_0.job_title,
2026-08-24 17:11:12.481 |         c1_0.kyc_status,
2026-08-24 17:11:12.481 |         c1_0.last_name,
2026-08-24 17:11:12.481 |         c1_0.locked,
2026-08-24 17:11:12.481 |         c1_0.monthly_income,
2026-08-24 17:11:12.481 |         c1_0.password,
2026-08-24 17:11:12.481 |         c1_0.risk_profile,
2026-08-24 17:11:12.481 |         c1_0.role,
2026-08-24 17:11:12.481 |         c1_0.source_of_funds 
2026-08-24 17:11:12.481 |     from
2026-08-24 17:11:12.482 |         customers c1_0 
2026-08-24 17:11:12.482 |     where
2026-08-24 17:11:12.482 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.482 | Hibernate: 
2026-08-24 17:11:12.482 |     select
2026-08-24 17:11:12.482 |         c1_0.id,
2026-08-24 17:11:12.482 |         c1_0.created_at,
2026-08-24 17:11:12.482 |         c1_0.email,
2026-08-24 17:11:12.482 |         c1_0.employment_status,
2026-08-24 17:11:12.482 |         c1_0.first_name,
2026-08-24 17:11:12.482 |         c1_0.job_title,
2026-08-24 17:11:12.482 |         c1_0.kyc_status,
2026-08-24 17:11:12.482 |         c1_0.last_name,
2026-08-24 17:11:12.482 |         c1_0.locked,
2026-08-24 17:11:12.482 |         c1_0.monthly_income,
2026-08-24 17:11:12.482 |         c1_0.password,
2026-08-24 17:11:12.482 |         c1_0.risk_profile,
2026-08-24 17:11:12.482 |         c1_0.role,
2026-08-24 17:11:12.482 |         c1_0.source_of_funds 
2026-08-24 17:11:12.482 |     from
2026-08-24 17:11:12.482 |         customers c1_0 
2026-08-24 17:11:12.482 |     where
2026-08-24 17:11:12.482 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.487 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: 7c6ad407-73f8-45fb-ba87-31a962c31b47] - 
2026-08-24 17:11:12.487 |     select
2026-08-24 17:11:12.487 |         a1_0.id,
2026-08-24 17:11:12.487 |         a1_0.account_name,
2026-08-24 17:11:12.487 |         a1_0.account_number,
2026-08-24 17:11:12.487 |         a1_0.account_type,
2026-08-24 17:11:12.487 |         a1_0.allow_incoming,
2026-08-24 17:11:12.487 |         a1_0.allow_outgoing,
2026-08-24 17:11:12.487 |         a1_0.balance,
2026-08-24 17:11:12.487 |         a1_0.card_cvv,
2026-08-24 17:11:12.487 |         a1_0.card_expiry,
2026-08-24 17:11:12.487 |         a1_0.created_at,
2026-08-24 17:11:12.487 |         a1_0.currency,
2026-08-24 17:11:12.487 |         a1_0.customer_id,
2026-08-24 17:11:12.487 |         a1_0.daily_limit,
2026-08-24 17:11:12.487 |         a1_0.frozen,
2026-08-24 17:11:12.487 |         a1_0.monthly_limit,
2026-08-24 17:11:12.487 |         a1_0.parent_account_id,
2026-08-24 17:11:12.487 |         a1_0.require_dual_approval,
2026-08-24 17:11:12.487 |         a1_0.status,
2026-08-24 17:11:12.488 |         a1_0.swift_code,
2026-08-24 17:11:12.488 |         a1_0.updated_at,
2026-08-24 17:11:12.488 |         a1_0.version 
2026-08-24 17:11:12.488 |     from
2026-08-24 17:11:12.488 |         accounts a1_0 
2026-08-24 17:11:12.488 |     where
2026-08-24 17:11:12.488 |         a1_0.customer_id=?
2026-08-24 17:11:12.488 | Hibernate: 
2026-08-24 17:11:12.488 |     select
2026-08-24 17:11:12.488 |         a1_0.id,
2026-08-24 17:11:12.488 |         a1_0.account_name,
2026-08-24 17:11:12.488 |         a1_0.account_number,
2026-08-24 17:11:12.488 |         a1_0.account_type,
2026-08-24 17:11:12.488 |         a1_0.allow_incoming,
2026-08-24 17:11:12.488 |         a1_0.allow_outgoing,
2026-08-24 17:11:12.488 |         a1_0.balance,
2026-08-24 17:11:12.488 |         a1_0.card_cvv,
2026-08-24 17:11:12.488 |         a1_0.card_expiry,
2026-08-24 17:11:12.488 |         a1_0.created_at,
2026-08-24 17:11:12.488 |         a1_0.currency,
2026-08-24 17:11:12.488 |         a1_0.customer_id,
2026-08-24 17:11:12.488 |         a1_0.daily_limit,
2026-08-24 17:11:12.488 |         a1_0.frozen,
2026-08-24 17:11:12.488 |         a1_0.monthly_limit,
2026-08-24 17:11:12.488 |         a1_0.parent_account_id,
2026-08-24 17:11:12.488 |         a1_0.require_dual_approval,
2026-08-24 17:11:12.488 |         a1_0.status,
2026-08-24 17:11:12.488 |         a1_0.swift_code,
2026-08-24 17:11:12.488 |         a1_0.updated_at,
2026-08-24 17:11:12.488 |         a1_0.version 
2026-08-24 17:11:12.488 |     from
2026-08-24 17:11:12.488 |         accounts a1_0 
2026-08-24 17:11:12.488 |     where
2026-08-24 17:11:12.488 |         a1_0.customer_id=?
2026-08-24 17:11:12.494 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 7c6ad407-73f8-45fb-ba87-31a962c31b47] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 17ms
2026-08-24 17:11:12.496 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:12.496 |     insert 
2026-08-24 17:11:12.496 |     into
2026-08-24 17:11:12.496 |         api_audit_events
2026-08-24 17:11:12.496 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:11:12.496 |     values
2026-08-24 17:11:12.496 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:11:12.496 | Hibernate: 
2026-08-24 17:11:12.496 |     insert 
2026-08-24 17:11:12.496 |     into
2026-08-24 17:11:12.496 |         api_audit_events
2026-08-24 17:11:12.496 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:11:12.496 |     values
2026-08-24 17:11:12.496 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:11:12.516 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=38ms
2026-08-24 17:11:12.703 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /api/v1/accounts
2026-08-24 17:11:12.708 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: d5c8fef7-8b76-4675-8536-d2ce6726fc12] - 
2026-08-24 17:11:12.708 |     select
2026-08-24 17:11:12.708 |         c1_0.id,
2026-08-24 17:11:12.708 |         c1_0.created_at,
2026-08-24 17:11:12.708 |         c1_0.email,
2026-08-24 17:11:12.708 |         c1_0.employment_status,
2026-08-24 17:11:12.708 |         c1_0.first_name,
2026-08-24 17:11:12.708 |         c1_0.job_title,
2026-08-24 17:11:12.708 |         c1_0.kyc_status,
2026-08-24 17:11:12.708 |         c1_0.last_name,
2026-08-24 17:11:12.708 |         c1_0.locked,
2026-08-24 17:11:12.708 |         c1_0.monthly_income,
2026-08-24 17:11:12.708 |         c1_0.password,
2026-08-24 17:11:12.708 |         c1_0.risk_profile,
2026-08-24 17:11:12.708 |         c1_0.role,
2026-08-24 17:11:12.708 |         c1_0.source_of_funds 
2026-08-24 17:11:12.708 |     from
2026-08-24 17:11:12.708 |         customers c1_0 
2026-08-24 17:11:12.708 |     where
2026-08-24 17:11:12.708 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.708 | Hibernate: 
2026-08-24 17:11:12.708 |     select
2026-08-24 17:11:12.708 |         c1_0.id,
2026-08-24 17:11:12.708 |         c1_0.created_at,
2026-08-24 17:11:12.708 |         c1_0.email,
2026-08-24 17:11:12.708 |         c1_0.employment_status,
2026-08-24 17:11:12.708 |         c1_0.first_name,
2026-08-24 17:11:12.708 |         c1_0.job_title,
2026-08-24 17:11:12.708 |         c1_0.kyc_status,
2026-08-24 17:11:12.708 |         c1_0.last_name,
2026-08-24 17:11:12.708 |         c1_0.locked,
2026-08-24 17:11:12.708 |         c1_0.monthly_income,
2026-08-24 17:11:12.708 |         c1_0.password,
2026-08-24 17:11:12.708 |         c1_0.risk_profile,
2026-08-24 17:11:12.708 |         c1_0.role,
2026-08-24 17:11:12.708 |         c1_0.source_of_funds 
2026-08-24 17:11:12.708 |     from
2026-08-24 17:11:12.708 |         customers c1_0 
2026-08-24 17:11:12.708 |     where
2026-08-24 17:11:12.708 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.714 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: d5c8fef7-8b76-4675-8536-d2ce6726fc12] - Secured GET /api/v1/accounts
2026-08-24 17:11:12.718 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: d5c8fef7-8b76-4675-8536-d2ce6726fc12] - 
2026-08-24 17:11:12.718 |     select
2026-08-24 17:11:12.718 |         c1_0.id,
2026-08-24 17:11:12.718 |         c1_0.created_at,
2026-08-24 17:11:12.718 |         c1_0.email,
2026-08-24 17:11:12.718 |         c1_0.employment_status,
2026-08-24 17:11:12.718 |         c1_0.first_name,
2026-08-24 17:11:12.718 |         c1_0.job_title,
2026-08-24 17:11:12.718 |         c1_0.kyc_status,
2026-08-24 17:11:12.718 |         c1_0.last_name,
2026-08-24 17:11:12.718 |         c1_0.locked,
2026-08-24 17:11:12.718 |         c1_0.monthly_income,
2026-08-24 17:11:12.718 |         c1_0.password,
2026-08-24 17:11:12.718 |         c1_0.risk_profile,
2026-08-24 17:11:12.718 |         c1_0.role,
2026-08-24 17:11:12.718 |         c1_0.source_of_funds 
2026-08-24 17:11:12.718 |     from
2026-08-24 17:11:12.718 |         customers c1_0 
2026-08-24 17:11:12.718 |     where
2026-08-24 17:11:12.718 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.718 | Hibernate: 
2026-08-24 17:11:12.718 |     select
2026-08-24 17:11:12.718 |         c1_0.id,
2026-08-24 17:11:12.718 |         c1_0.created_at,
2026-08-24 17:11:12.718 |         c1_0.email,
2026-08-24 17:11:12.718 |         c1_0.employment_status,
2026-08-24 17:11:12.718 |         c1_0.first_name,
2026-08-24 17:11:12.718 |         c1_0.job_title,
2026-08-24 17:11:12.718 |         c1_0.kyc_status,
2026-08-24 17:11:12.718 |         c1_0.last_name,
2026-08-24 17:11:12.718 |         c1_0.locked,
2026-08-24 17:11:12.718 |         c1_0.monthly_income,
2026-08-24 17:11:12.718 |         c1_0.password,
2026-08-24 17:11:12.718 |         c1_0.risk_profile,
2026-08-24 17:11:12.718 |         c1_0.role,
2026-08-24 17:11:12.718 |         c1_0.source_of_funds 
2026-08-24 17:11:12.718 |     from
2026-08-24 17:11:12.718 |         customers c1_0 
2026-08-24 17:11:12.718 |     where
2026-08-24 17:11:12.718 |         upper(c1_0.email)=upper(?)
2026-08-24 17:11:12.722 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: d5c8fef7-8b76-4675-8536-d2ce6726fc12] - 
2026-08-24 17:11:12.722 |     select
2026-08-24 17:11:12.722 |         a1_0.id,
2026-08-24 17:11:12.722 |         a1_0.account_name,
2026-08-24 17:11:12.722 |         a1_0.account_number,
2026-08-24 17:11:12.722 |         a1_0.account_type,
2026-08-24 17:11:12.722 |         a1_0.allow_incoming,
2026-08-24 17:11:12.722 |         a1_0.allow_outgoing,
2026-08-24 17:11:12.722 |         a1_0.balance,
2026-08-24 17:11:12.722 |         a1_0.card_cvv,
2026-08-24 17:11:12.722 |         a1_0.card_expiry,
2026-08-24 17:11:12.722 |         a1_0.created_at,
2026-08-24 17:11:12.722 |         a1_0.currency,
2026-08-24 17:11:12.722 |         a1_0.customer_id,
2026-08-24 17:11:12.722 |         a1_0.daily_limit,
2026-08-24 17:11:12.722 |         a1_0.frozen,
2026-08-24 17:11:12.722 |         a1_0.monthly_limit,
2026-08-24 17:11:12.722 |         a1_0.parent_account_id,
2026-08-24 17:11:12.722 |         a1_0.require_dual_approval,
2026-08-24 17:11:12.722 |         a1_0.status,
2026-08-24 17:11:12.722 |         a1_0.swift_code,
2026-08-24 17:11:12.722 |         a1_0.updated_at,
2026-08-24 17:11:12.722 |         a1_0.version 
2026-08-24 17:11:12.722 |     from
2026-08-24 17:11:12.722 |         accounts a1_0 
2026-08-24 17:11:12.722 |     where
2026-08-24 17:11:12.722 |         a1_0.customer_id=?
2026-08-24 17:11:12.722 | Hibernate: 
2026-08-24 17:11:12.722 |     select
2026-08-24 17:11:12.722 |         a1_0.id,
2026-08-24 17:11:12.722 |         a1_0.account_name,
2026-08-24 17:11:12.722 |         a1_0.account_number,
2026-08-24 17:11:12.722 |         a1_0.account_type,
2026-08-24 17:11:12.722 |         a1_0.allow_incoming,
2026-08-24 17:11:12.722 |         a1_0.allow_outgoing,
2026-08-24 17:11:12.722 |         a1_0.balance,
2026-08-24 17:11:12.722 |         a1_0.card_cvv,
2026-08-24 17:11:12.722 |         a1_0.card_expiry,
2026-08-24 17:11:12.722 |         a1_0.created_at,
2026-08-24 17:11:12.722 |         a1_0.currency,
2026-08-24 17:11:12.722 |         a1_0.customer_id,
2026-08-24 17:11:12.722 |         a1_0.daily_limit,
2026-08-24 17:11:12.722 |         a1_0.frozen,
2026-08-24 17:11:12.722 |         a1_0.monthly_limit,
2026-08-24 17:11:12.722 |         a1_0.parent_account_id,
2026-08-24 17:11:12.722 |         a1_0.require_dual_approval,
2026-08-24 17:11:12.722 |         a1_0.status,
2026-08-24 17:11:12.722 |         a1_0.swift_code,
2026-08-24 17:11:12.722 |         a1_0.updated_at,
2026-08-24 17:11:12.722 |         a1_0.version 
2026-08-24 17:11:12.722 |     from
2026-08-24 17:11:12.722 |         accounts a1_0 
2026-08-24 17:11:12.722 |     where
2026-08-24 17:11:12.722 |         a1_0.customer_id=?
2026-08-24 17:11:12.727 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d5c8fef7-8b76-4675-8536-d2ce6726fc12] - [HTTP LOG] GET /api/v1/accounts - Status: 200 - Duration: 12ms
2026-08-24 17:11:12.729 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:12.729 |     insert 
2026-08-24 17:11:12.729 |     into
2026-08-24 17:11:12.729 |         api_audit_events
2026-08-24 17:11:12.729 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:11:12.729 |     values
2026-08-24 17:11:12.729 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:11:12.729 | Hibernate: 
2026-08-24 17:11:12.729 |     insert 
2026-08-24 17:11:12.729 |     into
2026-08-24 17:11:12.729 |         api_audit_events
2026-08-24 17:11:12.729 |         (api_key_id, auth_failure_reason, authentication_status, authorization_status, client_id, created_at, endpoint, environment, granted_scopes, http_method, idempotency_key, latency_ms, linked_account_id, merchant_id, request_id, request_stage, response_code, risk_decision, source_ip, status_family, user_agent) 
2026-08-24 17:11:12.729 |     values
2026-08-24 17:11:12.729 |         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-08-24 17:11:12.739 | 2026-08-24 09:11:12 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - [API AUDIT] GET /api/v1/accounts → 200 | stage=COMPLETED | keyId=null | acct=null | latency=25ms
2026-08-24 17:11:14.577 | 2026-08-24 09:11:14 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:14.577 |     SELECT
2026-08-24 17:11:14.577 |         o1.* 
2026-08-24 17:11:14.577 |     FROM
2026-08-24 17:11:14.577 |         payment_event_outbox o1 
2026-08-24 17:11:14.577 |     WHERE
2026-08-24 17:11:14.577 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:14.577 |         AND (
2026-08-24 17:11:14.577 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:14.577 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:14.577 |         )   
2026-08-24 17:11:14.577 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:14.577 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:14.577 |             1 
2026-08-24 17:11:14.577 |         FROM
2026-08-24 17:11:14.577 |             payment_event_outbox o2       
2026-08-24 17:11:14.577 |         WHERE
2026-08-24 17:11:14.577 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:14.577 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:14.577 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:14.577 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:14.577 |     ORDER BY
2026-08-24 17:11:14.577 |         o1.created_at ASC 
2026-08-24 17:11:14.577 |     LIMIT
2026-08-24 17:11:14.577 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:14.577 | Hibernate: 
2026-08-24 17:11:14.577 |     SELECT
2026-08-24 17:11:14.577 |         o1.* 
2026-08-24 17:11:14.577 |     FROM
2026-08-24 17:11:14.577 |         payment_event_outbox o1 
2026-08-24 17:11:14.577 |     WHERE
2026-08-24 17:11:14.577 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:14.577 |         AND (
2026-08-24 17:11:14.577 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:14.577 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:14.577 |         )   
2026-08-24 17:11:14.577 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:14.577 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:14.577 |             1 
2026-08-24 17:11:14.577 |         FROM
2026-08-24 17:11:14.577 |             payment_event_outbox o2       
2026-08-24 17:11:14.577 |         WHERE
2026-08-24 17:11:14.577 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:14.577 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:14.577 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:14.577 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:14.577 |     ORDER BY
2026-08-24 17:11:14.577 |         o1.created_at ASC 
2026-08-24 17:11:14.577 |     LIMIT
2026-08-24 17:11:14.577 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:19.582 | 2026-08-24 09:11:19 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:19.582 |     SELECT
2026-08-24 17:11:19.582 |         o1.* 
2026-08-24 17:11:19.582 |     FROM
2026-08-24 17:11:19.582 |         payment_event_outbox o1 
2026-08-24 17:11:19.582 |     WHERE
2026-08-24 17:11:19.582 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:19.582 |         AND (
2026-08-24 17:11:19.582 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:19.582 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:19.582 |         )   
2026-08-24 17:11:19.582 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:19.582 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:19.582 |             1 
2026-08-24 17:11:19.582 |         FROM
2026-08-24 17:11:19.582 |             payment_event_outbox o2       
2026-08-24 17:11:19.582 |         WHERE
2026-08-24 17:11:19.582 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:19.582 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:19.582 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:19.582 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:19.582 |     ORDER BY
2026-08-24 17:11:19.582 |         o1.created_at ASC 
2026-08-24 17:11:19.582 |     LIMIT
2026-08-24 17:11:19.582 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:19.582 | Hibernate: 
2026-08-24 17:11:19.582 |     SELECT
2026-08-24 17:11:19.582 |         o1.* 
2026-08-24 17:11:19.582 |     FROM
2026-08-24 17:11:19.582 |         payment_event_outbox o1 
2026-08-24 17:11:19.582 |     WHERE
2026-08-24 17:11:19.582 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:19.582 |         AND (
2026-08-24 17:11:19.582 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:19.582 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:19.582 |         )   
2026-08-24 17:11:19.582 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:19.582 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:19.582 |             1 
2026-08-24 17:11:19.582 |         FROM
2026-08-24 17:11:19.582 |             payment_event_outbox o2       
2026-08-24 17:11:19.582 |         WHERE
2026-08-24 17:11:19.582 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:19.582 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:19.582 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:19.582 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:19.582 |     ORDER BY
2026-08-24 17:11:19.582 |         o1.created_at ASC 
2026-08-24 17:11:19.582 |     LIMIT
2026-08-24 17:11:19.582 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:21.496 | 2026-08-24 09:11:21 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:11:21.496 | 2026-08-24 09:11:21 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:11:21.497 | 2026-08-24 09:11:21 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 03a89cbb-f395-434d-97c0-95ef7d0ffd82] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:11:21.506 | 2026-08-24 09:11:21 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 03a89cbb-f395-434d-97c0-95ef7d0ffd82] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 9ms
2026-08-24 17:11:24.587 | 2026-08-24 09:11:24 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:24.587 |     SELECT
2026-08-24 17:11:24.587 |         o1.* 
2026-08-24 17:11:24.587 |     FROM
2026-08-24 17:11:24.587 |         payment_event_outbox o1 
2026-08-24 17:11:24.587 |     WHERE
2026-08-24 17:11:24.587 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:24.587 |         AND (
2026-08-24 17:11:24.587 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:24.587 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:24.587 |         )   
2026-08-24 17:11:24.587 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:24.587 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:24.587 |             1 
2026-08-24 17:11:24.587 |         FROM
2026-08-24 17:11:24.587 |             payment_event_outbox o2       
2026-08-24 17:11:24.587 |         WHERE
2026-08-24 17:11:24.587 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:24.587 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:24.587 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:24.587 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:24.587 |     ORDER BY
2026-08-24 17:11:24.587 |         o1.created_at ASC 
2026-08-24 17:11:24.587 |     LIMIT
2026-08-24 17:11:24.587 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:24.587 | Hibernate: 
2026-08-24 17:11:24.587 |     SELECT
2026-08-24 17:11:24.587 |         o1.* 
2026-08-24 17:11:24.587 |     FROM
2026-08-24 17:11:24.587 |         payment_event_outbox o1 
2026-08-24 17:11:24.587 |     WHERE
2026-08-24 17:11:24.587 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:24.587 |         AND (
2026-08-24 17:11:24.587 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:24.587 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:24.587 |         )   
2026-08-24 17:11:24.587 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:24.587 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:24.587 |             1 
2026-08-24 17:11:24.587 |         FROM
2026-08-24 17:11:24.587 |             payment_event_outbox o2       
2026-08-24 17:11:24.587 |         WHERE
2026-08-24 17:11:24.587 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:24.587 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:24.587 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:24.587 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:24.587 |     ORDER BY
2026-08-24 17:11:24.587 |         o1.created_at ASC 
2026-08-24 17:11:24.587 |     LIMIT
2026-08-24 17:11:24.587 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:29.592 | 2026-08-24 09:11:29 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:29.592 |     SELECT
2026-08-24 17:11:29.592 |         o1.* 
2026-08-24 17:11:29.592 |     FROM
2026-08-24 17:11:29.592 |         payment_event_outbox o1 
2026-08-24 17:11:29.592 |     WHERE
2026-08-24 17:11:29.592 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:29.592 |         AND (
2026-08-24 17:11:29.592 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:29.592 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:29.592 |         )   
2026-08-24 17:11:29.592 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:29.592 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:29.592 |             1 
2026-08-24 17:11:29.592 |         FROM
2026-08-24 17:11:29.592 |             payment_event_outbox o2       
2026-08-24 17:11:29.592 |         WHERE
2026-08-24 17:11:29.592 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:29.592 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:29.592 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:29.592 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:29.592 |     ORDER BY
2026-08-24 17:11:29.592 |         o1.created_at ASC 
2026-08-24 17:11:29.592 |     LIMIT
2026-08-24 17:11:29.592 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:29.592 | Hibernate: 
2026-08-24 17:11:29.592 |     SELECT
2026-08-24 17:11:29.592 |         o1.* 
2026-08-24 17:11:29.592 |     FROM
2026-08-24 17:11:29.592 |         payment_event_outbox o1 
2026-08-24 17:11:29.592 |     WHERE
2026-08-24 17:11:29.592 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:29.592 |         AND (
2026-08-24 17:11:29.592 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:29.592 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:29.592 |         )   
2026-08-24 17:11:29.592 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:29.592 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:29.592 |             1 
2026-08-24 17:11:29.592 |         FROM
2026-08-24 17:11:29.592 |             payment_event_outbox o2       
2026-08-24 17:11:29.592 |         WHERE
2026-08-24 17:11:29.592 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:29.592 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:29.592 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:29.592 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:29.592 |     ORDER BY
2026-08-24 17:11:29.592 |         o1.created_at ASC 
2026-08-24 17:11:29.592 |     LIMIT
2026-08-24 17:11:29.592 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:31.637 | 2026-08-24 09:11:31 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:11:31.637 | 2026-08-24 09:11:31 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:11:31.638 | 2026-08-24 09:11:31 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 2c912467-9ddc-45fe-9dcd-354e090614de] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:11:31.642 | 2026-08-24 09:11:31 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 2c912467-9ddc-45fe-9dcd-354e090614de] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-24 17:11:34.596 | 2026-08-24 09:11:34 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:34.596 |     SELECT
2026-08-24 17:11:34.596 |         o1.* 
2026-08-24 17:11:34.596 |     FROM
2026-08-24 17:11:34.596 |         payment_event_outbox o1 
2026-08-24 17:11:34.596 |     WHERE
2026-08-24 17:11:34.596 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:34.596 |         AND (
2026-08-24 17:11:34.596 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:34.596 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:34.596 |         )   
2026-08-24 17:11:34.596 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:34.596 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:34.596 |             1 
2026-08-24 17:11:34.596 |         FROM
2026-08-24 17:11:34.596 |             payment_event_outbox o2       
2026-08-24 17:11:34.596 |         WHERE
2026-08-24 17:11:34.596 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:34.596 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:34.596 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:34.596 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:34.596 |     ORDER BY
2026-08-24 17:11:34.596 |         o1.created_at ASC 
2026-08-24 17:11:34.596 |     LIMIT
2026-08-24 17:11:34.596 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:34.596 | Hibernate: 
2026-08-24 17:11:34.596 |     SELECT
2026-08-24 17:11:34.596 |         o1.* 
2026-08-24 17:11:34.596 |     FROM
2026-08-24 17:11:34.596 |         payment_event_outbox o1 
2026-08-24 17:11:34.596 |     WHERE
2026-08-24 17:11:34.596 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:34.596 |         AND (
2026-08-24 17:11:34.596 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:34.596 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:34.596 |         )   
2026-08-24 17:11:34.596 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:34.596 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:34.596 |             1 
2026-08-24 17:11:34.596 |         FROM
2026-08-24 17:11:34.596 |             payment_event_outbox o2       
2026-08-24 17:11:34.596 |         WHERE
2026-08-24 17:11:34.596 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:34.596 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:34.596 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:34.596 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:34.596 |     ORDER BY
2026-08-24 17:11:34.596 |         o1.created_at ASC 
2026-08-24 17:11:34.596 |     LIMIT
2026-08-24 17:11:34.596 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:39.600 | 2026-08-24 09:11:39 [MessageBroker-15] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:39.601 |     SELECT
2026-08-24 17:11:39.601 |         o1.* 
2026-08-24 17:11:39.601 |     FROM
2026-08-24 17:11:39.601 |         payment_event_outbox o1 
2026-08-24 17:11:39.601 |     WHERE
2026-08-24 17:11:39.601 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:39.601 |         AND (
2026-08-24 17:11:39.601 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:39.601 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:39.601 |         )   
2026-08-24 17:11:39.601 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:39.601 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:39.601 |             1 
2026-08-24 17:11:39.601 |         FROM
2026-08-24 17:11:39.601 |             payment_event_outbox o2       
2026-08-24 17:11:39.601 |         WHERE
2026-08-24 17:11:39.601 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:39.601 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:39.601 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:39.601 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:39.601 |     ORDER BY
2026-08-24 17:11:39.601 |         o1.created_at ASC 
2026-08-24 17:11:39.601 |     LIMIT
2026-08-24 17:11:39.601 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:39.601 | Hibernate: 
2026-08-24 17:11:39.601 |     SELECT
2026-08-24 17:11:39.601 |         o1.* 
2026-08-24 17:11:39.601 |     FROM
2026-08-24 17:11:39.601 |         payment_event_outbox o1 
2026-08-24 17:11:39.601 |     WHERE
2026-08-24 17:11:39.601 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:39.601 |         AND (
2026-08-24 17:11:39.601 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:39.601 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:39.601 |         )   
2026-08-24 17:11:39.601 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:39.601 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:39.601 |             1 
2026-08-24 17:11:39.601 |         FROM
2026-08-24 17:11:39.601 |             payment_event_outbox o2       
2026-08-24 17:11:39.601 |         WHERE
2026-08-24 17:11:39.601 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:39.601 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:39.601 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:39.601 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:39.601 |     ORDER BY
2026-08-24 17:11:39.601 |         o1.created_at ASC 
2026-08-24 17:11:39.601 |     LIMIT
2026-08-24 17:11:39.601 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:41.733 | 2026-08-24 09:11:41 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-24 17:11:41.734 | 2026-08-24 09:11:41 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-24 17:11:41.734 | 2026-08-24 09:11:41 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: c329d8cf-efad-4ac6-b3ee-74534dfec1a0] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-24 17:11:41.738 | 2026-08-24 09:11:41 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: c329d8cf-efad-4ac6-b3ee-74534dfec1a0] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-24 17:11:44.074 | 2026-08-24 09:11:44 [MessageBroker-6] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:44.074 |     SELECT
2026-08-24 17:11:44.074 |         * 
2026-08-24 17:11:44.074 |     FROM
2026-08-24 17:11:44.074 |         payment_event_outbox 
2026-08-24 17:11:44.074 |     WHERE
2026-08-24 17:11:44.074 |         status = 'DELIVERING'   
2026-08-24 17:11:44.074 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:44.074 | Hibernate: 
2026-08-24 17:11:44.074 |     SELECT
2026-08-24 17:11:44.074 |         * 
2026-08-24 17:11:44.074 |     FROM
2026-08-24 17:11:44.074 |         payment_event_outbox 
2026-08-24 17:11:44.074 |     WHERE
2026-08-24 17:11:44.074 |         status = 'DELIVERING'   
2026-08-24 17:11:44.074 |         AND locked_at < ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:44.091 | 2026-08-24 09:11:44 [MessageBroker-1] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:44.091 |     select
2026-08-24 17:11:44.091 |         icl1_0.id,
2026-08-24 17:11:44.091 |         icl1_0.attempt_count,
2026-08-24 17:11:44.091 |         icl1_0.callback_url,
2026-08-24 17:11:44.091 |         icl1_0.created_at,
2026-08-24 17:11:44.091 |         icl1_0.next_retry_at,
2026-08-24 17:11:44.091 |         icl1_0.payload,
2026-08-24 17:11:44.091 |         icl1_0.payment_session_id,
2026-08-24 17:11:44.091 |         icl1_0.response_body,
2026-08-24 17:11:44.091 |         icl1_0.response_code,
2026-08-24 17:11:44.091 |         icl1_0.status,
2026-08-24 17:11:44.091 |         icl1_0.updated_at 
2026-08-24 17:11:44.091 |     from
2026-08-24 17:11:44.091 |         institution_callback_log icl1_0 
2026-08-24 17:11:44.091 |     where
2026-08-24 17:11:44.091 |         icl1_0.status=? 
2026-08-24 17:11:44.091 |         and icl1_0.next_retry_at<?
2026-08-24 17:11:44.091 | Hibernate: 
2026-08-24 17:11:44.091 |     select
2026-08-24 17:11:44.091 |         icl1_0.id,
2026-08-24 17:11:44.091 |         icl1_0.attempt_count,
2026-08-24 17:11:44.091 |         icl1_0.callback_url,
2026-08-24 17:11:44.091 |         icl1_0.created_at,
2026-08-24 17:11:44.091 |         icl1_0.next_retry_at,
2026-08-24 17:11:44.091 |         icl1_0.payload,
2026-08-24 17:11:44.091 |         icl1_0.payment_session_id,
2026-08-24 17:11:44.091 |         icl1_0.response_body,
2026-08-24 17:11:44.091 |         icl1_0.response_code,
2026-08-24 17:11:44.091 |         icl1_0.status,
2026-08-24 17:11:44.091 |         icl1_0.updated_at 
2026-08-24 17:11:44.091 |     from
2026-08-24 17:11:44.091 |         institution_callback_log icl1_0 
2026-08-24 17:11:44.091 |     where
2026-08-24 17:11:44.091 |         icl1_0.status=? 
2026-08-24 17:11:44.091 |         and icl1_0.next_retry_at<?
2026-08-24 17:11:44.603 | 2026-08-24 09:11:44 [MessageBroker-11] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-24 17:11:44.603 |     SELECT
2026-08-24 17:11:44.603 |         o1.* 
2026-08-24 17:11:44.603 |     FROM
2026-08-24 17:11:44.603 |         payment_event_outbox o1 
2026-08-24 17:11:44.603 |     WHERE
2026-08-24 17:11:44.603 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:44.603 |         AND (
2026-08-24 17:11:44.603 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:44.603 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:44.603 |         )   
2026-08-24 17:11:44.603 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:44.603 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:44.603 |             1 
2026-08-24 17:11:44.603 |         FROM
2026-08-24 17:11:44.603 |             payment_event_outbox o2       
2026-08-24 17:11:44.603 |         WHERE
2026-08-24 17:11:44.603 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:44.603 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:44.603 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:44.603 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:44.603 |     ORDER BY
2026-08-24 17:11:44.603 |         o1.created_at ASC 
2026-08-24 17:11:44.603 |     LIMIT
2026-08-24 17:11:44.603 |         ? FOR UPDATE SKIP LOCKED 
2026-08-24 17:11:44.603 | Hibernate: 
2026-08-24 17:11:44.603 |     SELECT
2026-08-24 17:11:44.603 |         o1.* 
2026-08-24 17:11:44.603 |     FROM
2026-08-24 17:11:44.603 |         payment_event_outbox o1 
2026-08-24 17:11:44.603 |     WHERE
2026-08-24 17:11:44.603 |         o1.status IN ('PENDING', 'RETRY')   
2026-08-24 17:11:44.603 |         AND (
2026-08-24 17:11:44.603 |             o1.next_attempt_at IS NULL 
2026-08-24 17:11:44.603 |             OR o1.next_attempt_at <= CURRENT_TIMESTAMP
2026-08-24 17:11:44.603 |         )   
2026-08-24 17:11:44.603 |         AND o1.locked_at IS NULL   
2026-08-24 17:11:44.603 |         AND NOT EXISTS (       SELECT
2026-08-24 17:11:44.603 |             1 
2026-08-24 17:11:44.603 |         FROM
2026-08-24 17:11:44.603 |             payment_event_outbox o2       
2026-08-24 17:11:44.603 |         WHERE
2026-08-24 17:11:44.603 |             o2.aggregate_type = o1.aggregate_type         
2026-08-24 17:11:44.603 |             AND o2.aggregate_id = o1.aggregate_id         
2026-08-24 17:11:44.603 |             AND o2.sequence < o1.sequence         
2026-08-24 17:11:44.603 |             AND o2.status != 'DELIVERED'   ) 
2026-08-24 17:11:44.603 |     ORDER BY
2026-08-24 17:11:44.603 |         o1.created_at ASC 
2026-08-24 17:11:44.603 |     LIMIT
2026-08-24 17:11:44.603 |         ? FOR UPDATE SKIP LOCKED 