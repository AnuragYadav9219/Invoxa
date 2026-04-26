package com.invoice.tracker.controller.user;

import com.invoice.tracker.service.auth.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.auth.ChangePasswordRequest;
import com.invoice.tracker.dto.auth.SendOtpRequest;
import com.invoice.tracker.dto.user.DeleteAccountRequest;
import com.invoice.tracker.dto.user.RecoverAccountRequest;
import com.invoice.tracker.dto.user.UpdateProfileRequest;
import com.invoice.tracker.dto.user.UserProfileResponse;
import com.invoice.tracker.entity.auth.OtpPurpose;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.service.auth.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final OtpService otpService;
    private final UserService userService;

    // =================== UPDATE PROFILE ==================
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {

        UserProfileResponse profile = userService.updateProfile(request);

        return ResponseBuilder.success(profile, "Profile updated successfully");
    }

    // ==================== GET PROFILE ======================
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {

        UserProfileResponse profile = userService.getProfile();

        return ResponseBuilder.success(profile, "Profile fetched successfully");
    }

    // ================== CHANGE PASSWORD =======================
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        if (email == null) {
            throw new RuntimeException("Unauthorized");
        }

        userService.changePassword(email, request);

        return ResponseBuilder.success(null, "Password changed successfully");
    }

    // ======================= DELETE ACCOUNT ====================

    @PostMapping("/delete/send-otp")
    public ResponseEntity<ApiResponse<Object>> sendDeleteOtp() {

        String email = SecurityUtils.getCurrentUserEmail();

        otpService.sendOtp(email, OtpPurpose.DELETE_ACCOUNT);

        return ResponseBuilder.success(null, "OTP sent for account deletion");
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Object>> deleteAccount(@RequestBody DeleteAccountRequest request) {

        userService.deleteAccount(request);

        return ResponseBuilder.success(null, "Account deleted successfully");
    }

    // =========================== RECOVER ===========================

    @PostMapping("/recover/send-otp")
    public ResponseEntity<ApiResponse<Object>> sendRecoverOtp(
            @Valid @RequestBody SendOtpRequest request) {

        if (request.getEmail() == null) {
            throw new BadRequestException("Email is required");
        }

        otpService.sendOtp(request.getEmail(), OtpPurpose.RECOVER);

        return ResponseBuilder.success(null, "Recovery OTP sent");
    }

    @PostMapping("/recover")
    public ResponseEntity<ApiResponse<Object>> recoverAccount(@RequestBody RecoverAccountRequest request) {

        userService.recoverAccount(request.getEmail(), request.getOtp());

        return ResponseBuilder.success(null, "Account recovered successfully");
    }
}
