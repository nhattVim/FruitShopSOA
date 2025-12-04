// frontend/src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../api/apiService';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
      setNewStatus(data.status); // Set initial status for dropdown
    } catch (err) {
      setError('Failed to fetch order details.');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    setUpdateStatusSuccess(false);
    if (!newStatus || newStatus === order.status) {
      alert('Please select a new status.');
      return;
    }
    try {
      await updateOrderStatus(id, newStatus);
      setUpdateStatusSuccess(true);
      fetchOrderDetails(); // Refresh order details to show new status
    } catch (err) {
      setError(`Failed to update order status: ${err.response?.data || err.message}`);
      console.error('Error updating order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i>
          Error: {error}
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Order not found.
        </div>
      </div>
    );
  }

  const orderStatuses = ["NEW", "PROCESSING", "DELIVERING", "COMPLETED", "CANCELLED"];
  
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

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.unitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return price * quantity;
  };

  const orderTotal = order.orderItems?.reduce((sum, item) => sum + calculateItemTotal(item), 0) || 0;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-receipt me-2"></i>
          Order Details
        </h2>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      {/* Order Information Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Order Information
          </h4>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="text-muted small text-uppercase">Order ID</label>
                <p className="mb-0 fw-bold">#{order.id}</p>
              </div>
              <div className="mb-3">
                <label className="text-muted small text-uppercase">Order Number</label>
                <p className="mb-0">
                  <code className="text-primary">{order.orderNumber || 'N/A'}</code>
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="text-muted small text-uppercase">Customer ID</label>
                <p className="mb-0 fw-bold">{order.customerId}</p>
              </div>
              <div className="mb-3">
                <label className="text-muted small text-uppercase">Order Date</label>
                <p className="mb-0">
                  <i className="bi bi-calendar me-2"></i>
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <div>
                  <label className="text-muted small text-uppercase">Status</label>
                  <div>
                    <span className={`badge ${getStatusBadgeClass(order.status)} fs-6`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-end">
                  <label className="text-muted small text-uppercase">Total Amount</label>
                  <div>
                    <h3 className="mb-0 text-success">
                      ${order.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Order Items
          </h5>
        </div>
        <div className="card-body">
          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Item ID</th>
                    <th>Product ID</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => {
                    const itemTotal = calculateItemTotal(item);
                    return (
                      <tr key={item.id}>
                        <td><strong>#{item.id}</strong></td>
                        <td>Product #{item.productId}</td>
                        <td className="text-center">
                          <span className="badge bg-secondary">{item.quantity}</span>
                        </td>
                        <td className="text-end">${item.unitPrice ? parseFloat(item.unitPrice).toFixed(2) : '0.00'}</td>
                        <td className="text-end fw-bold">${itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th colSpan="4" className="text-end">Grand Total:</th>
                    <th className="text-end text-success">
                      ${order.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-inbox display-4 text-muted"></i>
              <p className="mt-3 text-muted">No items in this order.</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Status Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="bi bi-pencil-square me-2"></i>
            Update Order Status
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-8">
              <label htmlFor="statusSelect" className="form-label fw-semibold">New Status</label>
              <select 
                className="form-select" 
                id="statusSelect"
                value={newStatus} 
                onChange={handleStatusChange}
              >
                {orderStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <button 
                className="btn btn-primary w-100" 
                onClick={handleUpdateStatus}
                disabled={newStatus === order.status}
              >
                <i className="bi bi-check-circle me-2"></i>
                Update Status
              </button>
            </div>
          </div>
          {updateStatusSuccess && (
            <div className="alert alert-success mt-3 d-flex align-items-center">
              <i className="bi bi-check-circle me-2"></i>
              Order status updated successfully!
            </div>
          )}
          {error && (
            <div className="alert alert-danger mt-3 d-flex align-items-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;