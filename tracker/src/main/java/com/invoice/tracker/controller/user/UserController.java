package com.invoice.tracker.controller.user;

import com.invoice.tracker.service.user.UserService;
import com.invoice.tracker.util.FileValidationUtil;

import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.auth.ChangePasswordRequest;
import com.invoice.tracker.dto.cloudinary.ImageUploadResponse;
import com.invoice.tracker.dto.user.DeleteAccountRequest;
import com.invoice.tracker.dto.user.RecoverAccountRequest;
import com.invoice.tracker.dto.user.UpdateProfileRequest;
import com.invoice.tracker.dto.user.UserProfileResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileValidationUtil fileValidationUtil;

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

    // =================== UPLOAD PROFILE IMAGE ======================
    @PreAuthorize("hasAnyRole('OWNER', 'STAFF')")
    @PostMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageUploadResponse>> uploadProfileImage(
            @RequestParam("image") MultipartFile image,
            @RequestHeader("X-Shop-Id") UUID shopId,
            Authentication authentication) {

        fileValidationUtil.validateImage(image);

        ImageUploadResponse response = userService.uploadProfileImage(
                image,
                shopId,
                authentication.getName());

        return ResponseBuilder.success(
                response,
                "Profile image uploaded successfully");
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

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Object>> deleteAccount(@RequestBody DeleteAccountRequest request) {

        userService.deleteAccount(request);

        return ResponseBuilder.success(null, "Account deleted successfully");
    }

    // =========================== RECOVER ===========================

    @PostMapping("/recover")
    public ResponseEntity<ApiResponse<Object>> recoverAccount(@RequestBody RecoverAccountRequest request) {

        userService.recoverAccount(request.getEmail(), request.getOtp());

        return ResponseBuilder.success(null, "Account recovered successfully");
    }
}
