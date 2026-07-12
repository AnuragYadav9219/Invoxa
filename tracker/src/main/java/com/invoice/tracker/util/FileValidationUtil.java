package com.invoice.tracker.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.invoice.tracker.common.exception.BadRequestException;

@Component
public class FileValidationUtil {

    private static final long MAX_SIZE = 5 * 1024 * 1024;

    public void validateImage(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new BadRequestException("Please select an image");
        }

        if (image.getSize() > MAX_SIZE) {
            throw new BadRequestException("Image size must not exceed 5 MB.");
        }

        String type = image.getContentType();

        if (type == null ||
                !(type.equals("image/jpeg")
                        || type.equals("image/jpg")
                        || type.equals("image/png")
                        || type.equals("image/webp"))) {

            throw new BadRequestException("Only JPG, JPEG, PNG and WEBP images are allowed.");

        }
    }
}
