package com.invoice.tracker.security;

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

    // Generate JWT Token
    public String generateToken(UUID userId, UUID shopId, String role, String email, int version) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId.toString())
                .claim("shopId", shopId.toString())
                .claim("role", role)
                .claim("version", version)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes()))
                .compact();
    }

    // Extract userName from token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtConfig.getSecret().getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Validate the token
    public boolean isTokenValid(String token, UserDetails userDetails) {

        final String username = extractUsername(token);

        if (!username.equals(userDetails.getUsername())) {
            return false;
        }

        if (isTokenExpired(token)) {
            return false;
        } 

        // Token version check
        Claims claims = extractAllClaims(token);
        Integer tokenVersion = claims.get("version", Integer.class);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getTokenVersion().equals(tokenVersion)) {
            return false;
        }

        return true;
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {

        Date expiration = Jwts.parserBuilder()
                .setSigningKey(jwtConfig.getSecret().getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();

        return expiration.before(new Date());
    }

    // extract shopId to secure API to protect from others access
    // public UUID extractShopId(String token) {
    // return UUID.fromString(
    // extractClaim(token, claims -> claims.get("shopId", String.class))
    // );
    // }
}
