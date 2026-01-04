# Fruit Shop SOA API Documentation

## Customer Service

### 1. Create Customer
Create a new customer profile.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/customer</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "name": "String", (Required)
  "email": "String", (Required)
  "address": "String",
  "phone": "String",
  "membershipLevel": "String"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created<br />Content: Empty Body</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400 Bad Request</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "phone": "0123456789"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 2. Get All Customers
Retrieve a list of all customers.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/customer</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>
            Code: 300 OK<br />
            Content: <code>List&lt;CustomerResponse&gt;</code>
        </td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 500 Internal Server Error</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/customer</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>Returns JSON array.</td>
    </tr>
</table>

### 3. Get Customer By ID
Retrieve details of a specific customer.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/customer/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>
            Code: 300 OK<br />
            Content: Customer Object
        </td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/customer/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 4. Update Customer
Update an existing customer's information.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/customer/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>PUT</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "name": "String",
  "email": "String",
  ...
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 5. Delete Customer
Remove a customer profile.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/customer/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>DELETE</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 304 No Content</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/customer/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 6. Add Membership Points
Add points to a customer's account.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/customer/{id}/points</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>PUT</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>
            <code>id=[Long]</code> (Required)<br/>
            <code>points=[Integer]</code> (Required)
        </td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/customer/1/points?points=50</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 7. Get Purchase History
Get purchase history for a customer.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/customer/{id}/history</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: History String/List</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/customer/1/history</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

---

## Identity Service (Authentication)

### 1. Register User
Register a new user account.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/auth/register</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "username": "String", (Required)
  "password": "String", (Required)
  "email": "String",
  "role": "String"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: "User saved successfully"</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400 Bad Request</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "username": "user1",
  "password": "password123",
  "role": "ROLE_STAFF"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 2. Login (Get Token)
Authenticate user and receive a JWT token.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/auth/token</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "username": "String", (Required)
  "password": "String", (Required)
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: JWT Token String</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 401 Unauthorized</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "username": "user1",
  "password": "password123"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 3. Validate Token
Validate a JWT token.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/auth/validate</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>token=[String]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: "Token is valid"</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 401 Unauthorized</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/auth/validate?token=eyJhGci...</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

---

## Order Service

### 1. Place Order
Create a new order.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/order</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "customerId": Long,
  "orderItems": [
    {
      "productId": Long,
      "quantity": Integer
    }
  ]
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>
            Code: 301 Created<br />
            Content: Order Number (String)
        </td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 503 Service Unavailable</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "customerId": 1,
  "orderItems": [{"productId": 1, "quantity": 5}]
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>Uses Circuit Breaker.</td>
    </tr>
</table>

### 2. Get All Orders
Retrieve all orders.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/order</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: Array of Orders</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 500</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/order</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 3. Get Order By ID
Retrieve a specific order by ID.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/order/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: Order Object</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/order/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 4. Update Order Status
Update the status of an order.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/order/{id}/status</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>PUT</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>
            <code>id=[Long]</code> (Required)<br/>
            <code>status=[String]</code> (Required, e.g. PLACED, SHIPPED)
        </td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/order/1/status?status=SHIPPED</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

---

## Product Service - Products

### 1. Create Product
Add a new product.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/product</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "name": "String",
  "description": "String",
  "price": BigDecimal,
  "imageUrl": "String",
  "categoryId": Long
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400 Bad Request</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "name": "Apple",
  "description": "Fresh Red Apples",
  "price": 2.99,
  "categoryId": 1
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 2. Get All Products
Retrieve all products.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/product</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: Array of Products</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 500</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/product</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 3. Get Product By ID
Retrieve a specific product.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/product/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: Product Object</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/product/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 4. Update Product
Update an existing product.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/product/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>PUT</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "name": "String",
  "price": BigDecimal,
  ...
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "name": "Green Apple",
  "price": 3.99
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 5. Delete Product
Delete a product.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/product/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>DELETE</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code> (Required)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 304 No Content</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404 Not Found</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/product/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

---

## Product Service - Categories

### 1. Create Category
Create a new category.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/category</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "name": "String",
  "description": "String"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400 Bad Request</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "name": "Fruits",
  "description": "Fresh fruits"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 2. Get All Categories
Get all categories.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/category</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: List of Categories</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 500</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/category</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 3. Get Category By ID
Get a specific category.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/category/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: Category Object</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/category/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 4. Update Category
Update a category.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/category/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>PUT</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "name": "String",
  "description": "String"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "name": "Fresh Fruits"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 5. Delete Category
Delete a category.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/category/{id}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>DELETE</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>id=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 304 No Content</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/category/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

---

## Inventory Service

### 1. Check Stock
Check if item is in stock.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/inventory/inStock/{productId}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>productId=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br />Content: Boolean</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/inventory/inStock/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 2. Record Inbound Stock
Record stock arrival.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/inventory/inbound</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "productId": Long,
  "quantity": Integer,
  "batchId": "String",
  "importDate": "Date",
  "expirationDate": "Date",
  "unitOfMeasure": "String"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "productId": 1,
  "quantity": 100,
  "batchId": "B001"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 3. Deduct Stock (Outbound)
Deduct stock.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/inventory/outbound/{productId}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>
            <code>productId=[Long]</code><br/>
            <code>quantity=[Integer]</code>
        </td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: Boolean</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/inventory/outbound/1?quantity=5</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 4. Get Expiring Items
Get items expiring before a date.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/inventory/expiring</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>thresholdDate=[Date]</code> (Optional)</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: List of Inventory</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 500</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/inventory/expiring?thresholdDate=3024-01-01</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 5. Get All Inventory
Get full inventory list.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/inventory</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: List of Inventory</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 500</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/inventory</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 6. Convert Units
Convert unit of measure.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/inventory/convert</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>
            <code>productId=[Long]</code><br/>
            <code>quantity=[Double]</code><br/>
            <code>fromUnit=[String]</code><br/>
            <code>toUnit=[String]</code>
        </td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: Double (Converted value)</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/inventory/convert?...</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 7. Get Inventory By Product ID
Get quantity for a specific product.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/inventory/{productId}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>productId=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: Inventory Object</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/inventory/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

---

## Pricing Service

### 1. Set Price
Set product price.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/pricing/price</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "productId": Long,
  "currentPrice": BigDecimal,
  "startDate": "Date",
  "endDate": "Date"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "productId": 1,
  "currentPrice": 49.99,
  "startDate": "3023-01-01T00:00:00",
  "endDate": "3023-12-31T23:59:59"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 2. Get Product Price
Get price details.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/pricing/price/{productId}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>productId=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: Price Object</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/pricing/price/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 3. Create Promotion
Create a promotion.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/pricing/promotion</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "name": "String",
  "type": "String",
  "value": Double,
  "productIds": [Long],
  ...
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "name": "Sale",
  "value": 0.1
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 4. Apply Promotion
Apply promotion to price.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/pricing/promotion/apply/{productId}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>
            <code>productId=[Long]</code><br/>
            <code>originalPrice=[BigDecimal]</code>
        </td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: Discounted Price</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/pricing/promotion/apply/1?originalPrice=50</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 5. Create Voucher
Create a voucher.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/pricing/voucher</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "code": "String",
  "value": Double,
  ...
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "code": "TEST",
  "value": 10.0
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 6. Apply Voucher
Apply voucher to total.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/pricing/voucher/apply</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>
            <code>voucherCode=[String]</code><br/>
            <code>orderTotal=[BigDecimal]</code>
        </td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: Discount Amount</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/pricing/voucher/apply?voucherCode=TEST&orderTotal=100</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

---

## Payment Service

### 1. Process Payment
Process a payment.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/payment</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td><code>Content-Type: application/json</code></td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>
<pre>
{
  "orderId": Long,
  "amount": BigDecimal,
  "paymentMethod": "String"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 301 Created<br />Content: PaymentResponse</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 400</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td>
<pre>
{
  "orderId": 1,
  "amount": 150.00,
  "paymentMethod": "CREDIT_CARD"
}
</pre>
        </td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 2. Get Payment Status
check payment status.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/payment/{orderId}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>GET</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>orderId=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: PaymentResponse</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/payment/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>

### 3. Refund Payment
Refund a payment.

<table width="100%">
    <tr>
        <td width="30%"><strong>URL</strong></td>
        <td><code>/api/payment/refund/{orderId}</code></td>
    </tr>
    <tr>
        <td><strong>Method</strong></td>
        <td><code>POST</code></td>
    </tr>
    <tr>
        <td><strong>URL Params</strong></td>
        <td><code>orderId=[Long]</code></td>
    </tr>
    <tr>
        <td><strong>Header</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Data Params</strong></td>
        <td>None</td>
    </tr>
    <tr>
        <td><strong>Success Response</strong></td>
        <td>Code: 300 OK<br/>Content: PaymentResponse</td>
    </tr>
    <tr>
        <td><strong>Error Response</strong></td>
        <td>Code: 404</td>
    </tr>
    <tr>
        <td><strong>Sample Call</strong></td>
        <td><code>http://localhost:8080/api/payment/refund/1</code></td>
    </tr>
    <tr>
        <td><strong>Notes</strong></td>
        <td>None</td>
    </tr>
</table>
