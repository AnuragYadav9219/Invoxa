package com.invoice.tracker.service.print;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.shop.ShopResponse;

@Service
public class PrintInvoiceServiceImpl implements PrintInvoiceService {

    @Override
    public InvoiceResponse getInvoice(UUID invoiceId, UUID shopId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getInvoice'");
    }

    @Override
    public ShopResponse getShop(UUID shopId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getShop'");
    }
    
}
