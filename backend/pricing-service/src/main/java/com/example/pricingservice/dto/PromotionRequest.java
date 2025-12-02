package com.example.pricingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PromotionRequest {
    private String name;
    private String description;
    private String type; // e.g., "BOGO", "PercentageDiscount", "FixedDiscount"
    private Double value; // e.g., 0.10 for 10% discount, 5.00 for $5 fixed discount
    private List<Long> productIds; // IDs of products to which the promotion applies
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String conditions; // e.g., "Buy 2 Get 1 Free", "Min order $50"
}
