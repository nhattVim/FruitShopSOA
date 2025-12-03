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
    <div className="card my-4">
      <div className="card-header">
        <h3>Set Product Price</h3>
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
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Setting Price...' : 'Set Price'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Price set successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default SetPrice;