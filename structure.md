.
|-- backend
|   |-- Dockerfile
|   |-- build.gradle
|   |-- checkstyle.xml
|   |-- dev.bat
|   |-- docker-compose.yml
|   |-- gradlew
|   |-- gradlew.bat
|   |-- logs.log
|   |-- pom.xml
|   |-- settings.gradle
|   `-- src
|       |-- main
|       |   |-- java
|       |   |   `-- com
|       |   |       `-- company
|       |   |           `-- banking
|       |   |               |-- account
|       |   |               |   |-- api
|       |   |               |   |   `-- dto
|       |   |               |   |-- application
|       |   |               |   |   |-- port
|       |   |               |   |   |   |-- in
|       |   |               |   |   |   `-- out
|       |   |               |   |   `-- provisioning
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- admin
|       |   |               |   |-- api
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   `-- infrastructure
|       |   |               |-- aml
|       |   |               |   |-- application
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- apigateway
|       |   |               |   |-- api
|       |   |               |   |   `-- dto
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   |-- domain
|       |   |               |   |-- infrastructure
|       |   |               |   |-- presentation
|       |   |               |   `-- security
|       |   |               |-- banking
|       |   |               |   `-- orchestration
|       |   |               |       `-- domain
|       |   |               |-- common
|       |   |               |   |-- audit
|       |   |               |   |-- enums
|       |   |               |   |-- exception
|       |   |               |   |-- mapper
|       |   |               |   |-- resilience
|       |   |               |   |-- response
|       |   |               |   `-- util
|       |   |               |-- complaint
|       |   |               |   |-- application
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- config
|       |   |               |-- customer
|       |   |               |   |-- api
|       |   |               |   |   `-- dto
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- fraud
|       |   |               |   |-- application
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- governance
|       |   |               |   |-- application
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- legacy
|       |   |               |   `-- v1-deprecated
|       |   |               |-- merchant
|       |   |               |   |-- application
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- notification
|       |   |               |   |-- api
|       |   |               |   |   `-- dto
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       `-- out
|       |   |               |   `-- infrastructure
|       |   |               |-- orchestration
|       |   |               |   |-- api
|       |   |               |   |   `-- dto
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- payment
|       |   |               |   |-- application
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- product
|       |   |               |   |-- api
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- reporting
|       |   |               |   |-- api
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- security
|       |   |               |   |-- auth
|       |   |               |   |   |-- domain
|       |   |               |   |   |-- dto
|       |   |               |   |   `-- infrastructure
|       |   |               |   |-- jwt
|       |   |               |   |-- mfa
|       |   |               |   `-- policy
|       |   |               |-- settlement
|       |   |               |   |-- application
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- statement
|       |   |               |   |-- api
|       |   |               |   |   `-- dto
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               |-- transaction
|       |   |               |   |-- api
|       |   |               |   |   `-- dto
|       |   |               |   |-- application
|       |   |               |   |   `-- port
|       |   |               |   |       |-- in
|       |   |               |   |       `-- out
|       |   |               |   |-- domain
|       |   |               |   `-- infrastructure
|       |   |               `-- web
|       |   |                   |-- advice
|       |   |                   |-- filter
|       |   |                   `-- interceptor
|       |   `-- resources
|       |       |-- application-dev.yml
|       |       |-- application-prod.yml
|       |       |-- application-staging.yml
|       |       |-- application-test.yml
|       |       |-- application.yml
|       |       |-- banner.txt
|       |       |-- db
|       |       |   `-- migration
|       |       |       |-- V10__relax_legacy_api_keys_constraints.sql
|       |       |       |-- V12__add_kyc_fields_to_customers.sql
|       |       |       |-- V13__add_card_details_to_accounts.sql
|       |       |       |-- V14__add_cdd_and_lock_fields_to_customers.sql
|       |       |       |-- V15__add_aml_schema.sql
|       |       |       |-- V16__add_vam_limits_and_permissions.sql
|       |       |       |-- V17__add_api_key_account_binding.sql
|       |       |       |-- V18__add_payment_gateway_schema.sql
|       |       |       |-- V19__add_merchant_settlement_schema.sql
|       |       |       |-- V1__init_schema.sql
|       |       |       |-- V20__add_gateway_disputes_schema.sql
|       |       |       |-- V21__add_api_audit_trail.sql
|       |       |       |-- V22__add_regulatory_requirements_schema.sql
|       |       |       |-- V23__add_afasa_fraud_management_schema.sql
|       |       |       |-- V24__add_payment_messaging_schema.sql
|       |       |       |-- V25__add_advanced_settlement_schema.sql
|       |       |       |-- V26__add_customer_complaints_schema.sql
|       |       |       |-- V27__add_resilience_rto_rpo_schema.sql
|       |       |       |-- V28__add_compliance_evidence_schema.sql
|       |       |       |-- V29__add_dynamic_qr_payment_schema.sql
|       |       |       |-- V2__accounts_and_balances.sql
|       |       |       |-- V30__add_webauthn_credentials.sql
|       |       |       |-- V31__add_transaction_intents.sql
|       |       |       |-- V32__add_authorization_attempts.sql
|       |       |       |-- V3__transactions_and_ledger.sql
|       |       |       |-- V4__products_and_statements.sql
|       |       |       |-- V5__api_gateway_and_security.sql
|       |       |       |-- V6__orchestration_and_routing.sql
|       |       |       |-- V7__payroll_and_ledger.sql
|       |       |       |-- V8__add_transaction_dispute_columns.sql
|       |       |       `-- V9__api_gateway_enforcement.sql
|       |       `-- logback-spring.xml
|       `-- test
|           |-- java
|           |   `-- com
|           |       `-- company
|           |           `-- banking
|           |               |-- account
|           |               |-- apigateway
|           |               |   `-- security
|           |               |-- customer
|           |               |-- integration
|           |               |-- security
|           |               `-- transaction
|           `-- resources
|               `-- application-test.yml
|-- docs
|   `-- decisions
|-- infra
|   |-- docker
|   |   |-- compose.dev.yaml
|   |   |-- compose.production.yaml
|   |   |-- compose.yaml
|   |   `-- docker-compose.override.yml
|   |-- k8s
|   |   |-- deployment.yaml
|   |   |-- hpa.yaml
|   |   |-- ingress.yaml
|   |   `-- service.yaml
|   |-- loadbalancer
|   |-- nginx
|   |   |-- conf.d
|   |   |   |-- api.conf
|   |   |   `-- security-headers.conf
|   |   |-- nginx.conf
|   |   `-- tls
|   `-- terraform
|-- modules.conf
|-- modules.conf.example.txt
|-- package-lock.json
|-- package.json
`-- release_log_20260814_160411.txt

174 directories, 65 files
