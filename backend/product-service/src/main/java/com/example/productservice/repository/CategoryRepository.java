package com.example.productservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.productservice.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
