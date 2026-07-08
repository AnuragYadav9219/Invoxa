package com.invoice.tracker.service.printToken;

import java.util.UUID;

public interface PrintTokenService {
    
    String generateToken(UUID invoiceId, UUID shopId);

    boolean validateToken(String token);

    UUID getInvoiceId(String token);

    UUID getShopId(String token);
}
