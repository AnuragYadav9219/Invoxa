package com.invoice.tracker.service.invoice;

import com.invoice.tracker.service.payment.PaymentService;
import com.invoice.tracker.service.pdf.PdfService;
import com.invoice.tracker.specification.InvoiceSpecification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.common.PageResponse;
import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceItem;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.entity.item.Item;
import com.invoice.tracker.entity.item.Unit;
import com.invoice.tracker.event.invoice.InvoiceCreatedEvent;
import com.invoice.tracker.helper.invoice.InvoiceHelper;
import com.invoice.tracker.helper.item.ItemHelper;
import com.invoice.tracker.mapper.InvoiceMapper;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.repository.shop.ShopRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.util.InvoiceNumberGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

        private final PdfService pdfService;
        private final InvoiceRepository invoiceRepository;
        private final ShopRepository shopRepository;
        private final InvoiceMapper invoiceMapper;
        private final InvoiceHelper invoiceHelper;
        private final ItemHelper itemHelper;
        private final PaymentService paymentService;
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

                        if (itemRequest.getQuantity() == null ||
                                        itemRequest.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                                throw new BadRequestException("Quantity must be greater than zero");
                        }

                        Item item = itemHelper.getItemOrThrow(itemRequest.getItemId());

                        if (!item.getShop().getId().equals(shopId)) {
                                throw new BadRequestException("Item does not belong to this shop");
                        }

                        Unit unit;
                        try {
                                if (itemRequest.getUnit() != null) {
                                        unit = Unit.valueOf(itemRequest.getUnit().toUpperCase());
                                } else if (item.getDefaultUnit() != null) {
                                        unit = item.getDefaultUnit();
                                } else {
                                        throw new BadRequestException("Unit is required");
                                }
                        } catch (Exception e) {
                                throw new BadRequestException("Invalid unit");
                        }

                        if (!item.getAllowedUnits().contains(unit)) {
                                throw new BadRequestException("Unit not allowed for item: " + item.getName());
                        }

                        BigDecimal quantity = itemRequest.getQuantity();

                        BigDecimal price = resolvePrice(item, itemRequest);

                        BigDecimal itemTotal = price.multiply(quantity);
                        totalAmount = totalAmount.add(itemTotal);

                        InvoiceItem invoiceItem = InvoiceItem.builder()
                                        .item(item)
                                        .itemName(item.getName())
                                        .unit(unit)
                                        .price(price)
                                        .quantity(quantity)
                                        .total(itemTotal)
                                        .build();

                        invoiceItems.add(invoiceItem);
                }

                String invoiceNumber = invoiceNumberGenerator.generate();

                Shop shop = shopRepository.findById(shopId)
                                .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

                Invoice invoice = Invoice.builder()
                                .invoiceNumber(invoiceNumber)
                                .shopId(shopId)
                                .customerName(request.getCustomerName())
                                .customerPhone(request.getCustomerPhone())
                                .customerEmail(request.getCustomerEmail())
                                .customerAddress(request.getCustomerAddress())
                                .status(InvoiceStatus.PENDING)
                                .template(shop.getInvoiceTemplate())
                                .totalAmount(totalAmount)
                                .paidAmount(BigDecimal.ZERO)
                                .remainingAmount(totalAmount)
                                .dueDate(request.getDueDate())
                                .paymentToken(UUID.randomUUID().toString().replace("-", ""))
                                .build();

                invoiceItems.forEach(i -> i.setInvoice(invoice));
                invoice.setItems(invoiceItems);

                Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);

                String email = SecurityUtils.getCurrentUserEmail() != null
                                ? request.getCustomerEmail()
                                : SecurityUtils.getCurrentUserEmail();

                eventPublisher.publishEvent(
                                new InvoiceCreatedEvent(savedInvoice.getId(), shopId, email));

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

        // ====================== GET CUSTOMER's INVOICES =====================
        @Override
        public List<InvoiceResponse> getInvoicesByCustomer(String customerName) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                return invoiceRepository
                                .findByShopIdAndCustomerNameIgnoreCase(shopId, customerName)
                                .stream()
                                .map(invoiceMapper::toSummaryResponse)
                                .toList();
        }

        // ====================== CUSTOMER SUMMARY =========================
        @Override
        public List<Map<String, Object>> getCustomerSummary() {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                List<Invoice> invoices = invoiceRepository
                                .findByShopIdAndDeletedFalse(shopId);

                Map<String, Map<String, Object>> map = new HashMap<>();

                for (Invoice inv : invoices) {

                        if (inv.getCustomerName() == null)
                                continue;

                        String key = inv.getCustomerName().toLowerCase();

                        map.putIfAbsent(key, new HashMap<>());
                        Map<String, Object> data = map.get(key);

                        data.put("name", inv.getCustomerName());
                        data.put("phone", inv.getCustomerPhone());

                        data.put(
                                        "totalAmount",
                                        ((BigDecimal) data.getOrDefault("totalAmount", BigDecimal.ZERO))
                                                        .add(inv.getTotalAmount() != null ? inv.getTotalAmount()
                                                                        : BigDecimal.ZERO));

                        data.put(
                                        "paidAmount",
                                        ((BigDecimal) data.getOrDefault("paidAmount", BigDecimal.ZERO))
                                                        .add(inv.getPaidAmount() != null ? inv.getPaidAmount()
                                                                        : BigDecimal.ZERO));

                        data.put(
                                        "invoiceCount",
                                        ((Integer) data.getOrDefault("invoiceCount", 0)) + 1);
                }

                for (Map<String, Object> data : map.values()) {

                        BigDecimal total = (BigDecimal) data.getOrDefault("totalAmount", BigDecimal.ZERO);
                        BigDecimal paid = (BigDecimal) data.getOrDefault("paidAmount", BigDecimal.ZERO);

                        data.put("pendingAmount", total.subtract(paid));
                }

                return map.values().stream()
                                .sorted((a, b) -> ((BigDecimal) b.get("totalAmount"))
                                                .compareTo((BigDecimal) a.get("totalAmount")))
                                .toList();
        }

        // ===================== UPDATE INVOICE ==========================
        @Override
        @Transactional
        public InvoiceResponse updateInvoice(UUID invoiceId, CreateInvoiceRequest request) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                // Validations
                if (request.getItems() == null || request.getItems().isEmpty()) {
                        throw new BadRequestException("Invoice must contain at least one item");
                }

                if (request.getCustomerName() == null || request.getCustomerName().isBlank()) {
                        throw new BadRequestException("Customer name is required");
                }

                if (request.getCustomerEmail() == null || request.getCustomerEmail().isBlank()) {
                        throw new BadRequestException("Customer email is required");
                }

                Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

                if (!invoice.getShopId().equals(shopId)) {
                        throw new BadRequestException("Unauthorized access to invoice");
                }

                // Update basic fields
                invoice.setCustomerName(request.getCustomerName());
                invoice.setCustomerEmail(request.getCustomerEmail());
                invoice.setCustomerPhone(request.getCustomerPhone());
                invoice.setCustomerAddress(request.getCustomerAddress());
                invoice.setDueDate(request.getDueDate());

                // Remove old items
                invoice.getItems().clear();

                List<InvoiceItem> updatedItems = new ArrayList<>();
                BigDecimal totalAmount = BigDecimal.ZERO;

                // Rebuild items
                for (InvoiceItemRequest itemRequest : request.getItems()) {

                        if (itemRequest.getQuantity() == null ||
                                        itemRequest.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                                throw new BadRequestException("Quantity must be greater than zero");
                        }

                        Item item = itemHelper.getItemOrThrow(itemRequest.getItemId());

                        if (!item.getShop().getId().equals(shopId)) {
                                throw new BadRequestException("Item does not belong to this shop");
                        }

                        Unit unit;
                        try {
                                if (itemRequest.getUnit() != null) {
                                        unit = Unit.valueOf(itemRequest.getUnit().toUpperCase());
                                } else if (item.getDefaultUnit() != null) {
                                        unit = item.getDefaultUnit();
                                } else {
                                        throw new BadRequestException("Unit is required");
                                }
                        } catch (Exception e) {
                                throw new BadRequestException("Invalid unit");
                        }

                        if (!item.getAllowedUnits().contains(unit)) {
                                throw new BadRequestException("Unit not allowed for item: " + item.getName());
                        }

                        BigDecimal quantity = itemRequest.getQuantity();
                        BigDecimal price = resolvePrice(item, itemRequest);

                        BigDecimal itemTotal = price.multiply(quantity);
                        totalAmount = totalAmount.add(itemTotal);

                        InvoiceItem invoiceItem = InvoiceItem.builder()
                                        .item(item)
                                        .itemName(item.getName())
                                        .unit(unit)
                                        .price(price)
                                        .quantity(quantity)
                                        .total(itemTotal)
                                        .invoice(invoice)
                                        .build();

                        updatedItems.add(invoiceItem);
                }

                invoice.getItems().addAll(updatedItems);

                // Update totals
                invoice.setTotalAmount(totalAmount);

                // Recalculate remaining amount
                BigDecimal paidAmount = invoice.getPaidAmount() != null
                                ? invoice.getPaidAmount()
                                : BigDecimal.ZERO;

                invoice.setRemainingAmount(totalAmount.subtract(paidAmount));

                Invoice updatedInvoice = invoiceRepository.save(invoice);

                return invoiceMapper.toResponse(updatedInvoice);
        }

        // ====================== DELETE (SOFT) =========================
        @Override
        @Transactional
        public void deleteInvoice(UUID invoiceId) {

                Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

                invoice.setDeleted(true);
                invoice.setDeletedAt(LocalDateTime.now());

                invoiceRepository.save(invoice);
                paymentService.deletePaymentsByInvoice(invoiceId);
        }

        // ====================== RESTORE INVOICE ========================
        @Override
        @Transactional
        public void restoreInvoice(UUID id) {
                Invoice invoice = invoiceRepository
                                .findByIdAndShopId(id, SecurityUtils.getCurrentUserShopId())
                                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

                invoice.setDeleted(false);
                invoice.setDeletedAt(null);

                invoiceRepository.save(invoice);
                paymentService.restorePaymentsByInvoice(id);
        }

        // ======================== PERMANENT DELETE =====================
        @Override
        public void permanentDeleteInvoice(UUID id) {

                Invoice invoice = invoiceRepository
                                .findByIdAndShopId(id, SecurityUtils.getCurrentUserShopId())
                                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

                invoiceRepository.delete(invoice);
        }

        // ======================= GET DELETED INVOICES ====================
        @Override
        public List<InvoiceResponse> getDeletedInvoices() {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                return invoiceRepository.findDeletedInvoicesWithItems(shopId)
                                .stream()
                                .map(invoiceMapper::toResponse)
                                .toList();
        }

        // ====================== PDF GENERATION =========================
        @Override
        public byte[] getInvoicePdf(UUID invoiceId, UUID shopId, String email) {

                Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

                if (!invoice.getShopId().equals(shopId)) {
                        throw new BadRequestException("Invoice does not belong to this shop");
                }

                return pdfService.generateInvoicePdf(invoiceId, shopId, invoice.getTemplate());
        }

        // ====================== GET RECENT INVOICES ====================
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getRecentInvoices(int limit) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                Pageable pageable = PageRequest.of(0, limit);

                return invoiceRepository
                                .findRecentInvoicesWithItems(shopId, pageable)
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

        @Override
        @Transactional(readOnly = true)
        public InvoiceResponse getPublicInvoice(String paymentToken) {

                Invoice invoice = invoiceRepository.findByPaymentToken(paymentToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

                return invoiceMapper.toResponse(invoice);
        }

        // ========================= PRIVATE METHODS =======================

        private BigDecimal resolvePrice(Item item, InvoiceItemRequest request) {

                BigDecimal basePrice = item.getPrice();

                if (request.getCustomPrice() != null) {

                        if (request.getCustomPrice().compareTo(BigDecimal.ZERO) <= 0) {
                                throw new BadRequestException("Invalid custom price");
                        }

                        if (request.getCustomPrice().compareTo(basePrice.multiply(BigDecimal.valueOf(2))) > 0) {
                                throw new BadRequestException("Custom price too high");
                        }

                        return request.getCustomPrice();
                }

                return basePrice;
        }

        @Override
        public InvoiceResponse getInvoiceForPrint(UUID invoiceId, UUID shopId) {

                Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId, shopId);

                return invoiceMapper.toResponse(invoice);
        }
}