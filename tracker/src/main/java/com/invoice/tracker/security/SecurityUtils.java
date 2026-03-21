package com.invoice.tracker.security;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    // Get current user
    public static UserPrincipal getPrincipal() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("User not authenticated");
        }

        return (UserPrincipal) authentication.getPrincipal();
    }

    // Current user id
    public static UUID getCurrentUserId() {
        return getPrincipal().getUserId();
    }

    // Current ShopId
    public static UUID getCurrentUserShopId() {
        return getPrincipal().getShopId();
    }

    // Get current user email
    public static String getCurrentUserEmail() {
        return getPrincipal().getUsername();
    }

    // Current role
    public static String getCurrentUserRole() {
        return getPrincipal().getRole();
    }
}
