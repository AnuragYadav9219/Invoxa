package com.invoice.tracker.dto.subscription;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSubscriptionCheckoutRequest {

    @NotNull
    private UUID planId;
}