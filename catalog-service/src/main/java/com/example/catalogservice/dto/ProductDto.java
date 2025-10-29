package com.example.catalogservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDto {

    private Long id;
    private String name;
    private String description;
    private double price;
    private String unit;
    private String imageUrl;
    private String categoryName;
}
