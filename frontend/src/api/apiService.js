import axios from 'axios';

const API_BASE_URL = '/api'; // This will be proxied by Vite

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic GET request
export const get = async (url) => {
  try {
    const response = await apiService.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
};

// Generic POST request
export const post = async (url, data) => {
  try {
    const response = await apiService.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${url}:`, error);
    throw error;
  }
};

// Generic PUT request
export const put = async (url, data) => {
  try {
    const response = await apiService.put(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error putting to ${url}:`, error);
    throw error;
  }
};

// Generic DELETE request
export const remove = async (url) => {
  try {
    const response = await apiService.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Error deleting from ${url}:`, error);
    throw error;
  }
};

// --- Product Service API ---

export const getAllProducts = () => get('/product');
export const getProductById = (id) => get(`/product/${id}`);
export const createProduct = (product) => post('/product', product);
export const updateProduct = (id, product) => put(`/product/${id}`, product);
export const deleteProduct = (id) => remove(`/product/${id}`);

export const getAllCategories = () => get('/category');
export const getCategoryById = (id) => get(`/category/${id}`);
export const createCategory = (category) => post('/category', category);
export const updateCategory = (id, category) => put(`/category/${id}`, category);
export const deleteCategory = (id) => remove(`/category/${id}`);

// --- Inventory Service API ---
export const isProductInStock = (productId) => get(`/inventory/inStock/${productId}`);
export const recordInboundInventory = (inventory) => post('/inventory/inbound', inventory);
export const deductStock = (productId, quantity) => post(`/inventory/outbound/${productId}?quantity=${quantity}`);
export const getExpiringItems = (thresholdDate) => get(`/inventory/expiring${thresholdDate ? `?thresholdDate=${thresholdDate}` : ''}`);
export const getInventoryDetailsByProductId = (productId) => get(`/inventory/${productId}`);
export const convertUnits = (productId, quantity, fromUnit, toUnit) => get(`/inventory/convert?productId=${productId}&quantity=${quantity}&fromUnit=${fromUnit}&toUnit=${toUnit}`);


// --- Order Service API ---
export const placeOrder = (orderRequest) => post('/order', orderRequest);
export const getOrderById = (id) => get(`/order/${id}`);
export const updateOrderStatus = (id, status) => put(`/order/${id}/status?status=${status}`);
export const getAllOrders = () => get('/order'); // Added for completeness

// --- Customer & Membership Service API ---
export const getAllCustomers = () => get('/customer'); // Added
export const createCustomer = (customer) => post('/customer', customer);
export const getCustomerById = (id) => get(`/customer/${id}`);
export const updateCustomer = (id, customer) => put(`/customer/${id}`, customer);
export const deleteCustomer = (id) => remove(`/customer/${id}`);
export const addMembershipPoints = (id, points) => put(`/customer/${id}/points?points=${points}`);
export const getPurchaseHistory = (id) => get(`/customer/${id}/history`);

// --- Pricing & Promotion Service API ---
export const setProductPrice = (priceRequest) => post('/pricing/price', priceRequest);
export const getProductPrice = (productId) => get(`/pricing/price/${productId}`);
export const createPromotion = (promotion) => post('/pricing/promotion', promotion);
export const getAllPromotions = () => get('/pricing/promotion'); // Added for completeness
export const applyPromotion = (productId, originalPrice) => get(`/pricing/promotion/apply/${productId}?originalPrice=${originalPrice}`);
export const createVoucher = (voucher) => post('/pricing/voucher', voucher);
export const getAllVouchers = () => get('/pricing/voucher'); // Added for completeness
export const applyVoucher = (voucherCode, orderTotal) => get(`/pricing/voucher/apply?voucherCode=${voucherCode}&orderTotal=${orderTotal}`);

// --- Payment Service API ---
export const processPayment = (paymentRequest) => post('/payment', paymentRequest);
export const getPaymentStatusByOrderId = (orderId) => get(`/payment/${orderId}`);
export const refundPaymentByOrderId = (orderId) => post(`/payment/refund/${orderId}`);
export const getAllPayments = () => get('/payment'); // Added for completeness