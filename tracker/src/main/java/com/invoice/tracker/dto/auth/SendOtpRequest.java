package com.invoice.tracker.dto.auth;

import com.invoice.tracker.entity.auth.OtpPurpose;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendOtpRequest {
    
    @NotBlank
    @Email(message = "Invalid email")
    private String email;

    private String password;

    @NotNull(message = "OTP purpose is required")
    private OtpPurpose purpose;
}
