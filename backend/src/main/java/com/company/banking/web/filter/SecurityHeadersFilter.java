package com.company.banking.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(2)
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Value("${platform.domain:${PLATFORM_DOMAIN:}}")
    private String platformDomain;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

        String dynamicConnectSrc = (platformDomain != null && !platformDomain.isBlank())
                ? "connect-src 'self' wss: ws: https://" + platformDomain + " http://" + platformDomain + " *; "
                : "connect-src 'self' wss: ws: https: http: *; ";

        response.setHeader("Content-Security-Policy", 
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: data:; " +
            dynamicConnectSrc +
            "img-src 'self' data: https: http:;"
        );

        filterChain.doFilter(request, response);
    }
}
