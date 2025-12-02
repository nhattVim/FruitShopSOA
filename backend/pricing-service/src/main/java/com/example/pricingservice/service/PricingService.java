package com.example.pricingservice.service;

import com.example.pricingservice.dto.*;
import com.example.pricingservice.model.Price;
import com.example.pricingservice.model.Promotion;
import com.example.pricingservice.model.Voucher;
import com.example.pricingservice.repository.PriceRepository;
import com.example.pricingservice.repository.PromotionRepository;
import com.example.pricingservice.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PricingService {

    private final PriceRepository priceRepository;
    private final PromotionRepository promotionRepository;
    private final VoucherRepository voucherRepository;

    @Transactional
    public void setPrice(PriceRequest priceRequest) {
        Price price = Price.builder()
                .productId(priceRequest.getProductId())
                .currentPrice(priceRequest.getCurrentPrice())
                .startDate(priceRequest.getStartDate())
                .endDate(priceRequest.getEndDate())
                .build();
        priceRepository.save(price);
        log.info("Price set for productId: {} - {}", priceRequest.getProductId(), priceRequest.getCurrentPrice());
    }

    @Transactional(readOnly = true)
    public PriceResponse getProductPrice(Long productId) {
        return priceRepository.findByProductId(productId)
                .map(this::mapToPriceResponse)
                .orElse(null); // Or throw an exception
    }

    @Transactional
    public void createPromotion(PromotionRequest promotionRequest) {
        Promotion promotion = Promotion.builder()
                .name(promotionRequest.getName())
                .description(promotionRequest.getDescription())
                .type(promotionRequest.getType())
                .value(promotionRequest.getValue())
                .productIds(promotionRequest.getProductIds())
                .startDate(promotionRequest.getStartDate())
                .endDate(promotionRequest.getEndDate())
                .conditions(promotionRequest.getConditions())
                .build();
        promotionRepository.save(promotion);
        log.info("Promotion created: {}", promotionRequest.getName());
    }

    @Transactional(readOnly = true)
    public BigDecimal applyPromotion(Long productId, BigDecimal originalPrice) {
        List<Promotion> activePromotions = promotionRepository.findByProductIdsContainingAndStartDateBeforeAndEndDateAfter(
                productId, LocalDateTime.now(), LocalDateTime.now());

        BigDecimal finalPrice = originalPrice;
        for (Promotion promotion : activePromotions) {
            // Simple logic: apply one promotion, more complex logic (e.g., best discount) can be added
            if ("PercentageDiscount".equalsIgnoreCase(promotion.getType())) {
                finalPrice = finalPrice.subtract(originalPrice.multiply(BigDecimal.valueOf(promotion.getValue())));
            } else if ("FixedDiscount".equalsIgnoreCase(promotion.getType())) {
                finalPrice = finalPrice.subtract(BigDecimal.valueOf(promotion.getValue()));
            }
            // "BOGO" and other types would require more complex application logic and potentially order context
        }
        return finalPrice;
    }

    @Transactional
    public void createVoucher(VoucherRequest voucherRequest) {
        Voucher voucher = Voucher.builder()
                .code(voucherRequest.getCode())
                .discountType(voucherRequest.getDiscountType())
                .value(voucherRequest.getValue())
                .minOrderAmount(voucherRequest.getMinOrderAmount())
                .usageLimit(voucherRequest.getUsageLimit())
                .usedCount(0) // Initialize used count
                .validFrom(voucherRequest.getValidFrom())
                .validUntil(voucherRequest.getValidUntil())
                .active(true)
                .build();
        voucherRepository.save(voucher);
        log.info("Voucher created: {}", voucherRequest.getCode());
    }

    @Transactional
    public BigDecimal applyVoucher(String voucherCode, BigDecimal orderTotal) {
        Optional<Voucher> voucherOptional = voucherRepository.findByCode(voucherCode);
        if (voucherOptional.isPresent()) {
            Voucher voucher = voucherOptional.get();
            LocalDateTime now = LocalDateTime.now();

            if (voucher.getActive() &&
                    voucher.getUsedCount() < voucher.getUsageLimit() &&
                    (voucher.getValidFrom() == null || !now.isBefore(voucher.getValidFrom())) &&
                    (voucher.getValidUntil() == null || !now.isAfter(voucher.getValidUntil())) &&
                    (voucher.getMinOrderAmount() == null || orderTotal.compareTo(BigDecimal.valueOf(voucher.getMinOrderAmount())) >= 0)) {

                BigDecimal discountedTotal = orderTotal;
                if ("PERCENTAGE".equalsIgnoreCase(voucher.getDiscountType())) {
                    discountedTotal = orderTotal.subtract(orderTotal.multiply(BigDecimal.valueOf(voucher.getValue()).divide(BigDecimal.valueOf(100))));
                } else if ("FIXED".equalsIgnoreCase(voucher.getDiscountType())) {
                    discountedTotal = orderTotal.subtract(BigDecimal.valueOf(voucher.getValue()));
                }
                voucher.setUsedCount(voucher.getUsedCount() + 1);
                voucherRepository.save(voucher);
                log.info("Voucher {} applied successfully. Discounted total: {}", voucherCode, discountedTotal);
                return discountedTotal;
            } else {
                log.warn("Voucher {} is not valid or cannot be applied.", voucherCode);
                return orderTotal; // No discount applied
            }
        } else {
            log.warn("Voucher {} not found.", voucherCode);
            return orderTotal; // No discount applied
        }
    }

    private PriceResponse mapToPriceResponse(Price price) {
        return PriceResponse.builder()
                .id(price.getId())
                .productId(price.getProductId())
                .currentPrice(price.getCurrentPrice())
                .startDate(price.getStartDate())
                .endDate(price.getEndDate())
                .build();
    }

    private PromotionResponse mapToPromotionResponse(Promotion promotion) {
        return PromotionResponse.builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .description(promotion.getDescription())
                .type(promotion.getType())
                .value(promotion.getValue())
                .productIds(promotion.getProductIds())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .conditions(promotion.getConditions())
                .build();
    }

    private VoucherResponse mapToVoucherResponse(Voucher voucher) {
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .discountType(voucher.getDiscountType())
                .value(voucher.getValue())
                .minOrderAmount(voucher.getMinOrderAmount())
                .usageLimit(voucher.getUsageLimit())
                .usedCount(voucher.getUsedCount())
                .validFrom(voucher.getValidFrom())
                .validUntil(voucher.getValidUntil())
                .active(voucher.getActive())
                .build();
    }
}
