package com.invoice.tracker.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.invoice.tracker.security.PrintTokenUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PrintTokenAuthenticationFilter extends OncePerRequestFilter {

    private final PrintTokenUtil printTokenUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String token = request.getHeader("X-Print-Token");

        // No print token
        if (token == null || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            // Validate 
            if (!printTokenUtil.isValid(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            request.setAttribute(
                    "invoiceId",
                    printTokenUtil.getInvoiceId(token));

            request.setAttribute(
                    "shopId",
                    printTokenUtil.getShopId(token));

        } catch (Exception e) {
            System.err.println("Invalid Print Token: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();

        // Only execute this filter for public print/payment URLs
        return !(path.startsWith("/api/public")
                || path.startsWith("/api/print"));
    }
}