package com.example.pricingservice.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String promotionType; // e.g., "BOGO", "PercentageDiscount", "FixedDiscount"
    private Double promotionValue; // e.g., 0.10 for 10% discount, 5.00 for $5 fixed discount
    @ElementCollection
    @CollectionTable(name = "promotion_products")
    private List<Long> productIds; // IDs of products to which the promotion applies
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String conditions; // e.g., "Buy 2 Get 1 Free", "Min order $50"
}
