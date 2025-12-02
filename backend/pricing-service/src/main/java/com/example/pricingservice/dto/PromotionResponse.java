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
public class PromotionResponse {
    private Long id;
    private String name;
    private String description;
    private String type;
    private Double value;
    private List<Long> productIds;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String conditions;
}
