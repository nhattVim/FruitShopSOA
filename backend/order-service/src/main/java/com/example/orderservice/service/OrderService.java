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
            try {
                // Call Inventory Service to check stock and reserve
                Boolean isInStock = webClientBuilder.build().get()
                        .uri("http://inventory-service/api/inventory/inStock/" + item.getProductId())
                        .retrieve()
                        .bodyToMono(Boolean.class)
                        .timeout(java.time.Duration.ofSeconds(5))
                        .block(); // Blocking call for simplicity, consider async in real app

                if (Boolean.FALSE.equals(isInStock)) {
                    throw new IllegalArgumentException("Product " + item.getProductId() + " is not in stock, please try again later.");
                }

                // Get current inventory to check available quantity before deducting
                InventoryResponse inventoryResponse = null;
                try {
                    inventoryResponse = webClientBuilder.build().get()
                            .uri("http://inventory-service/api/inventory/" + item.getProductId())
                            .retrieve()
                            .bodyToMono(InventoryResponse.class)
                            .timeout(java.time.Duration.ofSeconds(5))
                            .block();
                } catch (Exception e) {
                    log.warn("Could not fetch inventory details for product {}, proceeding with deduction", item.getProductId());
                }

                // Deduct stock
                Boolean deducted = webClientBuilder.build().post()
                        .uri("http://inventory-service/api/inventory/outbound/" + item.getProductId() + "?quantity=" + item.getQuantity())
                        .retrieve()
                        .bodyToMono(Boolean.class)
                        .timeout(java.time.Duration.ofSeconds(5))
                        .block();

                if (Boolean.FALSE.equals(deducted)) {
                    String errorMsg;
                    if (inventoryResponse == null) {
                        errorMsg = String.format("Product %d has no inventory record. Please add inventory first.", item.getProductId());
                    } else if (inventoryResponse.getQuantity() < item.getQuantity()) {
                        errorMsg = String.format("Insufficient stock for product %d. Available: %d, Requested: %d", 
                                item.getProductId(), inventoryResponse.getQuantity(), item.getQuantity());
                    } else {
                        errorMsg = String.format("Failed to deduct stock for product %d. Please try again.", item.getProductId());
                    }
                    throw new IllegalArgumentException(errorMsg);
                }

                // Call Pricing Service to get unit price
                PriceResponse priceResponse = webClientBuilder.build().get()
                        .uri("http://pricing-service/api/pricing/price/" + item.getProductId())
                        .retrieve()
                        .bodyToMono(PriceResponse.class)
                        .timeout(java.time.Duration.ofSeconds(5))
                        .block();

                if (priceResponse != null && priceResponse.getCurrentPrice() != null) {
                    item.setUnitPrice(priceResponse.getCurrentPrice());
                    totalAmount = totalAmount.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                } else {
                    throw new IllegalArgumentException("Could not retrieve price for product " + item.getProductId());
                }
            } catch (org.springframework.web.reactive.function.client.WebClientException e) {
                log.error("Error calling service for product {}", item.getProductId(), e);
                throw new RuntimeException("Service unavailable: Unable to process order. Please try again later.", e);
            } catch (RuntimeException e) {
                // Handle timeout and other reactor exceptions
                // Timeout exceptions from Reactor are wrapped in RuntimeException
                Throwable cause = e.getCause();
                String message = e.getMessage();
                String className = e.getClass().getName();
                
                // Check for timeout-related exceptions
                if (cause instanceof java.util.concurrent.TimeoutException || 
                    (message != null && message.toLowerCase().contains("timeout")) ||
                    className.contains("Timeout")) {
                    log.error("Timeout while calling service for product {}", item.getProductId(), e);
                    throw new RuntimeException("Service timeout: Unable to process order. Please try again later.", e);
                }
                log.error("Error processing order item for product {}", item.getProductId(), e);
                throw e;
            } catch (Exception e) {
                log.error("Unexpected error processing order item for product {}", item.getProductId(), e);
                throw e;
            }
        }
        order.setTotalAmount(totalAmount);
        
        // Set the order reference on all order items BEFORE saving
        // This is required because OrderItem.order is marked as nullable=false
        // and the Order entity has cascade=CascadeType.ALL
        order.getOrderItems().forEach(orderItem -> orderItem.setOrder(order));
        
        // Save the order (this will cascade save the order items due to CascadeType.ALL)
        orderRepository.save(order);

        log.info("Order {} created successfully for customer {}", order.getOrderNumber(), order.getCustomerId());
        return order.getOrderNumber();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .toList();
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
