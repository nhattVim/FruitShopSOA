package com.example.inventoryservice;

import com.example.inventoryservice.dto.InventoryRequest;
import com.example.inventoryservice.service.InventoryService;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class InventoryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventoryServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(InventoryService inventoryService) {
		return args -> {
			// Add some inventory for Product ID 1 (e.g., Apple)
			InventoryRequest appleInventory = InventoryRequest.builder()
					.productId(1L)
					.quantity(100)
					.batchId("BATCH-APPLE-001")
					.importDate(LocalDate.now())
					.expirationDate(LocalDate.now().plusMonths(6))
					.unitOfMeasure("kg")
					.build();
			inventoryService.recordInbound(appleInventory);

			// Add some inventory for Product ID 2 (e.g., Banana)
			InventoryRequest bananaInventory = InventoryRequest.builder()
					.productId(2L)
					.quantity(200)
					.batchId("BATCH-BANANA-001")
					.importDate(LocalDate.now())
					.expirationDate(LocalDate.now().plusWeeks(2))
					.unitOfMeasure("unit")
					.build();
			inventoryService.recordInbound(bananaInventory);

			// Add some inventory for Product ID 3 (e.g., Orange)
			InventoryRequest orangeInventory = InventoryRequest.builder()
					.productId(3L)
					.quantity(150)
					.batchId("BATCH-ORANGE-001")
					.importDate(LocalDate.now())
					.expirationDate(LocalDate.now().plusMonths(3))
					.unitOfMeasure("kg")
					.build();
			inventoryService.recordInbound(orangeInventory);
		};
	}

}

