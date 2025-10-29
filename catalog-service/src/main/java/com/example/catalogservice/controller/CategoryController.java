package com.example.catalogservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.catalogservice.entity.Category;
import com.example.catalogservice.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService catergoryService;

    @GetMapping("/")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(catergoryService.getAllCategories());
    }
}
