package com.example.inventoryservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.inventoryservice.entity.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

}
