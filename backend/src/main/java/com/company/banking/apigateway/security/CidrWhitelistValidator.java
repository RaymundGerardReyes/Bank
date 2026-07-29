package com.company.banking.apigateway.security;

import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class CidrWhitelistValidator {

    public boolean isIpWhitelisted(String clientIp, String cidrWhitelist) {
        if (cidrWhitelist == null || cidrWhitelist.trim().isEmpty() || cidrWhitelist.contains("0.0.0.0/0")) {
            return true;
        }

        String[] cidrs = cidrWhitelist.split(",");
        for (String rawCidr : cidrs) {
            String cidr = rawCidr.trim();
            if (cidr.equals("0.0.0.0/0") || cidr.equals(clientIp)) {
                return true;
            }
            if (matchesCidr(clientIp, cidr)) {
                return true;
            }
        }

        return false;
    }

    private boolean matchesCidr(String ipStr, String cidrStr) {
        try {
            if (!cidrStr.contains("/")) {
                cidrStr = cidrStr + "/32";
            }

            String[] parts = cidrStr.split("/");
            InetAddress targetAddr = InetAddress.getByName(ipStr);
            InetAddress cidrAddr = InetAddress.getByName(parts[0]);
            int prefixLength = Integer.parseInt(parts[1]);

            byte[] targetBytes = targetAddr.getAddress();
            byte[] cidrBytes = cidrAddr.getAddress();

            if (targetBytes.length != cidrBytes.length) {
                return false;
            }

            int bytesToCheck = prefixLength / 8;
            for (int i = 0; i < bytesToCheck; i++) {
                if (targetBytes[i] != cidrBytes[i]) {
                    return false;
                }
            }

            int remainderBits = prefixLength % 8;
            if (remainderBits > 0 && bytesToCheck < targetBytes.length) {
                int mask = (0xFF00 >> remainderBits) & 0xFF;
                if ((targetBytes[bytesToCheck] & mask) != (cidrBytes[bytesToCheck] & mask)) {
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
