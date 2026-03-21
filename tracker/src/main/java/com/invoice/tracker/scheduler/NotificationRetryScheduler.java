package com.invoice.tracker.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.invoice.tracker.entity.notification.Notification;
import com.invoice.tracker.entity.notification.NotificationStatus;
import com.invoice.tracker.repository.notification.NotificationRepository;
import com.invoice.tracker.service.notification.channel.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationRetryScheduler {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    private static final int MAX_RETRY = 3;

    // ====================== RETRY FAILED NOTIFICATION =========================
    @Scheduled(fixedRate = 300000)
    public void retryFailedNotifications() {

        log.info("Running notification retry scheduler...");

        List<Notification> failedNotifications = notificationRepository.findBySentFalseAndRetryCountLessThan(MAX_RETRY);

        for (Notification notification : failedNotifications) {

            if (!isReadyForRetry(notification)) {
                continue;
            }

            try {
                log.info("Retrying notification to {}", notification.getRecipient());

                emailService.sendHtml(
                        notification.getRecipient(),
                        buildRetrySubject(notification),
                        notification.getMessage());

                notification.setSent(true);
                notification.setStatus(NotificationStatus.SENT);
                notification.setLastTriedAt(LocalDateTime.now());
                notification.setSentAt(LocalDateTime.now());

                log.info("Notification sent successfully to {}", notification.getRecipient());

            } catch (Exception e) {

                notification.setRetryCount(notification.getRetryCount() + 1);
                notification.setLastTriedAt(LocalDateTime.now());

                if (notification.getRetryCount() >= MAX_RETRY) {
                    notification.setStatus(NotificationStatus.FAILED);
                    log.error("Notification permanently failed for {}", notification.getRecipient());
                } else {
                    notification.setStatus(NotificationStatus.RETRYING);
                    log.error("Retry {} failed for {}", notification.getRetryCount(), notification.getRecipient());
                }
            }

            notificationRepository.save(notification);
        }
    }

    // ====================== RETRY STRATEGY =====================
    private boolean isReadyForRetry(Notification notification) {

        if (notification.getLastTriedAt() == null) {
            return true;
        }

        int retry = notification.getRetryCount();

        int delayMinutes = (int) Math.pow(2, retry) * 5;

        LocalDateTime nextRetryTime = notification.getLastTriedAt().plusMinutes(delayMinutes);

        return LocalDateTime.now().isAfter(nextRetryTime);
    }

    private String buildRetrySubject(Notification notification) {
        return "Retry: " + (notification.getType() != null
                ? notification.getType()
                : "Notification");
    }
}
