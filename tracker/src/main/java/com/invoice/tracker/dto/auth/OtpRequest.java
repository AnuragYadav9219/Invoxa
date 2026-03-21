package com.invoice.tracker.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequest {
    
    private String email;
    private String otp;
    private String deviceId;
    private String deviceName;
}
