package com.example.orderservice.config;

import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.model.OrderStatus;
import com.example.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final OrderRepository orderRepository;

    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (orderRepository.count() == 0) {
            log.info("Initializing sample order data...");
            initializeSampleOrders();
            log.info("Sample order data initialized successfully!");
        } else {
            log.info("Database already contains orders. Skipping data initialization.");
        }
    }

    private void initializeSampleOrders() {
        // Sample Order 1: Completed order
        Order order1 = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerId(1L)
                .orderDate(LocalDateTime.now().minusDays(5))
                .status(OrderStatus.COMPLETED)
                .totalAmount(new BigDecimal("45.98"))
                .orderItems(new ArrayList<>())
                .build();

        OrderItem item1_1 = OrderItem.builder()
                .productId(1L)
                .quantity(3)
                .unitPrice(new BigDecimal("5.99"))
                .order(order1)
                .build();

        OrderItem item1_2 = OrderItem.builder()
                .productId(2L)
                .quantity(2)
                .unitPrice(new BigDecimal("7.50"))
                .order(order1)
                .build();

        OrderItem item1_3 = OrderItem.builder()
                .productId(3L)
                .quantity(4)
                .unitPrice(new BigDecimal("4.50"))
                .order(order1)
                .build();

        order1.getOrderItems().add(item1_1);
        order1.getOrderItems().add(item1_2);
        order1.getOrderItems().add(item1_3);
        orderRepository.save(order1);

        // Sample Order 2: Processing order
        Order order2 = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerId(2L)
                .orderDate(LocalDateTime.now().minusDays(2))
                .status(OrderStatus.PROCESSING)
                .totalAmount(new BigDecimal("28.47"))
                .orderItems(new ArrayList<>())
                .build();

        OrderItem item2_1 = OrderItem.builder()
                .productId(1L)
                .quantity(2)
                .unitPrice(new BigDecimal("5.99"))
                .order(order2)
                .build();

        OrderItem item2_2 = OrderItem.builder()
                .productId(4L)
                .quantity(3)
                .unitPrice(new BigDecimal("5.50"))
                .order(order2)
                .build();

        order2.getOrderItems().add(item2_1);
        order2.getOrderItems().add(item2_2);
        orderRepository.save(order2);

        // Sample Order 3: New order
        Order order3 = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerId(1L)
                .orderDate(LocalDateTime.now().minusHours(3))
                .status(OrderStatus.NEW)
                .totalAmount(new BigDecimal("19.98"))
                .orderItems(new ArrayList<>())
                .build();

        OrderItem item3_1 = OrderItem.builder()
                .productId(2L)
                .quantity(1)
                .unitPrice(new BigDecimal("7.50"))
                .order(order3)
                .build();

        OrderItem item3_2 = OrderItem.builder()
                .productId(5L)
                .quantity(2)
                .unitPrice(new BigDecimal("6.24"))
                .order(order3)
                .build();

        order3.getOrderItems().add(item3_1);
        order3.getOrderItems().add(item3_2);
        orderRepository.save(order3);

        // Sample Order 4: Delivering order
        Order order4 = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerId(3L)
                .orderDate(LocalDateTime.now().minusDays(1))
                .status(OrderStatus.DELIVERING)
                .totalAmount(new BigDecimal("67.45"))
                .orderItems(new ArrayList<>())
                .build();

        OrderItem item4_1 = OrderItem.builder()
                .productId(1L)
                .quantity(5)
                .unitPrice(new BigDecimal("5.99"))
                .order(order4)
                .build();

        OrderItem item4_2 = OrderItem.builder()
                .productId(3L)
                .quantity(6)
                .unitPrice(new BigDecimal("4.50"))
                .order(order4)
                .build();

        OrderItem item4_3 = OrderItem.builder()
                .productId(6L)
                .quantity(2)
                .unitPrice(new BigDecimal("8.75"))
                .order(order4)
                .build();

        order4.getOrderItems().add(item4_1);
        order4.getOrderItems().add(item4_2);
        order4.getOrderItems().add(item4_3);
        orderRepository.save(order4);

        // Sample Order 5: Cancelled order
        Order order5 = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerId(2L)
                .orderDate(LocalDateTime.now().minusDays(3))
                .status(OrderStatus.CANCELLED)
                .totalAmount(new BigDecimal("12.99"))
                .orderItems(new ArrayList<>())
                .build();

        OrderItem item5_1 = OrderItem.builder()
                .productId(2L)
                .quantity(1)
                .unitPrice(new BigDecimal("7.50"))
                .order(order5)
                .build();

        OrderItem item5_2 = OrderItem.builder()
                .productId(4L)
                .quantity(1)
                .unitPrice(new BigDecimal("5.49"))
                .order(order5)
                .build();

        order5.getOrderItems().add(item5_1);
        order5.getOrderItems().add(item5_2);
        orderRepository.save(order5);

        log.info("Created {} sample orders with various statuses", orderRepository.count());
    }
}

