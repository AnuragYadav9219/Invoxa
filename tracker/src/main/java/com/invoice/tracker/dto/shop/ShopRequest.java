package com.invoice.tracker.dto.shop;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ShopRequest {
    private String shopName;
    private String ownerName;
    private String phone;
    private String address;
}
