package com.invoice.tracker.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    private String shopName;

    @NotBlank
    private String ownerName;

    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String phone;

    private String address;

    private String deviceId;
    private String deviceName;
}
