package com.invoice.tracker.security;

import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.config.JwtConfig;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtConfig jwtConfig;

    // Generate JWT Token
    public String generateToken(UUID userId, UUID shopId, String role) {
        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("shopId", shopId.toString())
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes()))
                .compact();
    }

    // Extract userId from token
    public String extractUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtConfig.getSecret().getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
