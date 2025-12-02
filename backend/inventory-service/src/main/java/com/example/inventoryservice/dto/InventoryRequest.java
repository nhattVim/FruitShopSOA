package com.example.inventoryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class InventoryRequest {
    private Long productId;
    private Integer quantity;
    private String batchId;
    private LocalDate importDate;
    private LocalDate expirationDate;
    private String unitOfMeasure;
}
