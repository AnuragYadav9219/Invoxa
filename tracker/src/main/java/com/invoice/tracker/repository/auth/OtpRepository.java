package com.invoice.tracker.repository.auth;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.auth.Otp;

public interface OtpRepository extends JpaRepository<Otp, UUID> {

    Optional<Otp> findTopByEmailOrderByExpiryTimeDesc(String email);
}
