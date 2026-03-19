package com.invoice.tracker.repository.notification;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.notification.Notification;

public interface NotificationRepository extends JpaRepository<Notification, UUID>  {
    
    List<Notification> findByInvoice_ShopIdOrderBySentAtDesc(UUID shopId);
}
