package com.invoice.tracker.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteAccountRequest {
    private String password;
    private String otp;
}
