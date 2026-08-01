package com.invoice.tracker.specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.entity.invoice.Invoice;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class InvoiceSpecification {

    public static Specification<Invoice> filterInvoices(
            InvoiceFilterRequest filter, UUID shopId) {

        return (root, query, cb) -> {

            if (!Long.class.equals(query.getResultType())) {
                root.fetch("items", JoinType.LEFT);
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("shopId"), shopId));
            predicates.add(cb.isFalse(root.get("deleted")));

            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {

                String pattern = "%" + filter.getSearch().toLowerCase() + "%";

                Predicate invoiceNumberMatch = cb.like(cb.lower(root.get("invoiceNumber")), pattern);

                Predicate customerMatch = cb.like(cb.lower(root.get("customerName")), pattern);

                Predicate emailMatch = cb.like(cb.lower(root.get("customerEmail")), pattern);

                predicates.add(cb.or(
                        invoiceNumberMatch,
                        customerMatch,
                        emailMatch));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getFromDate() != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("dueDate"),
                                filter.getFromDate()));
            }

            if (filter.getToDate() != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("dueDate"),
                                filter.getToDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}