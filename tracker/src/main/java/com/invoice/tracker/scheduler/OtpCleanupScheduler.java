package com.invoice.tracker.scheduler;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.repository.auth.OtpRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OtpCleanupScheduler {

    private final OtpRepository otpRepository;

    @Scheduled(cron = "0 */30 * * * *")
    @Transactional
    public void deleteExpiredOtps() {

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

        int count = otpRepository.deleteExpired(now);

        if (count > 0) {
            log.info("Deleted {} expired OTPs", count);
        }
    }
}
