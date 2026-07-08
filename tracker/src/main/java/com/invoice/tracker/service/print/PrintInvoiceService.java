package com.invoice.tracker.service.print;

import java.util.UUID;

import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.shop.ShopResponse;

public interface PrintInvoiceService {
    
    InvoiceResponse getInvoice(UUID invoiceId, UUID shopId);

    ShopResponse getShop(UUID shopId);
}
