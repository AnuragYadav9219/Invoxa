package com.invoice.tracker.common.exception;

public class SubscriptionExpiredException extends RuntimeException {

    public SubscriptionExpiredException(String message) {
        super(message);
    }
}
