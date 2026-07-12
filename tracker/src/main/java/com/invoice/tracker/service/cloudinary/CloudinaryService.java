package com.invoice.tracker.service.cloudinary;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.invoice.tracker.dto.cloudinary.ImageUploadResponse;

public interface CloudinaryService {
    
    ImageUploadResponse upload(MultipartFile file, UUID shopId);

    void delete(String publicId);
}
