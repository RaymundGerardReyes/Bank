package com.company.banking.apigateway.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.util.matcher.IpAddressMatcher;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CidrWhitelistValidator {

    public boolean isIpWhitelisted(String clientIp, String cidrWhitelist) {
        return isIpAllowed(clientIp, cidrWhitelist);
    }

    public boolean isIpAllowed(String clientIp, String cidrWhitelist) {
        if (cidrWhitelist == null || cidrWhitelist.trim().isEmpty() || cidrWhitelist.contains("0.0.0.0/0")) {
            return true; // Allow all if unconfigured or explicitly set to 0.0.0.0/0
        }

        if (clientIp == null || clientIp.trim().isEmpty()) {
            return false;
        }

        String[] allowedIps = cidrWhitelist.split(",");

        for (String allowedIp : allowedIps) {
            String cleanIp = allowedIp.trim();
            if (cleanIp.isEmpty()) {
                continue;
            }

            if ("0.0.0.0/0".equals(cleanIp) || cleanIp.equals(clientIp.trim())) {
                return true;
            }

            // Automatically append /32 for single IPs missing the subnet mask
            if (!cleanIp.contains("/")) {
                cleanIp = cleanIp + "/32";
            }

            try {
                IpAddressMatcher ipMatcher = new IpAddressMatcher(cleanIp);
                if (ipMatcher.matches(clientIp.trim())) {
                    return true;
                }
            } catch (IllegalArgumentException e) {
                log.warn("[CIDR VALIDATOR] Invalid CIDR format detected and bypassed: {}", cleanIp);
            }
        }

        return false;
    }
}
