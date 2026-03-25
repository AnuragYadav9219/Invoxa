package com.invoice.tracker.mapper;

import com.invoice.tracker.dto.auth.AuthResponse;
import com.invoice.tracker.entity.auth.User;

public class AuthMapper {

    public static AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {

        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .shopId(user.getShop().getId())
                .shopName(user.getShop().getShopName())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userDto)
                .build();
    }
}
