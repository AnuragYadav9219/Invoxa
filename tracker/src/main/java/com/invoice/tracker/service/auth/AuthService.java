package com.invoice.tracker.service.auth;

import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.dto.auth.AuthResponse;
import com.invoice.tracker.dto.auth.LoginRequest;
import com.invoice.tracker.dto.auth.RegisterRequest;
import com.invoice.tracker.entity.auth.RefreshToken;
import com.invoice.tracker.entity.auth.Role;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final com.invoice.tracker.repository.shop.ShopRepository shopRepository;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenService refreshTokenService;
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;

        // ================= REGISTER =================
        public AuthResponse register(RegisterRequest request) {

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new IllegalStateException("Email already exists");
                }

                Shop shop = Shop.builder()
                                .shopName(request.getShopName())
                                .ownerName(request.getOwnerName())
                                .phone(request.getPhone())
                                .address(request.getAddress())
                                .build();

                shopRepository.save(shop);

                User user = User.builder()
                                .name(request.getOwnerName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.OWNER)
                                .shop(shop)
                                .build();

                userRepository.save(user);

                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                shop.getId(),
                                user.getRole().name(),
                                user.getEmail(),
                                user.getTokenVersion());

                String deviceId = (request.getDeviceId() != null && !request.getDeviceId().isBlank())
                                ? request.getDeviceId()
                                : UUID.randomUUID().toString();

                String deviceName = (request.getDeviceName() != null && !request.getDeviceName().isBlank())
                                ? request.getDeviceName()
                                : "Unknown Device";

                // Device-aware refresh token
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                                user,
                                deviceId,
                                deviceName);

                return new AuthResponse(
                                "User registered successfully!",
                                accessToken,
                                refreshToken.getToken());
        }

        // ================= LOGIN =================
        public AuthResponse login(LoginRequest request) {

                // Authenticate user using Spring Security
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Generate JWT access token
                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                user.getShop().getId(),
                                user.getRole().name(),
                                user.getEmail(),
                                user.getTokenVersion());

                String deviceId = (request.getDeviceId() != null && !request.getDeviceId().isBlank())
                                ? request.getDeviceId()
                                : UUID.randomUUID().toString();

                String deviceName = (request.getDeviceName() != null && !request.getDeviceName().isBlank())
                                ? request.getDeviceName()
                                : "Unknown Device";

                // Create refresh token (NO revoke all -> multi-device supported)
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                                user,
                                deviceId,
                                deviceName);

                return new AuthResponse(
                                "Login successful",
                                accessToken,
                                refreshToken.getToken());
        }

        // ================= REFRESH TOKEN (ROTATION) =================
        @Transactional
        public AuthResponse refreshToken(String refreshTokenValue) {

                // verify token
                RefreshToken oldToken = refreshTokenService.verifyToken(refreshTokenValue);

                User user = oldToken.getUser();

                // Rotate token
                RefreshToken newToken = refreshTokenService.rotateToken(oldToken);

                // New Access Token
                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                user.getShop().getId(),
                                user.getRole().name(),
                                user.getEmail(),
                                user.getTokenVersion());

                return new AuthResponse(
                                "Token Refreshed Successfully",
                                accessToken,
                                newToken.getToken());
        }

        // ================= LOGOUT (CURRENT DEVICE) =================
        @Transactional
        public void logout(String refreshTokenValue, String email) {

                // Revoke this token
                refreshTokenService.revokeToken(refreshTokenValue);

                // Invalidate access tokens
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setTokenVersion(user.getTokenVersion() + 1);
        }

        // ================= LOGOUT ALL DEVICES =================
        @Transactional
        public void logoutAll(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Revoke all refresh tokens
                refreshTokenService.revokeUserTokens(user);

                // Invalidate all access tokens
                user.setTokenVersion(user.getTokenVersion() + 1);
        }

        // ================= LOGOUT SPECIFIC DEVICE =================
        @Transactional
        public void logoutDevice(String email, String deviceId) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Revoke only that device
                refreshTokenService.revokeDevice(user, deviceId);
        }
}