package com.invoice.tracker.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.invoice.tracker.entity.notification.Notification;
import com.invoice.tracker.repository.notification.NotificationRepository;
import com.invoice.tracker.service.notification.channel.EmailService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationRetryScheduler {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    private static final int MAX_RETRY = 3;

    @Scheduled(fixedRate = 300000)
    public void retryFailedNotifications() {

        List<Notification> failedNotifications = notificationRepository.findBySentFalseAndRetryCountLessThan(MAX_RETRY);

        for (Notification notification : failedNotifications) {

            try {
                emailService.send(
                        notification.getRecipient(),
                        "Retry: Notification",
                        notification.getMessage());

                notification.setSent(true);
            } catch (Exception e) {
                
                notification.setRetryCount(notification.getRetryCount() + 1);
                notification.setLastTriedAt(LocalDateTime.now());
            }

            notificationRepository.save(notification);
        }
    }
}
