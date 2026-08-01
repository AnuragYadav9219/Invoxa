package com.invoice.tracker.scheduler;

import java.time.LocalDate;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.invoice.tracker.service.subscription.SubscriptionService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {

    private final SubscriptionService subscriptionService;

    @Scheduled(cron = "0 0 0 * * *")
    public void expireSubscriptions() {

        subscriptionService.expireSubscriptions(
                LocalDate.now());
    }

}