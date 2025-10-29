package com.example.catalogservice.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.catalogservice.entity.Category;
import com.example.catalogservice.entity.Product;
import com.example.catalogservice.repository.CategoryRepository;
import com.example.catalogservice.repository.ProductRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class InitData {

    @Bean
    CommandLineRunner initCatalogData(CategoryRepository categoryRepository, ProductRepository productRepository) {
        return args -> {
            if (categoryRepository.count() == 0 && productRepository.count() == 0) {

                Category fruits = categoryRepository.save(new Category("Fruits"));
                Category vegetables = categoryRepository.save(new Category("Vegetables"));
                Category importedFruits = categoryRepository.save(new Category("Imported Fruits"));

                productRepository.save(Product.builder()
                        .name("Apple")
                        .description("Fresh red apples from local farm")
                        .price(2.5)
                        .unit("kg")
                        .imageUrl("https://example.com/images/apple.jpg")
                        .category(fruits)
                        .build());

                productRepository.save(Product.builder()
                        .name("Banana")
                        .description("Sweet bananas from Vietnam")
                        .price(1.8)
                        .unit("kg")
                        .imageUrl("https://example.com/images/banana.jpg")
                        .category(fruits)
                        .build());

                productRepository.save(Product.builder()
                        .name("Broccoli")
                        .description("Organic broccoli from Da Lat")
                        .price(3.2)
                        .unit("kg")
                        .imageUrl("https://example.com/images/broccoli.jpg")
                        .category(vegetables)
                        .build());

                productRepository.save(Product.builder()
                        .name("Kiwi")
                        .description("Imported kiwi fruit from New Zealand")
                        .price(4.5)
                        .unit("kg")
                        .imageUrl("https://example.com/images/kiwi.jpg")
                        .category(importedFruits)
                        .build());

                log.info(">>> Sample Categories & Products have been initialized.");
            }
        };
    }
}
