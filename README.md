# 🍎 Fruit Shop Management System

A comprehensive **Service-Oriented Architecture (SOA)** application for managing a fruit shop's operations, built with Spring Boot microservices and a modern React frontend.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Service Ports](#service-ports)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Fruit Shop Management System is a full-stack application designed to handle all aspects of a fruit shop's operations, including:

- **Product Management**: Manage fruit products and categories
- **Inventory Management**: Track stock levels, inbound/outbound operations, and expiring items
- **Order Processing**: Create and manage customer orders
- **Pricing & Promotions**: Set prices, create promotions, and manage vouchers
- **Customer Management**: Maintain customer profiles and membership information
- **Payment Processing**: Handle payment transactions

## 🏗️ Architecture

The application follows a **microservices architecture** with the following components:

### Core Infrastructure Services

1. **Discovery Service (Eureka Server)** - Port `8761`
   - Centralized service registry for all microservices
   - Enables service discovery and health monitoring

2. **API Gateway (Spring Cloud Gateway)** - Port `8080`
   - Single entry point for all client requests
   - Routes requests to appropriate microservices
   - Provides load balancing

### Business Logic Services

1. **Product Service** - Port `8086`
   - Manages product catalog and categories
   - Handles CRUD operations for products and categories

2. **Inventory Service** - Port `8082`
   - Manages stock levels and warehouse operations
   - Handles inbound/outbound transactions
   - Tracks expiring items and unit conversions

3. **Pricing Service** - Port `8085`
   - Manages product pricing
   - Handles promotions and vouchers
   - Calculates discounts and special offers

4. **Order Service** - Port `8083`
   - Creates and manages orders
   - Orchestrates interactions with Inventory and Pricing services
   - Calculates order totals with promotions

5. **Customer Service** - Port `8081`
   - Manages customer profiles
   - Handles membership and loyalty points

6. **Payment Service** - Port `8084`
   - Processes payment transactions
   - Records payment statuses

### Frontend

- **React Application** - Port `5173` (Vite default)
  - Modern, responsive UI with sidebar navigation
  - Built with React Router, Bootstrap, and Axios
  - Communicates with backend via API Gateway

## 🛠️ Tech Stack

### Backend
- **Java 21**
- **Spring Boot 4.0.0**
- **Spring Cloud** (Gateway, Eureka, Load Balancer)
- **Spring Data JPA**
- **H2 Database** (in-memory, for development)
- **Maven** (build tool)
- **Resilience4j** (Circuit Breaker pattern)
- **WebClient** (reactive HTTP client)

### Frontend
- **React 19.2.0**
- **Vite 7.2.4** (build tool)
- **React Router DOM 7.10.0**
- **Bootstrap 5.3.8**
- **Axios 1.13.2**
- **Bootstrap Icons**

## 📦 Prerequisites

Before running the application, ensure you have the following installed:

- **Java 21** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm** (or **yarn**)
- **Git** (for cloning the repository)

### Verify Installation

```bash
java -version    # Should show Java 21+
mvn -version     # Should show Maven 3.6+
node -v          # Should show Node 18+
npm -v           # Should show npm version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FruitShopSOA
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Build Backend Services (Optional)

The services will build automatically when running, but you can pre-build them:

```bash
cd backend
mvn clean install
cd ..
```

## ▶️ Running the Application

### Option 1: Using Scripts (Recommended)

#### Windows
```bash
run.bat
```

#### Linux/Mac
```bash
chmod +x run.sh
./run.sh start
```

The scripts will:
1. Start the Discovery Service (Eureka)
2. Start all microservices in parallel
3. Start the API Gateway
4. Start the frontend development server

### Option 2: Manual Start

#### Step 1: Start Discovery Service
```bash
cd backend/discovery-server
mvn spring-boot:run
```

Wait for it to start on port `8761`.

#### Step 2: Start Microservices
Open separate terminal windows for each service:

```bash
# Terminal 2: Product Service
cd backend/product-service
mvn spring-boot:run

# Terminal 3: Inventory Service
cd backend/inventory-service
mvn spring-boot:run

# Terminal 4: Pricing Service
cd backend/pricing-service
mvn spring-boot:run

# Terminal 5: Order Service
cd backend/order-service
mvn spring-boot:run

# Terminal 6: Customer Service
cd backend/customer-service
mvn spring-boot:run

# Terminal 7: Payment Service
cd backend/payment-service
mvn spring-boot:run
```

#### Step 3: Start API Gateway
```bash
cd backend/api-gateway
mvn spring-boot:run
```

#### Step 4: Start Frontend
```bash
cd frontend
npm run dev
```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **H2 Console** (for each service): http://localhost:{port}/h2-console
  - Example: http://localhost:8086/h2-console (Product Service)

## 📁 Project Structure

```
FruitShopSOA/
├── backend/
│   ├── api-gateway/          # API Gateway service
│   ├── discovery-server/      # Eureka Discovery Server
│   ├── product-service/       # Product management service
│   ├── inventory-service/     # Inventory management service
│   ├── pricing-service/       # Pricing and promotions service
│   ├── order-service/         # Order processing service
│   ├── customer-service/      # Customer management service
│   ├── payment-service/       # Payment processing service
│   └── API_DOCUMENTATION.md   # Detailed API documentation
├── frontend/
│   ├── src/
│   │   ├── api/               # API service layer
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app component
│   │   └── index.css          # Global styles
│   ├── package.json
│   └── vite.config.js
├── run.bat                    # Windows startup script
├── run.sh                     # Linux/Mac startup script
└── README.md                  # This file
```

## ✨ Features

### Product Management
- ✅ Create, read, update, and delete products
- ✅ Manage product categories
- ✅ Product image support
- ✅ Category-based organization

### Inventory Management
- ✅ View all inventory items
- ✅ Search inventory by product
- ✅ Record inbound stock
- ✅ Deduct stock (outbound)
- ✅ Track expiring items
- ✅ Unit conversion tool
- ✅ Stock status indicators (In Stock, Low Stock, Out of Stock)
- ✅ Expiration date tracking

### Order Management
- ✅ Create new orders
- ✅ View all orders
- ✅ Search orders by ID
- ✅ View order details
- ✅ Order status tracking
- ✅ Automatic inventory deduction
- ✅ Price calculation with promotions

### Pricing & Promotions
- ✅ Set product prices
- ✅ Create promotions (discounts, BOGO, etc.)
- ✅ Create and manage vouchers
- ✅ Price lookup
- ✅ Promotion/voucher calculators

### Customer Management
- ✅ Create and manage customer profiles
- ✅ View customer list
- ✅ Edit customer information
- ✅ Customer search functionality

### Payment Processing
- ✅ Process payments for orders
- ✅ Payment status tracking
- ✅ Transaction history

### User Interface
- ✅ Modern sidebar navigation
- ✅ Responsive design
- ✅ Professional UI with Bootstrap
- ✅ Loading states and error handling
- ✅ Success/error feedback messages
- ✅ Color-coded status indicators
- ✅ Mobile-friendly layout

## 📚 API Documentation

Detailed API documentation is available in `backend/API_DOCUMENTATION.md`.

### Quick API Reference

All API requests should be made through the API Gateway at `http://localhost:8080`:

- **Products**: `GET/POST/PUT/DELETE /api/product/**`
- **Categories**: `GET/POST/PUT/DELETE /api/category/**`
- **Inventory**: `GET/POST/PUT /api/inventory/**`
- **Pricing**: `GET/POST /api/pricing/**`
- **Promotions**: `GET/POST /api/promotion/**`
- **Vouchers**: `GET/POST /api/voucher/**`
- **Orders**: `GET/POST /api/order/**`
- **Customers**: `GET/POST/PUT/DELETE /api/customer/**`
- **Payments**: `GET/POST /api/payment/**`

## 🔌 Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Discovery Server | 8761 | Eureka Service Registry |
| API Gateway | 8080 | Main entry point |
| Customer Service | 8081 | Customer management |
| Inventory Service | 8082 | Inventory management |
| Order Service | 8083 | Order processing |
| Payment Service | 8084 | Payment processing |
| Pricing Service | 8085 | Pricing and promotions |
| Product Service | 8086 | Product management |
| Frontend | 5173 | React application |

## 🔧 Troubleshooting

### Services Not Starting

1. **Check Java Version**: Ensure Java 21+ is installed
   ```bash
   java -version
   ```

2. **Check Port Availability**: Ensure ports are not in use
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Linux/Mac
   lsof -i :8080
   ```

3. **Check Eureka Connection**: Ensure Discovery Service starts first
   - Verify Eureka is running at http://localhost:8761
   - Check service registration in Eureka dashboard

### Frontend Not Connecting to Backend

1. **Verify API Gateway**: Ensure API Gateway is running on port 8080
2. **Check CORS**: CORS should be configured in the API Gateway
3. **Check Network Tab**: Inspect browser console for API errors

### Database Issues

- All services use H2 in-memory database
- Data is lost on service restart
- Access H2 console at `http://localhost:{port}/h2-console`
- JDBC URL: `jdbc:h2:mem:db`
- Username: `sa`
- Password: (empty)

### Circuit Breaker Issues

- If you see "Circuit breaker fallback" errors, check:
  - Service discovery is working (check Eureka dashboard)
  - All required services are running
  - Network connectivity between services
  - Service health status

## 📝 Notes

- **Development Database**: The application uses H2 in-memory databases. All data is lost when services restart.
- **Service Discovery**: Services must register with Eureka before they can communicate with each other.
- **Load Balancing**: The API Gateway uses client-side load balancing via Spring Cloud LoadBalancer.
- **Circuit Breakers**: Services use Resilience4j circuit breakers for fault tolerance.
- **Timeouts**: Inter-service communication has 5-second timeouts to prevent hanging requests.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ using Spring Boot and React**

