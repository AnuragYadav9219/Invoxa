package com.invoice.tracker.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.invoice.tracker.service.auth.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountCleanupScheduler {
    
    private final AuthService authService;

    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupExpiredAccounts() {
        int deleted = authService.cleanupExpiredAccounts();

        if(deleted > 0) {
            log.info("Deleted {} expired account(s)", deleted);
        }
    }
}
