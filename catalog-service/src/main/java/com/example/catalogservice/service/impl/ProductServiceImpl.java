package com.example.catalogservice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.catalogservice.entity.Product;
import com.example.catalogservice.repository.ProductRepository;
import com.example.catalogservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

}
