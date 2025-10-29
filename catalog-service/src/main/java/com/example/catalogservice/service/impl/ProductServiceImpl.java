package com.example.catalogservice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.catalogservice.dto.ProductDto;
import com.example.catalogservice.mapper.ProductMapper;
import com.example.catalogservice.repository.ProductRepository;
import com.example.catalogservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductDto> getAllProducts() {
        return productMapper.toDtoList(productRepository.findAll());
    }
}
