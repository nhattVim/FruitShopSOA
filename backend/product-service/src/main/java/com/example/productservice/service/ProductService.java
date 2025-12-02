package com.example.productservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.productservice.dto.ProductRequest;
import com.example.productservice.dto.ProductResponse;
import com.example.productservice.model.Product;
import com.example.productservice.repository.ProductRepository;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public void createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .imageUrl(productRequest.getImageUrl())
                .categoryId(productRequest.getCategoryId())
                .build();

        productRepository.save(product);
        log.info("Product {} is saved", product.getId());
    }

    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream().map(this::mapToProductResponse).toList();
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategoryId())
                .build();
    }

    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToProductResponse)
                .orElse(null); // Or throw an exception
    }

    public void updateProduct(Long id, ProductRequest productRequest) {
        productRepository.findById(id).ifPresentOrElse(
                product -> {
                    product.setName(productRequest.getName());
                    product.setDescription(productRequest.getDescription());
                    product.setPrice(productRequest.getPrice());
                    product.setImageUrl(productRequest.getImageUrl());
                    product.setCategoryId(productRequest.getCategoryId());
                    productRepository.save(product);
                    log.info("Product {} is updated", product.getId());
                },
                () -> log.warn("Product with id {} not found for update", id)
                // Optionally throw an exception
        );
    }

    public void deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            log.info("Product with id {} is deleted", id);
        } else {
            log.warn("Product with id {} not found for deletion", id);
            // Optionally throw an exception
        }
    }
}
