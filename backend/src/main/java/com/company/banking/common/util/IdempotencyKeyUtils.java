package com.company.banking.common.util;

import java.util.UUID;

public class IdempotencyKeyUtils {
    
    public static String generateKey() {
        return UUID.randomUUID().toString();
    }
}
