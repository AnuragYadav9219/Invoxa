package com.invoice.tracker.specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.invoice.tracker.dto.payment.PaymentFilterRequest;
import com.invoice.tracker.entity.payment.Payment;

import jakarta.persistence.criteria.Predicate;

public class PaymentSpecification {

        public static Specification<Payment> filterPayments(PaymentFilterRequest filter, UUID shopId) {

                return (root, query, cb) -> {

                        List<Predicate> predicates = new ArrayList<>();

                        /* ================= MULTI-TENANT ================= */
                        predicates.add(
                                        cb.equal(root.get("invoice").get("shopId"), shopId));

                        /* ================= 🗑 SOFT DELETE ================= */
                        predicates.add(
                                        cb.equal(root.get("deleted"), false));

                        /* ================= SEARCH ================= */
                        if (filter != null &&
                                        filter.getSearch() != null &&
                                        !filter.getSearch().isBlank()) {

                                String searchValue = filter.getSearch().trim().toLowerCase();
                                String pattern = "%" + searchValue + "%";

                                List<Predicate> searchPredicates = new ArrayList<>();

                                // reference number
                                searchPredicates.add(
                                                cb.like(cb.lower(root.get("referenceNumber")), pattern));

                                // customer name
                                searchPredicates.add(
                                                cb.like(cb.lower(root.get("invoice").get("customerName")), pattern));

                                // customer phone
                                searchPredicates.add(
                                                cb.like(cb.lower(root.get("invoice").get("customerPhone")), pattern));

                                /* ================= AMOUNT SEARCH ================= */
                                try {
                                        // If user typed a number -> match amount
                                        BigDecimal amount = new BigDecimal(searchValue);

                                        searchPredicates.add(
                                                        cb.equal(root.get("amount"), amount));
                                } catch (Exception ignored) {
                                        // Not a number -> ignore amount filter
                                }

                                predicates.add(
                                                cb.or(searchPredicates.toArray(new Predicate[0])));
                        }

                        /* ================= METHOD ================= */
                        if (filter != null && filter.getMethod() != null) {
                                predicates.add(
                                                cb.equal(root.get("method"), filter.getMethod()));
                        }

                        /* ================= DATE RANGE ================= */
                        if (filter != null && filter.getFromDate() != null) {
                                predicates.add(
                                                cb.greaterThanOrEqualTo(
                                                                root.get("createdAt"),
                                                                filter.getFromDate().atStartOfDay()));
                        }

                        if (filter != null && filter.getToDate() != null) {
                                predicates.add(
                                                cb.lessThanOrEqualTo(
                                                                root.get("createdAt"),
                                                                filter.getToDate().atTime(23, 59, 59)));
                        }

                        /* ================= AMOUNT RANGE ================= */
                        if (filter != null && filter.getMinAmount() != null) {
                                predicates.add(
                                                cb.greaterThanOrEqualTo(
                                                                root.get("amount"),
                                                                filter.getMinAmount()));
                        }

                        if (filter != null && filter.getMaxAmount() != null) {
                                predicates.add(
                                                cb.lessThanOrEqualTo(
                                                                root.get("amount"),
                                                                filter.getMaxAmount()));
                        }

                        return cb.and(predicates.toArray(new Predicate[0]));
                };
        }
}