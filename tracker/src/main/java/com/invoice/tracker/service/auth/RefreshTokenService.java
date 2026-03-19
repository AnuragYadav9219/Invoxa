package com.invoice.tracker.service.auth;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.config.JwtConfig;
import com.invoice.tracker.entity.auth.RefreshToken;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtConfig jwtConfig;

     // ========================= CREATE TOKEN =========================
    public RefreshToken createRefreshToken(User user, String deviceId, String deviceName) {

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(jwtConfig.getRefreshExpiration()))
                .revoked(false)
                .expired(false)
                .deviceId(deviceId)
                .deviceName(deviceName)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

     // ===================== VERIFY TOKEN =====================
    @Transactional
    public RefreshToken verifyToken(String tokenValue) {

        if (tokenValue == null || tokenValue.isBlank()) {
            throw new RuntimeException("Refresh token missing");
        }

        RefreshToken token = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid refresh token"));

        // Expiry check
        if (token.getExpiryDate().isBefore(Instant.now())) {
            token.setExpired(true);
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            throw new BadRequestException("Refresh token expired");
        }

        // Reuse attack detection
        if (token.isRevoked()) {
            // Possible token theft -> revoke ALL tokens
            revokeUserTokens(token.getUser());
            throw new BadRequestException("Refresh token reuse detected. All sessions revoked.");
        }

        return token;
    }

     // ====================== ROTATE ========================
    @Transactional
    public RefreshToken rotateToken(RefreshToken oldToken) {

        // Invalidate old token
        oldToken.setRevoked(true);
        oldToken.setExpired(true);
        refreshTokenRepository.save(oldToken);

        // Create new token (same device)
        RefreshToken newToken = RefreshToken.builder()
                .user(oldToken.getUser())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(jwtConfig.getRefreshExpiration()))
                .revoked(false)
                .expired(false)
                .deviceId(oldToken.getDeviceId())
                .deviceName(oldToken.getDeviceName())
                .build();

        return refreshTokenRepository.save(newToken);
    }

    // ========================== REVOKE ALL ==========================
    @Transactional
    public void revokeUserTokens(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }

    // ========================== REVOKE SINGLE ==========================
    @Transactional
    public void revokeToken(String tokenValue) {

        if (tokenValue == null || tokenValue.isBlank()) {
            throw new BadRequestException("Refresh token missing");
        }

        RefreshToken token = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid refresh token"));

        token.setRevoked(true);
        token.setExpired(true);
        refreshTokenRepository.save(token);
    }

     // =========================== REVOKE DEVICE ===========================
    @Transactional
    public void revokeDevice(User user, String deviceId) {

        if (deviceId == null || deviceId.isBlank()) {
            throw new BadRequestException("Device ID is required");
        }

        refreshTokenRepository.revokeByUserAndDeviceId(user, deviceId);
    }

    // =========================== ACTIVE DEVICES ===========================
    public List<RefreshToken> getActiveTokens(User user) {
        return refreshTokenRepository.findByUserAndRevokedFalse(user);
    }
}