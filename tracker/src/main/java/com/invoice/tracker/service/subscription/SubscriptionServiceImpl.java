package com.invoice.tracker.service.subscription;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.subscription.BillingInformationResponse;
import com.invoice.tracker.dto.subscription.CurrentSubscriptionResponse;
import com.invoice.tracker.dto.subscription.SubscriptionDashboardResponse;
import com.invoice.tracker.dto.subscription.SubscriptionPaymentResponse;
import com.invoice.tracker.dto.subscription.SubscriptionPlanResponse;
import com.invoice.tracker.dto.subscription.TemplateResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.subscription.PlanType;
import com.invoice.tracker.entity.subscription.ShopSubscription;
import com.invoice.tracker.entity.subscription.SubscriptionPlan;
import com.invoice.tracker.entity.subscription.SubscriptionStatus;
import com.invoice.tracker.mapper.SubscriptionMapper;
import com.invoice.tracker.mapper.SubscriptionPaymentMapper;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.repository.item.ItemRepository;
import com.invoice.tracker.repository.shop.ShopRepository;
import com.invoice.tracker.repository.subscription.ShopSubscriptionRepository;
import com.invoice.tracker.repository.subscription.SubscriptionPaymentRepository;
import com.invoice.tracker.repository.subscription.SubscriptionPlanRepository;
import com.invoice.tracker.repository.template.TemplateRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionServiceImpl implements SubscriptionService {

        private final ShopSubscriptionRepository subscriptionRepository;
        private final SubscriptionPlanRepository planRepository;
        private final SubscriptionMapper subscriptionMapper;
        private final SubscriptionPaymentRepository paymentRepository;
        private final SubscriptionPaymentMapper paymentMapper;
        private final ShopSubscriptionRepository shopSubscriptionRepository;
        private final ShopRepository shopRepository;
        private final InvoiceRepository invoiceRepository;
        private final ItemRepository itemRepository;
        private final UserRepository userRepository;
        private final TemplateRepository templateRepository;

        @Override
        @Transactional(readOnly = true)
        public CurrentSubscriptionResponse getCurrentSubscription(UUID shopId) {

                ShopSubscription subscription = getOrCreateSubscription(shopId);

                return CurrentSubscriptionResponse.builder()
                                .planName(subscription.getPlan().getName())
                                .startDate(subscription.getStartDate())
                                .endDate(subscription.getEndDate())
                                .status(subscription.getStatus())
                                .autoRenew(subscription.getAutoRenew())
                                .build();
        }

        @Override
        public ShopSubscription activateSubscription(
                        UUID shopId,
                        SubscriptionPlan plan,
                        String paymentId) {

                ShopSubscription subscription = getOrCreateSubscription(shopId);

                LocalDate today = LocalDate.now();

                // Renewal
                if (subscription.getStatus() == SubscriptionStatus.ACTIVE
                                && subscription.getEndDate() != null
                                && subscription.getEndDate().isAfter(today)) {

                        subscription.setEndDate(
                                        subscription.getEndDate().plusMonths(1));

                } else {

                        subscription.setStartDate(today);
                        subscription.setEndDate(today.plusMonths(1));
                }

                subscription.setPlan(plan);
                subscription.setStatus(SubscriptionStatus.ACTIVE);
                subscription.setRazorpayPaymentId(paymentId);

                return subscriptionRepository.save(subscription);
        }

        @Override
        public ShopSubscription renewSubscription(
                        UUID shopId,
                        String paymentId) {

                ShopSubscription subscription = getOrCreateSubscription(shopId);

                subscription.setEndDate(
                                subscription.getEndDate().plusMonths(1));

                subscription.setStatus(SubscriptionStatus.ACTIVE);
                subscription.setRazorpayPaymentId(paymentId);

                return subscriptionRepository.save(subscription);
        }

        @Override
        public void expireSubscriptions(LocalDate today) {

                List<ShopSubscription> subscriptions = subscriptionRepository
                                .findByStatusAndEndDateLessThanEqual(
                                                SubscriptionStatus.ACTIVE,
                                                today);

                for (ShopSubscription subscription : subscriptions) {

                        subscription.setStatus(SubscriptionStatus.EXPIRED);
                }

                subscriptionRepository.saveAll(subscriptions);
        }

        @Override
        @Transactional(readOnly = true)
        public List<SubscriptionPlanResponse> getAvailablePlans() {

                return planRepository.findByActiveTrue()
                                .stream()
                                .map(subscriptionMapper::toResponse)
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<SubscriptionPaymentResponse> getPaymentHistory(
                        UUID shopId) {

                return paymentRepository
                                .findByShopIdOrderByCreatedAtDesc(shopId)
                                .stream()
                                .map(paymentMapper::toResponse)
                                .toList();
        }

        @Override
        @Transactional
        public void initializeSubscription(Shop shop) {

                SubscriptionPlan freePlan = planRepository.findByNameIgnoreCase("FREE")
                                .orElseThrow(() -> new ResourceNotFoundException("FREE subscription plan not found"));

                ShopSubscription subscription = ShopSubscription.builder()
                                .shop(shop)
                                .plan(freePlan)
                                .startDate(LocalDate.now())
                                .endDate(null)
                                .status(SubscriptionStatus.ACTIVE)
                                .autoRenew(false)
                                .build();

                shopSubscriptionRepository.save(subscription);
        }

        @Override
        @Transactional(readOnly = true)
        public SubscriptionDashboardResponse getDashboard(UUID shopId) {

                ShopSubscription subscription = getOrCreateSubscription(shopId);

                SubscriptionPlan plan = subscription.getPlan();

                long invoiceUsage = invoiceRepository.countByShopIdAndDeletedFalse(shopId);

                long customerUsage = invoiceRepository.countDistinctCustomers(shopId);

                long itemUsage = itemRepository.countByShopIdAndDeletedFalse(shopId);

                long userUsage = userRepository.countByShopIdAndDeletedFalse(shopId);

                long daysRemaining = Math.max(0,
                                ChronoUnit.DAYS.between(
                                                LocalDate.now(),
                                                subscription.getEndDate()));

                PlanType userPlan = plan.getPlanType();

                List<TemplateResponse> templates = templateRepository
                                .findByActiveTrueOrderByName()
                                .stream()
                                .map(template -> TemplateResponse.builder()
                                                .code(template.getCode())
                                                .name(template.getName())
                                                .description(template.getDescription())
                                                .minimumPlan(template.getMinimumPlan())
                                                .accessible(
                                                                template.getMinimumPlan().getLevel() <= userPlan
                                                                                .getLevel())
                                                .build())
                                .toList();

                return SubscriptionDashboardResponse.builder()
                                .planName(plan.getName())
                                .monthlyPrice(plan.getMonthlyPrice())

                                .status(subscription.getStatus())
                                .startDate(subscription.getStartDate())
                                .endDate(subscription.getEndDate())
                                .daysRemaining(daysRemaining)
                                .autoRenew(subscription.getAutoRenew())

                                .invoiceLimit(plan.getInvoiceLimit())
                                .customerLimit(plan.getCustomerLimit())
                                .itemLimit(plan.getItemLimit())
                                .userLimit(plan.getUserLimit())

                                .invoiceUsage(invoiceUsage)
                                .customerUsage(customerUsage)
                                .itemUsage(itemUsage)
                                .userUsage(userUsage)

                                .emailEnabled(plan.getEmailEnabled())
                                .apiEnabled(plan.getApiEnabled())
                                .aiEnabled(plan.getAiEnabled())
                                .templates(templates)
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public BillingInformationResponse getBillingInformation(UUID shopId) {

                ShopSubscription subscription = getOrCreateSubscription(shopId);

                if (subscription.getPlan().getName().equalsIgnoreCase("FREE")) {
                        return BillingInformationResponse.builder()
                                        .freePlan(true)
                                        .autoRenew(false)
                                        .nextBillingDate(null)
                                        .build();
                }

                return BillingInformationResponse.builder()
                                .paymentProvider("Razorpay")
                                .paymentMethod("Online")
                                .paymentDisplayName("Processed securely via Razorpay")
                                .razorpayPaymentId(subscription.getRazorpayPaymentId())
                                .autoRenew(Boolean.TRUE.equals(subscription.getAutoRenew()))
                                .startDate(subscription.getStartDate())
                                .nextBillingDate(subscription.getEndDate())
                                .currency("INR")
                                .build();
        }

        // ====================== PRIVATE METHODS =========================

        private ShopSubscription getOrCreateSubscription(UUID shopId) {

                return shopSubscriptionRepository.findByShopId(shopId)
                                .orElseGet(() -> {

                                        Shop shop = shopRepository.findById(shopId)
                                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                                        "Shop not found"));

                                        SubscriptionPlan freePlan = planRepository.findByNameIgnoreCase("FREE")
                                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                                        "FREE subscription plan not found"));

                                        ShopSubscription subscription = ShopSubscription.builder()
                                                        .shop(shop)
                                                        .plan(freePlan)
                                                        .status(SubscriptionStatus.ACTIVE)
                                                        .startDate(LocalDate.now())
                                                        .endDate(null)
                                                        .autoRenew(false)
                                                        .build();

                                        return shopSubscriptionRepository.save(subscription);
                                });
        }
}