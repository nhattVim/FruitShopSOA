package com.example.inventoryservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.inventoryservice.entity.StockItem;

public interface StockItemRepository extends JpaRepository<StockItem, Long> {

}
