package com.invoice.tracker.service.support;

import com.invoice.tracker.service.notification.channel.EmailService;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.dto.support.SupportRequest;
import com.invoice.tracker.dto.support.SupportResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.entity.support.SupportTicket;
import com.invoice.tracker.entity.support.TicketStatus;
import com.invoice.tracker.mapper.SupportMapper;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.repository.support.SupportRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SupportServiceImpl implements SupportService {

    private final EmailService emailService;
    private final SupportRepository supportRepository;
    private final UserRepository userRepository;
    private final SupportMapper supportMapper;

    @Override
    public SupportResponse createTicket(SupportRequest request) {

        User user = null;
        Shop shop = null;

        String name = request.getName();
        String email = request.getEmail();

        try {
            String currentEmail = SecurityUtils.getCurrentUserEmail();

            if (currentEmail != null) {

                user = userRepository.findByEmail(currentEmail).orElse(null);

                if (user != null) {
                    shop = user.getShop();
                    name = user.getName();
                    email = user.getEmail();
                }
            }

        } catch (Exception ignored) {
            // Anonymous visitor
        }

        SupportTicket ticket = SupportTicket.builder()
                .ticketNumber(generateTicketNumber())
                .user(user)
                .shop(shop)
                .name(name)
                .email(email)
                .type(request.getType())
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(TicketStatus.OPEN)
                .build();

        ticket = supportRepository.save(ticket);

        try {
            emailService.sendSupportTicketNotification(ticket);
        } catch (Exception e) {
            log.error(
                    "Failed to send support email for ticket {}",
                    ticket.getTicketNumber(),
                    e);
        }

        return supportMapper.toResponse(ticket);
    }

    private String generateTicketNumber() {
        return "SUP-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }
}
