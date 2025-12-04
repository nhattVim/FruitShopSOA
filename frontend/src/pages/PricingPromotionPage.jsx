// frontend/src/pages/PricingPromotionPage.jsx
import React, { useState, useEffect } from 'react';
import SetPrice from '../components/SetPrice';
import CreatePromotion from '../components/CreatePromotion';
import CreateVoucher from '../components/CreateVoucher';
import { 
  getProductPrice, 
  applyPromotion, 
  applyVoucher,
  getAllPromotions,
  getAllVouchers,
  getAllProducts
} from '../api/apiService';

const PricingPromotionPage = () => {
  const [activeTab, setActiveTab] = useState('pricing'); // 'pricing', 'promotions', 'vouchers', 'tools'
  const [showCreateForm, setShowCreateForm] = useState(null); // 'price', 'promotion', 'voucher'
  
  // State for View Product Price
  const [viewPriceProductId, setViewPriceProductId] = useState('');
  const [productPrice, setProductPrice] = useState(null);
  const [viewPriceLoading, setViewPriceLoading] = useState(false);
  const [viewPriceError, setViewPriceError] = useState(null);

  // State for Apply Promotion
  const [applyPromoProductId, setApplyPromoProductId] = useState('');
  const [applyPromoOriginalPrice, setApplyPromoOriginalPrice] = useState('');
  const [appliedPromoPrice, setAppliedPromoPrice] = useState(null);
  const [applyPromoLoading, setApplyPromoLoading] = useState(false);
  const [applyPromoError, setApplyPromoError] = useState(null);

  // State for Apply Voucher
  const [applyVoucherCode, setApplyVoucherCode] = useState('');
  const [applyVoucherOrderTotal, setApplyVoucherOrderTotal] = useState('');
  const [appliedVoucherTotal, setAppliedVoucherTotal] = useState(null);
  const [applyVoucherLoading, setApplyVoucherLoading] = useState(false);
  const [applyVoucherError, setApplyVoucherError] = useState(null);

  // State for lists
  const [promotions, setPromotions] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch data when tabs change
  useEffect(() => {
    if (activeTab === 'promotions') {
      fetchPromotions();
    } else if (activeTab === 'vouchers') {
      fetchVouchers();
    } else if (activeTab === 'pricing') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchPromotions = async () => {
    try {
      setLoadingPromotions(true);
      const data = await getAllPromotions();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setPromotions([]);
    } finally {
      setLoadingPromotions(false);
    }
  };

  const fetchVouchers = async () => {
    try {
      setLoadingVouchers(true);
      const data = await getAllVouchers();
      setVouchers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching vouchers:', err);
      setVouchers([]);
    } finally {
      setLoadingVouchers(false);
    }
  };

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

  const handleViewProductPrice = async (e) => {
    e.preventDefault();
    setViewPriceLoading(true);
    setViewPriceError(null);
    setProductPrice(null);
    if (!viewPriceProductId) {
      setViewPriceError('Product ID is required.');
      setViewPriceLoading(false);
      return;
    }
    try {
      const price = await getProductPrice(parseInt(viewPriceProductId, 10));
      setProductPrice(price);
    } catch (err) {
      setViewPriceError(`Failed to fetch product price: ${err.response?.data || err.message}`);
      console.error('Error fetching product price:', err);
    } finally {
      setViewPriceLoading(false);
    }
  };

  const handleApplyPromotion = async (e) => {
    e.preventDefault();
    setApplyPromoLoading(true);
    setApplyPromoError(null);
    setAppliedPromoPrice(null);
    if (!applyPromoProductId || !applyPromoOriginalPrice) {
      setApplyPromoError('Product ID and Original Price are required.');
      setApplyPromoLoading(false);
      return;
    }
    try {
      const finalPrice = await applyPromotion(parseInt(applyPromoProductId, 10), parseFloat(applyPromoOriginalPrice));
      setAppliedPromoPrice(finalPrice);
    } catch (err) {
      setApplyPromoError(`Failed to apply promotion: ${err.response?.data || err.message}`);
      console.error('Error applying promotion:', err);
    } finally {
      setApplyPromoLoading(false);
    }
  };

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    setApplyVoucherLoading(true);
    setApplyVoucherError(null);
    setAppliedVoucherTotal(null);
    if (!applyVoucherCode || !applyVoucherOrderTotal) {
      setApplyVoucherError('Voucher Code and Order Total are required.');
      setApplyVoucherLoading(false);
      return;
    }
    try {
      const finalTotal = await applyVoucher(applyVoucherCode, parseFloat(applyVoucherOrderTotal));
      setAppliedVoucherTotal(finalTotal);
    } catch (err) {
      setApplyVoucherError(`Failed to apply voucher: ${err.response?.data || err.message}`);
      console.error('Error applying voucher:', err);
    } finally {
      setApplyVoucherLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const isActive = (dateString) => {
    if (!dateString) return false;
    try {
      const date = new Date(dateString);
      return date > new Date();
    } catch {
      return false;
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-currency-dollar me-2"></i>
          Pricing & Promotion Management
        </h2>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
            type="button"
          >
            <i className="bi bi-tag me-2"></i>
            Product Pricing
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('promotions')}
            type="button"
          >
            <i className="bi bi-percent me-2"></i>
            Promotions
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'vouchers' ? 'active' : ''}`}
            onClick={() => setActiveTab('vouchers')}
            type="button"
          >
            <i className="bi bi-ticket-perforated me-2"></i>
            Vouchers
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
            type="button"
          >
            <i className="bi bi-tools me-2"></i>
            Tools
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Product Pricing</h4>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(showCreateForm === 'price' ? null : 'price')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                {showCreateForm === 'price' ? 'Cancel' : 'Set Product Price'}
              </button>
            </div>

            {showCreateForm === 'price' && (
              <div className="mb-4">
                <SetPrice onPriceSet={() => {
                  setShowCreateForm(null);
                  fetchProducts();
                }} />
              </div>
            )}

            {/* Product Price Lookup */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-search me-2"></i>
                  Lookup Product Price
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleViewProductPrice} className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="viewPriceProductId" className="form-label">Product</label>
                    <select
                      className="form-select"
                      id="viewPriceProductId"
                      value={viewPriceProductId}
                      onChange={(e) => setViewPriceProductId(e.target.value)}
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
                    <button type="submit" className="btn btn-primary w-100" disabled={viewPriceLoading}>
                      {viewPriceLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Get Price
                        </>
                      )}
                    </button>
                  </div>
                </form>
                {viewPriceError && (
                  <div className="alert alert-danger mt-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {viewPriceError}
                  </div>
                )}
                {productPrice && (
                  <div className="alert alert-success mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Product ID {productPrice.productId}</strong>
                        <br />
                        <span className="display-6 text-success">
                          ${productPrice.currentPrice?.toFixed(2) || '0.00'}
                        </span>
                        <br />
                        <small className="text-muted">
                          Valid: {formatDate(productPrice.startDate)} - {formatDate(productPrice.endDate)}
                        </small>
                      </div>
                      <i className="bi bi-check-circle display-4 text-success"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Promotions</h4>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(showCreateForm === 'promotion' ? null : 'promotion')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                {showCreateForm === 'promotion' ? 'Cancel' : 'Create Promotion'}
              </button>
            </div>

            {showCreateForm === 'promotion' && (
              <div className="mb-4">
                <CreatePromotion onPromotionCreated={() => {
                  setShowCreateForm(null);
                  fetchPromotions();
                }} />
              </div>
            )}

            {/* Promotions List */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  All Promotions
                </h5>
                <button className="btn btn-sm btn-outline-primary" onClick={fetchPromotions}>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </button>
              </div>
              <div className="card-body">
                {loadingPromotions ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : promotions.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                    <p className="mt-3 text-muted">No promotions found. Create your first promotion!</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Value</th>
                          <th>Products</th>
                          <th>Valid Period</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promotions.map((promo) => (
                          <tr key={promo.id}>
                            <td>
                              <strong>{promo.name}</strong>
                              {promo.description && (
                                <>
                                  <br />
                                  <small className="text-muted">{promo.description}</small>
                                </>
                              )}
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {promo.type || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <strong className="text-success">
                                {promo.type === 'PercentageDiscount' ? `${(promo.value * 100).toFixed(0)}%` : `$${promo.value?.toFixed(2)}`}
                              </strong>
                            </td>
                            <td>
                              {promo.productIds && promo.productIds.length > 0 ? (
                                <span className="badge bg-secondary">
                                  {promo.productIds.length} product(s)
                                </span>
                              ) : (
                                <span className="text-muted">All products</span>
                              )}
                            </td>
                            <td>
                              <small>
                                {formatDate(promo.startDate)}<br />
                                to {formatDate(promo.endDate)}
                              </small>
                            </td>
                            <td>
                              {isActive(promo.endDate) ? (
                                <span className="badge bg-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary">Expired</span>
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

            {/* Apply Promotion Tool */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-calculator me-2"></i>
                  Calculate Promotion Price
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleApplyPromotion} className="row g-3">
                  <div className="col-md-4">
                    <label htmlFor="applyPromoProductId" className="form-label">Product ID</label>
                    <input
                      type="number"
                      className="form-control"
                      id="applyPromoProductId"
                      placeholder="Product ID"
                      value={applyPromoProductId}
                      onChange={(e) => setApplyPromoProductId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="applyPromoOriginalPrice" className="form-label">Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="applyPromoOriginalPrice"
                      placeholder="0.00"
                      value={applyPromoOriginalPrice}
                      onChange={(e) => setApplyPromoOriginalPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100" disabled={applyPromoLoading}>
                      {applyPromoLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Calculating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-calculator me-2"></i>
                          Calculate
                        </>
                      )}
                    </button>
                  </div>
                </form>
                {applyPromoError && (
                  <div className="alert alert-danger mt-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {applyPromoError}
                  </div>
                )}
                {appliedPromoPrice !== null && (
                  <div className="alert alert-success mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Price After Promotion:</strong>
                        <br />
                        <span className="display-6 text-success">
                          ${appliedPromoPrice.toFixed(2)}
                        </span>
                        <br />
                        <small className="text-muted">
                          Original: ${parseFloat(applyPromoOriginalPrice).toFixed(2)} | 
                          Savings: ${(parseFloat(applyPromoOriginalPrice) - appliedPromoPrice).toFixed(2)}
                        </small>
                      </div>
                      <i className="bi bi-tag display-4 text-success"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vouchers Tab */}
        {activeTab === 'vouchers' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Vouchers</h4>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(showCreateForm === 'voucher' ? null : 'voucher')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                {showCreateForm === 'voucher' ? 'Cancel' : 'Create Voucher'}
              </button>
            </div>

            {showCreateForm === 'voucher' && (
              <div className="mb-4">
                <CreateVoucher onVoucherCreated={() => {
                  setShowCreateForm(null);
                  fetchVouchers();
                }} />
              </div>
            )}

            {/* Vouchers List */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  All Vouchers
                </h5>
                <button className="btn btn-sm btn-outline-primary" onClick={fetchVouchers}>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </button>
              </div>
              <div className="card-body">
                {loadingVouchers ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : vouchers.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                    <p className="mt-3 text-muted">No vouchers found. Create your first voucher!</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Code</th>
                          <th>Type</th>
                          <th>Value</th>
                          <th>Min Order</th>
                          <th>Usage Limit</th>
                          <th>Valid Period</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vouchers.map((voucher) => (
                          <tr key={voucher.id}>
                            <td>
                              <code className="text-primary fs-5">{voucher.code}</code>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {voucher.discountType || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <strong className="text-success">
                                {voucher.discountType === 'PERCENTAGE' ? `${voucher.value}%` : `$${voucher.value?.toFixed(2)}`}
                              </strong>
                            </td>
                            <td>
                              {voucher.minOrderAmount ? (
                                <span>${voucher.minOrderAmount.toFixed(2)}</span>
                              ) : (
                                <span className="text-muted">No minimum</span>
                              )}
                            </td>
                            <td>
                              <span className="badge bg-secondary">
                                {voucher.usageLimit || 'Unlimited'}
                              </span>
                            </td>
                            <td>
                              <small>
                                {formatDate(voucher.validFrom)}<br />
                                to {formatDate(voucher.validUntil)}
                              </small>
                            </td>
                            <td>
                              {voucher.active && isActive(voucher.validUntil) ? (
                                <span className="badge bg-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary">Inactive</span>
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

            {/* Apply Voucher Tool */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-calculator me-2"></i>
                  Calculate Voucher Discount
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleApplyVoucher} className="row g-3">
                  <div className="col-md-4">
                    <label htmlFor="applyVoucherCode" className="form-label">Voucher Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="applyVoucherCode"
                      placeholder="Enter voucher code"
                      value={applyVoucherCode}
                      onChange={(e) => setApplyVoucherCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="applyVoucherOrderTotal" className="form-label">Order Total</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="applyVoucherOrderTotal"
                      placeholder="0.00"
                      value={applyVoucherOrderTotal}
                      onChange={(e) => setApplyVoucherOrderTotal(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100" disabled={applyVoucherLoading}>
                      {applyVoucherLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Calculating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-calculator me-2"></i>
                          Calculate
                        </>
                      )}
                    </button>
                  </div>
                </form>
                {applyVoucherError && (
                  <div className="alert alert-danger mt-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {applyVoucherError}
                  </div>
                )}
                {appliedVoucherTotal !== null && (
                  <div className="alert alert-success mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Order Total After Voucher:</strong>
                        <br />
                        <span className="display-6 text-success">
                          ${appliedVoucherTotal.toFixed(2)}
                        </span>
                        <br />
                        <small className="text-muted">
                          Original: ${parseFloat(applyVoucherOrderTotal).toFixed(2)} | 
                          Discount: ${(parseFloat(applyVoucherOrderTotal) - appliedVoucherTotal).toFixed(2)}
                        </small>
                      </div>
                      <i className="bi bi-ticket-perforated display-4 text-success"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div>
            <h4 className="mb-4">Pricing Tools</h4>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-search me-2"></i>
                      Price Lookup
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">Quickly look up product prices by product ID.</p>
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => setActiveTab('pricing')}
                    >
                      Go to Price Lookup
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-percent me-2"></i>
                      Promotion Calculator
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">Calculate final price after applying promotions.</p>
                    <button
                      className="btn btn-outline-success w-100"
                      onClick={() => setActiveTab('promotions')}
                    >
                      Go to Promotions
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Voucher Calculator
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">Calculate order total after applying vouchers.</p>
                    <button
                      className="btn btn-outline-info w-100"
                      onClick={() => setActiveTab('vouchers')}
                    >
                      Go to Vouchers
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Quick Help
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Set product prices with validity periods
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Create percentage or fixed discounts
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Manage voucher codes and usage limits
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPromotionPage;
