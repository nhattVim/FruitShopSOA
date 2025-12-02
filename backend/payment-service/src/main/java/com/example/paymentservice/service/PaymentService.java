package com.example.paymentservice.service;

import com.example.paymentservice.dto.PaymentRequest;
import com.example.paymentservice.dto.PaymentResponse;
import com.example.paymentservice.model.Payment;
import com.example.paymentservice.model.PaymentStatus;
import com.example.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        // Simulate payment gateway integration
        PaymentStatus status = simulatePaymentGateway(paymentRequest);
        String transactionId = UUID.randomUUID().toString(); // Simulate transaction ID from gateway

        Payment payment = Payment.builder()
                .orderId(paymentRequest.getOrderId())
                .amount(paymentRequest.getAmount())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .transactionId(transactionId)
                .status(status)
                .paymentDate(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);
        log.info("Payment processed for orderId: {}, status: {}", paymentRequest.getOrderId(), status);
        return mapToPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentStatus(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(this::mapToPaymentResponse)
                .orElse(null); // Or throw an exception
    }

    @Transactional
    public PaymentResponse refundPayment(Long orderId) {
        Optional<Payment> paymentOptional = paymentRepository.findByOrderId(orderId);
        if (paymentOptional.isPresent()) {
            Payment payment = paymentOptional.get();
            if (payment.getStatus() == PaymentStatus.COMPLETED) {
                payment.setStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(payment);
                log.info("Payment for orderId {} refunded.", orderId);
                return mapToPaymentResponse(payment);
            } else {
                log.warn("Payment for orderId {} cannot be refunded as its status is not COMPLETED.", orderId);
                return mapToPaymentResponse(payment);
            }
        } else {
            log.warn("Payment for orderId {} not found for refund.", orderId);
            return null; // Or throw an exception
        }
    }

    private PaymentStatus simulatePaymentGateway(PaymentRequest request) {
        // Simple simulation: assume success for now
        // In a real application, this would involve calling external payment APIs
        log.info("Simulating payment gateway for orderId: {} with method: {}", request.getOrderId(), request.getPaymentMethod());
        // For demonstration, let's say cash payments are always successful, others might have random failures
        if ("Cash".equalsIgnoreCase(request.getPaymentMethod())) {
            return PaymentStatus.COMPLETED;
        } else {
            // Simulate a random success/failure for other methods
            if (Math.random() > 0.1) { // 90% success rate
                return PaymentStatus.COMPLETED;
            } else {
                return PaymentStatus.FAILED;
            }
        }
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}
