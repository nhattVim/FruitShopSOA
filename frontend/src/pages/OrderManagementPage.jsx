// frontend/src/pages/OrderManagementPage.jsx
import React, { useState } from 'react';
import PlaceOrder from '../components/PlaceOrder';
import { useNavigate } from 'react-router-dom';

const OrderManagementPage = () => {
  const [showPlaceOrderForm, setShowPlaceOrderForm] = useState(false);
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [orderNumberSearch, setOrderNumberSearch] = useState('');
  const navigate = useNavigate();

  const handleOrderPlaced = (orderNumber) => {
    setShowPlaceOrderForm(false);
    alert(`Order ${orderNumber} placed successfully!`);
  };

  const handleSearchOrderById = (e) => {
    e.preventDefault();
    if (orderIdSearch) {
      navigate(`/orders/${orderIdSearch}`);
    } else {
      alert('Please enter an Order ID to search.');
    }
  };

  // Note: Backend API only supports GET by ID, not by orderNumber directly.
  // This search by orderNumber might not work without an API change, or would require a prior lookup.
  // For now, it's a placeholder if a backend endpoint for orderNumber lookup is added.
  const handleSearchOrderByNumber = (e) => {
    e.preventDefault();
    if (orderNumberSearch) {
      alert('Searching by Order Number is not yet implemented in the API. Please use Order ID search.');
      // navigate(`/orders/by-number/${orderNumberSearch}`); // Would need a new route and API endpoint
    } else {
      alert('Please enter an Order Number to search.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Order Management</h2>

      <div className="mb-3 d-flex justify-content-end">
        <button className="btn btn-success me-2" onClick={() => setShowPlaceOrderForm(true)}>
          Place New Order
        </button>
        <button className="btn btn-info" onClick={() => setShowPlaceOrderForm(false)}>
          View Orders
        </button>
      </div>

      {showPlaceOrderForm && (
        <PlaceOrder onOrderPlaced={handleOrderPlaced} />
      )}

      {!showPlaceOrderForm && (
        <div className="card my-4">
          <div className="card-header">
            <h3>Search Order by ID</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSearchOrderById} className="d-flex">
              <input
                type="number"
                className="form-control me-2"
                placeholder="Enter Order ID"
                value={orderIdSearch}
                onChange={(e) => setOrderIdSearch(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;