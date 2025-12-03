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

  if (loading) return <div className="text-center my-4">Loading order details...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  if (!order) return <div className="alert alert-warning" role="alert">Order not found.</div>;

  const orderStatuses = ["NEW", "PROCESSING", "DELIVERING", "COMPLETED", "CANCELLED"];

  return (
    <div className="container mt-4">
      <div className="card my-4">
        <div className="card-header">
          <h3>Order Details for {order.orderNumber}</h3>
        </div>
        <div className="card-body">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Customer ID:</strong> {order.customerId}</p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Status:</strong> <span className={`badge bg-${order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}`}>{order.status}</span></p>
          <p><strong>Total Amount:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</p>

          <h4 className="mt-4">Order Items</h4>
          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.productId}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No items in this order.</p>
          )}

          <h4 className="mt-4">Update Order Status</h4>
          <div className="input-group mb-3">
            <select className="form-select" value={newStatus} onChange={handleStatusChange}>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleUpdateStatus}>Update Status</button>
          </div>
          {updateStatusSuccess && <div className="alert alert-success mt-3">Order status updated successfully!</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;