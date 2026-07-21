package com.invoice.tracker.mapper;

import java.time.LocalDate;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.invoice.InvoiceItemResponse;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.entity.invoice.Invoice;

@Component
public class InvoiceMapper {

        public InvoiceResponse toResponse(Invoice invoice) {

                return InvoiceResponse.builder()
                                .id(invoice.getId())
                                .invoiceNumber(invoice.getInvoiceNumber())
                                .shopId(invoice.getShopId())

                                .customerName(invoice.getCustomerName())
                                .customerPhone(invoice.getCustomerPhone())
                                .customerEmail(invoice.getCustomerEmail())
                                .customerAddress(invoice.getCustomerAddress())

                                .totalAmount(invoice.getTotalAmount())
                                .paidAmount(invoice.getPaidAmount())
                                .remainingAmount(invoice.getRemainingAmount())

                                .status(invoice.getStatus().name())
                                .template(
                                        invoice.getTemplate() != null 
                                                ? invoice.getTemplate().name()
                                                : null
                                )

                                .createdAt(LocalDate.now())
                                .dueDate(invoice.getDueDate())
                                .items(
                                        invoice.getItems() != null
                                                ? invoice.getItems().stream()
                                                        .map(item -> InvoiceItemResponse.builder()
                                                                .itemId(item.getItem() != null ? item.getItem().getId() : null)
                                                                .itemName(item.getItemName())
                                                                .quantity(item.getQuantity())
                                                                .price(item.getPrice())
                                                                .total(item.getTotal())
                                                                .unit(item.getUnit() != null ? item.getUnit().name() : null)
                                                                .build())
                                                        .toList()
                                                : null)
                                .build();
        }

        public InvoiceResponse toSummaryResponse(Invoice invoice) {

                return InvoiceResponse.builder()
                                .id(invoice.getId())
                                .invoiceNumber(invoice.getInvoiceNumber())
                                .shopId(invoice.getShopId())

                                .customerName(invoice.getCustomerName())
                                .customerPhone(invoice.getCustomerPhone())
                                .customerEmail(invoice.getCustomerEmail())
                                .customerAddress(invoice.getCustomerAddress())

                                .totalAmount(invoice.getTotalAmount())
                                .paidAmount(invoice.getPaidAmount())
                                .remainingAmount(invoice.getRemainingAmount())

                                .status(invoice.getStatus() != null ? invoice.getStatus().name() : null)
                                .template(invoice.getTemplate().name())
                                
                                .createdAt(invoice.getCreatedAt().toLocalDate())
                                .dueDate(invoice.getDueDate())
                                .build();
        }
}
