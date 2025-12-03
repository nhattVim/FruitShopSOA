// frontend/src/components/EditCustomer.jsx
import React, { useState, useEffect } from 'react';
import { getCustomerById, updateCustomer } from '../api/apiService';

const EditCustomer = ({ customerId, onCustomerUpdated, onCancelEdit }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await getCustomerById(customerId);
        setCustomer(data);
      } catch (err) {
        setError('Failed to fetch customer for editing.');
        console.error('Error fetching customer:', err);
      } finally {
        setLoading(false);
      }
    };
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!customer.name || !customer.email || !customer.address || !customer.phone) {
      setError('All fields except Membership Level are required.');
      setLoading(false);
      return;
    }

    try {
      await updateCustomer(customerId, customer);
      setSuccess(true);
      if (onCustomerUpdated) {
        onCustomerUpdated(); // Notify parent to refresh list
      }
    } catch (err) {
      setError('Failed to update customer. Please check your input and try again.');
      console.error('Error updating customer:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center my-4">Loading customer details...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  if (!customer) return <div className="alert alert-warning" role="alert">Customer not found or invalid ID.</div>;

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Edit Customer (ID: {customerId})</h3>
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
              value={customer.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={customer.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={customer.address || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={customer.phone || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="membershipLevel" className="form-label">Membership Level:</label>
            <select
              className="form-select"
              id="membershipLevel"
              name="membershipLevel"
              value={customer.membershipLevel || ''}
              onChange={handleChange}
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {loading ? 'Updating...' : 'Update Customer'}
          </button>
          {onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
              Cancel
            </button>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Customer updated successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;