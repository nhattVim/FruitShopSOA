// frontend/src/components/PlaceOrder.jsx
import React, { useState, useEffect } from 'react';
import { placeOrder, getAllProducts } from '../api/apiService'; // Import getAllProducts

const PlaceOrder = ({ onOrderPlaced }) => {
  const [order, setOrder] = useState({
    customerId: '',
    orderItems: [{ productId: '', quantity: '' }],
  });
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setProductsError('Failed to fetch products for dropdown.');
        console.error('Error fetching products:', err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCustomerChange = (e) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      customerId: e.target.value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newOrderItems = [...order.orderItems];
    newOrderItems[index] = {
      ...newOrderItems[index],
      [name]: value,
    };
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: newOrderItems,
    }));
  };

  const handleAddItem = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: [...prevOrder.orderItems, { productId: '', quantity: '' }],
    }));
  };

  const handleRemoveItem = (index) => {
    const newOrderItems = [...order.orderItems];
    newOrderItems.splice(index, 1);
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: newOrderItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false); // Reset success state at the beginning of submission
    setOrderNumber('');

    // Basic validation
    if (!order.customerId) {
      setError('Customer ID is required.');
      setLoading(false);
      return;
    }
    if (order.orderItems.some(item => !item.productId || !item.quantity)) {
      setError('All order items must have a Product ID and Quantity.');
      setLoading(false);
      return;
    }

    try {
      const orderRequest = {
        customerId: parseInt(order.customerId, 10),
        orderItems: order.orderItems.map(item => ({
          productId: parseInt(item.productId, 10),
          quantity: parseInt(item.quantity, 10),
        })),
      };
      const response = await placeOrder(orderRequest); // Expects the order number string
      setSuccess(true);
      setOrderNumber(response);
      setOrder({
        customerId: '',
        orderItems: [{ productId: '', quantity: '' }],
      }); // Clear form
      if (onOrderPlaced) {
        onOrderPlaced(response); // Notify parent of new order number
      }
    } catch (err) {
      // This catch block will be hit if the backend returns a non-2xx status (like 503 from fallback)
      const errorMessage = err.response?.data || err.message || 'An unknown error occurred.';
      setError(`Failed to place order: ${errorMessage}`);
      setSuccess(false); // Explicitly set success to false on error
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (productsLoading) return <div className="text-center my-4">Loading products for order...</div>;
  if (productsError) return <div className="alert alert-danger" role="alert">Error loading products: {productsError}</div>;

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Place New Order</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="customerId" className="form-label">Customer ID:</label>
            <input
              type="number"
              className="form-control"
              id="customerId"
              name="customerId"
              value={order.customerId}
              onChange={handleCustomerChange}
              required
            />
          </div>

          <h4 className="mt-4">Order Items</h4>
          {order.orderItems.map((item, index) => (
            <div key={index} className="row mb-3 align-items-end">
              <div className="col-md-5">
                <label htmlFor={`productId-${index}`} className="form-label">Product:</label>
                <select
                  className="form-select"
                  id={`productId-${index}`}
                  name="productId"
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                >
                  <option value="">-- Select Product --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <label htmlFor={`quantity-${index}`} className="form-label">Quantity:</label>
                <input
                  type="number"
                  className="form-control"
                  id={`quantity-${index}`}
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-2 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveItem(index)}
                  disabled={order.orderItems.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary mb-3" onClick={handleAddItem}>
            Add Item
          </button>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && (
            <div className="alert alert-success mt-3">
              Order placed successfully! Order Number: <strong>{orderNumber}</strong>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;