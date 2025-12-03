// frontend/src/components/AddCustomer.jsx
import React, { useState } from 'react';
import { createCustomer } from '../api/apiService';

const AddCustomer = ({ onCustomerAdded }) => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    membershipLevel: 'Bronze', // Default level
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      await createCustomer(customer);
      setSuccess(true);
      setCustomer({
        name: '',
        email: '',
        address: '',
        phone: '',
        membershipLevel: 'Bronze',
      }); // Clear form
      if (onCustomerAdded) {
        onCustomerAdded(); // Notify parent to refresh list
      }
    } catch (err) {
      setError('Failed to add customer. Please check your input and try again.');
      console.error('Error adding customer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Add New Customer</h3>
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
              value={customer.name}
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
              value={customer.email}
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
              value={customer.address}
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
              value={customer.phone}
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
              value={customer.membershipLevel}
              onChange={handleChange}
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Adding...' : 'Add Customer'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Customer added successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;