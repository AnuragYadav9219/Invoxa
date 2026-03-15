package com.invoice.tracker.service.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.dto.auth.AuthResponse;
import com.invoice.tracker.dto.auth.LoginRequest;
import com.invoice.tracker.dto.auth.RefreshTokenRequest;
import com.invoice.tracker.dto.auth.RegisterRequest;
import com.invoice.tracker.entity.auth.RefreshToken;
import com.invoice.tracker.entity.auth.Role;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.RefreshTokenRepository;
import com.invoice.tracker.repository.auth.ShopRepository;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final ShopRepository shopRepository;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenService refreshTokenService;
        private final RefreshTokenRepository refreshTokenRepository;
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;

        // Logic to register an user
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
                                user.getEmail());

                // Create Refresh token after deleting previous one
                refreshTokenService.revokeUserTokens(user);
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                return new AuthResponse(
                                "User registered successfully!",
                                accessToken,
                                refreshToken.getToken());
        }

        // Logic to login the user
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
                                user.getEmail());

                refreshTokenService.revokeUserTokens(user);
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                return new AuthResponse(
                                "Login successful",
                                accessToken,
                                refreshToken.getToken());
        }

        // Logic to refresh the token
        @Transactional
        public AuthResponse refreshToken(RefreshTokenRequest request) {

                RefreshToken refreshToken = refreshTokenRepository
                                .findByToken(request.getRefreshToken())
                                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

                // verify token
                refreshTokenService.verifyExpiration(refreshToken);

                User user = refreshToken.getUser();

                // Generate new refresh token
                RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

                // Revoke old token
                refreshToken.setRevoked(true);
                refreshToken.setReplacedByToken(newRefreshToken.getToken());

                refreshTokenRepository.save(refreshToken);

                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                user.getShop().getId(),
                                user.getRole().name(),
                                user.getEmail());

                return new AuthResponse(
                                "Token Refreshed Successfully",
                                accessToken,
                                newRefreshToken.getToken());
        }

        // Logic for logout
        @Transactional
        public void logout(RefreshTokenRequest request) {

                RefreshToken refreshToken = refreshTokenRepository
                                .findByToken(request.getRefreshToken())
                                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

                refreshToken.setRevoked(true);

                refreshTokenRepository.save(refreshToken);
        }

        // Logout from all devices logic
        @Transactional
        public void logoutAll(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                
                refreshTokenService.revokeUserTokens(user);
        }
}