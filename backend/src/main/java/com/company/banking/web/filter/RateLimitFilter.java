package com.company.banking.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

@Component
@Order(4)
public class RateLimitFilter extends OncePerRequestFilter {

    private final ConcurrentHashMap<String, Semaphore> rateLimitMap;

    public RateLimitFilter(ConcurrentHashMap<String, Semaphore> rateLimitMap) {
        this.rateLimitMap = rateLimitMap;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String ip = request.getRemoteAddr();
        Semaphore semaphore = rateLimitMap.computeIfAbsent(ip, k -> new Semaphore(100)); // 100 concurrent req per IP

        if (semaphore.tryAcquire()) {
            try {
                filterChain.doFilter(request, response);
            } finally {
                semaphore.release();
            }
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Please try again later.");
        }
    }
}
