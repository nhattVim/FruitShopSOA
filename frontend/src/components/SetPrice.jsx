// frontend/src/components/SetPrice.jsx
import React, { useState } from 'react';
import { setProductPrice } from '../api/apiService';

const SetPrice = ({ onPriceSet }) => {
  const [priceData, setPriceData] = useState({
    productId: '',
    currentPrice: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPriceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!priceData.productId || !priceData.currentPrice || !priceData.startDate || !priceData.endDate) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const priceRequest = {
        productId: parseInt(priceData.productId, 10),
        currentPrice: parseFloat(priceData.currentPrice),
        // Dates should be in ISO format (e.g., "YYYY-MM-DDTHH:mm:ss")
        startDate: new Date(priceData.startDate).toISOString().slice(0, 19),
        endDate: new Date(priceData.endDate).toISOString().slice(0, 19),
      };
      await setProductPrice(priceRequest);
      setSuccess(true);
      setPriceData({
        productId: '',
        currentPrice: '',
        startDate: '',
        endDate: '',
      });
      if (onPriceSet) {
        onPriceSet();
      }
    } catch (err) {
      setError(`Failed to set price: ${err.response?.data || err.message}`);
      console.error('Error setting price:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-tag me-2"></i>
          Set Product Price
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="productId" className="form-label">Product ID:</label>
            <input
              type="number"
              className="form-control"
              id="productId"
              name="productId"
              value={priceData.productId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="currentPrice" className="form-label">Current Price:</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="currentPrice"
              name="currentPrice"
              value={priceData.currentPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date:</label>
            <input
              type="datetime-local"
              className="form-control"
              id="startDate"
              name="startDate"
              value={priceData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date:</label>
            <input
              type="datetime-local"
              className="form-control"
              id="endDate"
              name="endDate"
              value={priceData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Setting Price...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Set Price
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="alert alert-danger mt-3 d-flex align-items-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success mt-3 d-flex align-items-center">
              <i className="bi bi-check-circle me-2"></i>
              Price set successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SetPrice;