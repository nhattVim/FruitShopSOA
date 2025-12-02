package com.example.pricingservice.repository;

import com.example.pricingservice.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByProductIdsContainingAndStartDateBeforeAndEndDateAfter(Long productId, LocalDateTime now1, LocalDateTime now2);
}
