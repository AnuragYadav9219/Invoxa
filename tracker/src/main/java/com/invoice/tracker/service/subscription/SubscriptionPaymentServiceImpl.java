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
        public void verifyPayment(VerifySubscriptionPaymentRequest request) {

                SubscriptionPayment payment = paymentRepository
                                .findByOrderId(request.getRazorpayOrderId())
                                .orElseThrow(() -> new ResourceNotFoundException("Subscription payment not found"));

                boolean valid = gatewayService.verifyPayment(
                                request.getRazorpayOrderId(),
                                request.getRazorpayPaymentId(),
                                request.getRazorpaySignature());

                if (!valid) {
                        payment.setStatus(SubscriptionPaymentStatus.FAILED);
                        payment.setFailureReason("Invalid payment signature");
                        paymentRepository.save(payment);

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

                if (payment.getStatus() == SubscriptionPaymentStatus.FAILED) {

                        log.info(
                                        "Subscription payment already failed. OrderId={}",
                                        orderId);

                        return;
                }

                try {

                        Payment razorpayPayment = gatewayService.fetchPayment(paymentId);

                        String status = razorpayPayment.get("status").toString();

                        if (!"captured".equalsIgnoreCase(status)) {

                                payment.setStatus(
                                                SubscriptionPaymentStatus.FAILED);

                                payment.setFailureReason(
                                                "Payment status: " + status);

                                paymentRepository.save(payment);

                                throw new BadRequestException(
                                                "Payment not captured");
                        }

                        String razorpayOrderId = razorpayPayment.get("order_id").toString();

                        if (!orderId.equals(razorpayOrderId)) {

                                payment.setStatus(
                                                SubscriptionPaymentStatus.FAILED);

                                payment.setFailureReason(
                                                "Order ID mismatch");

                                paymentRepository.save(payment);

                                throw new BadRequestException(
                                                "Payment does not belong to this order.");
                        }

                        Object amountObj = razorpayPayment.get("amount");

                        BigDecimal paidAmount;

                        if (amountObj instanceof Number number) {

                                paidAmount = BigDecimal.valueOf(
                                                number.longValue())
                                                .divide(BigDecimal.valueOf(100));

                        } else {

                                paidAmount = new BigDecimal(
                                                amountObj.toString())
                                                .divide(BigDecimal.valueOf(100));
                        }

                        if (paidAmount.compareTo(payment.getAmount()) != 0) {

                                payment.setStatus(
                                                SubscriptionPaymentStatus.FAILED);

                                payment.setFailureReason(
                                                "Amount mismatch");

                                paymentRepository.save(payment);

                                throw new BadRequestException(
                                                "Subscription amount mismatch.");
                        }

                        String method = razorpayPayment.get("method").toString();

                        log.info(
                                        "Subscription paid using {}",
                                        method);

                        payment.setPaymentId(paymentId);
                        payment.setTransactionId(paymentId);
                        payment.setPaidAt(LocalDateTime.now());
                        payment.setStatus(
                                        SubscriptionPaymentStatus.SUCCESS);
                        payment.setFailureReason(null);

                        paymentRepository.save(payment);

                        log.info(
                                        "Subscription payment marked SUCCESS. PaymentId={}",
                                        paymentId);

                        subscriptionService.activateSubscription(
                                        payment.getShop().getId(),
                                        payment.getPlan(),
                                        paymentId);

                } catch (Exception ex) {

                        if (payment.getStatus() != SubscriptionPaymentStatus.SUCCESS) {

                                payment.setStatus(
                                                SubscriptionPaymentStatus.FAILED);

                                if (payment.getFailureReason() == null) {
                                        payment.setFailureReason(ex.getMessage());
                                }

                                paymentRepository.save(payment);
                        }

                        throw ex;
                }
        }

        @Override
        public void markPaymentFailed(
                        String orderId,
                        String paymentId,
                        String reason) {

                SubscriptionPayment payment = paymentRepository
                                .findByOrderId(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Subscription payment not found"));

                if (payment.getStatus() == SubscriptionPaymentStatus.SUCCESS) {

                        log.info(
                                        "Ignoring failed webhook because payment is already SUCCESS. OrderId={}",
                                        orderId);

                        return;
                }

                if (payment.getStatus() == SubscriptionPaymentStatus.FAILED) {

                        log.info(
                                        "Payment already marked FAILED. OrderId={}",
                                        orderId);

                        return;
                }

                payment.setPaymentId(paymentId);
                payment.setTransactionId(paymentId);
                payment.setStatus(
                                SubscriptionPaymentStatus.FAILED);
                payment.setFailureReason(reason);

                paymentRepository.save(payment);

                log.info(
                                "Subscription payment marked FAILED. OrderId={}",
                                orderId);
        }
}