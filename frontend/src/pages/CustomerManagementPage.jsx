// frontend/src/pages/CustomerManagementPage.jsx
import React, { useState } from 'react';
import CustomerList from '../components/CustomerList';
import AddCustomer from '../components/AddCustomer';
import EditCustomer from '../components/EditCustomer';

const CustomerManagementPage = () => {
  const [editingCustomer, setEditingCustomer] = useState(null); // Stores customer object being edited
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0); // Used to trigger CustomerList refresh

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleCustomerAdded = () => {
    setShowAddCustomerForm(false); // Hide form after adding
    triggerRefresh(); // Refresh list
  };

  const handleCustomerUpdated = () => {
    setEditingCustomer(null); // Hide edit form after updating
    triggerRefresh(); // Refresh list
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowAddCustomerForm(false); // Hide add form if showing
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Customer Management</h2>

      <div className="mb-3 d-flex justify-content-end">
        <button className="btn btn-success me-2" onClick={() => {
          setShowAddCustomerForm(true);
          setEditingCustomer(null); // Ensure edit form is hidden
        }}>
          Add New Customer
        </button>
        <button className="btn btn-info" onClick={() => {
          setShowAddCustomerForm(false);
          setEditingCustomer(null); // Ensure edit form is hidden
        }}>
          View All Customers
        </button>
      </div>

      {showAddCustomerForm && (
        <AddCustomer onCustomerAdded={handleCustomerAdded} />
      )}

      {editingCustomer && (
        <EditCustomer
          customerId={editingCustomer.id}
          onCustomerUpdated={handleCustomerUpdated}
          onCancelEdit={handleCancelEdit}
        />
      )}

      {!showAddCustomerForm && !editingCustomer && (
        <CustomerList onEditCustomer={handleEditCustomer} refreshTrigger={refreshCounter} />
      )}
    </div>
  );
};

export default CustomerManagementPage;