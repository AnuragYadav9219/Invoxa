package com.invoice.tracker.dto.invoice;

import com.invoice.tracker.dto.shop.ShopResponse;

public record InvoicePdfResponse(
        InvoiceResponse invoice,
        ShopResponse shop) {

}
