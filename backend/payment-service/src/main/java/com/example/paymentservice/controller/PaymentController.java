package com.example.paymentservice.controller;

import com.example.paymentservice.dto.PaymentRequest;
import com.example.paymentservice.dto.PaymentResponse;
import com.example.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse processPayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.processPayment(paymentRequest);
    }

    @GetMapping("/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    public PaymentResponse getPaymentStatus(@PathVariable Long orderId) {
        return paymentService.getPaymentStatus(orderId);
    }

    @PostMapping("/refund/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    public PaymentResponse refundPayment(@PathVariable Long orderId) {
        return paymentService.refundPayment(orderId);
    }
}
