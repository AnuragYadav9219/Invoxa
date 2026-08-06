package com.invoice.tracker.security;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class PrintTokenUtil {

    @Value("${app.print.secret}")
    private String secret;

    @Value("${app.print.expiration}")
    private long expiration;

    private Key signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ================= TOKEN =================

    public String generateToken(UUID invoiceId, UUID shopId) {

        String token = Jwts.builder()
                .claim("invoiceId", invoiceId.toString())
                .claim("shopId", shopId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signingKey())
                .compact();

        return token;
    }

    // ================= CLAIMS =================

    private Claims claims(String token) {

        try {

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims;

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public UUID getInvoiceId(String token) {

        return UUID.fromString(
                claims(token).get("invoiceId", String.class));
    }

    public UUID getShopId(String token) {

        return UUID.fromString(
                claims(token).get("shopId", String.class));
    }

    public boolean isValid(String token) {

        try {

            Claims claims = claims(token);
            return claims.getExpiration().after(new Date());

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
}
