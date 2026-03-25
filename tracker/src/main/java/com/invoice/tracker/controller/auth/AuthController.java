package com.invoice.tracker.controller.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.auth.AuthResponse;
import com.invoice.tracker.dto.auth.LoginRequest;
import com.invoice.tracker.dto.auth.OtpRequest;
import com.invoice.tracker.dto.auth.RegisterRequest;
import com.invoice.tracker.service.auth.AuthService;
import com.invoice.tracker.service.auth.OtpService;
import com.invoice.tracker.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthService authService;
        private final OtpService otpService;
        private final CookieUtil cookieUtil;

        // ================= REGISTER =================
        @PostMapping("/register")
        public ResponseEntity<ApiResponse<AuthResponse>> register(
                        @Valid @RequestBody RegisterRequest request,
                        HttpServletResponse response) {

                AuthResponse authResponse = authService.register(request);

                cookieUtil.addRefreshTokenCookie(
                                response,
                                authResponse.getRefreshToken(),
                                7 * 24 * 60 * 60);

                return ResponseBuilder.success(authResponse, "User registered successfully", HttpStatus.CREATED);
        }

        // ================= LOGIN =================
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<AuthResponse>> login(
                        @Valid @RequestBody LoginRequest request,
                        HttpServletResponse response) {

                AuthResponse authResponse = authService.login(request);

                // Set refresh token in cookie
                cookieUtil.addRefreshTokenCookie(
                                response,
                                authResponse.getRefreshToken(),
                                7 * 24 * 60 * 60);

                return ResponseBuilder.success(authResponse, "Login successful");
        }

        // ================= OTP SEND =================
        @PostMapping("/send-otp")
        public ResponseEntity<ApiResponse<Void>> sendOtp(@RequestParam String email) {

                otpService.sendOtp(email);

                return ResponseBuilder.success(null, "OTP sent successfully");
        }

        // ================= OTP VERIFY (LOGIN / REGISTER) =================
        @PostMapping("/verify-otp")
        public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(
                        @RequestBody OtpRequest request,
                        HttpServletResponse response) {

                AuthResponse authResponse = authService.verifyOtpLoginOrRegister(request);

                // Set refresh token cookie
                cookieUtil.addRefreshTokenCookie(
                                response,
                                authResponse.getRefreshToken(),
                                7 * 24 * 60 * 60);

                return ResponseBuilder.success(authResponse, "OTP verified successfully");
        }

        // ================= REFRESH =================
        @PostMapping("/refresh")
        public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
                        HttpServletRequest request,
                        HttpServletResponse response) {

                // extract R.T. from cookie
                String refreshToken = cookieUtil.getRefreshToken(request);

                if (refreshToken == null) {
                        return ResponseBuilder.error("Refresh token missing", HttpStatus.UNAUTHORIZED);
                }

                AuthResponse authResponse = authService.refreshToken(refreshToken);

                // Rotate cookie
                cookieUtil.addRefreshTokenCookie(
                                response,
                                authResponse.getRefreshToken(),
                                7 * 24 * 60 * 60);

                return ResponseBuilder.success(authResponse, "Token refreshed successful");
        }

        // ================= LOGOUT =================
        @PreAuthorize("isAuthenticated()")
        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<Void>> logout(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        Authentication authentication) {

                // Extract refresh token from cookie
                String refreshToken = cookieUtil.getRefreshToken(request);

                if (authentication == null || refreshToken == null) {
                        return ResponseBuilder.error("User not authenticated", HttpStatus.UNAUTHORIZED);
                }

                authService.logout(refreshToken, authentication.getName());

                // Clear cookie
                cookieUtil.clearRefreshTokenCookie(response);

                return ResponseBuilder.success(null, "Logged out successfully");
        }

        // ================= LOGOUT ALL =================
        @PostMapping("/logout-all")
        public ResponseEntity<ApiResponse<Void>> logoutAll(
                        HttpServletResponse response,
                        Authentication authentication) {

                if (authentication == null) {
                        return ResponseBuilder.error("User not authenticated", HttpStatus.UNAUTHORIZED);
                }

                authService.logoutAll(authentication.getName());

                // Clear cookie
                cookieUtil.clearRefreshTokenCookie(response);

                return ResponseBuilder.success(null, "Logged out from all devices");
        }

        // ================= LOGOUT SPECIFIC DEVICE =================
        @PostMapping("/logout-device")
        public ResponseEntity<ApiResponse<Void>> logoutDevice(
                        @RequestParam String deviceId,
                        Authentication authentication) {

                authService.logoutDevice(authentication.getName(), deviceId);

                return ResponseBuilder.success(null, "Device logged out successfully");
        }
}
