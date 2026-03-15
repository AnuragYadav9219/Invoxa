package com.invoice.tracker.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.config.JwtConfig;
import com.invoice.tracker.entity.RefreshToken;
import com.invoice.tracker.entity.User;
import com.invoice.tracker.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtConfig jwtConfig;

    // Create Refresh Token
    public RefreshToken createRefreshToken(User user) {

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(jwtConfig.getRefreshExpiration()))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    // Verify tokens
    public RefreshToken verifyExpiration(RefreshToken token) {

        if(token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expired");
        }

        if (token.isRevoked()) {
            throw new RuntimeException("Refresh token reuse detected. Possible attack.");
        }

        return token;
    }

    // Revoke the user tokens
    public void revokeUserTokens(User user) {

        List<RefreshToken> tokens = refreshTokenRepository.findByUser(user);
        
        tokens.forEach(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }
}
