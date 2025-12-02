package com.example.customerservice.service;

import com.example.customerservice.dto.CustomerRequest;
import com.example.customerservice.dto.CustomerResponse;
import com.example.customerservice.model.Customer;
import com.example.customerservice.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional
    public void createCustomer(CustomerRequest customerRequest) {
        Customer customer = Customer.builder()
                .name(customerRequest.getName())
                .email(customerRequest.getEmail())
                .address(customerRequest.getAddress())
                .phone(customerRequest.getPhone())
                .membershipLevel(customerRequest.getMembershipLevel())
                .membershipPoints(0) // New customer starts with 0 points
                .build();
        customerRepository.save(customer);
        log.info("Customer {} created with email {}", customer.getName(), customer.getEmail());
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(this::mapToCustomerResponse)
                .orElse(null); // Or throw an exception
    }

    @Transactional
    public void updateCustomer(Long id, CustomerRequest customerRequest) {
        customerRepository.findById(id).ifPresentOrElse(
                customer -> {
                    customer.setName(customerRequest.getName());
                    customer.setEmail(customerRequest.getEmail());
                    customer.setAddress(customerRequest.getAddress());
                    customer.setPhone(customerRequest.getPhone());
                    customer.setMembershipLevel(customerRequest.getMembershipLevel());
                    // membershipPoints are updated via addMembershipPoints method
                    customerRepository.save(customer);
                    log.info("Customer {} updated", customer.getId());
                },
                () -> log.warn("Customer with id {} not found for update", id)
        );
    }

    @Transactional
    public void deleteCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            log.info("Customer with id {} deleted", id);
        } else {
            log.warn("Customer with id {} not found for deletion", id);
        }
    }

    @Transactional
    public void addMembershipPoints(Long customerId, Integer points) {
        customerRepository.findById(customerId).ifPresentOrElse(
                customer -> {
                    customer.setMembershipPoints(customer.getMembershipPoints() + points);
                    customerRepository.save(customer);
                    log.info("Added {} points to customer {}. New total: {}", points, customerId, customer.getMembershipPoints());
                },
                () -> log.warn("Customer with id {} not found for adding membership points", customerId)
        );
    }

    // Placeholder for fetching purchase history
    // This would ideally call the Order Service
    public String getPurchaseHistory(Long customerId) {
        log.info("Fetching purchase history for customer {}", customerId);
        return "Purchase history for customer " + customerId + " (Not yet implemented, would call Order Service)";
    }

    private CustomerResponse mapToCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .address(customer.getAddress())
                .phone(customer.getPhone())
                .membershipLevel(customer.getMembershipLevel())
                .membershipPoints(customer.getMembershipPoints())
                .build();
    }
}
