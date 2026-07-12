package com.invoice.tracker.service.cloudinary;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.invoice.tracker.dto.cloudinary.ImageUploadResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public ImageUploadResponse upload(MultipartFile file, UUID shopId) {

        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "invoxa/" + shopId + "/profile-images",
                            "resource_type", "image",
                            "overwrite", true,
                            "unique_filename", true,
                            "use_filename", false));

            return ImageUploadResponse.builder()
                    .url(uploadResult.get("secure_url").toString())
                    .publicId(uploadResult.get("public_id").toString())
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    @Override
    public void delete(String publicId) {

        try {

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        } catch (Exception e) {
            throw new RuntimeException("Image deletion failed");
        }
    }

}
