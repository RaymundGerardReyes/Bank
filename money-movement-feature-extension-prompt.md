        ... 72 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Unable to obtain connection from database: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1802)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:601)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:312)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365)
        ... 84 common frames omitted
Caused by: org.flywaydb.core.internal.exception.FlywaySqlException: Unable to obtain connection from database: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.  
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:71)
        at org.flywaydb.core.internal.jdbc.JdbcConnectionFactory.<init>(JdbcConnectionFactory.java:76)
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:137)
        at org.flywaydb.core.Flyway.migrate(Flyway.java:176)   
        at org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer.afterPropertiesSet(FlywayMigrationInitializer.java:66)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1849)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1798)
        ... 93 common frames omitted
Caused by: org.postgresql.util.PSQLException: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.    
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:352)
        at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54)
        at org.postgresql.jdbc.PgConnection.<init>(PgConnection.java:273)
        at org.postgresql.Driver.makeConnection(Driver.java:446)
        at org.postgresql.Driver.connect(Driver.java:298)      
        at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:137)
        at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:360)
        at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:202)
        at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:461)
        at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:550)
        at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:98)
        at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:111)
        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:59)
        ... 99 common frames omitted
Caused by: java.net.ConnectException: Connection refused       
        at java.base/sun.nio.ch.Net.pollConnect(Native Method) 
        at java.base/sun.nio.ch.Net.pollConnectNow(Unknown Source)
        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source)
        at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source)
        at java.base/java.net.SocksSocketImpl.connect(Unknown Source)
        at java.base/java.net.Socket.connect(Unknown Source)   
        at org.postgresql.core.PGStream.createSocket(PGStream.java:260)
        at org.postgresql.core.PGStream.<init>(PGStream.java:121)
        at org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:140)
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:268)
        ... 111 common frames omitted
  _   _               _                     _   ____           
   _    _
 | | | | __ _ _ __ __| | ___ _ __   ___  __| | | __ )  __ _ _ __ | | _(_)_ __   __ _
 | |_| |/ _` | '__/ _` |/ _ \ '_ \ / _ \/ _` | |  _ \ / _` | '_ \| |/ / | '_ \ / _` |
 |  _  | (_| | | | (_| |  __/ | | |  __/ (_| | | |_) | (_| | | | |   <| | | | | (_| |
 |_| |_|\__,_|_|  \__,_|\___|_| |_|\___|\__,_| |____/ \__,_|_| |_|_|\_\_|_| |_|\__, |
                                                               
                |___/
 :: Hardened Modular Monolith Backend ::

2026-08-27 10:33:01 [background-preinit] INFO  o.h.validator.internal.util.Version [X-Request-Id: ] - HV000001: Hibernate Validator 8.0.1.Final
2026-08-27 10:33:01 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - Starting BankingApplication v0.1.0 using Java 21.0.12 with PID 1 (/app/app.jar started by spring in /app)
2026-08-27 10:33:01 [main] DEBUG c.company.banking.BankingApplication [X-Request-Id: ] - Running with Spring Boot v3.4.0, Spring v6.2.0
2026-08-27 10:33:01 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - The following 1 profile is active: "dev"
2026-08-27 10:33:03 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-08-27 10:33:03 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Finished Spring Data repository scanning in 193 ms. Found 47 JPA repository interfaces.        
2026-08-27 10:33:05 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer [X-Request-Id: ] - Tomcat initialized with port 8080 (http) 
2026-08-27 10:33:05 [main] INFO  o.a.coyote.http11.Http11NioProtocol [X-Request-Id: ] - Initializing ProtocolHandler ["http-nio-0.0.0.0-8080"]
2026-08-27 10:33:05 [main] INFO  o.a.catalina.core.StandardService [X-Request-Id: ] - Starting service [Tomcat]
2026-08-27 10:33:05 [main] INFO  o.a.catalina.core.StandardEngine [X-Request-Id: ] - Starting Servlet engine: [Apache Tomcat/10.1.33]
2026-08-27 10:33:05 [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] [X-Request-Id: ] - Initializing Spring embedded WebApplicationContext
2026-08-27 10:33:05 [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext [X-Request-Id: ] - Root WebApplicationContext: initialization completed in 3707 ms
2026-08-27 10:33:05 [main] INFO  com.zaxxer.hikari.HikariDataSource [X-Request-Id: ] - HikariPool-1 - Starting...
2026-08-27 10:33:06 [main] ERROR o.s.b.w.e.tomcat.TomcatStarter [X-Request-Id: ] - Error starting Tomcat context. Exception: org.springframework.beans.factory.UnsatisfiedDependencyException. Message: Error creating bean with name 'apiAuditLoggingFilter' defined in URL [jar:nested:/app/app.jar/!BOOT-INF/classes/!/com/company/banking/apigateway/security/ApiAuditLoggingFilter.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'apiAuditEventJpaRepository' defined in com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'        
2026-08-27 10:33:06 [main] INFO  o.a.catalina.core.StandardService [X-Request-Id: ] - Stopping service [Tomcat]
2026-08-27 10:33:06 [main] WARN  o.s.b.w.s.c.AnnotationConfigServletWebServerApplicationContext [X-Request-Id: ] - Exception encountered during context initialization - cancelling refresh attempt: org.springframework.context.ApplicationContextException: Unable to start web server
2026-08-27 10:33:06 [main] INFO  o.s.b.a.l.ConditionEvaluationReportLogger [X-Request-Id: ] -

Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.   
2026-08-27 10:33:06 [main] ERROR o.s.boot.SpringApplication [X-Request-Id: ] - Application run failed
org.springframework.context.ApplicationContextException: Unable to start web server
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:165)
        at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:621)        
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146)
        at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
        at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350)
        at com.company.banking.BankingApplication.main(BankingApplication.java:17)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
        at java.base/java.lang.reflect.Method.invoke(Unknown Source)
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:102)
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:64)
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:40)
Caused by: org.springframework.boot.web.server.WebServerException: Unable to start embedded Tomcat
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:147)
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.<init>(TomcatWebServer.java:107)
        at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getTomcatWebServer(TomcatServletWebServerFactory.java:516)
        at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getWebServer(TomcatServletWebServerFactory.java:222)
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.createWebServer(ServletWebServerApplicationContext.java:188)
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:162)
        ... 13 common frames omitted
Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'apiAuditLoggingFilter' defined in URL [jar:nested:/app/app.jar/!BOOT-INF/classes/!/com/company/banking/apigateway/security/ApiAuditLoggingFilter.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'apiAuditEventJpaRepository' defined in com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'     
        at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:804)    
        at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240)    
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1371)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1208)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:204)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.getOrderedBeansOfType(ServletContextInitializerBeans.java:211)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:174)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:169)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAdaptableBeans(ServletContextInitializerBeans.java:154)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.<init>(ServletContextInitializerBeans.java:87) 
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.getServletContextInitializerBeans(ServletWebServerApplicationContext.java:266)
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.selfInitialize(ServletWebServerApplicationContext.java:240)
        at org.springframework.boot.web.embedded.tomcat.TomcatStarter.onStartup(TomcatStarter.java:52)
        at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:4426)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193)
        at java.base/java.util.concurrent.FutureTask.run(Unknown Source)
        at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75)
        at java.base/java.util.concurrent.AbstractExecutorService.submit(Unknown Source)
        at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749)
        at org.apache.catalina.core.StandardHost.startInternal(StandardHost.java:772)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193)
        at java.base/java.util.concurrent.FutureTask.run(Unknown Source)
        at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75)
        at java.base/java.util.concurrent.AbstractExecutorService.submit(Unknown Source)
        at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749)
        at org.apache.catalina.core.StandardEngine.startInternal(StandardEngine.java:203)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.StandardService.startInternal(StandardService.java:415)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.StandardServer.startInternal(StandardServer.java:870)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.startup.Tomcat.start(Tomcat.java:437)
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:128)
        ... 18 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'apiAuditEventJpaRepository' defined in com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.applyPropertyValues(AbstractAutowireCapableBeanFactory.java:1701)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.populateBean(AbstractAutowireCapableBeanFactory.java:1450)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:600)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1568)
        at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1514)
        at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913)
        at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791)    
        ... 59 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaSharedEM_entityManagerFactory': Cannot resolve reference to bean 'entityManagerFactory' while setting constructor argument
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135)
        at org.springframework.beans.factory.support.ConstructorResolver.resolveConstructorArguments(ConstructorResolver.java:691)
        at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:513)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1351)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1181)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365)
        ... 72 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Unable to obtain connection from database: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1802)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:601)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:312)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365)
        ... 84 common frames omitted
Caused by: org.flywaydb.core.internal.exception.FlywaySqlException: Unable to obtain connection from database: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.  
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:71)
        at org.flywaydb.core.internal.jdbc.JdbcConnectionFactory.<init>(JdbcConnectionFactory.java:76)
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:137)
        at org.flywaydb.core.Flyway.migrate(Flyway.java:176)   
        at org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer.afterPropertiesSet(FlywayMigrationInitializer.java:66)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1849)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1798)
        ... 93 common frames omitted
Caused by: org.postgresql.util.PSQLException: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.    
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:352)
        at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54)
        at org.postgresql.jdbc.PgConnection.<init>(PgConnection.java:273)
        at org.postgresql.Driver.makeConnection(Driver.java:446)
        at org.postgresql.Driver.connect(Driver.java:298)      
        at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:137)
        at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:360)
        at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:202)
        at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:461)
        at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:550)
        at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:98)
        at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:111)
        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:59)
        ... 99 common frames omitted
Caused by: java.net.ConnectException: Connection refused       
        at java.base/sun.nio.ch.Net.pollConnect(Native Method) 
        at java.base/sun.nio.ch.Net.pollConnectNow(Unknown Source)
        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source)
        at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source)
        at java.base/java.net.SocksSocketImpl.connect(Unknown Source)
        at java.base/java.net.Socket.connect(Unknown Source)   
        at org.postgresql.core.PGStream.createSocket(PGStream.java:260)
        at org.postgresql.core.PGStream.<init>(PGStream.java:121)
        at org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:140)
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:268)
        ... 111 common frames omitted
  _   _               _                     _   ____           
   _    _
 | | | | __ _ _ __ __| | ___ _ __   ___  __| | | __ )  __ _ _ __ | | _(_)_ __   __ _
 | |_| |/ _` | '__/ _` |/ _ \ '_ \ / _ \/ _` | |  _ \ / _` | '_ \| |/ / | '_ \ / _` |
 |  _  | (_| | | | (_| |  __/ | | |  __/ (_| | | |_) | (_| | | | |   <| | | | | (_| |
 |_| |_|\__,_|_|  \__,_|\___|_| |_|\___|\__,_| |____/ \__,_|_| |_|_|\_\_|_| |_|\__, |
                                                               
                |___/
 :: Hardened Modular Monolith Backend ::

2026-08-27 10:33:09 [background-preinit] INFO  o.h.validator.internal.util.Version [X-Request-Id: ] - HV000001: Hibernate Validator 8.0.1.Final
2026-08-27 10:33:09 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - Starting BankingApplication v0.1.0 using Java 21.0.12 with PID 1 (/app/app.jar started by spring in /app)
2026-08-27 10:33:09 [main] DEBUG c.company.banking.BankingApplication [X-Request-Id: ] - Running with Spring Boot v3.4.0, Spring v6.2.0
2026-08-27 10:33:09 [main] INFO  c.company.banking.BankingApplication [X-Request-Id: ] - The following 1 profile is active: "dev"
2026-08-27 10:33:11 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-08-27 10:33:11 [main] INFO  o.s.d.r.c.RepositoryConfigurationDelegate [X-Request-Id: ] - Finished Spring Data repository scanning in 230 ms. Found 47 JPA repository interfaces.        
2026-08-27 10:33:13 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer [X-Request-Id: ] - Tomcat initialized with port 8080 (http) 
2026-08-27 10:33:13 [main] INFO  o.a.coyote.http11.Http11NioProtocol [X-Request-Id: ] - Initializing ProtocolHandler ["http-nio-0.0.0.0-8080"]
2026-08-27 10:33:13 [main] INFO  o.a.catalina.core.StandardService [X-Request-Id: ] - Starting service [Tomcat]
2026-08-27 10:33:13 [main] INFO  o.a.catalina.core.StandardEngine [X-Request-Id: ] - Starting Servlet engine: [Apache Tomcat/10.1.33]
2026-08-27 10:33:13 [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] [X-Request-Id: ] - Initializing Spring embedded WebApplicationContext
2026-08-27 10:33:13 [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext [X-Request-Id: ] - Root WebApplicationContext: initialization completed in 4578 ms
2026-08-27 10:33:14 [main] INFO  com.zaxxer.hikari.HikariDataSource [X-Request-Id: ] - HikariPool-1 - Starting...
2026-08-27 10:33:15 [main] ERROR o.s.b.w.e.tomcat.TomcatStarter [X-Request-Id: ] - Error starting Tomcat context. Exception: org.springframework.beans.factory.UnsatisfiedDependencyException. Message: Error creating bean with name 'apiAuditLoggingFilter' defined in URL [jar:nested:/app/app.jar/!BOOT-INF/classes/!/com/company/banking/apigateway/security/ApiAuditLoggingFilter.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'apiAuditEventJpaRepository' defined in com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'        
2026-08-27 10:33:15 [main] INFO  o.a.catalina.core.StandardService [X-Request-Id: ] - Stopping service [Tomcat]
2026-08-27 10:33:15 [main] WARN  o.s.b.w.s.c.AnnotationConfigServletWebServerApplicationContext [X-Request-Id: ] - Exception encountered during context initialization - cancelling refresh attempt: org.springframework.context.ApplicationContextException: Unable to start web server
2026-08-27 10:33:15 [main] INFO  o.s.b.a.l.ConditionEvaluationReportLogger [X-Request-Id: ] -

Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.   
2026-08-27 10:33:15 [main] ERROR o.s.boot.SpringApplication [X-Request-Id: ] - Application run failed
org.springframework.context.ApplicationContextException: Unable to start web server
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:165)
        at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:621)        
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146)
        at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
        at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350)
        at com.company.banking.BankingApplication.main(BankingApplication.java:17)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
        at java.base/java.lang.reflect.Method.invoke(Unknown Source)
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:102)
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:64)
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:40)
Caused by: org.springframework.boot.web.server.WebServerException: Unable to start embedded Tomcat
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:147)
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.<init>(TomcatWebServer.java:107)
        at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getTomcatWebServer(TomcatServletWebServerFactory.java:516)
        at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getWebServer(TomcatServletWebServerFactory.java:222)
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.createWebServer(ServletWebServerApplicationContext.java:188)
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:162)
        ... 13 common frames omitted
Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'apiAuditLoggingFilter' defined in URL [jar:nested:/app/app.jar/!BOOT-INF/classes/!/com/company/banking/apigateway/security/ApiAuditLoggingFilter.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'apiAuditEventJpaRepository' defined in com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'     
        at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:804)    
        at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240)    
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1371)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1208)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:204)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.getOrderedBeansOfType(ServletContextInitializerBeans.java:211)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:174)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:169)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAdaptableBeans(ServletContextInitializerBeans.java:154)
        at org.springframework.boot.web.servlet.ServletContextInitializerBeans.<init>(ServletContextInitializerBeans.java:87) 
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.getServletContextInitializerBeans(ServletWebServerApplicationContext.java:266)
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.selfInitialize(ServletWebServerApplicationContext.java:240)
        at org.springframework.boot.web.embedded.tomcat.TomcatStarter.onStartup(TomcatStarter.java:52)
        at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:4426)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193)
        at java.base/java.util.concurrent.FutureTask.run(Unknown Source)
        at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75)
        at java.base/java.util.concurrent.AbstractExecutorService.submit(Unknown Source)
        at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749)
        at org.apache.catalina.core.StandardHost.startInternal(StandardHost.java:772)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203)
        at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193)
        at java.base/java.util.concurrent.FutureTask.run(Unknown Source)
        at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75)
        at java.base/java.util.concurrent.AbstractExecutorService.submit(Unknown Source)
        at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749)
        at org.apache.catalina.core.StandardEngine.startInternal(StandardEngine.java:203)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.StandardService.startInternal(StandardService.java:415)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.core.StandardServer.startInternal(StandardServer.java:870)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
        at org.apache.catalina.startup.Tomcat.start(Tomcat.java:437)
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:128)
        ... 18 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'apiAuditEventJpaRepository' defined in com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.applyPropertyValues(AbstractAutowireCapableBeanFactory.java:1701)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.populateBean(AbstractAutowireCapableBeanFactory.java:1450)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:600)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1568)
        at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1514)
        at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913)
        at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791)    
        ... 59 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaSharedEM_entityManagerFactory': Cannot resolve reference to bean 'entityManagerFactory' while setting constructor argument
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135)
        at org.springframework.beans.factory.support.ConstructorResolver.resolveConstructorArguments(ConstructorResolver.java:691)
        at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:513)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1351)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1181)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365)
        ... 72 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Unable to obtain connection from database: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1802)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:601)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:336)     
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:288)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:334)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:312)
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
        at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365)
        ... 84 common frames omitted
Caused by: org.flywaydb.core.internal.exception.FlywaySqlException: Unable to obtain connection from database: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.  
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:71)
        at org.flywaydb.core.internal.jdbc.JdbcConnectionFactory.<init>(JdbcConnectionFactory.java:76)
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:137)
        at org.flywaydb.core.Flyway.migrate(Flyway.java:176)   
        at org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer.afterPropertiesSet(FlywayMigrationInitializer.java:66)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1849)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1798)
        ... 93 common frames omitted
Caused by: org.postgresql.util.PSQLException: Connection to localhost:5435 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.    
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:352)
        at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54)
        at org.postgresql.jdbc.PgConnection.<init>(PgConnection.java:273)
        at org.postgresql.Driver.makeConnection(Driver.java:446)
        at org.postgresql.Driver.connect(Driver.java:298)      
        at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:137)
        at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:360)
        at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:202)
        at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:461)
        at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:550)
        at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:98)
        at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:111)
        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:59)
        ... 99 common frames omitted
Caused by: java.net.ConnectException: Connection refused       
        at java.base/sun.nio.ch.Net.pollConnect(Native Method) 
        at java.base/sun.nio.ch.Net.pollConnectNow(Unknown Source)
        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source)
        at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source)
        at java.base/java.net.SocksSocketImpl.connect(Unknown Source)
        at java.base/java.net.Socket.connect(Unknown Source)   
        at org.postgresql.core.PGStream.createSocket(PGStream.java:260)
        at org.postgresql.core.PGStream.<init>(PGStream.java:121)
        at org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:140)
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:268)
        ... 111 common frames omitted

LOQ@RAYMUND-PC03 MINGW64 /d/Java/Bank (main)
$