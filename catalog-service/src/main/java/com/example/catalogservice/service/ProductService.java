package com.example.catalogservice.service;

import java.util.List;

import com.example.catalogservice.dto.ProductDto;

public interface ProductService {

    List<ProductDto> getAllProducts();
}
