package com.invoice.tracker.service.auth;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.entity.auth.Otp;
import com.invoice.tracker.repository.auth.OtpRepository;
import com.invoice.tracker.service.notification.channel.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final int MAX_ATTEMPTS = 3;
    private static final int OTP_EXPIRY_MINUTES = 5;

    private final SecureRandom random = new SecureRandom();

    // ====================== SEND OTP =========================
    public void sendOtp(String email) {

        // Rate Limiting
        otpRepository.findTopByEmailOrderByExpiryTimeDesc(email)
                .ifPresent(existing -> {
                    if (existing.getExpiryTime().isAfter(LocalDateTime.now().minusSeconds(30))) {
                        throw new BadRequestException("Please wait before requesting another OTP");
                    }
                });

        // 6-digit OTP
        String otp = String.valueOf(100000 + random.nextInt());

        Otp entity = Otp.builder()
                .email(email)
                .otpHash(passwordEncoder.encode(otp))
                .expiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .attempts(0)
                .used(false)
                .build();

        otpRepository.save(entity);

        emailService.sendOtpEmail(email, otp);;
    }

    // ========================== VERIFY OTP =============================
    public void verifyOtp(String email, String otp) {

        Otp savedOtp = otpRepository.findTopByEmailOrderByExpiryTimeDesc(email)
                .orElseThrow(() -> new ResourceNotFoundException("OTP not found"));

        validateOtp(savedOtp);

        savedOtp.setAttempts(savedOtp.getAttempts() + 1);

        if (!passwordEncoder.matches(otp, savedOtp.getOtpHash())) {
            otpRepository.save(savedOtp);
            throw new BadRequestException("Invalid OTP");
        }

        savedOtp.setUsed(true);
        otpRepository.save(savedOtp);
    }

    // ========================== VALIDATION ==============================
    private void validateOtp(Otp savedOtp) {

        if (savedOtp.isUsed()) {
            throw new BadRequestException("OTP already used");
        }

        if (savedOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP Expired");
        }

        if (savedOtp.getAttempts() >= MAX_ATTEMPTS) {
            throw new BadRequestException("Too many Attempts");
        }
    }
}
