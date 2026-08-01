package com.invoice.tracker.service.auth;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.dto.auth.SendOtpRequest;
import com.invoice.tracker.entity.auth.Otp;
import com.invoice.tracker.entity.auth.OtpPurpose;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.OtpRepository;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.service.notification.channel.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final int MAX_ATTEMPTS = 3;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 30;

    private final SecureRandom random = new SecureRandom();

    // ====================== SEND OTP =========================
    @Transactional
    public void sendOtp(SendOtpRequest request) {

        log.info("Entered OtpService.sendOtp()");

        String email = normalizeEmail(request.getEmail());

        boolean userExists = userRepository.existsByEmail(email);

        // PURPOSE VALIDATION
        switch (request.getPurpose()) {

            case REGISTER -> {
                if (userExists) {
                    throw new BadRequestException("User already exists");
                }
            }

            case LOGIN, RESET -> {
                if (!userExists) {
                    log.warn("OTP requested for non-existing email: {}", email);
                    return;
                }
            }

            case RECOVER -> {
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new BadRequestException("Invalid request"));

                if (!user.isDeleted()) {
                    throw new BadRequestException("Account is not deleted");
                }

                if (user.getDeletedAt() != null &&
                        user.getDeletedAt().isBefore(LocalDateTime.now().minusDays(30))) {
                    throw new BadRequestException("Recovery period expired. You can register again using this email.");
                }
            }

            case DELETE_ACCOUNT -> {
                UUID userId = SecurityUtils.getCurrentUserId();

                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new BadRequestException("User not found"));

                if (user.isDeleted()) {
                    throw new BadRequestException("Account already deleted");
                }

                if (request.getPassword() == null || request.getPassword().isBlank()) {
                    throw new BadRequestException("Password is required");
                }

                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    throw new BadRequestException("Invalid password");
                }

                email = user.getEmail();
            }

            default -> throw new BadRequestException("Invalid OTP purpose");
        }

        // Rate limiting per purpose
        otpRepository.findTopByEmailAndPurposeOrderByCreatedAtDesc(email, request.getPurpose()).ifPresent(existing -> {
            long remainingSeconds = RESEND_COOLDOWN_SECONDS
                    - Duration.between(existing.getCreatedAt(), LocalDateTime.now()).getSeconds();

            if (remainingSeconds > 0) {
                throw new BadRequestException(
                        String.format(
                                "Please wait %d more seconds before requesting another OTP.",
                                remainingSeconds,
                                remainingSeconds == 1 ? "" : "s"));
            }
        });

        // Generate 6-digit OTP
        String otp = String.valueOf(100000 + random.nextInt(900000));

        // Invalidate old OTPs for same purpose
        otpRepository.invalidateAllByEmailAndPurpose(email, request.getPurpose());

        Otp entity = Otp.builder()
                .email(email)
                .purpose(request.getPurpose())
                .otpHash(passwordEncoder.encode(otp))
                .createdAt(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .attempts(0)
                .used(false)
                .build();

        otpRepository.save(entity);

        emailService.sendOtpEmail(email, otp);

        log.info("OTP sent to {} [{}]", email, request.getPurpose());
    }

    // ========================== VERIFY OTP =============================
    @Transactional
    public void verifyOtp(String email, String otp, OtpPurpose purpose) {

        email = normalizeEmail(email);

        Otp savedOtp = otpRepository
                .findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(email, purpose)
                .orElseThrow(() -> new BadRequestException("Invalid OTP or expired"));

        validateOtp(savedOtp);

        // Wrong OTP
        if (!passwordEncoder.matches(otp, savedOtp.getOtpHash())) {

            savedOtp.setAttempts(savedOtp.getAttempts() + 1);

            // Lock OTP if max attempts reached
            if (savedOtp.getAttempts() >= MAX_ATTEMPTS) {
                savedOtp.setUsed(true);
                log.warn("OTP locked due to max attempts: {}", email);
            }

            otpRepository.save(savedOtp);

            log.warn("Invalid OTP attempt {} for {}", savedOtp.getAttempts(), email);

            throw new BadRequestException("Invalid OTP");
        }

        savedOtp.setUsed(true);
        otpRepository.save(savedOtp);

        log.info("OTP verified successfully for {} [{}]", email, purpose);
    }

    // ========================== VALIDATION ==============================
    private void validateOtp(Otp savedOtp) {

        if (savedOtp.isUsed()) {
            throw new BadRequestException("OTP already used");
        }

        if (savedOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP expired. Please request a new one.");
        }

        if (savedOtp.getAttempts() >= MAX_ATTEMPTS) {
            throw new BadRequestException("Too many incorrect attempts. Request a new OTP.");
        }
    }

    // ========================== UTIL ==============================
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}