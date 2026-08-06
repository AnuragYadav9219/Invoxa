package com.invoice.tracker.service.support;

import com.invoice.tracker.dto.support.SupportRequest;
import com.invoice.tracker.dto.support.SupportResponse;

public interface SupportService {

    SupportResponse createTicket(SupportRequest request);

}
