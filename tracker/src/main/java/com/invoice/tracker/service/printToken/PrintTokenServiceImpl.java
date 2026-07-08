package com.invoice.tracker.service.printToken;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class PrintTokenServiceImpl implements PrintTokenService {

    @Value("${app.print.secret}")
    private String secret;

    @Value("${app.print.expiration}")
    private long expiration;

    private Key signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public String generateToken(UUID invoiceId, UUID shopId) {

        return Jwts.builder()
                .claim("invoiceId", invoiceId.toString())
                .claim("shopId", shopId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signingKey())
                .compact();
    }

    private Claims claims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    public boolean validateToken(String token) {

        try {

            Claims claims = claims(token);

            return claims.getExpiration().after(new Date());

        } catch (Exception ex) {

            return false;
        }
    }

    @Override
    public UUID getInvoiceId(String token) {

        return UUID.fromString(
                claims(token).get("invoiceId", String.class));
    }

    @Override
    public UUID getShopId(String token) {

        return UUID.fromString(
                claims(token).get("shopId", String.class));
    }

}
