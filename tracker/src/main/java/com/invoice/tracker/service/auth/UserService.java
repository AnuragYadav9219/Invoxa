package com.invoice.tracker.service.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.auth.ChangePasswordRequest;
import com.invoice.tracker.dto.user.DeleteAccountRequest;
import com.invoice.tracker.dto.user.UpdateProfileRequest;
import com.invoice.tracker.dto.user.UserProfileResponse;
import com.invoice.tracker.entity.auth.OtpPurpose;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.security.SecurityUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final OtpService otpService;

    public UUID getCurrentUserShopId() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return user.getShop().getId();
    }

    // ============== UPDATE PROFILE =================
    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (user.getShop() != null) {
            if (request.getPhone() != null) {
                user.getShop().setPhone(request.getPhone());
            }

            if (request.getAddress() != null) {
                user.getShop().setAddress(request.getAddress());
            }

            if (request.getShopName() != null) {
                user.getShop().setShopName(request.getShopName());
                ;
            }

            if (request.getOwnerName() != null) {
                user.getShop().setOwnerName(request.getOwnerName());
            }
        }

        userRepository.save(user);

        return UserProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getShop().getPhone())
                .address(user.getShop().getAddress())
                .shopId(user.getShop().getId())
                .shopName(user.getShop().getShopName())
                .ownerName(user.getShop().getOwnerName())
                .build();
    }

    // ================== GET PROFILE ================
    public UserProfileResponse getProfile() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmailWithShop(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getShop() != null ? user.getShop().getPhone() : null)
                .address(user.getShop() != null ? user.getShop().getAddress() : null)
                .shopId(user.getShop() != null ? user.getShop().getId() : null)
                .shopName(user.getShop() != null ? user.getShop().getShopName() : null)
                .ownerName(user.getShop() != null ? user.getShop().getOwnerName() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }

    // ================== CHANGE PASSWORD ====================
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmailWithShop(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Old Password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // =================== DELETE ACCOUNT ====================
    @Transactional
    public void deleteAccount(DeleteAccountRequest request) {

        UUID userId = SecurityUtils.getCurrentUserId();
        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isDeleted()) {
            throw new BadRequestException("Account already deleted");
        }

        otpService.verifyOtp(email, request.getOtp(), OtpPurpose.DELETE_ACCOUNT);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid password");
        }

        refreshTokenService.revokeUserTokens(user);

        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());

        user.setTokenVersion(user.getTokenVersion() + 1);

        userRepository.save(user);
    }

    // ================ RECOVER ==============
    @Transactional
    public void recoverAccount(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isDeleted()) {
            throw new BadRequestException("Account is already active");
        }

        if (user.getDeletedAt() == null) {
            throw new BadRequestException("Invalid deletion state");
        }

        if (user.getDeletedAt().isBefore(LocalDateTime.now().minusDays(30))) {
            throw new BadRequestException("Recovery period expired");
        }

        otpService.verifyOtp(email, otp, OtpPurpose.RECOVER);

        user.setDeleted(false);
        user.setDeletedAt(null);

        user.setTokenVersion(user.getTokenVersion() + 1);

        userRepository.save(user);
    }
}