package com.example.inventoryservice.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.inventoryservice.entity.StockItem;
import com.example.inventoryservice.entity.Warehouse;
import com.example.inventoryservice.repository.StockItemRepository;
import com.example.inventoryservice.repository.WarehouseRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class InitData {

    @Bean
    CommandLineRunner initCatalogData(StockItemRepository stockItemRepository,
            WarehouseRepository warehouseRepository) {
        return args -> {

            Warehouse wh1 = Warehouse.builder()
                    .name("Kho Trung Tâm Đà Nẵng")
                    .location("KCN Hòa Khánh, Liên Chiểu, Đà Nẵng")
                    .build();

            Warehouse wh2 = Warehouse.builder()
                    .name("Kho Hà Nội")
                    .location("Số 25 Nguyễn Văn Cừ, Long Biên, Hà Nội")
                    .build();

            Warehouse wh3 = Warehouse.builder()
                    .name("Kho TP.HCM")
                    .location("Khu chế xuất Tân Thuận, Quận 7, TP.HCM")
                    .build();

            warehouseRepository.saveAll(List.of(wh1, wh2, wh3));

            StockItem s1 = StockItem.builder()
                    .productId(1L)
                    .warehouse(wh1)
                    .quantity(120)
                    .batchNo("BATCH-001")
                    .expiryDate(LocalDate.now().plusDays(45))
                    .createdAt(LocalDateTime.now())
                    .build();

            StockItem s2 = StockItem.builder()
                    .productId(2L)
                    .warehouse(wh1)
                    .quantity(85)
                    .batchNo("BATCH-002")
                    .expiryDate(LocalDate.now().plusDays(30))
                    .createdAt(LocalDateTime.now())
                    .build();

            StockItem s3 = StockItem.builder()
                    .productId(3L)
                    .warehouse(wh2)
                    .quantity(200)
                    .batchNo("BATCH-003")
                    .expiryDate(LocalDate.now().plusDays(60))
                    .createdAt(LocalDateTime.now())
                    .build();

            StockItem s4 = StockItem.builder()
                    .productId(4L)
                    .warehouse(wh3)
                    .quantity(150)
                    .batchNo("BATCH-004")
                    .expiryDate(LocalDate.now().plusDays(25))
                    .createdAt(LocalDateTime.now())
                    .build();

            StockItem s5 = StockItem.builder()
                    .productId(5L)
                    .warehouse(wh3)
                    .quantity(90)
                    .batchNo("BATCH-005")
                    .expiryDate(LocalDate.now().plusDays(15))
                    .createdAt(LocalDateTime.now())
                    .build();

            stockItemRepository.saveAll(List.of(s1, s2, s3, s4, s5));

            log.info("✅ Dữ liệu mẫu InventoryService đã được khởi tạo thành công!");
        };
    }
}
