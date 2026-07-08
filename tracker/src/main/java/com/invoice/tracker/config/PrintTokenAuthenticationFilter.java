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

        System.out.println("===== PRINT FILTER =====");
        System.out.println("Header : " + token);

        if (token != null) {
            System.out.println("Invoice : " + printTokenUtil.getInvoiceId(token));
            System.out.println("Shop    : " + printTokenUtil.getShopId(token));
        }

        // No print token -> continue
        if (token == null || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            if (printTokenUtil.isValid(token)) {

                request.setAttribute(
                        "invoiceId",
                        printTokenUtil.getInvoiceId(token));

                request.setAttribute(
                        "shopId",
                        printTokenUtil.getShopId(token));
            }

        } catch (Exception ignored) {
            // Invalid token -> don't authenticate.
            // Let the controller decide what to do.
        }

        filterChain.doFilter(request, response);
    }
}
