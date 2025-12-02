package com.example.orderservice.service;

import com.example.orderservice.dto.InventoryResponse;
import com.example.orderservice.dto.PriceResponse;
import com.example.orderservice.dto.OrderItemRequest;
import com.example.orderservice.dto.OrderItemResponse;
import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.dto.PriceResponse;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.model.OrderStatus;
import com.example.orderservice.repository.OrderItemRepository;
import com.example.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final WebClient.Builder webClientBuilder;

    @Transactional
    public String createOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);
        order.setCustomerId(orderRequest.getCustomerId());

        List<OrderItem> orderItems = orderRequest.getOrderItems().stream()
                .map(this::mapToOrderItem)
                .toList();

        order.setOrderItems(orderItems);

        // Calculate total amount and interact with other services
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItem item : order.getOrderItems()) {
            // Call Inventory Service to check stock and reserve
            Boolean isInStock = webClientBuilder.build().get()
                    .uri("http://inventory-service/api/inventory/inStock/" + item.getProductId())
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block(); // Blocking call for simplicity, consider async in real app

            if (Boolean.FALSE.equals(isInStock)) {
                throw new IllegalArgumentException("Product " + item.getProductId() + " is not in stock, please try again later.");
            }

            // Deduct stock
            Boolean deducted = webClientBuilder.build().post()
                    .uri("http://inventory-service/api/inventory/outbound/" + item.getProductId() + "?quantity=" + item.getQuantity())
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            if (Boolean.FALSE.equals(deducted)) {
                throw new IllegalArgumentException("Failed to deduct stock for product " + item.getProductId());
            }

            // Call Pricing Service to get unit price
            PriceResponse priceResponse = webClientBuilder.build().get()
                    .uri("http://pricing-service/api/pricing/price/" + item.getProductId())
                    .retrieve()
                    .bodyToMono(PriceResponse.class)
                    .block();

            if (priceResponse != null && priceResponse.getCurrentPrice() != null) {
                item.setUnitPrice(priceResponse.getCurrentPrice());
                totalAmount = totalAmount.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            } else {
                throw new IllegalArgumentException("Could not retrieve price for product " + item.getProductId());
            }
        }
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        // Ensure order items are saved with the order reference
        order.getOrderItems().forEach(orderItem -> orderItem.setOrder(order));
        orderItemRepository.saveAll(order.getOrderItems());

        log.info("Order {} created successfully for customer {}", order.getOrderNumber(), order.getCustomerId());
        return order.getOrderNumber();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(this::mapToOrderResponse)
                .orElse(null); // Or throw an exception
    }

    @Transactional
    public void updateOrderStatus(Long id, OrderStatus newStatus) {
        orderRepository.findById(id).ifPresentOrElse(
                order -> {
                    order.setStatus(newStatus);
                    orderRepository.save(order);
                    log.info("Order {} status updated to {}", order.getOrderNumber(), newStatus);
                },
                () -> log.warn("Order with id {} not found for status update", id)
        );
    }

    private OrderItem mapToOrderItem(OrderItemRequest orderItemRequest) {
        return OrderItem.builder()
                .productId(orderItemRequest.getProductId())
                .quantity(orderItemRequest.getQuantity())
                .build();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> orderItemResponses = order.getOrderItems().stream()
                .map(this::mapToOrderItemResponse)
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomerId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .orderItems(orderItemResponses)
                .build();
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem orderItem) {
        return OrderItemResponse.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProductId())
                .quantity(orderItem.getQuantity())
                .unitPrice(orderItem.getUnitPrice())
                .build();
    }
}
