// frontend/src/pages/InventoryDetailPage.jsx
import React, { useState } from 'react';
import { getInventoryDetailsByProductId, isProductInStock } from '../api/apiService';
// import './InventoryDetailPage.css'; // Removed, using Bootstrap

const InventoryDetailPage = () => {
  const [productId, setProductId] = useState('');
  const [inventoryDetails, setInventoryDetails] = useState(null);
  const [inStockStatus, setInStockStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setProductId(e.target.value);
  };

  const fetchInventoryDetails = async (id) => {
    setLoading(true);
    setError(null);
    setInventoryDetails(null);
    setInStockStatus(null);

    try {
      const details = await getInventoryDetailsByProductId(id);
      setInventoryDetails(details);
    } catch (err) {
      setError('Failed to fetch inventory details.');
      console.error('Error fetching inventory details:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkInStock = async (id) => {
    setLoading(true);
    setError(null);
    setInStockStatus(null);

    try {
      const status = await isProductInStock(id);
      setInStockStatus(status);
    } catch (err) {
      setError('Failed to check in-stock status.');
      console.error('Error checking in-stock status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) {
      setError('Please enter a Product ID.');
      return;
    }
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      setError('Product ID must be a number.');
      return;
    }
    
    await Promise.all([fetchInventoryDetails(id), checkInStock(id)]);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Inventory Details</h2>
      <div className="card my-4">
        <div className="card-header">
          Search Inventory
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="productId" className="form-label">Product ID:</label>
              <input
                type="number"
                className="form-control"
                id="productId"
                value={productId}
                onChange={handleInputChange}
                placeholder="Enter Product ID"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Get Inventory Info'}
            </button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      </div>

      {inventoryDetails && (
        <div className="card my-4">
          <div className="card-header">
            <h3>Details for Product ID: {inventoryDetails.productId}</h3>
          </div>
          <div className="card-body">
            <p><strong>ID:</strong> {inventoryDetails.id}</p>
            <p><strong>Quantity:</strong> {inventoryDetails.quantity}</p>
            <p><strong>Batch ID:</strong> {inventoryDetails.batchId}</p>
            <p><strong>Import Date:</strong> {inventoryDetails.importDate}</p>
            <p><strong>Expiration Date:</strong> {inventoryDetails.expirationDate}</p>
            <p><strong>Unit of Measure:</strong> {inventoryDetails.unitOfMeasure}</p>
          </div>
        </div>
      )}

      {inStockStatus !== null && (
        <div className="card my-4">
          <div className="card-header">
            <h3>In-Stock Status</h3>
          </div>
          <div className="card-body">
            <p>Product is {inStockStatus ? <span className="badge bg-success">IN STOCK</span> : <span className="badge bg-danger">OUT OF STOCK</span>}.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDetailPage;
