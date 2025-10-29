package com.example.catalogservice.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.catalogservice.dto.ProductDto;
import com.example.catalogservice.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryName", ignore = true)
    ProductDto toDto(Product product);

    List<ProductDto> toDtoList(List<Product> products);
}
