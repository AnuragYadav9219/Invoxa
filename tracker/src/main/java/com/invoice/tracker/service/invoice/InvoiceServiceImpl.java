package com.invoice.tracker.service.invoice;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.dto.invoice.InvoiceItemRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceItem;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.entity.item.Item;
import com.invoice.tracker.mapper.InvoiceMapper;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.repository.item.ItemRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.util.InvoiceNumberGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

        private final InvoiceRepository invoiceRepository;
        private final ItemRepository itemRepository;
        private final InvoiceMapper invoiceMapper;
        private final InvoiceNumberGenerator invoiceNumberGenerator;

        @Override
        @Transactional
        public InvoiceResponse createInvoice(CreateInvoiceRequest request) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                if (request.getItems() == null || request.getItems().isEmpty()) {
                        throw new RuntimeException("Invoice must contain at least one item");
                }

                List<InvoiceItem> invoiceItems = new ArrayList<>();
                BigDecimal totalAmount = BigDecimal.ZERO;

                for (InvoiceItemRequest itemRequest : request.getItems()) {

                        Item item = itemRepository.findByIdAndShopId(itemRequest.getItemId(), shopId)
                                        .orElseThrow(() -> new RuntimeException("Item not found"));

                        BigDecimal price = BigDecimal.valueOf(item.getPrice());
                        BigDecimal quantity = BigDecimal.valueOf(itemRequest.getQuantity());

                        BigDecimal itemTotal = price.multiply(quantity);

                        totalAmount = totalAmount.add(itemTotal);

                        InvoiceItem invoiceItem = InvoiceItem.builder()
                                        .itemName(item.getName())
                                        .price(price)
                                        .quantity(itemRequest.getQuantity())
                                        .total(itemTotal)
                                        .build();

                        invoiceItems.add(invoiceItem);
                }

                String invoiceNumber = invoiceNumberGenerator.generate();

                Invoice invoice = Invoice.builder()
                                .invoiceNumber(invoiceNumber)
                                .shopId(shopId)
                                .customerName(request.getCustomerName())
                                .customerPhone(request.getCustomerPhone())
                                .status(InvoiceStatus.PENDING)
                                .totalAmount(totalAmount)
                                .dueDate(request.getDueDate())
                                .build();

                invoiceItems.forEach(i -> i.setInvoice(invoice));
                invoice.setItems(invoiceItems);

                Invoice savedInvoice = invoiceRepository.save(invoice);

                return invoiceMapper.toResponse(savedInvoice);
        }

        // Get all Invoices for current shop
        @Override
        public List<InvoiceResponse> getInvoices() {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                return invoiceRepository.findByShopId(shopId)
                                .stream()
                                .map(invoiceMapper::toResponse)
                                .toList();
        }

        // Get single invoice
        @Override
        public InvoiceResponse getInvoice(UUID invoiceId) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                Invoice invoice = invoiceRepository
                                .findByIdAndShopId(invoiceId, shopId)
                                .orElseThrow(() -> new RuntimeException("Invoice not found"));

                return invoiceMapper.toResponse(invoice);
        }

        // Mark invoice as paid
        @Override
        public InvoiceResponse markAsPaid(UUID invoiceId) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                Invoice invoice = invoiceRepository
                                .findByIdAndShopId(invoiceId, shopId)
                                .orElseThrow(() -> new RuntimeException("Invoice not found"));

                invoice.setStatus(InvoiceStatus.PAID);

                Invoice updated = invoiceRepository.save(invoice);

                return invoiceMapper.toResponse(updated);
        }

        // Delete invoice
        @Override
        public void deleteInvoice(UUID invoiceId) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                Invoice invoice = invoiceRepository
                                .findByIdAndShopId(invoiceId, shopId)
                                .orElseThrow(() -> new RuntimeException("Invoice not found"));

                invoiceRepository.delete(invoice);
        }
}
