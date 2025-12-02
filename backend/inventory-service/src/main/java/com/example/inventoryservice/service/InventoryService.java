package com.example.inventoryservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.inventoryservice.dto.InventoryRequest;
import com.example.inventoryservice.dto.InventoryResponse;
import com.example.inventoryservice.model.Inventory;
import com.example.inventoryservice.repository.InventoryRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public boolean isInStock(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(inventory -> inventory.getQuantity() > 0)
                .orElse(false);
    }

    @Transactional
    public void recordInbound(InventoryRequest inventoryRequest) {
        Inventory inventory = Inventory.builder()
                .productId(inventoryRequest.getProductId())
                .quantity(inventoryRequest.getQuantity())
                .batchId(inventoryRequest.getBatchId())
                .importDate(inventoryRequest.getImportDate())
                .expirationDate(inventoryRequest.getExpirationDate())
                .unitOfMeasure(inventoryRequest.getUnitOfMeasure())
                .build();
        inventoryRepository.save(inventory);
        log.info("Inbound inventory recorded for productId: {} batchId: {}", inventoryRequest.getProductId(),
                inventoryRequest.getBatchId());
    }

    @Transactional
    public boolean deductStock(Long productId, Integer quantity) {
        Optional<Inventory> inventoryOptional = inventoryRepository.findByProductId(productId);
        if (inventoryOptional.isPresent()) {
            Inventory inventory = inventoryOptional.get();
            if (inventory.getQuantity() >= quantity) {
                inventory.setQuantity(inventory.getQuantity() - quantity);
                inventoryRepository.save(inventory);
                log.info("Deducted {} units from productId: {}", quantity, productId);
                return true;
            } else {
                log.warn("Insufficient stock for productId: {}. Available: {}, Requested: {}", productId,
                        inventory.getQuantity(), quantity);
                return false;
            }
        } else {
            log.warn("Inventory not found for productId: {}", productId);
            return false;
        }
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getExpiringItems(LocalDate thresholdDate) {
        // Find items expiring on or before the threshold date
        return inventoryRepository.findAll().stream()
                .filter(inventory -> inventory.getExpirationDate() != null
                        && !inventory.getExpirationDate().isAfter(thresholdDate))
                .map(this::mapToInventoryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(this::mapToInventoryResponse)
                .orElse(null); // Or throw an exception
    }

    // Placeholder for unit conversion logic
    @Transactional
    public Double convertUnits(Long productId, Double quantity, String fromUnit, String toUnit) {
        log.info("Performing unit conversion for productId: {}, quantity: {}, from {} to {}", productId, quantity,
                fromUnit, toUnit);
        // Implement actual conversion logic here, possibly involving a lookup table or
        // external service
        // For now, a simple placeholder
        if (fromUnit.equalsIgnoreCase(toUnit)) {
            return quantity;
        } else if (fromUnit.equalsIgnoreCase("kg") && toUnit.equalsIgnoreCase("gram")) {
            return quantity * 1000;
        } else if (fromUnit.equalsIgnoreCase("box") && toUnit.equalsIgnoreCase("unit")) {
            // Assume 1 box = 10 units for demonstration
            return quantity * 10;
        }
        log.warn("No conversion rule found for {} to {}", fromUnit, toUnit);
        return null; // Or throw an exception
    }

    private InventoryResponse mapToInventoryResponse(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProductId())
                .quantity(inventory.getQuantity())
                .batchId(inventory.getBatchId())
                .importDate(inventory.getImportDate())
                .expirationDate(inventory.getExpirationDate())
                .unitOfMeasure(inventory.getUnitOfMeasure())
                .build();
    }
}
