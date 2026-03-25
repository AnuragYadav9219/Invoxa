package com.invoice.tracker.service.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.auth.AuthResponse;
import com.invoice.tracker.dto.auth.LoginRequest;
import com.invoice.tracker.dto.auth.OtpRequest;
import com.invoice.tracker.dto.auth.RegisterRequest;
import com.invoice.tracker.entity.auth.RefreshToken;
import com.invoice.tracker.entity.auth.Role;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.helper.auth.DeviceHelper;
import com.invoice.tracker.mapper.AuthMapper;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.repository.shop.ShopRepository;
import com.invoice.tracker.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final OtpService otpService;
        private final UserRepository userRepository;
        private final ShopRepository shopRepository;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenService refreshTokenService;
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;
        private final DeviceHelper deviceHelper;

        private static final Logger log = LoggerFactory.getLogger(AuthService.class);

        // ================= REGISTER =================
        @Transactional
        public AuthResponse register(RegisterRequest request) {

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email already exists");
                }

                if (request.getEmail() == null || request.getEmail().isBlank()) {
                        throw new BadRequestException("Email is required");
                }

                if (request.getPassword() == null || request.getPassword().length() < 6) {
                        throw new BadRequestException("Password must be at least 6 characters");
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

                log.info("New user registered | email={} | role={}",
                                user.getEmail(),
                                user.getRole());

                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                shop.getId(),
                                user.getRole().name(),
                                user.getEmail(),
                                user.getTokenVersion());

                String deviceId = deviceHelper.getDeviceId(request.getDeviceId());
                String deviceName = deviceHelper.getDeviceName(request.getDeviceName());

                // Device-aware refresh token
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                                user,
                                deviceId,
                                deviceName);

                return AuthMapper.buildAuthResponse(user, accessToken, refreshToken.getToken());
        }

        // ================= LOGIN =================
        @Transactional
        public AuthResponse login(LoginRequest request) {

                // Authenticate user using Spring Security
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));
                } catch (Exception e) {
                        log.warn("Login failed | email={}", request.getEmail());
                        throw new BadRequestException("Invalid email or password");
                }

                User user = userRepository.findByEmailWithShop(request.getEmail())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                if (user.getShop() == null) {
                        throw new IllegalStateException("User has no shop assigned");
                }

                String deviceId = deviceHelper.getDeviceId(request.getDeviceId());
                String deviceName = deviceHelper.getDeviceName(request.getDeviceName());

                log.info("User logged in | email={} | role={} | deviceName={}",
                                user.getEmail(),
                                user.getRole(),
                                deviceName);

                // Generate JWT access token
                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                user.getShop().getId(),
                                user.getRole().name(),
                                user.getEmail(),
                                user.getTokenVersion());

                // Create refresh token (NO revoke all -> multi-device supported)
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                                user,
                                deviceId,
                                deviceName);

                return AuthMapper.buildAuthResponse(user, accessToken, refreshToken.getToken());
        }

        // =================== VERIFY OTP LOGIN ==========================
        public AuthResponse verifyOtpLoginOrRegister(OtpRequest request) {

                otpService.verifyOtp(request.getEmail(), request.getOtp());

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseGet(() -> {
                                        Shop shop = shopRepository.save(
                                                        Shop.builder()
                                                                        .shopName("New Shop")
                                                                        .ownerName(request.getEmail())
                                                                        .build());

                                        return userRepository.save(
                                                        User.builder()
                                                                        .email(request.getEmail())
                                                                        .role(Role.OWNER)
                                                                        .shop(shop)
                                                                        .build());
                                });

                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                user.getShop().getId(),
                                user.getRole().name(),
                                user.getEmail(),
                                user.getTokenVersion());

                String deviceId = deviceHelper.getDeviceId(request.getDeviceId());
                String deviceName = deviceHelper.getDeviceName(request.getDeviceName());

                RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                                user,
                                deviceId,
                                deviceName);

                return AuthMapper.buildAuthResponse(user, accessToken, refreshToken.getToken());
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

                return AuthMapper.buildAuthResponse(user, accessToken, newToken.getToken());
        }

        // ================= LOGOUT (CURRENT DEVICE) =================
        @Transactional
        public void logout(String refreshTokenValue, String email) {

                // Revoke this token
                refreshTokenService.revokeToken(refreshTokenValue);

                // Invalidate access tokens
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                user.setTokenVersion(user.getTokenVersion() + 1);
                userRepository.save(user);
                log.info("User logged out | email={}", email);
        }

        // ================= LOGOUT ALL DEVICES =================
        @Transactional
        public void logoutAll(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                // Revoke all refresh tokens
                refreshTokenService.revokeUserTokens(user);

                // Invalidate all access tokens
                user.setTokenVersion(user.getTokenVersion() + 1);
                userRepository.save(user);
        }

        // ================= LOGOUT SPECIFIC DEVICE =================
        @Transactional
        public void logoutDevice(String email, String deviceId) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                // Revoke only that device
                refreshTokenService.revokeDevice(user, deviceId);
        }
}