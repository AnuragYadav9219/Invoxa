package com.invoice.tracker.repository.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.invoice.tracker.entity.auth.RefreshToken;
import com.invoice.tracker.entity.auth.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUser(User user);

    void deleteByUser(User user);

    @Modifying
    @Query("UPDATE RefreshToken t SET t.revoked = true, t.expired = true WHERE t.user = :user")
    void revokeAllByUser(User user);

    @Modifying
    @Query("UPDATE RefreshToken t SET t.revoked = true, t.expired = true WHERE t.user = :user AND t.deviceId = :deviceId")
    void revokeByUserAndDeviceId(User user, String deviceId);

    List<RefreshToken> findByUserAndRevokedFalse(User user);
}
