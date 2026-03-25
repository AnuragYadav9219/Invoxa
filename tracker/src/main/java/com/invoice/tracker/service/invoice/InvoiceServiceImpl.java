package com.invoice.tracker.service.invoice;

import com.invoice.tracker.service.pdf.PdfService;
import com.invoice.tracker.specification.InvoiceSpecification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.dto.invoice.InvoiceItemRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.dto.common.PageResponse;
import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceItem;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.entity.item.Item;
import com.invoice.tracker.event.invoice.InvoiceCreatedEvent;
import com.invoice.tracker.helper.invoice.InvoiceHelper;
import com.invoice.tracker.helper.item.ItemHelper;
import com.invoice.tracker.mapper.InvoiceMapper;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.util.InvoiceNumberGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

        private final PdfService pdfService;
        private final InvoiceRepository invoiceRepository;
        private final InvoiceMapper invoiceMapper;
        private final InvoiceHelper invoiceHelper;
        private final ItemHelper itemHelper;
        private final InvoiceNumberGenerator invoiceNumberGenerator;
        private final ApplicationEventPublisher eventPublisher;

        // ====================== CREATE INVOICE =========================
        @Override
        @Transactional
        public InvoiceResponse createInvoice(CreateInvoiceRequest request) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                if (request.getItems() == null || request.getItems().isEmpty()) {
                        throw new BadRequestException("Invoice must contain at least one item");
                }

                if (request.getCustomerName() == null || request.getCustomerName().isBlank()) {
                        throw new BadRequestException("Customer name is required");
                }

                if (request.getCustomerEmail() == null || request.getCustomerEmail().isBlank()) {
                        throw new BadRequestException("Customer email is required");
                }

                List<InvoiceItem> invoiceItems = new ArrayList<>();
                BigDecimal totalAmount = BigDecimal.ZERO;

                for (InvoiceItemRequest itemRequest : request.getItems()) {

                        if (itemRequest.getQuantity() <= 0) {
                                throw new BadRequestException("Quantity must be greater than zero");
                        }

                        Item item = itemHelper.getItemOrThrow(itemRequest.getItemId());

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
                                .customerEmail(request.getCustomerEmail())
                                .status(InvoiceStatus.PENDING)
                                .totalAmount(totalAmount)
                                .paidAmount(BigDecimal.ZERO)
                                .remainingAmount(totalAmount)
                                .dueDate(request.getDueDate())
                                .build();

                invoiceItems.forEach(i -> i.setInvoice(invoice));
                invoice.setItems(invoiceItems);

                Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);

                eventPublisher.publishEvent(new InvoiceCreatedEvent(savedInvoice.getId(), shopId));

                return invoiceMapper.toResponse(savedInvoice);
        }

        // ====================== GET ALL INVOICES =========================
        @Override
        public PageResponse<InvoiceResponse> getInvoices(int page, int size) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

                Page<InvoiceResponse> pageData = invoiceRepository
                                .findByShopId(shopId, pageable)
                                .map(invoiceMapper::toResponse);

                return new PageResponse<>(
                                pageData.getContent(),
                                pageData.getNumber(),
                                pageData.getSize(),
                                pageData.getTotalElements(),
                                pageData.getTotalPages(),
                                pageData.isLast());
        }

        // ======================== GET SINGLE INVOICE =========================
        @Override
        public InvoiceResponse getInvoice(UUID invoiceId) {

                Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

                return invoiceMapper.toResponse(invoice);
        }

        // ====================== DELETE INVOICE =========================
        @Override
        public void deleteInvoice(UUID invoiceId) {

                Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

                invoiceRepository.delete(invoice);
        }

        // ====================== PDF GENERATION =========================
        public byte[] getInvoicePdf(UUID invoiceId, UUID shopId) {

                Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

                return pdfService.generateInvoicePdf(invoice);
        }

        // ====================== GET RECENT INVOICES ====================
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getRecentInvoices(int limit) {

                Pageable pageable = PageRequest.of(0, limit);

                return invoiceRepository
                                .findRecentInvoicesWithItems(pageable)
                                .stream()
                                .map(invoiceMapper::toResponse)
                                .toList();
        }

        // ======================== FILTER =========================
        @Override
        public PageResponse<InvoiceResponse> filterInvoices(InvoiceFilterRequest filter, int page, int size) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                String sort = filter.getSort() != null ? filter.getSort() : "createdAt,desc";

                String[] parts = sort.split(",");
                String field = parts[0];
                String direction = parts[1];

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by(Sort.Direction.fromString(direction), field));

                Page<InvoiceResponse> pageData = invoiceRepository.findAll(
                                InvoiceSpecification.filterInvoices(filter, shopId),
                                pageable).map(invoiceMapper::toResponse);

                return new PageResponse<>(
                                pageData.getContent(),
                                pageData.getNumber(),
                                pageData.getSize(),
                                pageData.getTotalElements(),
                                pageData.getTotalPages(),
                                pageData.isLast());
        }
}