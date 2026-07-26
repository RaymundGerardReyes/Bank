package com.company.banking.common.util;

public class MaskingUtils {

    public static String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "****";
        }
        int len = accountNumber.length();
        return "****" + accountNumber.substring(len - 4);
    }

    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "*****";
        }
        String[] parts = email.split("@");
        String name = parts[0];
        if (name.length() <= 2) {
            return "*@" + parts[1];
        }
        return name.substring(0, 2) + "*****@" + parts[1];
    }
}
