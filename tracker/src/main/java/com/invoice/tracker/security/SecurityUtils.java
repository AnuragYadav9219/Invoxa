package com.invoice.tracker.security;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.invoice.tracker.entity.auth.User;

public class SecurityUtils {

    // Get current user
    public static User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("User not authenticated");
        }

        return ((UserPrincipal) authentication.getPrincipal()).getUser();
    }

    // Current user id
    public static UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }

    // Current ShopId
    public static UUID getCurrentUserShopId() {
        return getCurrentUser().getShop().getId();
    }

    // Get current user email
    public static String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }
}
