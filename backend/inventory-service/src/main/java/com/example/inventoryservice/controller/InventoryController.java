package com.example.inventoryservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.inventoryservice.dto.InventoryRequest;
import com.example.inventoryservice.dto.InventoryResponse;
import com.example.inventoryservice.service.InventoryService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/inStock/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public boolean isInStock(@PathVariable Long productId) {
        return inventoryService.isInStock(productId);
    }

    @PostMapping("/inbound")
    @ResponseStatus(HttpStatus.CREATED)
    public void recordInbound(@RequestBody InventoryRequest inventoryRequest) {
        inventoryService.recordInbound(inventoryRequest);
    }

    @PostMapping("/outbound/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public boolean deductStock(@PathVariable Long productId, @RequestParam Integer quantity) {
        return inventoryService.deductStock(productId, quantity);
    }

    @GetMapping("/expiring")
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> getExpiringItems(@RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate thresholdDate) {
        if (thresholdDate == null) {
            thresholdDate = LocalDate.now().plusMonths(1); // Default to items expiring in next month
        }
        return inventoryService.getExpiringItems(thresholdDate);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public InventoryResponse getInventoryByProductId(@PathVariable Long productId) {
        return inventoryService.getInventoryByProductId(productId);
    }

    @GetMapping("/convert")
    @ResponseStatus(HttpStatus.OK)
    public Double convertUnits(@RequestParam Long productId,
                               @RequestParam Double quantity,
                               @RequestParam String fromUnit,
                               @RequestParam String toUnit) {
        return inventoryService.convertUnits(productId, quantity, fromUnit, toUnit);
    }
}
