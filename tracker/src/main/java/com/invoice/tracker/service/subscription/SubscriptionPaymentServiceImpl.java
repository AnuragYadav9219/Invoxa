package com.invoice.tracker.service.subscription;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.subscription.VerifySubscriptionPaymentRequest;
import com.invoice.tracker.entity.subscription.SubscriptionPayment;
import com.invoice.tracker.entity.subscription.SubscriptionPaymentStatus;
import com.invoice.tracker.repository.subscription.SubscriptionPaymentRepository;
import com.invoice.tracker.service.payment.gateway.RazorpayGatewayService;
import com.razorpay.Payment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SubscriptionPaymentServiceImpl
                implements SubscriptionPaymentService {

        private final RazorpayGatewayService gatewayService;
        private final SubscriptionPaymentRepository paymentRepository;
        private final SubscriptionService subscriptionService;

        @Override
        public void verifyPayment(
                        VerifySubscriptionPaymentRequest request) {

                boolean valid = gatewayService.verifyPayment(
                                request.getRazorpayOrderId(),
                                request.getRazorpayPaymentId(),
                                request.getRazorpaySignature());

                if (!valid) {
                        throw new BadRequestException("Invalid payment signature");
                }

                completePayment(
                                request.getRazorpayOrderId(),
                                request.getRazorpayPaymentId());
        }

        @Override
        public void completePayment(
                        String orderId,
                        String paymentId) {

                SubscriptionPayment payment = paymentRepository
                                .findByOrderId(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Subscription payment not found"));

                if (payment.getStatus() == SubscriptionPaymentStatus.SUCCESS) {

                        log.info(
                                        "Subscription payment already processed. OrderId={}",
                                        orderId);

                        return;
                }

                Payment razorpayPayment = gatewayService.fetchPayment(paymentId);

                String status = razorpayPayment.get("status").toString();

                if (!"captured".equalsIgnoreCase(status)) {
                        throw new BadRequestException("Payment not captured");
                }

                String razorpayOrderId = razorpayPayment.get("order_id").toString();

                if (!orderId.equals(razorpayOrderId)) {
                        throw new BadRequestException("Payment does not belong to the this order.");
                }

                Object amountObj = razorpayPayment.get("amount");

                BigDecimal paidAmount;

                if (amountObj instanceof Number number) {
                        paidAmount = BigDecimal.valueOf(number.longValue())
                                        .divide(BigDecimal.valueOf(100));
                } else {
                        paidAmount = new BigDecimal(amountObj.toString())
                                        .divide(BigDecimal.valueOf(100));
                }

                if (paidAmount.compareTo(payment.getAmount()) != 0) {
                        throw new BadRequestException("Subscription amount mismatch.");
                }

                // 4. (Optional) Log payment method
                String method = razorpayPayment.get("method").toString();

                log.info("Subscription paid using {}", method);

                payment.setPaymentId(paymentId);
                payment.setTransactionId(paymentId);
                payment.setPaidAt(LocalDateTime.now());
                payment.setStatus(SubscriptionPaymentStatus.SUCCESS);

                paymentRepository.save(payment);

                log.info(
                                "Subscription payment marked SUCCESS. PaymentId={}",
                                paymentId);

                subscriptionService.activateSubscription(
                                payment.getShop().getId(),
                                payment.getPlan(),
                                paymentId);
        }
}