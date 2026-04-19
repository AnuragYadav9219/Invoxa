package com.invoice.tracker.controller.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.auth.ChangePasswordRequest;
import com.invoice.tracker.dto.user.UpdateProfileRequest;
import com.invoice.tracker.dto.user.UserProfileResponse;
import com.invoice.tracker.service.auth.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {

        UserProfileResponse profile = userService.updateProfile(request);

        return ResponseBuilder.success(profile, "Profile updated successfully");
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {

        UserProfileResponse profile = userService.getProfile();

        return ResponseBuilder.success(profile, "Profile fetched successfully");
    }

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
}
