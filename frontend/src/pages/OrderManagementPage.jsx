// frontend/src/pages/OrderManagementPage.jsx
import React, { useState, useEffect } from 'react';
import PlaceOrder from '../components/PlaceOrder';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, getOrderById } from '../api/apiService';

const OrderManagementPage = () => {
  const [showPlaceOrderForm, setShowPlaceOrderForm] = useState(false);
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showPlaceOrderForm) {
      fetchOrders();
    }
  }, [showPlaceOrderForm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch orders. You can still search by Order ID.');
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPlaced = (orderNumber) => {
    setShowPlaceOrderForm(false);
    fetchOrders();
  };

  const handleSearchOrderById = async (e) => {
    e.preventDefault();
    if (orderIdSearch) {
      try {
        const order = await getOrderById(orderIdSearch);
        if (order) {
          navigate(`/orders/${orderIdSearch}`);
        }
      } catch (err) {
        alert(`Order with ID ${orderIdSearch} not found.`);
      }
    } else {
      alert('Please enter an Order ID to search.');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'NEW': 'bg-primary',
      'PROCESSING': 'bg-info',
      'DELIVERING': 'bg-warning',
      'COMPLETED': 'bg-success',
      'CANCELLED': 'bg-danger',
    };
    return statusMap[status] || 'bg-secondary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-receipt me-2"></i>
          Order Management
        </h2>
        <div>
          {!showPlaceOrderForm ? (
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => setShowPlaceOrderForm(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Place New Order
            </button>
          ) : (
            <button 
              className="btn btn-outline-secondary btn-lg" 
              onClick={() => setShowPlaceOrderForm(false)}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Orders
            </button>
          )}
        </div>
      </div>

      {showPlaceOrderForm ? (
        <PlaceOrder onOrderPlaced={handleOrderPlaced} />
      ) : (
        <>
          {/* Search Section */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-search me-2"></i>
                Search Order
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearchOrderById} className="row g-3">
                <div className="col-md-8">
                  <label htmlFor="orderIdSearch" className="form-label">Order ID</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="orderIdSearch"
                    placeholder="Enter Order ID to view details"
                    value={orderIdSearch}
                    onChange={(e) => setOrderIdSearch(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    <i className="bi bi-search me-2"></i>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Orders List */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                All Orders
              </h5>
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={fetchOrders}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <p className="mt-3 text-muted">No orders found. Place your first order to get started!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Order Number</th>
                        <th>Customer ID</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th className="text-end">Total Amount</th>
                        <th className="text-center">Items</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${order.id}`)}>
                          <td><strong>#{order.id}</strong></td>
                          <td>
                            <code className="text-primary">{order.orderNumber || 'N/A'}</code>
                          </td>
                          <td>{order.customerId}</td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <strong className="text-success">
                              ${order.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}
                            </strong>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary">
                              {order.orderItems?.length || 0}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order.id}`);
                              }}
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagementPage;