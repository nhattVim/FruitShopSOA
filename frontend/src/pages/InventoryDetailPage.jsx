// frontend/src/pages/InventoryDetailPage.jsx
import React, { useState, useEffect } from 'react';
import {
  getAllInventory,
  getInventoryDetailsByProductId,
  isProductInStock,
  recordInboundInventory,
  deductStock,
  getExpiringItems,
  convertUnits,
  getAllProducts
} from '../api/apiService';

const InventoryDetailPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'search', 'add', 'deduct', 'expiring', 'converter'
  
  // Overview state
  const [allInventory, setAllInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  
  // Search state
  const [searchProductId, setSearchProductId] = useState('');
  const [inventoryDetails, setInventoryDetails] = useState(null);
  const [inStockStatus, setInStockStatus] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  // Add inventory state
  const [inboundData, setInboundData] = useState({
    productId: '',
    quantity: '',
    batchId: '',
    importDate: '',
    expirationDate: '',
    unitOfMeasure: 'unit'
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);
  
  // Deduct stock state
  const [deductData, setDeductData] = useState({
    productId: '',
    quantity: ''
  });
  const [deductLoading, setDeductLoading] = useState(false);
  const [deductError, setDeductError] = useState(null);
  const [deductSuccess, setDeductSuccess] = useState(false);
  
  // Expiring items state
  const [expiringItems, setExpiringItems] = useState([]);
  const [expiringThreshold, setExpiringThreshold] = useState('');
  const [expiringLoading, setExpiringLoading] = useState(false);
  
  // Unit converter state
  const [converterData, setConverterData] = useState({
    productId: '',
    quantity: '',
    fromUnit: 'unit',
    toUnit: 'unit'
  });
  const [convertedValue, setConvertedValue] = useState(null);
  const [converterLoading, setConverterLoading] = useState(false);
  const [converterError, setConverterError] = useState(null);
  
  // Products for dropdowns
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (activeTab === 'overview') {
      fetchAllInventory();
    } else if (activeTab === 'expiring') {
      fetchExpiringItems();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchAllInventory = async () => {
    try {
      setLoadingInventory(true);
      const data = await getAllInventory();
      setAllInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setAllInventory([]);
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchExpiringItems = async () => {
    try {
      setExpiringLoading(true);
      const threshold = expiringThreshold || new Date().toISOString().split('T')[0];
      const data = await getExpiringItems(threshold);
      setExpiringItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching expiring items:', err);
      setExpiringItems([]);
    } finally {
      setExpiringLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchProductId) {
      setSearchError('Please enter a Product ID.');
      return;
    }
    
    setSearchLoading(true);
    setSearchError(null);
    setInventoryDetails(null);
    setInStockStatus(null);
    
    try {
      const id = parseInt(searchProductId, 10);
      const [details, inStock] = await Promise.all([
        getInventoryDetailsByProductId(id).catch(() => null),
        isProductInStock(id).catch(() => null)
      ]);
      setInventoryDetails(details);
      setInStockStatus(inStock);
      if (!details && inStock === null) {
        setSearchError('Product not found or no inventory record exists.');
      }
    } catch (err) {
      setSearchError(`Failed to fetch inventory: ${err.response?.data || err.message}`);
      console.error('Error fetching inventory:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(false);

    if (!inboundData.productId || !inboundData.quantity || !inboundData.importDate) {
      setAddError('Product ID, Quantity, and Import Date are required.');
      setAddLoading(false);
      return;
    }

    try {
      const inventoryRequest = {
        productId: parseInt(inboundData.productId, 10),
        quantity: parseInt(inboundData.quantity, 10),
        batchId: inboundData.batchId || `BATCH-${Date.now()}`,
        importDate: inboundData.importDate,
        expirationDate: inboundData.expirationDate || null,
        unitOfMeasure: inboundData.unitOfMeasure
      };
      await recordInboundInventory(inventoryRequest);
      setAddSuccess(true);
      setInboundData({
        productId: '',
        quantity: '',
        batchId: '',
        importDate: '',
        expirationDate: '',
        unitOfMeasure: 'unit'
      });
      fetchAllInventory();
    } catch (err) {
      setAddError(`Failed to add inventory: ${err.response?.data || err.message}`);
      console.error('Error adding inventory:', err);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeductStock = async (e) => {
    e.preventDefault();
    setDeductLoading(true);
    setDeductError(null);
    setDeductSuccess(false);

    if (!deductData.productId || !deductData.quantity) {
      setDeductError('Product ID and Quantity are required.');
      setDeductLoading(false);
      return;
    }

    try {
      const productId = parseInt(deductData.productId, 10);
      const quantity = parseInt(deductData.quantity, 10);
      const success = await deductStock(productId, quantity);
      
      if (success) {
        setDeductSuccess(true);
        setDeductData({ productId: '', quantity: '' });
        fetchAllInventory();
      } else {
        setDeductError('Failed to deduct stock. Product may not exist or insufficient stock available.');
      }
    } catch (err) {
      setDeductError(`Failed to deduct stock: ${err.response?.data || err.message}`);
      console.error('Error deducting stock:', err);
    } finally {
      setDeductLoading(false);
    }
  };

  const handleConvertUnits = async (e) => {
    e.preventDefault();
    setConverterLoading(true);
    setConverterError(null);
    setConvertedValue(null);

    if (!converterData.productId || !converterData.quantity || !converterData.fromUnit || !converterData.toUnit) {
      setConverterError('All fields are required.');
      setConverterLoading(false);
      return;
    }

    try {
      const result = await convertUnits(
        parseInt(converterData.productId, 10),
        parseFloat(converterData.quantity),
        converterData.fromUnit,
        converterData.toUnit
      );
      if (result !== null && result !== undefined) {
        setConvertedValue(result);
      } else {
        setConverterError('Conversion not supported for these units.');
      }
    } catch (err) {
      setConverterError(`Failed to convert units: ${err.response?.data || err.message}`);
      console.error('Error converting units:', err);
    } finally {
      setConverterLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    try {
      const expDate = new Date(expirationDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    } catch {
      return false;
    }
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    try {
      return new Date(expirationDate) < new Date();
    } catch {
      return false;
    }
  };

  const getStockStatusBadge = (quantity) => {
    if (quantity === 0) return <span className="badge bg-danger">Out of Stock</span>;
    if (quantity < 10) return <span className="badge bg-warning">Low Stock</span>;
    return <span className="badge bg-success">In Stock</span>;
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-archive me-2"></i>
          Inventory Management
        </h2>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            type="button"
          >
            <i className="bi bi-grid me-2"></i>
            Overview
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
            type="button"
          >
            <i className="bi bi-search me-2"></i>
            Search
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
            type="button"
          >
            <i className="bi bi-box-arrow-in-down me-2"></i>
            Add Inventory
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'deduct' ? 'active' : ''}`}
            onClick={() => setActiveTab('deduct')}
            type="button"
          >
            <i className="bi bi-box-arrow-up me-2"></i>
            Deduct Stock
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'expiring' ? 'active' : ''}`}
            onClick={() => setActiveTab('expiring')}
            type="button"
          >
            <i className="bi bi-calendar-x me-2"></i>
            Expiring Items
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'converter' ? 'active' : ''}`}
            onClick={() => setActiveTab('converter')}
            type="button"
          >
            <i className="bi bi-arrow-left-right me-2"></i>
            Unit Converter
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">All Inventory</h4>
              <button className="btn btn-outline-primary" onClick={fetchAllInventory} disabled={loadingInventory}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Inventory List
                </h5>
              </div>
              <div className="card-body">
                {loadingInventory ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading inventory...</p>
                  </div>
                ) : allInventory.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                    <p className="mt-3 text-muted">No inventory records found. Add inventory to get started!</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Product ID</th>
                          <th className="text-end">Quantity</th>
                          <th>Unit</th>
                          <th>Batch ID</th>
                          <th>Import Date</th>
                          <th>Expiration Date</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allInventory.map((item) => (
                          <tr key={item.id}>
                            <td><strong>#{item.id}</strong></td>
                            <td>Product #{item.productId}</td>
                            <td className="text-end">
                              <strong className={item.quantity === 0 ? 'text-danger' : item.quantity < 10 ? 'text-warning' : 'text-success'}>
                                {item.quantity}
                              </strong>
                            </td>
                            <td>
                              <span className="badge bg-secondary">{item.unitOfMeasure || 'N/A'}</span>
                            </td>
                            <td>
                              <code className="text-primary">{item.batchId || 'N/A'}</code>
                            </td>
                            <td>{formatDate(item.importDate)}</td>
                            <td>
                              {item.expirationDate ? (
                                <>
                                  {formatDate(item.expirationDate)}
                                  {isExpired(item.expirationDate) && (
                                    <>
                                      <br />
                                      <span className="badge bg-danger">Expired</span>
                                    </>
                                  )}
                                  {isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && (
                                    <>
                                      <br />
                                      <span className="badge bg-warning">Expiring Soon</span>
                                    </>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted">No expiration</span>
                              )}
                            </td>
                            <td className="text-center">
                              {getStockStatusBadge(item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-search me-2"></i>
                  Search Inventory by Product
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSearch} className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="searchProductId" className="form-label">Product</label>
                    <select
                      className="form-select form-select-lg"
                      id="searchProductId"
                      value={searchProductId}
                      onChange={(e) => setSearchProductId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (ID: {product.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary btn-lg w-100" disabled={searchLoading}>
                      {searchLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </form>
                {searchError && (
                  <div className="alert alert-danger mt-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {searchError}
                  </div>
                )}
              </div>
            </div>

            {inventoryDetails && (
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Inventory Details - Product #{inventoryDetails.productId}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small text-uppercase">Inventory ID</label>
                        <p className="mb-0 fw-bold">#{inventoryDetails.id}</p>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small text-uppercase">Quantity</label>
                        <p className="mb-0">
                          <span className="display-6 text-success fw-bold">{inventoryDetails.quantity}</span>
                          <span className="ms-2 text-muted">{inventoryDetails.unitOfMeasure || 'units'}</span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small text-uppercase">Batch ID</label>
                        <p className="mb-0">
                          <code className="text-primary">{inventoryDetails.batchId || 'N/A'}</code>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small text-uppercase">Import Date</label>
                        <p className="mb-0">
                          <i className="bi bi-calendar me-2"></i>
                          {formatDate(inventoryDetails.importDate)}
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small text-uppercase">Expiration Date</label>
                        <p className="mb-0">
                          {inventoryDetails.expirationDate ? (
                            <>
                              <i className="bi bi-calendar-x me-2"></i>
                              {formatDate(inventoryDetails.expirationDate)}
                              {isExpired(inventoryDetails.expirationDate) && (
                                <span className="badge bg-danger ms-2">Expired</span>
                              )}
                              {isExpiringSoon(inventoryDetails.expirationDate) && !isExpired(inventoryDetails.expirationDate) && (
                                <span className="badge bg-warning ms-2">Expiring Soon</span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted">No expiration date</span>
                          )}
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small text-uppercase">Unit of Measure</label>
                        <p className="mb-0">
                          <span className="badge bg-info fs-6">{inventoryDetails.unitOfMeasure || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {inStockStatus !== null && (
              <div className="card shadow-sm border-0">
                <div className={`card-header ${inStockStatus ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                  <h5 className="mb-0">
                    <i className={`bi ${inStockStatus ? 'bi-check-circle' : 'bi-x-circle'} me-2`}></i>
                    Stock Status
                  </h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-3">
                    <i className={`bi ${inStockStatus ? 'bi-check-circle' : 'bi-x-circle'} display-1 ${inStockStatus ? 'text-success' : 'text-danger'}`}></i>
                    <h3 className="mt-3">
                      Product is {inStockStatus ? (
                        <span className="badge bg-success fs-3">IN STOCK</span>
                      ) : (
                        <span className="badge bg-danger fs-3">OUT OF STOCK</span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Inventory Tab */}
        {activeTab === 'add' && (
          <div>
            <div className="card shadow-sm border-0">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                  <i className="bi bi-box-arrow-in-down me-2"></i>
                  Record Inbound Inventory
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddInventory}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="inboundProductId" className="form-label fw-semibold">
                        Product <span className="text-danger">*</span>
                      </label>
                      {loadingProducts ? (
                        <div className="form-control">
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Loading products...
                        </div>
                      ) : (
                        <select
                          className="form-select form-select-lg"
                          id="inboundProductId"
                          value={inboundData.productId}
                          onChange={(e) => setInboundData({ ...inboundData, productId: e.target.value })}
                          required
                        >
                          <option value="">-- Select Product --</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (ID: {product.id})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inboundQuantity" className="form-label fw-semibold">
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="inboundQuantity"
                        min="1"
                        value={inboundData.quantity}
                        onChange={(e) => setInboundData({ ...inboundData, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inboundUnitOfMeasure" className="form-label fw-semibold">
                        Unit of Measure
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="inboundUnitOfMeasure"
                        value={inboundData.unitOfMeasure}
                        onChange={(e) => setInboundData({ ...inboundData, unitOfMeasure: e.target.value })}
                      >
                        <option value="unit">Unit</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="gram">Gram</option>
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                        <option value="lb">Pound (lb)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inboundBatchId" className="form-label fw-semibold">Batch ID</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="inboundBatchId"
                        placeholder="Auto-generated if empty"
                        value={inboundData.batchId}
                        onChange={(e) => setInboundData({ ...inboundData, batchId: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inboundImportDate" className="form-label fw-semibold">
                        Import Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        id="inboundImportDate"
                        value={inboundData.importDate}
                        onChange={(e) => setInboundData({ ...inboundData, importDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inboundExpirationDate" className="form-label fw-semibold">Expiration Date</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        id="inboundExpirationDate"
                        value={inboundData.expirationDate}
                        onChange={(e) => setInboundData({ ...inboundData, expirationDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-success btn-lg" disabled={addLoading || loadingProducts}>
                      {addLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding Inventory...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Record Inbound Inventory
                        </>
                      )}
                    </button>
                  </div>
                  {addError && (
                    <div className="alert alert-danger mt-3 d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {addError}
                    </div>
                  )}
                  {addSuccess && (
                    <div className="alert alert-success mt-3 d-flex align-items-center">
                      <i className="bi bi-check-circle me-2"></i>
                      Inventory added successfully!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Deduct Stock Tab */}
        {activeTab === 'deduct' && (
          <div>
            <div className="card shadow-sm border-0">
              <div className="card-header bg-warning text-dark">
                <h4 className="mb-0">
                  <i className="bi bi-box-arrow-up me-2"></i>
                  Deduct Stock (Outbound)
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleDeductStock}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="deductProductId" className="form-label fw-semibold">
                        Product <span className="text-danger">*</span>
                      </label>
                      {loadingProducts ? (
                        <div className="form-control">
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Loading products...
                        </div>
                      ) : (
                        <select
                          className="form-select form-select-lg"
                          id="deductProductId"
                          value={deductData.productId}
                          onChange={(e) => setDeductData({ ...deductData, productId: e.target.value })}
                          required
                        >
                          <option value="">-- Select Product --</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (ID: {product.id})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="deductQuantity" className="form-label fw-semibold">
                        Quantity to Deduct <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="deductQuantity"
                        min="1"
                        value={deductData.quantity}
                        onChange={(e) => setDeductData({ ...deductData, quantity: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="alert alert-info mt-3">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Note:</strong> This will reduce the available stock. Make sure you have sufficient inventory before deducting.
                  </div>
                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-warning btn-lg" disabled={deductLoading || loadingProducts}>
                      {deductLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Deducting Stock...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-dash-circle me-2"></i>
                          Deduct Stock
                        </>
                      )}
                    </button>
                  </div>
                  {deductError && (
                    <div className="alert alert-danger mt-3 d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {deductError}
                    </div>
                  )}
                  {deductSuccess && (
                    <div className="alert alert-success mt-3 d-flex align-items-center">
                      <i className="bi bi-check-circle me-2"></i>
                      Stock deducted successfully!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Expiring Items Tab */}
        {activeTab === 'expiring' && (
          <div>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-calendar-x me-2"></i>
                  Find Expiring Items
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={(e) => { e.preventDefault(); fetchExpiringItems(); }} className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="expiringThreshold" className="form-label">Threshold Date</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      id="expiringThreshold"
                      value={expiringThreshold}
                      onChange={(e) => setExpiringThreshold(e.target.value)}
                      placeholder="Leave empty for default (next month)"
                    />
                    <small className="text-muted">Items expiring on or before this date will be shown</small>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary btn-lg w-100" disabled={expiringLoading}>
                      {expiringLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Find Expiring
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Expiring Items
                </h5>
              </div>
              <div className="card-body">
                {expiringLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : expiringItems.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-check-circle display-1 text-success"></i>
                    <p className="mt-3 text-muted">No items expiring soon. Great job managing inventory!</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Product ID</th>
                          <th className="text-end">Quantity</th>
                          <th>Batch ID</th>
                          <th>Expiration Date</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expiringItems.map((item) => (
                          <tr key={item.id} className={isExpired(item.expirationDate) ? 'table-danger' : ''}>
                            <td>Product #{item.productId}</td>
                            <td className="text-end">
                              <strong>{item.quantity}</strong> {item.unitOfMeasure}
                            </td>
                            <td>
                              <code className="text-primary">{item.batchId || 'N/A'}</code>
                            </td>
                            <td>
                              {formatDate(item.expirationDate)}
                              {isExpired(item.expirationDate) && (
                                <>
                                  <br />
                                  <span className="badge bg-danger">EXPIRED</span>
                                </>
                              )}
                              {isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && (
                                <>
                                  <br />
                                  <span className="badge bg-warning">Expiring Soon</span>
                                </>
                              )}
                            </td>
                            <td className="text-center">
                              {isExpired(item.expirationDate) ? (
                                <span className="badge bg-danger">Expired</span>
                              ) : (
                                <span className="badge bg-warning">Expiring Soon</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unit Converter Tab */}
        {activeTab === 'converter' && (
          <div>
            <div className="card shadow-sm border-0">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">
                  <i className="bi bi-arrow-left-right me-2"></i>
                  Unit Converter
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleConvertUnits}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="converterProductId" className="form-label fw-semibold">
                        Product ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="converterProductId"
                        min="1"
                        value={converterData.productId}
                        onChange={(e) => setConverterData({ ...converterData, productId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="converterQuantity" className="form-label fw-semibold">
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="converterQuantity"
                        step="0.01"
                        min="0"
                        value={converterData.quantity}
                        onChange={(e) => setConverterData({ ...converterData, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="converterFromUnit" className="form-label fw-semibold">
                        From Unit <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="converterFromUnit"
                        value={converterData.fromUnit}
                        onChange={(e) => setConverterData({ ...converterData, fromUnit: e.target.value })}
                        required
                      >
                        <option value="unit">Unit</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="gram">Gram</option>
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                        <option value="lb">Pound (lb)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="converterToUnit" className="form-label fw-semibold">
                        To Unit <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="converterToUnit"
                        value={converterData.toUnit}
                        onChange={(e) => setConverterData({ ...converterData, toUnit: e.target.value })}
                        required
                      >
                        <option value="unit">Unit</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="gram">Gram</option>
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                        <option value="lb">Pound (lb)</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-info btn-lg text-white" disabled={converterLoading}>
                      {converterLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Converting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-arrow-left-right me-2"></i>
                          Convert Units
                        </>
                      )}
                    </button>
                  </div>
                  {converterError && (
                    <div className="alert alert-danger mt-3 d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {converterError}
                    </div>
                  )}
                  {convertedValue !== null && (
                    <div className="alert alert-success mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Conversion Result:</strong>
                          <br />
                          <span className="display-6 text-success">
                            {convertedValue.toFixed(2)} {converterData.toUnit}
                          </span>
                          <br />
                          <small className="text-muted">
                            {converterData.quantity} {converterData.fromUnit} = {convertedValue.toFixed(2)} {converterData.toUnit}
                          </small>
                        </div>
                        <i className="bi bi-check-circle display-4 text-success"></i>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDetailPage;
