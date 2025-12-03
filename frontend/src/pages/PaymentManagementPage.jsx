// frontend/src/pages/PaymentManagementPage.jsx
import React from 'react';
import ProcessPayment from '../components/ProcessPayment';

const PaymentManagementPage = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Payment Management</h2>
      <ProcessPayment />
    </div>
  );
};

export default PaymentManagementPage;