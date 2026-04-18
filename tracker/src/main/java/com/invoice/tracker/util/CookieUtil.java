package com.invoice.tracker.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CookieUtil {

    private static final String REFRESH_TOKEN = "refreshToken";

    @Value("${app.cookie.secure:true}")
    private boolean secure;

    @Value("${app.cookie.domain:}")
    private String domain;

    @Value("${app.cookie.same-site:Strict}")
    private String sameSite;

    /* ================= GET ================= */
    public String getRefreshToken(HttpServletRequest request) {

        if (request.getCookies() == null)
            return null;

        for (Cookie cookie : request.getCookies()) {
            if (REFRESH_TOKEN.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    /* ================= SET ================= */
    public void addRefreshTokenCookie(HttpServletResponse response, String token, int maxAge) {

        String cookie = buildCookie(token, maxAge);

        response.addHeader("Set-Cookie", cookie);
    }

    /* ================= CLEAR ================= */
    public void clearRefreshTokenCookie(HttpServletResponse response) {

        String cookie = buildCookie("", 0);

        response.addHeader("Set-Cookie", cookie);
    }

    /* ================= INTERNAL BUILDER ================= */
    private String buildCookie(String value, int maxAge) {

        StringBuilder cookie = new StringBuilder();

        cookie.append(REFRESH_TOKEN).append("=")
                .append(value == null ? "" : value)
                .append("; Max-Age=").append(maxAge)
                .append("; Path=/")
                .append("; HttpOnly");

        if (secure) {
            cookie.append("; Secure");
        }

        if (sameSite != null && !sameSite.isBlank()) {
            cookie.append("; SameSite=").append(sameSite);
        }

        if (domain != null && !domain.isBlank()) {
            cookie.append("; Domain=").append(domain);
        }

        return cookie.toString();
    }
}