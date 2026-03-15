package com.invoice.tracker.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.User;
import com.invoice.tracker.repository.UserRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UUID getCurrentUserShopId() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getShop().getId();
    }
}
