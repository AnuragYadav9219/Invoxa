package com.invoice.tracker.service.auth;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.user.UpdateProfileRequest;
import com.invoice.tracker.dto.user.UserProfileResponse;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.security.SecurityUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UUID getCurrentUserShopId() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return user.getShop().getId();
    }

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
        }

        userRepository.save(user);

        return UserProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getShop().getPhone())
                .address(user.getShop().getAddress())
                .shopId(user.getShop().getId())
                .build();
    }

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
                .build();
    }
}