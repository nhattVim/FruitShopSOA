package com.example.inventoryservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_inventory")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long productId; // Changed from skuCode
    private Integer quantity;
    private String batchId;
    private java.time.LocalDate importDate;
    private java.time.LocalDate expirationDate;
    private String unitOfMeasure; // e.g., "kg", "box"
}
