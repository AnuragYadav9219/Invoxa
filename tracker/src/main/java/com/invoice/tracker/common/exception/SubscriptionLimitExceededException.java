package com.invoice.tracker.common.exception;

public class SubscriptionLimitExceededException extends RuntimeException {
    
    public SubscriptionLimitExceededException(String message) {
        super(message);
    }
}
