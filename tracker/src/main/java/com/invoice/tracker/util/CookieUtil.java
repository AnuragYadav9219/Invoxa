package com.invoice.tracker.util;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CookieUtil {

    private static final String REFRESH_TOKEN = "refreshToken";

    // Extract refreshToken from cookie
    public String getRefreshToken(HttpServletRequest request) {

        if (request.getCookies() == null) {
            throw new RuntimeException("No cookies found");
        }

        for (Cookie cookie : request.getCookies()) {
            if (REFRESH_TOKEN.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        throw new RuntimeException("Refresh token not found");
    }

    // Create refresh token cookie
    public void addRefreshTokenCookie(HttpServletResponse response, String token, int maxAge) {

        String cookieValue = REFRESH_TOKEN + "=" + token +
                "; HttpOnly; Path=/api/auth; Max-Age=" + maxAge +
                "; SameSite=Strict";

        response.setHeader("Set-Cookie", cookieValue);
    }

    // Clear refresh token cookie (logout)
    public void clearRefreshTokenCookie(HttpServletResponse response) {

        String cookieValue = REFRESH_TOKEN + "=;" +
                " HttpOnly; Path=/api/auth; Max-Age=0; SameSite=Strict";

        response.setHeader("Set-Cookie", cookieValue);
    }
}
