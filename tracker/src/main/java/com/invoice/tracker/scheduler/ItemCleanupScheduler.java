package com.invoice.tracker.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.item.Item;
import com.invoice.tracker.repository.item.ItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemCleanupScheduler {

    private final ItemRepository itemRepository;

    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanOldDeletedItems() {

        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);

        List<Item> oldItems = itemRepository.findByDeletedTrueAndDeletedAtBefore(cutoff);

        if (!oldItems.isEmpty()) {
            itemRepository.deleteAll(oldItems);
            log.info("Deleted {} old invoices permanently", oldItems.size());
        }
    }
}
