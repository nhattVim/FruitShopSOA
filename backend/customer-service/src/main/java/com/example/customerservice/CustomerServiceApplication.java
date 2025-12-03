package com.example.customerservice;

import com.example.customerservice.dto.CustomerRequest;
import com.example.customerservice.service.CustomerService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class CustomerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(CustomerService customerService) {
		return args -> {
			// Create Customers
			CustomerRequest customer1 = CustomerRequest.builder()
					.name("John Doe")
					.email("john.doe@example.com")
					.address("123 Main St, Anytown, USA")
					.phone("+15551234567")
					.membershipLevel("Bronze")
					.build();
			customerService.createCustomer(customer1);

			CustomerRequest customer2 = CustomerRequest.builder()
					.name("Jane Smith")
					.email("jane.smith@example.com")
					.address("456 Oak Ave, Otherville, USA")
					.phone("+15559876543")
					.membershipLevel("Silver")
					.build();
			customerService.createCustomer(customer2);

			CustomerRequest customer3 = CustomerRequest.builder()
					.name("Alice Johnson")
					.email("alice.j@example.com")
					.address("789 Pine Ln, Anyplace, USA")
					.phone("+15551112222")
					.membershipLevel("Gold")
					.build();
			customerService.createCustomer(customer3);
		};
	}

}
