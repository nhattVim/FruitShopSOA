package com.example.pricingservice.controller;

import com.example.pricingservice.dto.*;
import com.example.pricingservice.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;

    @PostMapping("/price")
    @ResponseStatus(HttpStatus.CREATED)
    public void setPrice(@RequestBody PriceRequest priceRequest) {
        pricingService.setPrice(priceRequest);
    }

    @GetMapping("/price/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public PriceResponse getProductPrice(@PathVariable Long productId) {
        return pricingService.getProductPrice(productId);
    }

    @PostMapping("/promotion")
    @ResponseStatus(HttpStatus.CREATED)
    public void createPromotion(@RequestBody PromotionRequest promotionRequest) {
        pricingService.createPromotion(promotionRequest);
    }

    @GetMapping("/promotion/apply/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public BigDecimal applyPromotion(@PathVariable Long productId, @RequestParam BigDecimal originalPrice) {
        return pricingService.applyPromotion(productId, originalPrice);
    }

    @PostMapping("/voucher")
    @ResponseStatus(HttpStatus.CREATED)
    public void createVoucher(@RequestBody VoucherRequest voucherRequest) {
        pricingService.createVoucher(voucherRequest);
    }

    @GetMapping("/voucher/apply")
    @ResponseStatus(HttpStatus.OK)
    public BigDecimal applyVoucher(@RequestParam String voucherCode, @RequestParam BigDecimal orderTotal) {
        return pricingService.applyVoucher(voucherCode, orderTotal);
    }
}
