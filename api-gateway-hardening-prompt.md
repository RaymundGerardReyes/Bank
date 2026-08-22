2026-08-22 03:44:15.486 |   _   _               _                     _   ____              _    _             
2026-08-22 03:44:15.486 |  | | | | __ _ _ __ __| | ___ _ __   ___  __| | | __ )  __ _ _ __ | | _(_)_ __   __ _ 
2026-08-22 03:44:15.486 |  | |_| |/ _` | '__/ _` |/ _ \ '_ \ / _ \/ _` | |  _ \ / _` | '_ \| |/ / | '_ \ / _` |
2026-08-22 03:44:15.486 |  |  _  | (_| | | | (_| |  __/ | | |  __/ (_| | | |_) | (_| | | | |   <| | | | | (_| |
2026-08-22 03:44:15.486 |  |_| |_|\__,_|_|  \__,_|\___|_| |_|\___|\__,_| |____/ \__,_|_| |_|_|\_\_|_| |_|\__, |
2026-08-22 03:44:15.486 |                                                                                |___/ 
2026-08-22 03:44:15.486 |  :: Hardened Modular Monolith Backend ::
2026-08-22 03:44:15.486 | 
2026-08-22 03:44:15.503 | 2026-08-21 19:44:15 [background-preinit] INFO  o.h.validator.internal.util.Version [X-Request-Id: ] - HV000001: Hibernate Validator 8.0.1.Final
2026-08-22 03:44:15.613 | 2026-08-21 19:44:15 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - Starting BankingApplication v0.1.0 using Java 21.0.11 with PID 1 (/app/app.jar started by spring in /app)
2026-08-22 03:44:15.613 | 2026-08-21 19:44:15 [main] DEBUG c.company.banking.BankingApplication [X-Request-Id: ] - Running with Spring Boot v3.4.0, Spring v6.2.0
2026-08-22 03:44:15.614 | 2026-08-21 19:44:15 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - The following 1 profile is active: "dev"
2026-08-22 03:44:18.055 | 2026-08-21 19:44:18 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-08-22 03:44:18.329 | 2026-08-21 19:44:18 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Finished Spring Data repository scanning in 255 ms. Found 44 JPA repository interfaces.
2026-08-22 03:44:20.305 | 2026-08-21 19:44:20 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer [X-Request-Id: ] - Tomcat initialized with port 8080 (http)
2026-08-22 03:44:20.347 | 2026-08-21 19:44:20 [main] INFO  o.a.coyote.http11.Http11NioProtocol [X-Request-Id: ] - Initializing ProtocolHandler ["http-nio-0.0.0.0-8080"]
2026-08-22 03:44:20.362 | 2026-08-21 19:44:20 [main] INFO  o.a.catalina.core.StandardService [X-Request-Id: ] - Starting service [Tomcat]
2026-08-22 03:44:20.362 | 2026-08-21 19:44:20 [main] INFO  o.a.catalina.core.StandardEngine [X-Request-Id: ] - Starting Servlet engine: [Apache Tomcat/10.1.33]
2026-08-22 03:44:20.459 | 2026-08-21 19:44:20 [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] [X-Request-Id: ] - Initializing Spring embedded WebApplicationContext
2026-08-22 03:44:20.462 | 2026-08-21 19:44:20 [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext [X-Request-Id: ] - Root WebApplicationContext: initialization completed in 4769 ms
2026-08-22 03:44:21.458 | 2026-08-21 19:44:21 [main] INFO  com.zaxxer.hikari.HikariDataSource [X-Request-Id: ] - HikariPool-1 - Starting...
2026-08-22 03:44:21.792 | 2026-08-21 19:44:21 [main] INFO  com.zaxxer.hikari.pool.HikariPool [X-Request-Id: ] - HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@f9cd1e6
2026-08-22 03:44:21.794 | 2026-08-21 19:44:21 [main] INFO  com.zaxxer.hikari.HikariDataSource [X-Request-Id: ] - HikariPool-1 - Start completed.
2026-08-22 03:44:21.865 | 2026-08-21 19:44:21 [main] INFO  org.flywaydb.core.FlywayExecutor [X-Request-Id: ] - Database: jdbc:postgresql://database:5432/banking (PostgreSQL 17.10)
2026-08-22 03:44:22.061 | 2026-08-21 19:44:22 [main] INFO  o.f.core.internal.command.DbValidate [X-Request-Id: ] - Successfully validated 38 migrations (execution time 00:00.086s)
2026-08-22 03:44:22.063 | 2026-08-21 19:44:22 [main] WARN  org.flywaydb.core.Flyway [X-Request-Id: ] - cleanOnValidationError is deprecated and will be removed in a later release
2026-08-22 03:44:22.087 | 2026-08-21 19:44:22 [main] INFO  o.f.core.internal.command.DbMigrate [X-Request-Id: ] - Current version of schema "public": 39
2026-08-22 03:44:22.093 | 2026-08-21 19:44:22 [main] INFO  o.f.core.internal.command.DbMigrate [X-Request-Id: ] - Schema "public" is up to date. No migration necessary.
2026-08-22 03:44:22.298 | 2026-08-21 19:44:22 [main] INFO  o.h.jpa.internal.util.LogHelper [X-Request-Id: ] - HHH000204: Processing PersistenceUnitInfo [name: default]
2026-08-22 03:44:22.371 | 2026-08-21 19:44:22 [main] INFO  org.hibernate.Version [X-Request-Id: ] - HHH000412: Hibernate ORM core version 6.6.2.Final
2026-08-22 03:44:22.419 | 2026-08-21 19:44:22 [main] INFO  o.h.c.i.RegionFactoryInitiator [X-Request-Id: ] - HHH000026: Second-level cache disabled
2026-08-22 03:44:22.824 | 2026-08-21 19:44:22 [main] INFO  o.s.o.j.p.SpringPersistenceUnitInfo [X-Request-Id: ] - No LoadTimeWeaver setup: ignoring JPA class transformer
2026-08-22 03:44:22.899 | 2026-08-21 19:44:22 [main] WARN  org.hibernate.orm.deprecation [X-Request-Id: ] - HHH90000025: PostgreSQLDialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default)
2026-08-22 03:44:22.920 | 2026-08-21 19:44:22 [main] INFO  o.hibernate.orm.connections.pooling [X-Request-Id: ] - HHH10001005: Database info:
2026-08-22 03:44:22.920 | 	Database JDBC URL [Connecting through datasource 'HikariDataSource (HikariPool-1)']
2026-08-22 03:44:22.920 | 	Database driver: undefined/unknown
2026-08-22 03:44:22.920 | 	Database version: 17.10
2026-08-22 03:44:22.920 | 	Autocommit mode: undefined/unknown
2026-08-22 03:44:22.920 | 	Isolation level: undefined/unknown
2026-08-22 03:44:22.920 | 	Minimum pool size: undefined/unknown
2026-08-22 03:44:22.920 | 	Maximum pool size: undefined/unknown
2026-08-22 03:44:25.404 | 2026-08-21 19:44:25 [main] INFO  o.h.e.t.j.p.i.JtaPlatformInitiator [X-Request-Id: ] - HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-08-22 03:44:25.529 | 2026-08-21 19:44:25 [main] INFO  o.s.o.j.LocalContainerEntityManagerFactoryBean [X-Request-Id: ] - Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-08-22 03:44:26.361 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.s.jwt.JwtAuthenticationFilter [X-Request-Id: ] - Filter 'jwtAuthenticationFilter' configured for use
2026-08-22 03:44:26.361 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.web.filter.BffIdentityFilter [X-Request-Id: ] - Filter 'bffIdentityFilter' configured for use
2026-08-22 03:44:26.361 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.web.filter.RateLimitFilter [X-Request-Id: ] - Filter 'rateLimitFilter' configured for use
2026-08-22 03:44:26.361 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.a.security.ApiSignatureFilter [X-Request-Id: ] - Filter 'apiSignatureFilter' configured for use
2026-08-22 03:44:26.362 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ] - Filter 'requestLoggingFilter' configured for use
2026-08-22 03:44:26.362 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.a.s.ApiGatewayIdempotencyInterceptor [X-Request-Id: ] - Filter 'apiGatewayIdempotencyInterceptor' configured for use
2026-08-22 03:44:26.362 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.web.filter.CorrelationIdFilter [X-Request-Id: ] - Filter 'correlationIdFilter' configured for use
2026-08-22 03:44:26.365 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.a.s.GatewayRateLimitFilter [X-Request-Id: ] - Filter 'gatewayRateLimitFilter' configured for use
2026-08-22 03:44:26.366 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.a.s.ApiKeyAuthenticationFilter [X-Request-Id: ] - Filter 'apiKeyAuthenticationFilter' configured for use
2026-08-22 03:44:26.366 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.w.filter.SecurityHeadersFilter [X-Request-Id: ] - Filter 'securityHeadersFilter' configured for use
2026-08-22 03:44:26.366 | 2026-08-21 19:44:26 [main] DEBUG c.c.b.a.s.ApiAuditLoggingFilter [X-Request-Id: ] - Filter 'apiAuditLoggingFilter' configured for use
2026-08-22 03:44:27.843 | 2026-08-21 19:44:27 [main] INFO  o.s.d.j.r.query.QueryEnhancerFactory [X-Request-Id: ] - Hibernate is in classpath; If applicable, HQL parser will be used.
2026-08-22 03:44:28.958 | 2026-08-21 19:44:28 [main] INFO  o.s.s.c.a.a.c.InitializeAuthenticationProviderBeanManagerConfigurer$InitializeAuthenticationProviderManagerConfigurer [X-Request-Id: ] - Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-08-22 03:44:28.960 | 2026-08-21 19:44:28 [main] WARN  o.s.s.c.a.a.c.InitializeUserDetailsBeanManagerConfigurer$InitializeUserDetailsManagerConfigurer [X-Request-Id: ] - Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-08-22 03:44:29.299 | 2026-08-21 19:44:29 [main] WARN  o.s.b.a.o.j.JpaBaseConfiguration$JpaWebConfiguration [X-Request-Id: ] - spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2026-08-22 03:44:30.046 | 2026-08-21 19:44:30 [main] INFO  o.s.b.a.e.web.EndpointLinksResolver [X-Request-Id: ] - Exposing 3 endpoints beneath base path '/actuator'
2026-08-22 03:44:30.217 | 2026-08-21 19:44:30 [main] DEBUG o.s.s.web.DefaultSecurityFilterChain [X-Request-Id: ] - Will secure Or [Mvc [pattern='/actuator/**']] with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, LogoutFilter, BasicAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, ExceptionTranslationFilter, AuthorizationFilter
2026-08-22 03:44:30.280 | 2026-08-21 19:44:30 [main] DEBUG o.s.s.web.DefaultSecurityFilterChain [X-Request-Id: ] - Will secure any request with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, LogoutFilter, CorrelationIdFilter, BffIdentityFilter, ApiKeyAuthenticationFilter, JwtAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, SessionManagementFilter, ExceptionTranslationFilter, AuthorizationFilter
2026-08-22 03:44:31.094 | 2026-08-21 19:44:31 [main] INFO  o.s.m.s.b.SimpleBrokerMessageHandler [X-Request-Id: ] - Starting...
2026-08-22 03:44:31.095 | 2026-08-21 19:44:31 [main] INFO  o.s.m.s.b.SimpleBrokerMessageHandler [X-Request-Id: ] - BrokerAvailabilityEvent[available=true, SimpleBrokerMessageHandler [org.springframework.messaging.simp.broker.DefaultSubscriptionRegistry@51c8a421]]
2026-08-22 03:44:31.097 | 2026-08-21 19:44:31 [main] INFO  o.s.m.s.b.SimpleBrokerMessageHandler [X-Request-Id: ] - Started.
2026-08-22 03:44:31.097 | 2026-08-21 19:44:31 [main] INFO  o.a.coyote.http11.Http11NioProtocol [X-Request-Id: ] - Starting ProtocolHandler ["http-nio-0.0.0.0-8080"]
2026-08-22 03:44:31.119 | 2026-08-21 19:44:31 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer [X-Request-Id: ] - Tomcat started on port 8080 (http) with context path '/'
2026-08-22 03:44:31.147 | 2026-08-21 19:44:31 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - Started BankingApplication in 16.588 seconds (process running for 17.929)
2026-08-22 03:44:31.280 | 2026-08-21 19:44:31 [MessageBroker-7] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:44:31.280 |     select
2026-08-22 03:44:31.280 |         icl1_0.id,
2026-08-22 03:44:31.280 |         icl1_0.attempt_count,
2026-08-22 03:44:31.280 |         icl1_0.callback_url,
2026-08-22 03:44:31.280 |         icl1_0.created_at,
2026-08-22 03:44:31.280 |         icl1_0.next_retry_at,
2026-08-22 03:44:31.280 |         icl1_0.payload,
2026-08-22 03:44:31.280 |         icl1_0.payment_session_id,
2026-08-22 03:44:31.280 |         icl1_0.response_body,
2026-08-22 03:44:31.280 |         icl1_0.response_code,
2026-08-22 03:44:31.280 |         icl1_0.status,
2026-08-22 03:44:31.280 |         icl1_0.updated_at 
2026-08-22 03:44:31.280 |     from
2026-08-22 03:44:31.280 |         institution_callback_log icl1_0 
2026-08-22 03:44:31.280 |     where
2026-08-22 03:44:31.280 |         icl1_0.status=? 
2026-08-22 03:44:31.280 |         and icl1_0.next_retry_at<?
2026-08-22 03:44:31.281 | Hibernate: 
2026-08-22 03:44:31.281 |     select
2026-08-22 03:44:31.281 |         icl1_0.id,
2026-08-22 03:44:31.281 |         icl1_0.attempt_count,
2026-08-22 03:44:31.281 |         icl1_0.callback_url,
2026-08-22 03:44:31.281 |         icl1_0.created_at,
2026-08-22 03:44:31.281 |         icl1_0.next_retry_at,
2026-08-22 03:44:31.281 |         icl1_0.payload,
2026-08-22 03:44:31.281 |         icl1_0.payment_session_id,
2026-08-22 03:44:31.281 |         icl1_0.response_body,
2026-08-22 03:44:31.281 |         icl1_0.response_code,
2026-08-22 03:44:31.281 |         icl1_0.status,
2026-08-22 03:44:31.281 |         icl1_0.updated_at 
2026-08-22 03:44:31.281 |     from
2026-08-22 03:44:31.281 |         institution_callback_log icl1_0 
2026-08-22 03:44:31.281 |     where
2026-08-22 03:44:31.281 |         icl1_0.status=? 
2026-08-22 03:44:31.281 |         and icl1_0.next_retry_at<?
2026-08-22 03:44:31.317 | 2026-08-21 19:44:31 [main] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:44:31.317 |     select
2026-08-22 03:44:31.317 |         c1_0.id,
2026-08-22 03:44:31.317 |         c1_0.created_at,
2026-08-22 03:44:31.317 |         c1_0.email,
2026-08-22 03:44:31.317 |         c1_0.employment_status,
2026-08-22 03:44:31.317 |         c1_0.first_name,
2026-08-22 03:44:31.317 |         c1_0.job_title,
2026-08-22 03:44:31.317 |         c1_0.kyc_status,
2026-08-22 03:44:31.317 |         c1_0.last_name,
2026-08-22 03:44:31.317 |         c1_0.locked,
2026-08-22 03:44:31.317 |         c1_0.monthly_income,
2026-08-22 03:44:31.317 |         c1_0.password,
2026-08-22 03:44:31.317 |         c1_0.risk_profile,
2026-08-22 03:44:31.317 |         c1_0.role,
2026-08-22 03:44:31.317 |         c1_0.source_of_funds 
2026-08-22 03:44:31.317 |     from
2026-08-22 03:44:31.317 |         customers c1_0 
2026-08-22 03:44:31.317 |     where
2026-08-22 03:44:31.317 |         upper(c1_0.email)=upper(?)
2026-08-22 03:44:31.317 | Hibernate: 
2026-08-22 03:44:31.317 |     select
2026-08-22 03:44:31.317 |         c1_0.id,
2026-08-22 03:44:31.317 |         c1_0.created_at,
2026-08-22 03:44:31.317 |         c1_0.email,
2026-08-22 03:44:31.317 |         c1_0.employment_status,
2026-08-22 03:44:31.317 |         c1_0.first_name,
2026-08-22 03:44:31.317 |         c1_0.job_title,
2026-08-22 03:44:31.317 |         c1_0.kyc_status,
2026-08-22 03:44:31.317 |         c1_0.last_name,
2026-08-22 03:44:31.317 |         c1_0.locked,
2026-08-22 03:44:31.317 |         c1_0.monthly_income,
2026-08-22 03:44:31.317 |         c1_0.password,
2026-08-22 03:44:31.317 |         c1_0.risk_profile,
2026-08-22 03:44:31.317 |         c1_0.role,
2026-08-22 03:44:31.317 |         c1_0.source_of_funds 
2026-08-22 03:44:31.317 |     from
2026-08-22 03:44:31.317 |         customers c1_0 
2026-08-22 03:44:31.317 |     where
2026-08-22 03:44:31.317 |         upper(c1_0.email)=upper(?)
2026-08-22 03:44:31.341 | 2026-08-21 19:44:31 [main] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:44:31.341 |     select
2026-08-22 03:44:31.341 |         c1_0.id,
2026-08-22 03:44:31.341 |         c1_0.created_at,
2026-08-22 03:44:31.341 |         c1_0.email,
2026-08-22 03:44:31.341 |         c1_0.employment_status,
2026-08-22 03:44:31.341 |         c1_0.first_name,
2026-08-22 03:44:31.341 |         c1_0.job_title,
2026-08-22 03:44:31.341 |         c1_0.kyc_status,
2026-08-22 03:44:31.341 |         c1_0.last_name,
2026-08-22 03:44:31.341 |         c1_0.locked,
2026-08-22 03:44:31.341 |         c1_0.monthly_income,
2026-08-22 03:44:31.341 |         c1_0.password,
2026-08-22 03:44:31.341 |         c1_0.risk_profile,
2026-08-22 03:44:31.341 |         c1_0.role,
2026-08-22 03:44:31.341 |         c1_0.source_of_funds 
2026-08-22 03:44:31.341 |     from
2026-08-22 03:44:31.341 |         customers c1_0 
2026-08-22 03:44:31.341 |     where
2026-08-22 03:44:31.341 |         upper(c1_0.email)=upper(?)
2026-08-22 03:44:31.341 | Hibernate: 
2026-08-22 03:44:31.341 |     select
2026-08-22 03:44:31.341 |         c1_0.id,
2026-08-22 03:44:31.341 |         c1_0.created_at,
2026-08-22 03:44:31.341 |         c1_0.email,
2026-08-22 03:44:31.341 |         c1_0.employment_status,
2026-08-22 03:44:31.341 |         c1_0.first_name,
2026-08-22 03:44:31.341 |         c1_0.job_title,
2026-08-22 03:44:31.341 |         c1_0.kyc_status,
2026-08-22 03:44:31.341 |         c1_0.last_name,
2026-08-22 03:44:31.341 |         c1_0.locked,
2026-08-22 03:44:31.341 |         c1_0.monthly_income,
2026-08-22 03:44:31.341 |         c1_0.password,
2026-08-22 03:44:31.341 |         c1_0.risk_profile,
2026-08-22 03:44:31.341 |         c1_0.role,
2026-08-22 03:44:31.341 |         c1_0.source_of_funds 
2026-08-22 03:44:31.341 |     from
2026-08-22 03:44:31.341 |         customers c1_0 
2026-08-22 03:44:31.341 |     where
2026-08-22 03:44:31.341 |         upper(c1_0.email)=upper(?)
2026-08-22 03:44:33.550 | 2026-08-21 19:44:33 [http-nio-0.0.0.0-8080-exec-1] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] [X-Request-Id: ] - Initializing Spring DispatcherServlet 'dispatcherServlet'
2026-08-22 03:44:33.551 | 2026-08-21 19:44:33 [http-nio-0.0.0.0-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet [X-Request-Id: ] - Initializing Servlet 'dispatcherServlet'
2026-08-22 03:44:33.554 | 2026-08-21 19:44:33 [http-nio-0.0.0.0-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet [X-Request-Id: ] - Completed initialization in 4 ms
2026-08-22 03:44:33.574 | 2026-08-21 19:44:33 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:44:33.593 | 2026-08-21 19:44:33 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:44:33.696 | 2026-08-21 19:44:33 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 44a04382-01bf-41e1-aeff-add8e8d547da] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:44:33.696 | 2026-08-21 19:44:33 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 44a04382-01bf-41e1-aeff-add8e8d547da] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 101ms
2026-08-22 03:44:43.773 | 2026-08-21 19:44:43 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:44:43.774 | 2026-08-21 19:44:43 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:44:43.781 | 2026-08-21 19:44:43 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: d56c4332-77b2-4b23-87f5-f5f37ed898de] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:44:43.781 | 2026-08-21 19:44:43 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d56c4332-77b2-4b23-87f5-f5f37ed898de] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 7ms
2026-08-22 03:44:53.871 | 2026-08-21 19:44:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:44:53.872 | 2026-08-21 19:44:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:44:53.876 | 2026-08-21 19:44:53 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: eedc4068-2e43-47a9-91d0-dd96d3d900ab] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:44:53.876 | 2026-08-21 19:44:53 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: eedc4068-2e43-47a9-91d0-dd96d3d900ab] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:45:00.001 | 2026-08-21 19:45:00 [MessageBroker-2] INFO  c.c.b.p.a.PaymentReconciliationService [X-Request-Id: ] - [RECONCILIATION] Starting scheduled sweep for stuck PAYMENT_INTENTS...
2026-08-22 03:45:00.012 | 2026-08-21 19:45:00 [MessageBroker-2] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:45:00.014 |     select
2026-08-22 03:45:00.014 |         pi1_0.id,
2026-08-22 03:45:00.014 |         pi1_0.amount,
2026-08-22 03:45:00.014 |         pi1_0.created_at,
2026-08-22 03:45:00.014 |         pi1_0.currency,
2026-08-22 03:45:00.014 |         pi1_0.customer_account_number,
2026-08-22 03:45:00.014 |         pi1_0.description,
2026-08-22 03:45:00.014 |         pi1_0.fee_amount,
2026-08-22 03:45:00.014 |         pi1_0.intent_id,
2026-08-22 03:45:00.014 |         pi1_0.merchant_id,
2026-08-22 03:45:00.014 |         pi1_0.status,
2026-08-22 03:45:00.014 |         pi1_0.updated_at 
2026-08-22 03:45:00.014 |     from
2026-08-22 03:45:00.014 |         payment_intents pi1_0
2026-08-22 03:45:00.014 | Hibernate: 
2026-08-22 03:45:00.014 |     select
2026-08-22 03:45:00.014 |         pi1_0.id,
2026-08-22 03:45:00.014 |         pi1_0.amount,
2026-08-22 03:45:00.014 |         pi1_0.created_at,
2026-08-22 03:45:00.014 |         pi1_0.currency,
2026-08-22 03:45:00.014 |         pi1_0.customer_account_number,
2026-08-22 03:45:00.014 |         pi1_0.description,
2026-08-22 03:45:00.014 |         pi1_0.fee_amount,
2026-08-22 03:45:00.014 |         pi1_0.intent_id,
2026-08-22 03:45:00.014 |         pi1_0.merchant_id,
2026-08-22 03:45:00.014 |         pi1_0.status,
2026-08-22 03:45:00.014 |         pi1_0.updated_at 
2026-08-22 03:45:00.014 |     from
2026-08-22 03:45:00.014 |         payment_intents pi1_0
2026-08-22 03:45:00.023 | 2026-08-21 19:45:00 [MessageBroker-2] INFO  c.c.b.p.a.PaymentReconciliationService [X-Request-Id: ] - [RECONCILIATION] Sweep completed. Processed 0 intents.
2026-08-22 03:45:03.944 | 2026-08-21 19:45:03 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:45:03.946 | 2026-08-21 19:45:03 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:45:03.950 | 2026-08-21 19:45:03 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 896a1866-544b-4e90-b7c8-fcb2ebde9e12] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:45:03.950 | 2026-08-21 19:45:03 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 896a1866-544b-4e90-b7c8-fcb2ebde9e12] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:45:14.014 | 2026-08-21 19:45:14 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:45:14.015 | 2026-08-21 19:45:14 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:45:14.018 | 2026-08-21 19:45:14 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: ff5805e8-81e5-4110-89a3-92e810f8d2a3] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:45:14.018 | 2026-08-21 19:45:14 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ff5805e8-81e5-4110-89a3-92e810f8d2a3] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:45:24.117 | 2026-08-21 19:45:24 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:45:24.118 | 2026-08-21 19:45:24 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:45:24.123 | 2026-08-21 19:45:24 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: e5494bb6-f063-445b-9c7b-237dab86cd5b] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:45:24.123 | 2026-08-21 19:45:24 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: e5494bb6-f063-445b-9c7b-237dab86cd5b] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-22 03:45:31.036 | 2026-08-21 19:45:31 [MessageBroker-1] INFO  o.s.w.s.c.WebSocketMessageBrokerStats [X-Request-Id: ] - WebSocketSession[0 current WS(0)-HttpStream(0)-HttpPoll(0), 0 total, 0 closed abnormally (0 connect failure, 0 send limit, 0 transport error)], stompSubProtocol[processed CONNECT(0)-CONNECTED(0)-DISCONNECT(0)], stompBrokerRelay[null], inboundChannel[pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0], outboundChannel[pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0], sockJsScheduler[pool size = 10, active threads = 1, queued tasks = 7, completed tasks = 2]
2026-08-22 03:45:31.329 | 2026-08-21 19:45:31 [MessageBroker-5] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:45:31.329 |     select
2026-08-22 03:45:31.329 |         icl1_0.id,
2026-08-22 03:45:31.329 |         icl1_0.attempt_count,
2026-08-22 03:45:31.329 |         icl1_0.callback_url,
2026-08-22 03:45:31.329 |         icl1_0.created_at,
2026-08-22 03:45:31.329 |         icl1_0.next_retry_at,
2026-08-22 03:45:31.329 |         icl1_0.payload,
2026-08-22 03:45:31.329 |         icl1_0.payment_session_id,
2026-08-22 03:45:31.329 |         icl1_0.response_body,
2026-08-22 03:45:31.329 |         icl1_0.response_code,
2026-08-22 03:45:31.329 |         icl1_0.status,
2026-08-22 03:45:31.329 |         icl1_0.updated_at 
2026-08-22 03:45:31.329 |     from
2026-08-22 03:45:31.329 |         institution_callback_log icl1_0 
2026-08-22 03:45:31.329 |     where
2026-08-22 03:45:31.329 |         icl1_0.status=? 
2026-08-22 03:45:31.329 |         and icl1_0.next_retry_at<?
2026-08-22 03:45:31.329 | Hibernate: 
2026-08-22 03:45:31.329 |     select
2026-08-22 03:45:31.329 |         icl1_0.id,
2026-08-22 03:45:31.329 |         icl1_0.attempt_count,
2026-08-22 03:45:31.329 |         icl1_0.callback_url,
2026-08-22 03:45:31.329 |         icl1_0.created_at,
2026-08-22 03:45:31.329 |         icl1_0.next_retry_at,
2026-08-22 03:45:31.329 |         icl1_0.payload,
2026-08-22 03:45:31.329 |         icl1_0.payment_session_id,
2026-08-22 03:45:31.329 |         icl1_0.response_body,
2026-08-22 03:45:31.329 |         icl1_0.response_code,
2026-08-22 03:45:31.329 |         icl1_0.status,
2026-08-22 03:45:31.329 |         icl1_0.updated_at 
2026-08-22 03:45:31.329 |     from
2026-08-22 03:45:31.329 |         institution_callback_log icl1_0 
2026-08-22 03:45:31.329 |     where
2026-08-22 03:45:31.329 |         icl1_0.status=? 
2026-08-22 03:45:31.329 |         and icl1_0.next_retry_at<?
2026-08-22 03:45:34.196 | 2026-08-21 19:45:34 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:45:34.196 | 2026-08-21 19:45:34 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:45:34.200 | 2026-08-21 19:45:34 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 31d6ff5d-e9e5-40f2-b010-48a89423f4db] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:45:34.200 | 2026-08-21 19:45:34 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 31d6ff5d-e9e5-40f2-b010-48a89423f4db] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:45:44.277 | 2026-08-21 19:45:44 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:45:44.278 | 2026-08-21 19:45:44 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:45:44.281 | 2026-08-21 19:45:44 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: a22a27e7-17b1-487f-9cb7-e6b36fea328a] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:45:44.281 | 2026-08-21 19:45:44 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: a22a27e7-17b1-487f-9cb7-e6b36fea328a] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:45:54.359 | 2026-08-21 19:45:54 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:45:54.360 | 2026-08-21 19:45:54 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:45:54.364 | 2026-08-21 19:45:54 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 12cf1622-f3a0-43e0-9655-d8088de08ff1] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:45:54.364 | 2026-08-21 19:45:54 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 12cf1622-f3a0-43e0-9655-d8088de08ff1] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:46:04.459 | 2026-08-21 19:46:04 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:46:04.460 | 2026-08-21 19:46:04 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:46:04.463 | 2026-08-21 19:46:04 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 8f32a055-f4f6-468e-a03c-9c6c6d403383] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:46:04.463 | 2026-08-21 19:46:04 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 8f32a055-f4f6-468e-a03c-9c6c6d403383] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:46:14.551 | 2026-08-21 19:46:14 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:46:14.552 | 2026-08-21 19:46:14 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:46:14.556 | 2026-08-21 19:46:14 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 1e116c94-a97e-47a6-82be-f8f9acfdffef] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:46:14.556 | 2026-08-21 19:46:14 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 1e116c94-a97e-47a6-82be-f8f9acfdffef] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:46:24.633 | 2026-08-21 19:46:24 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:46:24.634 | 2026-08-21 19:46:24 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:46:24.638 | 2026-08-21 19:46:24 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: f6bbd2ba-0d7a-4e7b-a08d-6998bc8344c6] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:46:24.638 | 2026-08-21 19:46:24 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: f6bbd2ba-0d7a-4e7b-a08d-6998bc8344c6] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:46:31.332 | 2026-08-21 19:46:31 [MessageBroker-3] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:46:31.332 |     select
2026-08-22 03:46:31.332 |         icl1_0.id,
2026-08-22 03:46:31.332 |         icl1_0.attempt_count,
2026-08-22 03:46:31.332 |         icl1_0.callback_url,
2026-08-22 03:46:31.332 |         icl1_0.created_at,
2026-08-22 03:46:31.332 |         icl1_0.next_retry_at,
2026-08-22 03:46:31.332 |         icl1_0.payload,
2026-08-22 03:46:31.332 |         icl1_0.payment_session_id,
2026-08-22 03:46:31.332 |         icl1_0.response_body,
2026-08-22 03:46:31.332 |         icl1_0.response_code,
2026-08-22 03:46:31.332 |         icl1_0.status,
2026-08-22 03:46:31.332 |         icl1_0.updated_at 
2026-08-22 03:46:31.332 |     from
2026-08-22 03:46:31.332 |         institution_callback_log icl1_0 
2026-08-22 03:46:31.332 |     where
2026-08-22 03:46:31.332 |         icl1_0.status=? 
2026-08-22 03:46:31.332 |         and icl1_0.next_retry_at<?
2026-08-22 03:46:31.332 | Hibernate: 
2026-08-22 03:46:31.332 |     select
2026-08-22 03:46:31.332 |         icl1_0.id,
2026-08-22 03:46:31.332 |         icl1_0.attempt_count,
2026-08-22 03:46:31.332 |         icl1_0.callback_url,
2026-08-22 03:46:31.332 |         icl1_0.created_at,
2026-08-22 03:46:31.332 |         icl1_0.next_retry_at,
2026-08-22 03:46:31.332 |         icl1_0.payload,
2026-08-22 03:46:31.332 |         icl1_0.payment_session_id,
2026-08-22 03:46:31.332 |         icl1_0.response_body,
2026-08-22 03:46:31.332 |         icl1_0.response_code,
2026-08-22 03:46:31.332 |         icl1_0.status,
2026-08-22 03:46:31.332 |         icl1_0.updated_at 
2026-08-22 03:46:31.332 |     from
2026-08-22 03:46:31.332 |         institution_callback_log icl1_0 
2026-08-22 03:46:31.332 |     where
2026-08-22 03:46:31.332 |         icl1_0.status=? 
2026-08-22 03:46:31.332 |         and icl1_0.next_retry_at<?
2026-08-22 03:46:34.741 | 2026-08-21 19:46:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:46:34.741 | 2026-08-21 19:46:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:46:34.749 | 2026-08-21 19:46:34 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 69da4d0d-0afb-4263-a28d-8b4964286d2d] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:46:34.750 | 2026-08-21 19:46:34 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 69da4d0d-0afb-4263-a28d-8b4964286d2d] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 8ms
2026-08-22 03:46:44.830 | 2026-08-21 19:46:44 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:46:44.831 | 2026-08-21 19:46:44 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:46:44.834 | 2026-08-21 19:46:44 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 91d18976-118b-45b7-a093-bf8234be2cd5] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:46:44.834 | 2026-08-21 19:46:44 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 91d18976-118b-45b7-a093-bf8234be2cd5] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:46:54.930 | 2026-08-21 19:46:54 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:46:54.932 | 2026-08-21 19:46:54 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:46:54.936 | 2026-08-21 19:46:54 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 09fb3189-e636-450f-838d-11e7ce2abffc] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:46:54.936 | 2026-08-21 19:46:54 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 09fb3189-e636-450f-838d-11e7ce2abffc] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:47:05.028 | 2026-08-21 19:47:05 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:47:05.029 | 2026-08-21 19:47:05 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:47:05.033 | 2026-08-21 19:47:05 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 73648b4f-2df6-422a-938e-469dd4647b10] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:47:05.033 | 2026-08-21 19:47:05 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 73648b4f-2df6-422a-938e-469dd4647b10] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:47:15.097 | 2026-08-21 19:47:15 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:47:15.097 | 2026-08-21 19:47:15 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:47:15.101 | 2026-08-21 19:47:15 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b5755894-9b0f-418c-b955-2f2c095ac651] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:47:15.101 | 2026-08-21 19:47:15 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b5755894-9b0f-418c-b955-2f2c095ac651] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:47:25.226 | 2026-08-21 19:47:25 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:47:25.227 | 2026-08-21 19:47:25 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:47:25.230 | 2026-08-21 19:47:25 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 82e9c704-1899-4249-b191-3600a1635214] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:47:25.230 | 2026-08-21 19:47:25 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 82e9c704-1899-4249-b191-3600a1635214] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:47:31.335 | 2026-08-21 19:47:31 [MessageBroker-7] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:47:31.335 |     select
2026-08-22 03:47:31.335 |         icl1_0.id,
2026-08-22 03:47:31.335 |         icl1_0.attempt_count,
2026-08-22 03:47:31.335 |         icl1_0.callback_url,
2026-08-22 03:47:31.335 |         icl1_0.created_at,
2026-08-22 03:47:31.335 |         icl1_0.next_retry_at,
2026-08-22 03:47:31.335 |         icl1_0.payload,
2026-08-22 03:47:31.335 |         icl1_0.payment_session_id,
2026-08-22 03:47:31.335 |         icl1_0.response_body,
2026-08-22 03:47:31.335 |         icl1_0.response_code,
2026-08-22 03:47:31.335 |         icl1_0.status,
2026-08-22 03:47:31.335 |         icl1_0.updated_at 
2026-08-22 03:47:31.335 |     from
2026-08-22 03:47:31.335 |         institution_callback_log icl1_0 
2026-08-22 03:47:31.335 |     where
2026-08-22 03:47:31.335 |         icl1_0.status=? 
2026-08-22 03:47:31.335 |         and icl1_0.next_retry_at<?
2026-08-22 03:47:31.335 | Hibernate: 
2026-08-22 03:47:31.335 |     select
2026-08-22 03:47:31.335 |         icl1_0.id,
2026-08-22 03:47:31.335 |         icl1_0.attempt_count,
2026-08-22 03:47:31.336 |         icl1_0.callback_url,
2026-08-22 03:47:31.336 |         icl1_0.created_at,
2026-08-22 03:47:31.336 |         icl1_0.next_retry_at,
2026-08-22 03:47:31.336 |         icl1_0.payload,
2026-08-22 03:47:31.336 |         icl1_0.payment_session_id,
2026-08-22 03:47:31.336 |         icl1_0.response_body,
2026-08-22 03:47:31.336 |         icl1_0.response_code,
2026-08-22 03:47:31.336 |         icl1_0.status,
2026-08-22 03:47:31.336 |         icl1_0.updated_at 
2026-08-22 03:47:31.336 |     from
2026-08-22 03:47:31.336 |         institution_callback_log icl1_0 
2026-08-22 03:47:31.336 |     where
2026-08-22 03:47:31.336 |         icl1_0.status=? 
2026-08-22 03:47:31.336 |         and icl1_0.next_retry_at<?
2026-08-22 03:47:35.296 | 2026-08-21 19:47:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:47:35.297 | 2026-08-21 19:47:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:47:35.301 | 2026-08-21 19:47:35 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: d4dca3d5-0b80-45d0-9818-ffe0c2c7276e] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:47:35.301 | 2026-08-21 19:47:35 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d4dca3d5-0b80-45d0-9818-ffe0c2c7276e] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:47:45.385 | 2026-08-21 19:47:45 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:47:45.387 | 2026-08-21 19:47:45 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:47:45.392 | 2026-08-21 19:47:45 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 0f2a2397-09b5-43d7-8718-88060eeb92f6] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:47:45.392 | 2026-08-21 19:47:45 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 0f2a2397-09b5-43d7-8718-88060eeb92f6] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:47:55.489 | 2026-08-21 19:47:55 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:47:55.490 | 2026-08-21 19:47:55 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:47:55.496 | 2026-08-21 19:47:55 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: ceb95b4b-e072-4e8a-922b-3f2469ac3d47] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:47:55.496 | 2026-08-21 19:47:55 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ceb95b4b-e072-4e8a-922b-3f2469ac3d47] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 6ms
2026-08-22 03:48:05.580 | 2026-08-21 19:48:05 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:48:05.580 | 2026-08-21 19:48:05 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:48:05.585 | 2026-08-21 19:48:05 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 4bb973ba-d575-4f07-a638-35c3784fbd15] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:48:05.585 | 2026-08-21 19:48:05 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 4bb973ba-d575-4f07-a638-35c3784fbd15] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-22 03:48:15.668 | 2026-08-21 19:48:15 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:48:15.668 | 2026-08-21 19:48:15 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:48:15.672 | 2026-08-21 19:48:15 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 4122d47a-1039-424c-881e-19a3199235da] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:48:15.672 | 2026-08-21 19:48:15 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 4122d47a-1039-424c-881e-19a3199235da] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:48:25.737 | 2026-08-21 19:48:25 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:48:25.738 | 2026-08-21 19:48:25 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:48:25.742 | 2026-08-21 19:48:25 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 6a8246c4-e672-4a73-8fbd-f4edc4365a3d] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:48:25.742 | 2026-08-21 19:48:25 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 6a8246c4-e672-4a73-8fbd-f4edc4365a3d] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:48:31.324 | 2026-08-21 19:48:31 [MessageBroker-4] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:48:31.324 |     select
2026-08-22 03:48:31.324 |         icl1_0.id,
2026-08-22 03:48:31.324 |         icl1_0.attempt_count,
2026-08-22 03:48:31.324 |         icl1_0.callback_url,
2026-08-22 03:48:31.324 |         icl1_0.created_at,
2026-08-22 03:48:31.324 |         icl1_0.next_retry_at,
2026-08-22 03:48:31.324 |         icl1_0.payload,
2026-08-22 03:48:31.324 |         icl1_0.payment_session_id,
2026-08-22 03:48:31.324 |         icl1_0.response_body,
2026-08-22 03:48:31.324 |         icl1_0.response_code,
2026-08-22 03:48:31.324 |         icl1_0.status,
2026-08-22 03:48:31.324 |         icl1_0.updated_at 
2026-08-22 03:48:31.324 |     from
2026-08-22 03:48:31.324 |         institution_callback_log icl1_0 
2026-08-22 03:48:31.324 |     where
2026-08-22 03:48:31.324 |         icl1_0.status=? 
2026-08-22 03:48:31.324 |         and icl1_0.next_retry_at<?
2026-08-22 03:48:31.324 | Hibernate: 
2026-08-22 03:48:31.324 |     select
2026-08-22 03:48:31.324 |         icl1_0.id,
2026-08-22 03:48:31.324 |         icl1_0.attempt_count,
2026-08-22 03:48:31.324 |         icl1_0.callback_url,
2026-08-22 03:48:31.324 |         icl1_0.created_at,
2026-08-22 03:48:31.324 |         icl1_0.next_retry_at,
2026-08-22 03:48:31.324 |         icl1_0.payload,
2026-08-22 03:48:31.324 |         icl1_0.payment_session_id,
2026-08-22 03:48:31.324 |         icl1_0.response_body,
2026-08-22 03:48:31.324 |         icl1_0.response_code,
2026-08-22 03:48:31.324 |         icl1_0.status,
2026-08-22 03:48:31.324 |         icl1_0.updated_at 
2026-08-22 03:48:31.324 |     from
2026-08-22 03:48:31.324 |         institution_callback_log icl1_0 
2026-08-22 03:48:31.324 |     where
2026-08-22 03:48:31.324 |         icl1_0.status=? 
2026-08-22 03:48:31.324 |         and icl1_0.next_retry_at<?
2026-08-22 03:48:35.829 | 2026-08-21 19:48:35 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:48:35.830 | 2026-08-21 19:48:35 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:48:35.833 | 2026-08-21 19:48:35 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: d9f6fcd5-8db9-405d-a16e-111196f32f5b] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:48:35.833 | 2026-08-21 19:48:35 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: d9f6fcd5-8db9-405d-a16e-111196f32f5b] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:48:45.909 | 2026-08-21 19:48:45 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:48:45.910 | 2026-08-21 19:48:45 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:48:45.914 | 2026-08-21 19:48:45 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 18fed90e-c24a-463a-bb43-7294d52c92fb] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:48:45.914 | 2026-08-21 19:48:45 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 18fed90e-c24a-463a-bb43-7294d52c92fb] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:48:56.030 | 2026-08-21 19:48:56 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:48:56.031 | 2026-08-21 19:48:56 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:48:56.034 | 2026-08-21 19:48:56 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 33852f57-28fa-4924-b716-fdc823443a1f] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:48:56.034 | 2026-08-21 19:48:56 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 33852f57-28fa-4924-b716-fdc823443a1f] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:49:06.129 | 2026-08-21 19:49:06 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:49:06.129 | 2026-08-21 19:49:06 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:49:06.133 | 2026-08-21 19:49:06 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 5fbab432-bdba-4ae6-a7ea-d1801d12c434] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:49:06.133 | 2026-08-21 19:49:06 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 5fbab432-bdba-4ae6-a7ea-d1801d12c434] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:49:16.230 | 2026-08-21 19:49:16 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:49:16.231 | 2026-08-21 19:49:16 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:49:16.234 | 2026-08-21 19:49:16 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 6047c114-10c2-40d1-b634-5a754927f9cb] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:49:16.234 | 2026-08-21 19:49:16 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 6047c114-10c2-40d1-b634-5a754927f9cb] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:49:26.327 | 2026-08-21 19:49:26 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:49:26.327 | 2026-08-21 19:49:26 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:49:26.332 | 2026-08-21 19:49:26 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 0f68fb4d-e1e3-4a98-9a47-f03e59b36fb9] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:49:26.332 | 2026-08-21 19:49:26 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 0f68fb4d-e1e3-4a98-9a47-f03e59b36fb9] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-22 03:49:31.325 | 2026-08-21 19:49:31 [MessageBroker-10] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:49:31.325 |     select
2026-08-22 03:49:31.325 |         icl1_0.id,
2026-08-22 03:49:31.325 |         icl1_0.attempt_count,
2026-08-22 03:49:31.325 |         icl1_0.callback_url,
2026-08-22 03:49:31.325 |         icl1_0.created_at,
2026-08-22 03:49:31.325 |         icl1_0.next_retry_at,
2026-08-22 03:49:31.325 |         icl1_0.payload,
2026-08-22 03:49:31.325 |         icl1_0.payment_session_id,
2026-08-22 03:49:31.325 |         icl1_0.response_body,
2026-08-22 03:49:31.325 |         icl1_0.response_code,
2026-08-22 03:49:31.325 |         icl1_0.status,
2026-08-22 03:49:31.325 |         icl1_0.updated_at 
2026-08-22 03:49:31.325 |     from
2026-08-22 03:49:31.325 |         institution_callback_log icl1_0 
2026-08-22 03:49:31.325 |     where
2026-08-22 03:49:31.325 |         icl1_0.status=? 
2026-08-22 03:49:31.325 |         and icl1_0.next_retry_at<?
2026-08-22 03:49:31.325 | Hibernate: 
2026-08-22 03:49:31.325 |     select
2026-08-22 03:49:31.325 |         icl1_0.id,
2026-08-22 03:49:31.325 |         icl1_0.attempt_count,
2026-08-22 03:49:31.325 |         icl1_0.callback_url,
2026-08-22 03:49:31.325 |         icl1_0.created_at,
2026-08-22 03:49:31.325 |         icl1_0.next_retry_at,
2026-08-22 03:49:31.325 |         icl1_0.payload,
2026-08-22 03:49:31.325 |         icl1_0.payment_session_id,
2026-08-22 03:49:31.325 |         icl1_0.response_body,
2026-08-22 03:49:31.325 |         icl1_0.response_code,
2026-08-22 03:49:31.325 |         icl1_0.status,
2026-08-22 03:49:31.325 |         icl1_0.updated_at 
2026-08-22 03:49:31.325 |     from
2026-08-22 03:49:31.325 |         institution_callback_log icl1_0 
2026-08-22 03:49:31.325 |     where
2026-08-22 03:49:31.325 |         icl1_0.status=? 
2026-08-22 03:49:31.325 |         and icl1_0.next_retry_at<?
2026-08-22 03:49:36.404 | 2026-08-21 19:49:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:49:36.405 | 2026-08-21 19:49:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:49:36.409 | 2026-08-21 19:49:36 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 755ef2d9-6f0e-4e71-a137-94095373da71] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:49:36.409 | 2026-08-21 19:49:36 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 755ef2d9-6f0e-4e71-a137-94095373da71] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:49:46.495 | 2026-08-21 19:49:46 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:49:46.496 | 2026-08-21 19:49:46 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:49:46.499 | 2026-08-21 19:49:46 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 7a519235-c20b-42a5-9515-e8adabebf198] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:49:46.499 | 2026-08-21 19:49:46 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 7a519235-c20b-42a5-9515-e8adabebf198] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:49:56.577 | 2026-08-21 19:49:56 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:49:56.578 | 2026-08-21 19:49:56 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:49:56.581 | 2026-08-21 19:49:56 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 2dbf440c-24ae-46e7-aae3-db2faf3b76fe] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:49:56.581 | 2026-08-21 19:49:56 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 2dbf440c-24ae-46e7-aae3-db2faf3b76fe] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:50:06.661 | 2026-08-21 19:50:06 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:50:06.662 | 2026-08-21 19:50:06 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:50:06.665 | 2026-08-21 19:50:06 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 38f6e381-37b4-4c1a-937d-38b10bc1eb2b] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:50:06.665 | 2026-08-21 19:50:06 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 38f6e381-37b4-4c1a-937d-38b10bc1eb2b] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:50:16.759 | 2026-08-21 19:50:16 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:50:16.760 | 2026-08-21 19:50:16 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:50:16.763 | 2026-08-21 19:50:16 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: ce63c32c-c743-4cdd-9b3f-27fd9e934547] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:50:16.763 | 2026-08-21 19:50:16 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: ce63c32c-c743-4cdd-9b3f-27fd9e934547] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:50:26.870 | 2026-08-21 19:50:26 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:50:26.871 | 2026-08-21 19:50:26 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:50:26.874 | 2026-08-21 19:50:26 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 6e9a03bf-7924-4fb5-b372-eb0968df9676] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:50:26.874 | 2026-08-21 19:50:26 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 6e9a03bf-7924-4fb5-b372-eb0968df9676] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:50:31.328 | 2026-08-21 19:50:31 [MessageBroker-11] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:50:31.328 |     select
2026-08-22 03:50:31.328 |         icl1_0.id,
2026-08-22 03:50:31.328 |         icl1_0.attempt_count,
2026-08-22 03:50:31.328 |         icl1_0.callback_url,
2026-08-22 03:50:31.328 |         icl1_0.created_at,
2026-08-22 03:50:31.328 |         icl1_0.next_retry_at,
2026-08-22 03:50:31.328 |         icl1_0.payload,
2026-08-22 03:50:31.328 |         icl1_0.payment_session_id,
2026-08-22 03:50:31.328 |         icl1_0.response_body,
2026-08-22 03:50:31.328 |         icl1_0.response_code,
2026-08-22 03:50:31.328 |         icl1_0.status,
2026-08-22 03:50:31.328 |         icl1_0.updated_at 
2026-08-22 03:50:31.328 |     from
2026-08-22 03:50:31.328 |         institution_callback_log icl1_0 
2026-08-22 03:50:31.328 |     where
2026-08-22 03:50:31.328 |         icl1_0.status=? 
2026-08-22 03:50:31.328 |         and icl1_0.next_retry_at<?
2026-08-22 03:50:31.328 | Hibernate: 
2026-08-22 03:50:31.328 |     select
2026-08-22 03:50:31.328 |         icl1_0.id,
2026-08-22 03:50:31.328 |         icl1_0.attempt_count,
2026-08-22 03:50:31.328 |         icl1_0.callback_url,
2026-08-22 03:50:31.328 |         icl1_0.created_at,
2026-08-22 03:50:31.328 |         icl1_0.next_retry_at,
2026-08-22 03:50:31.328 |         icl1_0.payload,
2026-08-22 03:50:31.328 |         icl1_0.payment_session_id,
2026-08-22 03:50:31.328 |         icl1_0.response_body,
2026-08-22 03:50:31.328 |         icl1_0.response_code,
2026-08-22 03:50:31.328 |         icl1_0.status,
2026-08-22 03:50:31.328 |         icl1_0.updated_at 
2026-08-22 03:50:31.328 |     from
2026-08-22 03:50:31.328 |         institution_callback_log icl1_0 
2026-08-22 03:50:31.328 |     where
2026-08-22 03:50:31.328 |         icl1_0.status=? 
2026-08-22 03:50:31.328 |         and icl1_0.next_retry_at<?
2026-08-22 03:50:36.968 | 2026-08-21 19:50:36 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:50:36.969 | 2026-08-21 19:50:36 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:50:36.972 | 2026-08-21 19:50:36 [http-nio-0.0.0.0-8080-exec-7] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 85e4e0e2-e838-4f5b-9eab-5e6f21290092] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:50:36.972 | 2026-08-21 19:50:36 [http-nio-0.0.0.0-8080-exec-7] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 85e4e0e2-e838-4f5b-9eab-5e6f21290092] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:50:47.053 | 2026-08-21 19:50:47 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:50:47.053 | 2026-08-21 19:50:47 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:50:47.057 | 2026-08-21 19:50:47 [http-nio-0.0.0.0-8080-exec-8] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: bbdfd3eb-86ca-4292-b0e8-ecc8adf48ee1] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:50:47.057 | 2026-08-21 19:50:47 [http-nio-0.0.0.0-8080-exec-8] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: bbdfd3eb-86ca-4292-b0e8-ecc8adf48ee1] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:50:57.159 | 2026-08-21 19:50:57 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:50:57.160 | 2026-08-21 19:50:57 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:50:57.164 | 2026-08-21 19:50:57 [http-nio-0.0.0.0-8080-exec-9] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 0c1b8bf7-1be5-406d-ad5d-a2c454ddfd1d] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:50:57.164 | 2026-08-21 19:50:57 [http-nio-0.0.0.0-8080-exec-9] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 0c1b8bf7-1be5-406d-ad5d-a2c454ddfd1d] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:51:07.253 | 2026-08-21 19:51:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:51:07.253 | 2026-08-21 19:51:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:51:07.257 | 2026-08-21 19:51:07 [http-nio-0.0.0.0-8080-exec-10] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 0b9ff3c7-bf2c-40c5-b086-6c10b45a342e] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:51:07.257 | 2026-08-21 19:51:07 [http-nio-0.0.0.0-8080-exec-10] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 0b9ff3c7-bf2c-40c5-b086-6c10b45a342e] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:51:17.353 | 2026-08-21 19:51:17 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:51:17.353 | 2026-08-21 19:51:17 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:51:17.357 | 2026-08-21 19:51:17 [http-nio-0.0.0.0-8080-exec-1] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: e12f5ef5-e740-4fe4-839c-4e6d7928457e] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:51:17.357 | 2026-08-21 19:51:17 [http-nio-0.0.0.0-8080-exec-1] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: e12f5ef5-e740-4fe4-839c-4e6d7928457e] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:51:27.434 | 2026-08-21 19:51:27 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:51:27.434 | 2026-08-21 19:51:27 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:51:27.438 | 2026-08-21 19:51:27 [http-nio-0.0.0.0-8080-exec-2] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 5d913480-ebd4-4c74-b736-fc03b463d917] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:51:27.438 | 2026-08-21 19:51:27 [http-nio-0.0.0.0-8080-exec-2] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 5d913480-ebd4-4c74-b736-fc03b463d917] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:51:31.336 | 2026-08-21 19:51:31 [MessageBroker-11] DEBUG org.hibernate.SQL [X-Request-Id: ] - 
2026-08-22 03:51:31.336 |     select
2026-08-22 03:51:31.336 |         icl1_0.id,
2026-08-22 03:51:31.336 |         icl1_0.attempt_count,
2026-08-22 03:51:31.336 |         icl1_0.callback_url,
2026-08-22 03:51:31.336 |         icl1_0.created_at,
2026-08-22 03:51:31.336 |         icl1_0.next_retry_at,
2026-08-22 03:51:31.336 |         icl1_0.payload,
2026-08-22 03:51:31.336 |         icl1_0.payment_session_id,
2026-08-22 03:51:31.336 |         icl1_0.response_body,
2026-08-22 03:51:31.336 |         icl1_0.response_code,
2026-08-22 03:51:31.336 |         icl1_0.status,
2026-08-22 03:51:31.336 |         icl1_0.updated_at 
2026-08-22 03:51:31.336 |     from
2026-08-22 03:51:31.336 |         institution_callback_log icl1_0 
2026-08-22 03:51:31.336 |     where
2026-08-22 03:51:31.336 |         icl1_0.status=? 
2026-08-22 03:51:31.336 |         and icl1_0.next_retry_at<?
2026-08-22 03:51:31.336 | Hibernate: 
2026-08-22 03:51:31.336 |     select
2026-08-22 03:51:31.336 |         icl1_0.id,
2026-08-22 03:51:31.336 |         icl1_0.attempt_count,
2026-08-22 03:51:31.336 |         icl1_0.callback_url,
2026-08-22 03:51:31.336 |         icl1_0.created_at,
2026-08-22 03:51:31.336 |         icl1_0.next_retry_at,
2026-08-22 03:51:31.336 |         icl1_0.payload,
2026-08-22 03:51:31.336 |         icl1_0.payment_session_id,
2026-08-22 03:51:31.336 |         icl1_0.response_body,
2026-08-22 03:51:31.336 |         icl1_0.response_code,
2026-08-22 03:51:31.336 |         icl1_0.status,
2026-08-22 03:51:31.336 |         icl1_0.updated_at 
2026-08-22 03:51:31.336 |     from
2026-08-22 03:51:31.336 |         institution_callback_log icl1_0 
2026-08-22 03:51:31.336 |     where
2026-08-22 03:51:31.336 |         icl1_0.status=? 
2026-08-22 03:51:31.336 |         and icl1_0.next_retry_at<?
2026-08-22 03:51:37.514 | 2026-08-21 19:51:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:51:37.515 | 2026-08-21 19:51:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:51:37.520 | 2026-08-21 19:51:37 [http-nio-0.0.0.0-8080-exec-3] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: 9779bbc1-59a0-4e3c-a3cf-0c8f841434b3] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:51:37.520 | 2026-08-21 19:51:37 [http-nio-0.0.0.0-8080-exec-3] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: 9779bbc1-59a0-4e3c-a3cf-0c8f841434b3] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 5ms
2026-08-22 03:51:47.620 | 2026-08-21 19:51:47 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:51:47.621 | 2026-08-21 19:51:47 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:51:47.624 | 2026-08-21 19:51:47 [http-nio-0.0.0.0-8080-exec-4] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: a45af786-a87f-4b01-81c8-e4e9d0a56aa4] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:51:47.624 | 2026-08-21 19:51:47 [http-nio-0.0.0.0-8080-exec-4] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: a45af786-a87f-4b01-81c8-e4e9d0a56aa4] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms
2026-08-22 03:51:57.717 | 2026-08-21 19:51:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:51:57.718 | 2026-08-21 19:51:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:51:57.722 | 2026-08-21 19:51:57 [http-nio-0.0.0.0-8080-exec-5] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: f53b45dc-7264-469d-8147-fdf3159cee99] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:51:57.722 | 2026-08-21 19:51:57 [http-nio-0.0.0.0-8080-exec-5] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: f53b45dc-7264-469d-8147-fdf3159cee99] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 4ms
2026-08-22 03:52:07.807 | 2026-08-21 19:52:07 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Securing GET /actuator/health
2026-08-22 03:52:07.808 | 2026-08-21 19:52:07 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.security.web.FilterChainProxy [X-Request-Id: ] - Secured GET /actuator/health
2026-08-22 03:52:07.812 | 2026-08-21 19:52:07 [http-nio-0.0.0.0-8080-exec-6] DEBUG o.s.s.w.a.AnonymousAuthenticationFilter [X-Request-Id: b0174551-c36c-43cc-8b13-91a5ccf5c7c9] - Set SecurityContextHolder to anonymous SecurityContext
2026-08-22 03:52:07.812 | 2026-08-21 19:52:07 [http-nio-0.0.0.0-8080-exec-6] INFO  c.c.b.w.filter.RequestLoggingFilter [X-Request-Id: b0174551-c36c-43cc-8b13-91a5ccf5c7c9] - [HTTP LOG] GET /actuator/health - Status: 200 - Duration: 3ms