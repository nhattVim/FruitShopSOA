package com.example.pricingservice;

import com.example.pricingservice.dto.PriceRequest;
import com.example.pricingservice.dto.PromotionRequest;
import com.example.pricingservice.dto.VoucherRequest;
import com.example.pricingservice.service.PricingService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class PricingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PricingServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(PricingService pricingService) {
		return args -> {
			// Set Prices for Products (assuming Product IDs 1, 2, 3 exist)
			PriceRequest applePrice = PriceRequest.builder()
					.productId(1L)
					.currentPrice(BigDecimal.valueOf(1.99))
					.startDate(LocalDateTime.now())
					.endDate(LocalDateTime.now().plusYears(1))
					.build();
			pricingService.setPrice(applePrice);

			PriceRequest bananaPrice = PriceRequest.builder()
					.productId(2L)
					.currentPrice(BigDecimal.valueOf(0.79))
					.startDate(LocalDateTime.now())
					.endDate(LocalDateTime.now().plusYears(1))
					.build();
			pricingService.setPrice(bananaPrice);

			PriceRequest orangePrice = PriceRequest.builder()
					.productId(3L)
					.currentPrice(BigDecimal.valueOf(1.20))
					.startDate(LocalDateTime.now())
					.endDate(LocalDateTime.now().plusYears(1))
					.build();
			pricingService.setPrice(orangePrice);

			// Create a Promotion
			PromotionRequest weekendSale = PromotionRequest.builder()
					.name("Weekend Sale")
					.description("10% off on Apples and Bananas")
					.type("PercentageDiscount")
					.value(0.10)
					.productIds(Arrays.asList(1L, 2L))
					.startDate(LocalDateTime.now().minusDays(1))
					.endDate(LocalDateTime.now().plusDays(2))
					.conditions("Applies to imported apples and oranges")
					.build();
			pricingService.createPromotion(weekendSale);

			// Create a Voucher
			VoucherRequest save15Voucher = VoucherRequest.builder()
					.code("SAVE15")
					.discountType("PERCENTAGE")
					.value(15.0)
					.minOrderAmount(50.00)
					.usageLimit(100)
					.validFrom(LocalDateTime.now().minusDays(7))
					.validUntil(LocalDateTime.now().plusMonths(1))
					.active(true)
					.build();
			pricingService.createVoucher(save15Voucher);
		};
	}

}
