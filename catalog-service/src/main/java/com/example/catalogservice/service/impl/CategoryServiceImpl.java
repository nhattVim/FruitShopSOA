package com.example.catalogservice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.catalogservice.entity.Category;
import com.example.catalogservice.repository.CategoryRepository;
import com.example.catalogservice.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
