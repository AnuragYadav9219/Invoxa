package com.invoice.tracker.repository.auth;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.invoice.tracker.entity.auth.Otp;
import com.invoice.tracker.entity.auth.OtpPurpose;

public interface OtpRepository extends JpaRepository<Otp, UUID> {

    Optional<Otp> findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(
            String email, OtpPurpose purpose);

    Optional<Otp> findTopByEmailAndPurposeOrderByCreatedAtDesc(
            String email, OtpPurpose purpose);

    @Modifying
    @Query("UPDATE Otp o SET o.used = true WHERE o.email = :email AND o.purpose = :purpose AND o.used = false")
    void invalidateAllByEmailAndPurpose(String email, OtpPurpose purpose);

    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expiryTime < :time")
    int deleteExpired(@Param("time") LocalDateTime time);
}
