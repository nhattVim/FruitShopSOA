package com.example.catalogservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.catalogservice.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
