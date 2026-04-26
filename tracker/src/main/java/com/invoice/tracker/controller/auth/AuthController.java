package com.invoice.tracker.controller.auth;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.auth.AuthResponse;
import com.invoice.tracker.dto.auth.LoginRequest;
import com.invoice.tracker.dto.auth.OtpRequest;
import com.invoice.tracker.dto.auth.OtpVerificationResponse;
import com.invoice.tracker.dto.auth.RegisterRequest;
import com.invoice.tracker.dto.auth.ResetPasswordRequest;
import com.invoice.tracker.dto.auth.SendOtpRequest;
import com.invoice.tracker.dto.auth.SessionResponse;
import com.invoice.tracker.entity.auth.OtpPurpose;
import com.invoice.tracker.service.auth.AuthService;
import com.invoice.tracker.service.auth.OtpService;
import com.invoice.tracker.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final CookieUtil cookieUtil;

    private static final int REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60;

    /* ================= REGISTER ================= */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.register(request);

        cookieUtil.addRefreshTokenCookie(
                response,
                authResponse.getRefreshToken(),
                REFRESH_TOKEN_AGE);

        authResponse.setRefreshToken(null);

        return ResponseBuilder.success(authResponse, "User registered successfully", HttpStatus.CREATED);
    }

    /* ================= LOGIN ================= */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.login(request);

        cookieUtil.addRefreshTokenCookie(
                response,
                authResponse.getRefreshToken(),
                REFRESH_TOKEN_AGE);

        authResponse.setRefreshToken(null);

        return ResponseBuilder.success(authResponse, "Login successful");
    }

    /* ================= REGISTER OTP ================= */
    @PostMapping("/register/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendRegisterOtp(
            @Valid @RequestBody SendOtpRequest request) {

        otpService.sendOtp(request.getEmail(), OtpPurpose.REGISTER);
        return ResponseBuilder.success(null, "OTP sent");
    }

    /* ================= LOGIN OTP ================= */
    @PostMapping("/login/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendLoginOtp(
            @Valid @RequestBody SendOtpRequest request) {

        otpService.sendOtp(request.getEmail(), OtpPurpose.LOGIN);
        return ResponseBuilder.success(null, "OTP sent");
    }

    /* ================= OTP VERIFY ================= */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<OtpVerificationResponse>> verifyOtp(
            @Valid @RequestBody OtpRequest request,
            HttpServletResponse response) {

        log.info("OTP verification attemp for {}", request.getEmail());

        OtpVerificationResponse result = authService.verifyOtp(request);

        if (!result.isNewUser()) {

            cookieUtil.addRefreshTokenCookie(
                    response,
                    result.getAuth().getRefreshToken(),
                    REFRESH_TOKEN_AGE);

            result.getAuth().setRefreshToken(null);
        }

        return ResponseBuilder.success(result, "OTP verified successfully");
    }

    // ================= FORGOT PASSWORD - SEND OTP ==================
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse<Void>> forgotPasswordSendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        otpService.sendOtp(request.getEmail(), OtpPurpose.RESET);

        return ResponseBuilder.success(null, "OTP sent successfully");
    }

    // ================ RESET PASSWORD ==================
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseBuilder.success(null, "Password reset successful");
    }

    /* ================= REFRESH ================= */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshToken = cookieUtil.getRefreshToken(request);

        if (refreshToken == null) {
            return ResponseBuilder.error("Refresh token missing", HttpStatus.UNAUTHORIZED);
        }

        AuthResponse authResponse = authService.refreshToken(refreshToken);

        // rotate cookie
        cookieUtil.addRefreshTokenCookie(
                response,
                authResponse.getRefreshToken(),
                REFRESH_TOKEN_AGE);

        authResponse.setRefreshToken(null);

        return ResponseBuilder.success(authResponse, "Token refreshed successfully");
    }

    // ================= GET SESSIONS ===================
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getSessions(
            Authentication authentication,
            @RequestHeader(value = "X-Device-Id", required = false) String deviceId) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseBuilder.error("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        try {
            List<SessionResponse> sessions = authService.getUserSessions(authentication.getName(), deviceId);

            return ResponseBuilder.success(sessions, "Sessions fetched successfully");
        } catch (Exception e) {
            return ResponseBuilder.error("Failed to fetch sessions", HttpStatus.UNAUTHORIZED);
        }
    }

    /* ================= LOGOUT ================= */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {

        try {
            String refreshToken = cookieUtil.getRefreshToken(request);

            if (refreshToken != null) {
                authService.logout(
                        refreshToken,
                        authentication != null ? authentication.getName() : null);
            }

            cookieUtil.clearRefreshTokenCookie(response);

            return ResponseBuilder.success(null, "Logged out successfully");
        } catch (Exception e) {
            return ResponseBuilder.error("Logout failed", HttpStatus.UNAUTHORIZED);
        }
    }

    /* ================= LOGOUT ALL ================= */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll(
            HttpServletResponse response,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseBuilder.error("User not authenticated", HttpStatus.UNAUTHORIZED);
        }

        authService.logoutAll(authentication.getName());

        cookieUtil.clearRefreshTokenCookie(response);

        return ResponseBuilder.success(null, "Logged out from all devices");
    }

    /* ================= LOGOUT DEVICE ================= */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout-device")
    public ResponseEntity<ApiResponse<Void>> logoutDevice(
            @RequestParam String deviceId,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseBuilder.error("User not authenticated", HttpStatus.UNAUTHORIZED);
        }

        if (deviceId == null || deviceId.isBlank()) {
            return ResponseBuilder.error("Device ID is required", HttpStatus.BAD_REQUEST);
        }

        authService.logoutDevice(authentication.getName(), deviceId);

        return ResponseBuilder.success(null, "Device logged out successfully");
    }
}