package com.invoice.tracker.security;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.invoice.tracker.config.JwtConfig;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;

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
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public UUID getShopId(String token) {
        return UUID.fromString(extractAllClaims(token).get("shopId", String.class));
    }

    public String getRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // =================== VALIDATION ========================
    public boolean isTokenValid(String token, UserDetails userDetails) {

        Claims claims = extractAllClaims(token);

        String username = claims.getSubject();

        if (!username.equals(userDetails.getUsername())) {
            return false;
        }

        if (claims.getExpiration().before(new Date())) {
            return false;
        }

        // Token version check
        Integer tokenVersion = claims.get("version", Integer.class);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getTokenVersion().equals(tokenVersion);
    }
}
