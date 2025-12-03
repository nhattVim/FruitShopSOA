// frontend/src/components/ProcessPayment.jsx
import React, { useState } from 'react';
import { processPayment, getPaymentStatusByOrderId, refundPaymentByOrderId } from '../api/apiService';

const ProcessPayment = () => {
  const [paymentRequest, setPaymentRequest] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'Card',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Can be success message or PaymentResponse
  const [paymentStatusSearchId, setPaymentStatusSearchId] = useState('');
  const [refundOrderId, setRefundOrderId] = useState('');

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentRequest((prevRequest) => ({
      ...prevRequest,
      [name]: value,
    }));
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!paymentRequest.orderId || !paymentRequest.amount || !paymentRequest.paymentMethod) {
      setError('Order ID, Amount, and Payment Method are required.');
      setLoading(false);
      return;
    }

    try {
      const request = {
        orderId: parseInt(paymentRequest.orderId, 10),
        amount: parseFloat(paymentRequest.amount),
        paymentMethod: paymentRequest.paymentMethod,
      };
      const response = await processPayment(request);
      setSuccess({ message: 'Payment processed successfully!', details: response });
      setPaymentRequest({ orderId: '', amount: '', paymentMethod: 'Card' });
    } catch (err) {
      setError(`Failed to process payment: ${err.response?.data || err.message}`);
      console.error('Error processing payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPaymentStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!paymentStatusSearchId) {
      setError('Order ID is required to get payment status.');
      setLoading(false);
      return;
    }

    try {
      const response = await getPaymentStatusByOrderId(parseInt(paymentStatusSearchId, 10));
      setSuccess({ message: 'Payment status retrieved:', details: response });
    } catch (err) {
      setError(`Failed to get payment status: ${err.response?.data || err.message}`);
      console.error('Error getting payment status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!refundOrderId) {
      setError('Order ID is required to initiate refund.');
      setLoading(false);
      return;
    }

    try {
      const response = await refundPaymentByOrderId(parseInt(refundOrderId, 10));
      setSuccess({ message: 'Refund initiated successfully!', details: response });
      setRefundOrderId('');
    } catch (err) {
      setError(`Failed to refund payment: ${err.response?.data || err.message}`);
      console.error('Error refunding payment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Payment Operations</h3>
      </div>
      <div className="card-body">
        {/* Process Payment Form */}
        <h4 className="mt-3">Process New Payment</h4>
        <form onSubmit={handleProcessPayment}>
          <div className="mb-3">
            <label htmlFor="orderId" className="form-label">Order ID:</label>
            <input
              type="number"
              className="form-control"
              id="orderId"
              name="orderId"
              value={paymentRequest.orderId}
              onChange={handlePaymentChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount:</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="amount"
              name="amount"
              value={paymentRequest.amount}
              onChange={handlePaymentChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="paymentMethod" className="form-label">Payment Method:</label>
            <select
              className="form-select"
              id="paymentMethod"
              name="paymentMethod"
              value={paymentRequest.paymentMethod}
              onChange={handlePaymentChange}
            >
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Momo">Momo</option>
              <option value="VNPay">VNPay</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Processing...' : 'Process Payment'}
          </button>
        </form>

        <hr className="my-4" />

        {/* Get Payment Status Form */}
        <h4 className="mt-3">Get Payment Status by Order ID</h4>
        <form onSubmit={handleGetPaymentStatus} className="d-flex">
          <input
            type="number"
            className="form-control me-2"
            placeholder="Enter Order ID"
            value={paymentStatusSearchId}
            onChange={(e) => setPaymentStatusSearchId(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-info" disabled={loading}>
            {loading ? 'Searching...' : 'Get Status'}
          </button>
        </form>

        <hr className="my-4" />

        {/* Refund Payment Form */}
        <h4 className="mt-3">Refund Payment by Order ID</h4>
        <form onSubmit={handleRefundPayment} className="d-flex">
          <input
            type="number"
            className="form-control me-2"
            placeholder="Enter Order ID to Refund"
            value={refundOrderId}
            onChange={(e) => setRefundOrderId(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-warning" disabled={loading}>
            {loading ? 'Refunding...' : 'Refund Payment'}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && (
          <div className="alert alert-success mt-3">
            {success.message}
            {success.details && (
              <div>
                <p>Transaction ID: {success.details.transactionId}</p>
                <p>Status: {success.details.status}</p>
                <p>Amount: ${success.details.amount?.toFixed(2)}</p>
                <p>Method: {success.details.paymentMethod}</p>
                <p>Date: {new Date(success.details.paymentDate).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessPayment;