package com.invoice.tracker.dto.shop;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ShopResponse {
    private UUID id;
    private String shopName;
    private String ownername;
    private String phone;
    private String address;
}
