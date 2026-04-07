package com.invoice.tracker.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.payment.Payment;
import com.invoice.tracker.repository.payment.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentCleanupScheduler {

    private final PaymentRepository paymentRepository;

    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanOldDeletedPayments() {

        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);

        List<Payment> oldPayments = paymentRepository.findByDeletedTrueAndDeletedAtBefore(cutoff);

        if (!oldPayments.isEmpty()) {
            paymentRepository.deleteAll(oldPayments);
            log.info("Deleted {} old payments permanently", oldPayments.size());
        }
    }
}
