package com.example.customerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String membershipLevel;
    private Integer membershipPoints;
}
