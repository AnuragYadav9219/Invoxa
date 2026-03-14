package com.invoice.tracker.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.invoice.tracker.dto.AuthResponse;
import com.invoice.tracker.dto.LoginRequest;
import com.invoice.tracker.dto.RegisterRequest;
import com.invoice.tracker.entity.Role;
import com.invoice.tracker.entity.Shop;
import com.invoice.tracker.entity.User;
import com.invoice.tracker.repository.ShopRepository;
import com.invoice.tracker.repository.UserRepository;
import com.invoice.tracker.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final ShopRepository shopRepository;
        private final PasswordEncoder passwordEncoder;
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
                                user.getRole().name());

                return new AuthResponse(
                                "User registered successfully!",
                                accessToken,
                                "refresh-token-placeholder");
        }

        // Logic to login the user
        public AuthResponse login(LoginRequest request) {

                // Authenticate user using Spring Security
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Generate JWT access token
                String accessToken = jwtUtil.generateToken(
                                user.getId(),
                                user.getShop().getId(),
                                user.getRole().name());

                return new AuthResponse(
                                "Login successful",
                                accessToken,
                                "refresh-token-placeholder");
        }
}
