# Fruit Shop Management Backend API Documentation

This document describes the API for the Fruit Shop Management Backend, which is built using a Service-Oriented Architecture (SOA) with Spring Boot microservices.

## Architectural Overview

The backend consists of several independent microservices communicating primarily via REST APIs, orchestrated through an API Gateway and leveraging a Discovery Service for service registration and lookup.

### Core Services:

*   **Discovery Service (Eureka Server):** Centralized registry for all microservices to register themselves and discover others.
*   **API Gateway (Spring Cloud Gateway):** Single entry point for all client requests, routing them to the appropriate microservice. Provides load balancing and can handle cross-cutting concerns like security.

### Business Logic Services:

1.  **Product Service:** Manages static information about fruit items and their categories.
2.  **Inventory Service:** Handles warehouse and stock management, including inbound, outbound, stock audits, and unit conversions.
3.  **Pricing & Promotion Service:** Manages pricing tables, various promotion types (e.g., discounts, BOGO), and vouchers.
4.  **Order Service:** Facilitates order creation, manages order statuses, calculates order totals, and interacts with Inventory and Pricing services.
5.  **Customer & Membership Service:** Manages customer profiles, purchase history (placeholder), and membership point accumulation.
6.  **Payment Service:** Integrates with (simulated) payment gateways and records payment transaction statuses.

---

## 1. Product Service API

**Base URL:** `/api/product` (via API Gateway)

### 1.1. Products

#### 1.1.1. Create a new Product
-   **Endpoint:** `POST /api/product`
-   **Description:** Adds a new fruit product to the system.
-   **Request Body:** `ProductRequest`
    ```json
    {
      "name": "Apple",
      "description": "Sweet red apple",
      "price": 1.99,
      "imageUrl": "http://example.com/apple.jpg",
      "categoryId": 1
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** (None)

#### 1.1.2. Get all Products
-   **Endpoint:** `GET /api/product`
-   **Description:** Retrieves a list of all available fruit products.
-   **Response Status:** `200 OK`
-   **Response Body:** `List<ProductResponse>`
    ```json
    [
      {
        "id": 1,
        "name": "Apple",
        "description": "Sweet red apple",
        "price": 1.99,
        "imageUrl": "http://example.com/apple.jpg",
        "categoryId": 1
      }
    ]
    ```

#### 1.1.3. Get Product by ID
-   **Endpoint:** `GET /api/product/{id}`
-   **Description:** Retrieves a single fruit product by its unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the product (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `ProductResponse`
    ```json
    {
      "id": 1,
      "name": "Apple",
      "description": "Sweet red apple",
      "price": 1.99,
      "imageUrl": "http://example.com/apple.jpg",
      "categoryId": 1
    }
    ```
    -   `404 Not Found`: If product with `id` does not exist.

#### 1.1.4. Update Product
-   **Endpoint:** `PUT /api/product/{id}`
-   **Description:** Updates an existing fruit product by its unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the product (Long)
-   **Request Body:** `ProductRequest` (all fields are optional, only provided fields will be updated)
    ```json
    {
      "name": "Organic Apple",
      "price": 2.49
    }
    ```
-   **Response Status:** `200 OK`
-   **Response Body:** (None)
    -   `404 Not Found`: If product with `id` does not exist.

#### 1.1.5. Delete Product
-   **Endpoint:** `DELETE /api/product/{id}`
-   **Description:** Deletes a fruit product by its unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the product (Long)
-   **Response Status:** `204 No Content`
-   **Response Body:** (None)
    -   `404 Not Found`: If product with `id` does not exist.

### 1.2. Categories

**Base URL:** `/api/category` (via API Gateway)

#### 1.2.1. Create a new Category
-   **Endpoint:** `POST /api/category`
-   **Description:** Adds a new product category (e.g., "Imported Fruits") to the system.
-   **Request Body:** `CategoryRequest`
    ```json
    {
      "name": "Imported Fruits",
      "description": "Fresh fruits imported from abroad"
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** (None)

#### 1.2.2. Get all Categories
-   **Endpoint:** `GET /api/category`
-   **Description:** Retrieves a list of all available product categories.
-   **Response Status:** `200 OK`
-   **Response Body:** `List<CategoryResponse>`
    ```json
    [
      {
        "id": 1,
        "name": "Imported Fruits",
        "description": "Fresh fruits imported from abroad"
      }
    ]
    ```

#### 1.2.3. Get Category by ID
-   **Endpoint:** `GET /api/category/{id}`
-   **Description:** Retrieves a single product category by its unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the category (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `CategoryResponse`
    ```json
    {
      "id": 1,
      "name": "Imported Fruits",
      "description": "Fresh fruits imported from abroad"
    }
    ```
    -   `404 Not Found`: If category with `id` does not exist.

#### 1.2.4. Update Category
-   **Endpoint:** `PUT /api/category/{id}`
-   **Description:** Updates an existing product category by its unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the category (Long)
-   **Request Body:** `CategoryRequest` (all fields are optional)
    ```json
    {
      "name": "Premium Imported Fruits"
    }
    ```
-   **Response Status:** `200 OK`
-   **Response Body:** (None)
    -   `404 Not Found`: If category with `id` does not exist.

#### 1.2.5. Delete Category
-   **Endpoint:** `DELETE /api/category/{id}`
-   **Description:** Deletes a product category by its unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the category (Long)
-   **Response Status:** `204 No Content`
-   **Response Body:** (None)
    -   `404 Not Found`: If category with `id` does not exist.

---

## 2. Inventory Service API

**Base URL:** `/api/inventory` (via API Gateway)

### 2.1. In Stock Check

#### 2.1.1. Check if Product is In Stock
-   **Endpoint:** `GET /api/inventory/inStock/{productId}`
-   **Description:** Checks if a specific product is currently in stock.
-   **Path Parameters:**
    -   `productId`: The unique identifier of the product (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `boolean` (true if in stock, false otherwise)
    ```json
    true
    ```

### 2.2. Stock Management

#### 2.2.1. Record Inbound Inventory
-   **Endpoint:** `POST /api/inventory/inbound`
-   **Description:** Records new inventory (stock coming into the warehouse).
-   **Request Body:** `InventoryRequest`
    ```json
    {
      "productId": 1,
      "quantity": 100,
      "batchId": "BATCH-20231026-001",
      "importDate": "2023-10-26",
      "expirationDate": "2024-10-26",
      "unitOfMeasure": "kg"
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** (None)

#### 2.2.2. Deduct Stock (Outbound)
-   **Endpoint:** `POST /api/inventory/outbound/{productId}`
-   **Description:** Deducts a specified quantity from a product's stock (e.g., for sales or removal).
-   **Path Parameters:**
    -   `productId`: The unique identifier of the product (Long)
-   **Query Parameters:**
    -   `quantity`: The amount to deduct (Integer)
-   **Response Status:** `200 OK`
-   **Response Body:** `boolean` (true if deduction was successful, false if insufficient stock or product not found)
    ```json
    true
    ```

#### 2.2.3. Get Expiring Items
-   **Endpoint:** `GET /api/inventory/expiring`
-   **Description:** Retrieves a list of inventory items that are expiring on or before a given `thresholdDate`. If no date is provided, defaults to items expiring within the next month.
-   **Query Parameters:**
    -   `thresholdDate` (Optional): The date (YYYY-MM-DD) to check against.
-   **Response Status:** `200 OK`
-   **Response Body:** `List<InventoryResponse>`
    ```json
    [
      {
        "id": 101,
        "productId": 1,
        "quantity": 50,
        "batchId": "BATCH-20230915-001",
        "importDate": "2023-09-15",
        "expirationDate": "2023-12-31",
        "unitOfMeasure": "unit"
      }
    ]
    ```

#### 2.2.4. Get Inventory Details by Product ID
-   **Endpoint:** `GET /api/inventory/{productId}`
-   **Description:** Retrieves detailed inventory information for a specific product.
-   **Path Parameters:**
    -   `productId`: The unique identifier of the product (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `InventoryResponse`
    ```json
    {
      "id": 101,
      "productId": 1,
      "quantity": 150,
      "batchId": "BATCH-20231026-001",
      "importDate": "2023-10-26",
      "expirationDate": "2024-10-26",
      "unitOfMeasure": "kg"
    }
    ```
    -   `404 Not Found`: If inventory for `productId` does not exist.

### 2.3. Unit Conversion

#### 2.3.1. Convert Units
-   **Endpoint:** `GET /api/inventory/convert`
-   **Description:** Converts a quantity of a product from one unit of measure to another. (Note: Contains placeholder logic; actual conversion rates would be externalized or configurable).
-   **Query Parameters:**
    -   `productId`: The unique identifier of the product (Long)
    -   `quantity`: The quantity to convert (Double)
    -   `fromUnit`: The original unit of measure (String, e.g., "kg", "box")
    -   `toUnit`: The target unit of measure (String, e.g., "gram", "unit")
-   **Response Status:** `200 OK`
-   **Response Body:** `Double` (The converted quantity)
    ```json
    2000.0
    ```
    -   `400 Bad Request`: If conversion rule is not found or parameters are invalid.

---

## 3. Pricing & Promotion Service API

**Base URL:** `/api/pricing` (via API Gateway)

### 3.1. Pricing

#### 3.1.1. Set Product Price
-   **Endpoint:** `POST /api/pricing/price`
-   **Description:** Sets or updates the price for a specific product for a given period.
-   **Request Body:** `PriceRequest`
    ```json
    {
      "productId": 1,
      "currentPrice": 2.50,
      "startDate": "2023-11-01T00:00:00",
      "endDate": "2023-12-31T23:59:59"
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** (None)

#### 3.1.2. Get Product Price
-   **Endpoint:** `GET /api/pricing/price/{productId}`
-   **Description:** Retrieves the current active price for a specific product.
-   **Path Parameters:**
    -   `productId`: The unique identifier of the product (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `PriceResponse`
    ```json
    {
      "id": 1,
      "productId": 1,
      "currentPrice": 2.50,
      "startDate": "2023-11-01T00:00:00",
      "endDate": "2023-12-31T23:59:59"
    }
    ```
    -   `404 Not Found`: If no price is found for the product.

### 3.2. Promotions

#### 3.2.1. Create Promotion
-   **Endpoint:** `POST /api/pricing/promotion`
-   **Description:** Creates a new promotional offer (e.g., discount, BOGO).
-   **Request Body:** `PromotionRequest`
    ```json
    {
      "name": "Weekend Sale",
      "description": "10% off all imported fruits",
      "type": "PercentageDiscount",
      "value": 0.10,
      "productIds": [1, 2],
      "startDate": "2023-11-10T00:00:00",
      "endDate": "2023-11-12T23:59:59",
      "conditions": "Applies to imported apples and oranges"
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** (None)

#### 3.2.2. Apply Promotion
-   **Endpoint:** `GET /api/pricing/promotion/apply/{productId}`
-   **Description:** Calculates the discounted price for a product based on active promotions.
-   **Path Parameters:**
    -   `productId`: The unique identifier of the product (Long)
-   **Query Parameters:**
    -   `originalPrice`: The original price of the product (BigDecimal)
-   **Response Status:** `200 OK`
-   **Response Body:** `BigDecimal` (The final price after applying promotions)
    ```json
    2.25
    ```

### 3.3. Vouchers

#### 3.3.1. Create Voucher
-   **Endpoint:** `POST /api/pricing/voucher`
-   **Description:** Creates a new discount voucher.
-   **Request Body:** `VoucherRequest`
    ```json
    {
      "code": "SAVE15",
      "discountType": "PERCENTAGE",
      "value": 15.0,
      "minOrderAmount": 50.00,
      "usageLimit": 100,
      "validFrom": "2023-11-01T00:00:00",
      "validUntil": "2023-11-30T23:59:59",
      "active": true
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** (None)

#### 3.3.2. Apply Voucher
-   **Endpoint:** `GET /api/pricing/voucher/apply`
-   **Description:** Applies a voucher code to an order total and returns the discounted total. Checks for validity and usage limits.
-   **Query Parameters:**
    -   `voucherCode`: The code of the voucher to apply (String)
    -   `orderTotal`: The total amount of the order before discount (BigDecimal)
-   **Response Status:** `200 OK`
-   **Response Body:** `BigDecimal` (The order total after applying the voucher. If voucher is invalid or not applied, returns the original order total.)
    ```json
    42.50
    ```

---

## 4. Order Service API

**Base URL:** `/api/order` (via API Gateway)

### 4.1. Order Management

#### 4.1.1. Place a new Order
-   **Endpoint:** `POST /api/order`
-   **Description:** Creates a new order. This involves checking stock with the Inventory Service and fetching prices from the Pricing Service.
-   **Request Body:** `OrderRequest`
    ```json
    {
      "customerId": 10,
      "orderItems": [
        {
          "productId": 1,
          "quantity": 2
        },
        {
          "productId": 3,
          "quantity": 1
        }
      ]
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** `String` (The generated order number)
    ```json
    "d7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a"
    ```
    -   `400 Bad Request`: If products are out of stock or pricing information is unavailable.

#### 4.1.2. Get Order by ID
-   **Endpoint:** `GET /api/order/{id}`
-   **Description:** Retrieves a single order by its unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the order (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `OrderResponse`
    ```json
    {
      "id": 1,
      "orderNumber": "d7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a",
      "customerId": 10,
      "orderDate": "2023-11-15T10:30:00",
      "status": "NEW",
      "totalAmount": 7.49,
      "orderItems": [
        {
          "id": 101,
          "productId": 1,
          "quantity": 2,
          "unitPrice": 2.50
        },
        {
          "id": 102,
          "productId": 3,
          "quantity": 1,
          "unitPrice": 2.49
        }
      ]
    }
    ```
    -   `404 Not Found`: If order with `id` does not exist.

#### 4.1.3. Update Order Status
-   **Endpoint:** `PUT /api/order/{id}/status`
-   **Description:** Updates the status of an existing order.
-   **Path Parameters:**
    -   `id`: The unique identifier of the order (Long)
-   **Query Parameters:**
    -   `status`: The new status for the order (e.g., `NEW`, `PROCESSING`, `DELIVERING`, `COMPLETED`, `CANCELLED`)
-   **Response Status:** `200 OK`
-   **Response Body:** (None)
    -   `404 Not Found`: If order with `id` does not exist.
    -   `400 Bad Request`: If invalid status is provided.

---

## 5. Customer & Membership Service API

**Base URL:** `/api/customer` (via API Gateway)

### 5.1. Customer Management

#### 5.1.1. Create a new Customer
-   **Endpoint:** `POST /api/customer`
-   **Description:** Creates a new customer profile.
-   **Request Body:** `CustomerRequest`
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "address": "123 Main St, Anytown, USA",
      "phone": "+15551234567",
      "membershipLevel": "Bronze"
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** (None)

#### 5.1.2. Get Customer by ID
-   **Endpoint:** `GET /api/customer/{id}`
-   **Description:** Retrieves a single customer profile by their unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the customer (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `CustomerResponse`
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "address": "123 Main St, Anytown, USA",
      "phone": "+15551234567",
      "membershipLevel": "Bronze",
      "membershipPoints": 0
    }
    ```
    -   `404 Not Found`: If customer with `id` does not exist.

#### 5.1.3. Update Customer
-   **Endpoint:** `PUT /api/customer/{id}`
-   **Description:** Updates an existing customer profile by their unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the customer (Long)
-   **Request Body:** `CustomerRequest` (all fields are optional, only provided fields will be updated)
    ```json
    {
      "address": "456 Oak Ave, Otherville, USA",
      "membershipLevel": "Silver"
    }
    ```
-   **Response Status:** `200 OK`
-   **Response Body:** (None)
    -   `404 Not Found`: If customer with `id` does not exist.

#### 5.1.4. Delete Customer
-   **Endpoint:** `DELETE /api/customer/{id}`
-   **Description:** Deletes a customer profile by their unique ID.
-   **Path Parameters:**
    -   `id`: The unique identifier of the customer (Long)
-   **Response Status:** `204 No Content`
-   **Response Body:** (None)
    -   `404 Not Found`: If customer with `id` does not exist.

### 5.2. Membership Management

#### 5.2.1. Add Membership Points
-   **Endpoint:** `PUT /api/customer/{id}/points`
-   **Description:** Adds a specified amount of membership points to a customer's account.
-   **Path Parameters:**
    -   `id`: The unique identifier of the customer (Long)
-   **Query Parameters:**
    -   `points`: The number of points to add (Integer)
-   **Response Status:** `200 OK`
-   **Response Body:** (None)
    -   `404 Not Found`: If customer with `id` does not exist.

#### 5.2.2. Get Purchase History (Placeholder)
-   **Endpoint:** `GET /api/customer/{id}/history`
-   **Description:** Retrieves the purchase history for a specific customer. (Currently a placeholder, would typically integrate with the Order Service).
-   **Path Parameters:**
    -   `id`: The unique identifier of the customer (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `String` (Placeholder message)
    ```json
    "Purchase history for customer 1 (Not yet implemented, would call Order Service)"
    ```
    -   `404 Not Found`: If customer with `id` does not exist.

---

## 6. Payment Service API

**Base URL:** `/api/payment` (via API Gateway)

### 6.1. Payment Processing

#### 6.1.1. Process Payment
-   **Endpoint:** `POST /api/payment`
-   **Description:** Initiates a payment process for a given order. Simulates interaction with external payment gateways.
-   **Request Body:** `PaymentRequest`
    ```json
    {
      "orderId": 1,
      "amount": 45.99,
      "paymentMethod": "Card",
      "transactionId": null
    }
    ```
-   **Response Status:** `201 Created`
-   **Response Body:** `PaymentResponse`
    ```json
    {
      "id": 1001,
      "orderId": 1,
      "amount": 45.99,
      "paymentMethod": "Card",
      "transactionId": "sim-txn-12345",
      "status": "COMPLETED",
      "paymentDate": "2023-11-15T14:00:00"
    }
    ```
    -   `400 Bad Request`: If payment details are invalid.

#### 6.1.2. Get Payment Status by Order ID
-   **Endpoint:** `GET /api/payment/{orderId}`
-   **Description:** Retrieves the payment status for a specific order.
-   **Path Parameters:**
    -   `orderId`: The unique identifier of the order (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `PaymentResponse`
    ```json
    {
      "id": 1001,
      "orderId": 1,
      "amount": 45.99,
      "paymentMethod": "Card",
      "transactionId": "sim-txn-12345",
      "status": "COMPLETED",
      "paymentDate": "2023-11-15T14:00:00"
    }
    ```
    -   `404 Not Found`: If no payment record exists for the `orderId`.

#### 6.1.3. Refund Payment by Order ID
-   **Endpoint:** `POST /api/payment/refund/{orderId}`
-   **Description:** Initiates a refund for a completed payment associated with a specific order.
-   **Path Parameters:**
    -   `orderId`: The unique identifier of the order (Long)
-   **Response Status:** `200 OK`
-   **Response Body:** `PaymentResponse` (The updated payment record with status REFUNDED, or original record if not refunded)
    ```json
    {
      "id": 1001,
      "orderId": 1,
      "amount": 45.99,
      "paymentMethod": "Card",
      "transactionId": "sim-txn-12345",
      "status": "REFUNDED",
      "paymentDate": "2023-11-15T14:00:00"
    }
    ```
    -   `404 Not Found`: If no payment record exists for the `orderId`.
    -   `400 Bad Request`: If the payment cannot be refunded (e.g., not completed).
