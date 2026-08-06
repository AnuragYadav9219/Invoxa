package com.invoice.tracker.security;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.config.JwtConfig;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtConfig jwtConfig;

    // Key
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    // ================= GENERATE TOKEN =================
    public String generateToken(UUID userId, UUID shopId, String role, String email, int version) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId.toString())
                .claim("shopId", shopId.toString())
                .claim("role", role)
                .claim("version", version)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(getSigningKey())
                .compact();
    }

    // ================= EXTRACT CLAIMS =================
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(Claims claims) {
        return claims.getSubject();
    }

    public UUID getShopId(Claims claims) {
        return UUID.fromString(claims.get("shopId", String.class));
    }

    public String getRole(Claims claims) {
        return claims.get("role", String.class);
    }

    // =================== VALIDATION ========================
    public boolean isTokenValid(Claims claims, UserPrincipal principal) {

        if (!claims.getSubject().equals(principal.getUsername())) {
            return false;
        }

        if (claims.getExpiration().before(new Date())) {
            return false;
        }

        Integer tokenVersion = claims.get("version", Integer.class);

        return principal.getTokenVersion() == tokenVersion;
    }
}
