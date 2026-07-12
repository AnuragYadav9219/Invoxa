package com.invoice.tracker.service.user;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.invoice.tracker.dto.auth.ChangePasswordRequest;
import com.invoice.tracker.dto.cloudinary.ImageUploadResponse;
import com.invoice.tracker.dto.user.DeleteAccountRequest;
import com.invoice.tracker.dto.user.UpdateProfileRequest;
import com.invoice.tracker.dto.user.UserProfileResponse;

public interface UserService {
    
    UUID getCurrentUserShopId();

    UserProfileResponse updateProfile(UpdateProfileRequest request);

    UserProfileResponse getProfile();

    void changePassword(String email, ChangePasswordRequest request);

    void deleteAccount(DeleteAccountRequest request);

    void recoverAccount(String email, String otp);

    ImageUploadResponse uploadProfileImage(MultipartFile image, UUID shopId, String email);
}
