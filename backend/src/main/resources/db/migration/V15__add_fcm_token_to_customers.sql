-- V15__add_fcm_token_to_customers.sql
-- Adds Firebase Cloud Messaging (FCM) device token tracking for push notifications

ALTER TABLE customers 
ADD COLUMN fcm_token VARCHAR(255);