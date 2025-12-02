package com.example.pricingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class VoucherRequest {
    private String code;
    private String discountType; // e.g., "PERCENTAGE", "FIXED"
    private Double value; // e.g., 10.0 for 10% or $10
    private Double minOrderAmount;
    private Integer usageLimit;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Boolean active;
}
