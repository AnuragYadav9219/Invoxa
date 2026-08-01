package com.invoice.tracker.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.invoice.tracker.entity.notification.Notification;
import com.invoice.tracker.entity.notification.NotificationStatus;
import com.invoice.tracker.repository.notification.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationRetryScheduler {

    private final NotificationRepository notificationRepository;

    private static final int MAX_RETRY = 3;

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void retryFailedNotifications() {

        log.info("Running notification retry scheduler...");

        List<Notification> notifications = notificationRepository
                .findBySentFalseAndRetryCountLessThan(MAX_RETRY);

        for (Notification notification : notifications) {

            if (!isReadyForRetry(notification)) {
                continue;
            }

            notification.setRetryCount(notification.getRetryCount() + 1);
            notification.setLastTriedAt(LocalDateTime.now());

            if (notification.getRetryCount() >= MAX_RETRY) {

                notification.setStatus(NotificationStatus.FAILED);

                log.warn(
                        "Notification permanently marked as FAILED for {}",
                        notification.getRecipient());

            } else {

                notification.setStatus(NotificationStatus.RETRYING);

                log.info(
                        "Notification {} scheduled for retry ({}/{})",
                        notification.getId(),
                        notification.getRetryCount(),
                        MAX_RETRY);
            }

            notificationRepository.save(notification);
        }
    }

    private boolean isReadyForRetry(Notification notification) {

        if (notification.getLastTriedAt() == null) {
            return true;
        }

        int retry = notification.getRetryCount();

        long delayMinutes = (long) Math.pow(2, retry) * 5;

        return LocalDateTime.now().isAfter(
                notification.getLastTriedAt().plusMinutes(delayMinutes));
    }
}