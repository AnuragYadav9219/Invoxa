package com.invoice.tracker.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecoverAccountRequest {
    private String email;
    private String otp;
}
