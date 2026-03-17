package com.invoice.tracker.mapper;

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
                .totalAmount(invoice.getTotalAmount().doubleValue())
                .status(invoice.getStatus().name())
                .dueDate(invoice.getDueDate())
                .items(
                        invoice.getItems().stream()
                                .map(item -> InvoiceItemResponse.builder()
                                        .itemName(item.getItemName())
                                        .quantity(item.getQuantity())
                                        .price(item.getPrice())
                                        .total(item.getTotal())
                                        .build())
                                .toList())
                .build();
    }
}
