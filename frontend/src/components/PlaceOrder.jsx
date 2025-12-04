// frontend/src/components/PlaceOrder.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  placeOrder, 
  getAllProducts, 
  getAllCustomers,
  getProductPrice,
  isProductInStock 
} from '../api/apiService';

const PlaceOrder = ({ onOrderPlaced }) => {
  const [order, setOrder] = useState({
    customerId: '',
    orderItems: [{ productId: '', quantity: 1 }],
  });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productPrices, setProductPrices] = useState({});
  const [productStock, setProductStock] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [productsLoading, setProductsLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [customersError, setCustomersError] = useState(null);

  // Fetch products and customers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err) {
        setProductsError('Failed to fetch products.');
        console.error('Error fetching products:', err);
      } finally {
        setProductsLoading(false);
      }

      try {
        setCustomersLoading(true);
        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (err) {
        setCustomersError('Failed to fetch customers.');
        console.error('Error fetching customers:', err);
      } finally {
        setCustomersLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch price and stock when product is selected
  useEffect(() => {
    const fetchProductDetails = async () => {
      const pricePromises = {};
      const stockPromises = {};

      order.orderItems.forEach(item => {
        if (item.productId) {
          const productId = parseInt(item.productId, 10);
          if (!productPrices[productId]) {
            pricePromises[productId] = getProductPrice(productId).catch(() => null);
          }
          if (productStock[productId] === undefined) {
            stockPromises[productId] = isProductInStock(productId).catch(() => false);
          }
        }
      });

      // Fetch prices
      if (Object.keys(pricePromises).length > 0) {
        const priceResults = await Promise.allSettled(Object.values(pricePromises));
        const newPrices = { ...productPrices };
        Object.keys(pricePromises).forEach((productId, index) => {
          const result = priceResults[index];
          if (result.status === 'fulfilled' && result.value) {
            newPrices[parseInt(productId, 10)] = result.value.currentPrice || result.value;
          }
        });
        setProductPrices(newPrices);
      }

      // Fetch stock status
      if (Object.keys(stockPromises).length > 0) {
        const stockResults = await Promise.allSettled(Object.values(stockPromises));
        const newStock = { ...productStock };
        Object.keys(stockPromises).forEach((productId, index) => {
          const result = stockResults[index];
          if (result.status === 'fulfilled') {
            newStock[parseInt(productId, 10)] = result.value;
          }
        });
        setProductStock(newStock);
      }
    };

    if (!productsLoading && order.orderItems.some(item => item.productId)) {
      fetchProductDetails();
    }
  }, [order.orderItems, productsLoading]);

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
      [name]: name === 'quantity' ? Math.max(1, parseInt(value, 10) || 1) : value,
    };
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: newOrderItems,
    }));
    
    // Clear cached price/stock for changed product
    if (name === 'productId') {
      const productId = parseInt(value, 10);
      if (productId) {
        setProductPrices(prev => {
          const newPrices = { ...prev };
          delete newPrices[productId];
          return newPrices;
        });
        setProductStock(prev => {
          const newStock = { ...prev };
          delete newStock[productId];
          return newStock;
        });
      }
    }
  };

  const handleAddItem = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: [...prevOrder.orderItems, { productId: '', quantity: 1 }],
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

  // Calculate order summary
  const orderSummary = useMemo(() => {
    let subtotal = 0;
    const items = order.orderItems
      .filter(item => item.productId && item.quantity)
      .map(item => {
        const productId = parseInt(item.productId, 10);
        const quantity = parseInt(item.quantity, 10);
        const price = productPrices[productId] || 0;
        const itemTotal = price * quantity;
        subtotal += itemTotal;
        
        const product = products.find(p => p.id === productId);
        return {
          productId,
          productName: product?.name || `Product ${productId}`,
          quantity,
          price,
          total: itemTotal,
          inStock: productStock[productId] !== false,
        };
      });

    return { items, subtotal };
  }, [order.orderItems, productPrices, productStock, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setOrderNumber('');

    // Validation
    if (!order.customerId) {
      setError('Please select a customer.');
      setLoading(false);
      return;
    }
    
    if (order.orderItems.length === 0 || order.orderItems.every(item => !item.productId || !item.quantity)) {
      setError('Please add at least one product to the order.');
      setLoading(false);
      return;
    }

    // Check stock availability
    const outOfStockItems = orderSummary.items.filter(item => item.inStock === false);
    if (outOfStockItems.length > 0) {
      setError(`Some products are out of stock: ${outOfStockItems.map(i => i.productName).join(', ')}`);
      setLoading(false);
      return;
    }
    
    // Check if prices are loaded for all items
    const itemsWithoutPrice = orderSummary.items.filter(item => !item.price || item.price === 0);
    if (itemsWithoutPrice.length > 0) {
      setError(`Price information not available for: ${itemsWithoutPrice.map(i => i.productName).join(', ')}. Please wait a moment and try again.`);
      setLoading(false);
      return;
    }

    try {
      const orderRequest = {
        customerId: parseInt(order.customerId, 10),
        orderItems: order.orderItems
          .filter(item => item.productId && item.quantity)
          .map(item => ({
            productId: parseInt(item.productId, 10),
            quantity: parseInt(item.quantity, 10),
          })),
      };
      
      const response = await placeOrder(orderRequest);
      // Response should be the order number string directly
      const orderNum = typeof response === 'string' ? response : (response?.orderNumber || response?.data || 'Unknown');
      setSuccess(true);
      setOrderNumber(orderNum);
      setOrder({
        customerId: '',
        orderItems: [{ productId: '', quantity: 1 }],
      });
      setProductPrices({});
      setProductStock({});
      
      if (onOrderPlaced) {
        onOrderPlaced(response);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'An unknown error occurred.';
      setError(`Failed to place order: ${errorMessage}`);
      setSuccess(false);
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (productsLoading || customersLoading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading order form...</p>
        </div>
      </div>
    );
  }

  if (productsError || customersError) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {productsError || customersError}
      </div>
    );
  }

  const selectedCustomer = customers.find(c => c.id === parseInt(order.customerId, 10));

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-cart-plus me-2"></i>
          Place New Order
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Customer Selection */}
          <div className="mb-4">
            <label htmlFor="customerId" className="form-label fw-semibold">
              Customer <span className="text-danger">*</span>
            </label>
            <select
              className="form-select form-select-lg"
              id="customerId"
              name="customerId"
              value={order.customerId}
              onChange={handleCustomerChange}
              required
            >
              <option value="">-- Select Customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.email ? `(${customer.email})` : ''}
                </option>
              ))}
            </select>
            {selectedCustomer && (
              <div className="mt-2 text-muted small">
                <span className="badge bg-info me-2">{selectedCustomer.membershipLevel || 'Standard'}</span>
                {selectedCustomer.membershipPoints > 0 && (
                  <span>Points: {selectedCustomer.membershipPoints}</span>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Order Items</h5>
              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm" 
                onClick={handleAddItem}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Add Item
              </button>
            </div>

            {order.orderItems.map((item, index) => {
              const productId = item.productId ? parseInt(item.productId, 10) : null;
              const product = productId ? products.find(p => p.id === productId) : null;
              const price = productId ? productPrices[productId] : null;
              const inStock = productId ? productStock[productId] : null;
              const quantity = parseInt(item.quantity, 10) || 1;
              const itemTotal = price ? price * quantity : 0;

              return (
                <div key={index} className="card mb-3 border">
                  <div className="card-body">
                    <div className="row g-3 align-items-start">
                      <div className="col-md-5">
                        <label htmlFor={`productId-${index}`} className="form-label fw-semibold">
                          Product <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${productId && inStock === false ? 'is-invalid' : ''}`}
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
                        {productId && inStock === false && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            This product is currently out of stock
                          </div>
                        )}
                        {product && (
                          <div className="mt-2">
                            <small className="text-muted">{product.description}</small>
                          </div>
                        )}
                      </div>
                      <div className="col-md-3">
                        <label htmlFor={`quantity-${index}`} className="form-label fw-semibold">
                          Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id={`quantity-${index}`}
                          name="quantity"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold">Price</label>
                        <div className="form-control-plaintext">
                          {price !== null && price !== undefined ? (
                            <span className="fw-bold text-success">${price.toFixed(2)}</span>
                          ) : productId ? (
                            <span className="text-muted small">Loading...</span>
                          ) : (
                            <span className="text-muted">--</span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-1 d-flex align-items-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(index)}
                          disabled={order.orderItems.length === 1}
                          title="Remove item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    {productId && price && (
                      <div className="row mt-2">
                        <div className="col-12">
                          <small className="text-muted">
                            Subtotal: <strong>${itemTotal.toFixed(2)}</strong>
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          {orderSummary.items.length > 0 && (
            <div className="card mb-4 bg-light border-0">
              <div className="card-body">
                <h5 className="mb-3">Order Summary</h5>
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Total</th>
                        <th className="text-center">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderSummary.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.productName}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">${item.price.toFixed(2)}</td>
                          <td className="text-end fw-bold">${item.total.toFixed(2)}</td>
                          <td className="text-center">
                            {item.inStock ? (
                              <span className="badge bg-success">In Stock</span>
                            ) : (
                              <span className="badge bg-danger">Out of Stock</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-primary">
                        <th colSpan="3" className="text-end">Total:</th>
                        <th className="text-end">${orderSummary.subtotal.toFixed(2)}</th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              <div>{error}</div>
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              <div>
                <strong>Order placed successfully!</strong>
                <br />
                Order Number: <code className="bg-white px-2 py-1 rounded">{orderNumber}</code>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading || orderSummary.items.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Placing Order...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Place Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;