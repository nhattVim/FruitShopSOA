// frontend/src/components/CustomerList.jsx
import React, { useEffect, useState } from 'react';
import { getAllCustomers, deleteCustomer } from '../api/apiService';

const CustomerList = ({ onEditCustomer, refreshTrigger }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [refreshTrigger]); // Re-fetch customers when refreshTrigger changes

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers(); // Refresh the list
      } catch (err) {
        setError('Failed to delete customer.');
        console.error('Error deleting customer:', err);
      }
    }
  };

  if (loading) return <div className="text-center my-4">Loading customers...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Available Customers</h3>
      </div>
      <div className="card-body">
        {customers.length === 0 ? (
          <p className="text-center">No customers found. Add some!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Membership Level</th>
                  <th>Membership Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.address}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.membershipLevel}</td>
                    <td>{customer.membershipPoints}</td>
                    <td>
                      <button onClick={() => onEditCustomer(customer)} className="btn btn-sm btn-primary me-2">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(customer.id)} className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;