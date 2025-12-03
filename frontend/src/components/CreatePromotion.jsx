// frontend/src/components/CreatePromotion.jsx
import React, { useState } from 'react';
import { createPromotion } from '../api/apiService';

const CreatePromotion = ({ onPromotionCreated }) => {
  const [promotion, setPromotion] = useState({
    name: '',
    description: '',
    type: 'PercentageDiscount', // Default type
    value: '',
    productIds: '', // Comma-separated string
    startDate: '',
    endDate: '',
    conditions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!promotion.name || !promotion.type || !promotion.value || !promotion.productIds || !promotion.startDate || !promotion.endDate) {
      setError('Name, Type, Value, Product IDs, Start Date, and End Date are required.');
      setLoading(false);
      return;
    }

    try {
      const productIdsArray = promotion.productIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      
      const promotionToCreate = {
        ...promotion,
        value: parseFloat(promotion.value),
        productIds: productIdsArray,
        startDate: new Date(promotion.startDate).toISOString().slice(0, 19),
        endDate: new Date(promotion.endDate).toISOString().slice(0, 19),
      };
      await createPromotion(promotionToCreate);
      setSuccess(true);
      setPromotion({
        name: '',
        description: '',
        type: 'PercentageDiscount',
        value: '',
        productIds: '',
        startDate: '',
        endDate: '',
        conditions: '',
      });
      if (onPromotionCreated) {
        onPromotionCreated();
      }
    } catch (err) {
      setError(`Failed to create promotion: ${err.response?.data || err.message}`);
      console.error('Error creating promotion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Create New Promotion</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={promotion.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={promotion.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Type:</label>
            <select
              className="form-select"
              id="type"
              name="type"
              value={promotion.type}
              onChange={handleChange}
            >
              <option value="PercentageDiscount">Percentage Discount</option>
              <option value="FixedDiscount">Fixed Discount</option>
              {/* Add other types as per API_DOCUMENTATION.md */}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="value" className="form-label">Value (e.g., 0.10 for 10% or 5.00 for $5):</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="value"
              name="value"
              value={promotion.value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="productIds" className="form-label">Product IDs (comma-separated):</label>
            <input
              type="text"
              className="form-control"
              id="productIds"
              name="productIds"
              value={promotion.productIds}
              onChange={handleChange}
              placeholder="e.g., 1,2,3"
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
              value={promotion.startDate}
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
              value={promotion.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="conditions" className="form-label">Conditions:</label>
            <textarea
              className="form-control"
              id="conditions"
              name="conditions"
              value={promotion.conditions}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creating...' : 'Create Promotion'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Promotion created successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default CreatePromotion;