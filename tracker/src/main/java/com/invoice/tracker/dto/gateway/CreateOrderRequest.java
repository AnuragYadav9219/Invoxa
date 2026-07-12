package com.invoice.tracker.dto.gateway;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequest {

    private UUID invoiceId;
}
