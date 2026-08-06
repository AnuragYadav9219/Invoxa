package com.invoice.tracker.service.feedback;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.dto.feedback.FeedbackRequest;
import com.invoice.tracker.dto.feedback.FeedbackResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.entity.feedback.Feedback;
import com.invoice.tracker.mapper.FeedbackMapper;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.repository.feedback.FeedbackRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.service.notification.channel.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final FeedbackMapper feedbackMapper;
    private final EmailService emailService;

    @Override
    public FeedbackResponse submitFeedback(FeedbackRequest request) {

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

        } catch (Exception e) {
            // Anonymous visitor
        }

        Feedback feedback = Feedback.builder()
                .user(user)
                .shop(shop)
                .name(name)
                .email(email)
                .rating(request.getRating())
                .category(request.getCategory())
                .recommendation(request.getRecommendation())
                .liked(request.getLiked())
                .improvement(request.getImprovement())
                .build();

        feedback = feedbackRepository.save(feedback);

        try {
            emailService.sendFeedbackNotification(feedback);
        } catch (Exception e) {
            log.error(
                    "Failed to send feedback email {}",
                    feedback.getId(),
                    e);
        }

        return feedbackMapper.toResponse(feedback);
    }

}
