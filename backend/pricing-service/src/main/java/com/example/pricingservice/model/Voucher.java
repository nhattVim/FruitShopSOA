package com.example.pricingservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String discountType; // e.g., "PERCENTAGE", "FIXED"
    private Double voucherValue; // e.g., 10.0 for 10% or $10
    private Double minOrderAmount;
    private Integer usageLimit;
    private Integer usedCount; // To track how many times this voucher has been used
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Boolean active;
}
