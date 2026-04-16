package com.invoice.tracker.dto.user;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private String name;
    private String email;
    private String phone;
    private String address;
    private UUID shopId;
}
