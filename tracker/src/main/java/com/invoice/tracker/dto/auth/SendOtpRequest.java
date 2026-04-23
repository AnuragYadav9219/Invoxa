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
    @Email
    private String email;

    @NotNull
    private OtpPurpose purpose;
}
