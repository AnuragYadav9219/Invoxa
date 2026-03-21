package com.invoice.tracker.controller.payment;

import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pay")
public class PaymentViewController {

    // @GetMapping("/{invoiceId}")
    // public String paymentPage(@PathVariable UUID invoiceId, Model model) {

    // model.addAttribute("invoiceId", invoiceId);

    // return "payment-placeholder";
    // }

    @GetMapping("/{invoiceId}")
    public String paymentPage(@PathVariable UUID invoiceId, Model model) {

        model.addAttribute("invoiceId", invoiceId);
        return "payment-placeholder";
    }
}
