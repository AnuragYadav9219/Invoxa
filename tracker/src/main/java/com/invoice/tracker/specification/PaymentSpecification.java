package com.invoice.tracker.specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.invoice.tracker.dto.payment.PaymentFilterRequest;
import com.invoice.tracker.entity.payment.Payment;

import jakarta.persistence.criteria.Predicate;

public class PaymentSpecification {

        public static Specification<Payment> filterPayments(
                        PaymentFilterRequest filter,
                        UUID shopId) {
                return (root, query, cb) -> {

                        List<Predicate> predicates = new ArrayList<Predicate>();

                        // Multi-tenant safety
                        predicates.add(
                                        cb.equal(root.get("invoice").get("shopId"), shopId));

                        predicates.add(
                                        cb.equal(root.get("deleted"), false));

                        // Search (reference number)
                        if (filter.getSearch() != null && !filter.getSearch().isBlank()) {

                                String pattern = "%" + filter.getSearch().toLowerCase() + "%";

                                predicates.add(
                                                cb.like(
                                                                cb.lower(root.get("referenceNumber")),
                                                                pattern));

                        }

                        // Method filter
                        if (filter.getMethod() != null) {
                                predicates.add(
                                                cb.equal(root.get("method"),
                                                                filter.getMethod()));
                        }

                        // Date range
                        if (filter.getFromDate() != null) {
                                predicates.add(
                                                cb.greaterThanOrEqualTo(
                                                                root.get("createdAt"),
                                                                filter.getFromDate().atStartOfDay()));
                        }

                        if (filter.getToDate() != null) {
                                predicates.add(
                                                cb.lessThanOrEqualTo(
                                                                root.get("createdAt"),
                                                                filter.getToDate().atTime(23, 59, 59)));
                        }

                        // Amount range
                        if (filter.getMinAmount() != null) {
                                predicates.add(
                                                cb.greaterThanOrEqualTo(
                                                                root.get("amount"),
                                                                filter.getMinAmount()));
                        }

                        if (filter.getMaxAmount() != null) {
                                predicates.add(
                                                cb.lessThanOrEqualTo(
                                                                root.get("amount"),
                                                                filter.getMaxAmount()));
                        }

                        return cb.and(predicates.toArray(new Predicate[0]));
                };
        }
}
