// frontend/src/components/CreateVoucher.jsx
import React, { useState } from 'react';
import { createVoucher } from '../api/apiService';

const CreateVoucher = ({ onVoucherCreated }) => {
  const [voucher, setVoucher] = useState({
    code: '',
    discountType: 'PERCENTAGE', // Default type
    value: '',
    minOrderAmount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!voucher.code || !voucher.discountType || !voucher.value || !voucher.usageLimit || !voucher.validFrom || !voucher.validUntil) {
      setError('Code, Discount Type, Value, Usage Limit, Valid From, and Valid Until are required.');
      setLoading(false);
      return;
    }

    try {
      const voucherToCreate = {
        ...voucher,
        value: parseFloat(voucher.value),
        minOrderAmount: voucher.minOrderAmount ? parseFloat(voucher.minOrderAmount) : null,
        usageLimit: parseInt(voucher.usageLimit, 10),
        validFrom: new Date(voucher.validFrom).toISOString().slice(0, 19),
        validUntil: new Date(voucher.validUntil).toISOString().slice(0, 19),
      };
      await createVoucher(voucherToCreate);
      setSuccess(true);
      setVoucher({
        code: '',
        discountType: 'PERCENTAGE',
        value: '',
        minOrderAmount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: '',
        active: true,
      });
      if (onVoucherCreated) {
        onVoucherCreated();
      }
    } catch (err) {
      setError(`Failed to create voucher: ${err.response?.data || err.message}`);
      console.error('Error creating voucher:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Create New Voucher</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">Voucher Code:</label>
            <input
              type="text"
              className="form-control"
              id="code"
              name="code"
              value={voucher.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="discountType" className="form-label">Discount Type:</label>
            <select
              className="form-select"
              id="discountType"
              name="discountType"
              value={voucher.discountType}
              onChange={handleChange}
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed Amount</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="value" className="form-label">Value (e.g., 10 for 10% or $10):</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="value"
              name="value"
              value={voucher.value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="minOrderAmount" className="form-label">Minimum Order Amount (optional):</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="minOrderAmount"
              name="minOrderAmount"
              value={voucher.minOrderAmount}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="usageLimit" className="form-label">Usage Limit:</label>
            <input
              type="number"
              className="form-control"
              id="usageLimit"
              name="usageLimit"
              value={voucher.usageLimit}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="validFrom" className="form-label">Valid From:</label>
            <input
              type="datetime-local"
              className="form-control"
              id="validFrom"
              name="validFrom"
              value={voucher.validFrom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="validUntil" className="form-label">Valid Until:</label>
            <input
              type="datetime-local"
              className="form-control"
              id="validUntil"
              name="validUntil"
              value={voucher.validUntil}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="active"
              name="active"
              checked={voucher.active}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="active">Active</label>
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creating...' : 'Create Voucher'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Voucher created successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateVoucher;