package com.example.productservice;

import com.example.productservice.dto.CategoryRequest;
import com.example.productservice.dto.ProductRequest;
import com.example.productservice.service.CategoryService;
import com.example.productservice.service.ProductService;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ProductServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(ProductService productService, CategoryService categoryService) {
		return args -> {
			// Create Categories
			CategoryRequest fruitCategory = CategoryRequest.builder()
					.name("Fruits")
					.description("Fresh fruits from local and international farms")
					.build();
			categoryService.createCategory(fruitCategory);

			CategoryRequest vegetableCategory = CategoryRequest.builder()
					.name("Vegetables")
					.description("Organic and fresh vegetables")
					.build();
			categoryService.createCategory(vegetableCategory);

			// Add Products
			ProductRequest apple = ProductRequest.builder()
					.name("Apple")
					.description("Sweet red apple")
					.price(BigDecimal.valueOf(1.99))
					.imageUrl("http://example.com/apple.jpg")
					.categoryId(1L) // Assuming ID 1 for Fruits
					.build();
			productService.createProduct(apple);

			ProductRequest banana = ProductRequest.builder()
					.name("Banana")
					.description("Fresh yellow bananas")
					.price(BigDecimal.valueOf(0.79))
					.imageUrl("http://example.com/banana.jpg")
					.categoryId(1L) // Assuming ID 1 for Fruits
					.build();
			productService.createProduct(banana);

			ProductRequest orange = ProductRequest.builder()
					.name("Orange")
					.description("Juicy oranges")
					.price(BigDecimal.valueOf(1.20))
					.imageUrl("http://example.com/orange.jpg")
					.categoryId(1L) // Assuming ID 1 for Fruits
					.build();
			productService.createProduct(orange);

			ProductRequest spinach = ProductRequest.builder()
					.name("Spinach")
					.description("Fresh organic spinach")
					.price(BigDecimal.valueOf(2.49))
					.imageUrl("http://example.com/spinach.jpg")
					.categoryId(2L) // Assuming ID 2 for Vegetables
					.build();
			productService.createProduct(spinach);

			ProductRequest potato = ProductRequest.builder()
					.name("Potato")
					.description("Locally grown potatoes")
					.price(BigDecimal.valueOf(0.99))
					.imageUrl("http://example.com/potato.jpg")
					.categoryId(2L) // Assuming ID 2 for Vegetables
					.build();
			productService.createProduct(potato);
		};
	}

}

