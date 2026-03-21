package com.invoice.tracker.specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.entity.invoice.Invoice;

import jakarta.persistence.criteria.Predicate;

public class InvoiceSpecification {

    public static Specification<Invoice> filterInvoices(
            InvoiceFilterRequest filter, UUID shopId) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Multi-tenant safety
            predicates.add(cb.equal(root.get("shopId"), shopId));

            // Search
            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {

                String pattern = "%" + filter.getSearch().toLowerCase() + "%";

                Predicate invoiceNumberMatch = cb.like(cb.lower(root.get("invoiceNumber")), pattern);

                Predicate customerMatch = cb.like(cb.lower(root.get("customerName")), pattern);

                Predicate emailMatch = cb.like(cb.lower(root.get("customerEmail")), pattern);

                predicates.add(cb.or(invoiceNumberMatch, customerMatch, emailMatch));
            }

            // Status filter
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            // Date Range
            if (filter.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dueDate"), filter.getFromDate()));
            }

            if (filter.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dueDate"), filter.getToDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
