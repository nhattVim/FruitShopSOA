// frontend/src/pages/PricingPromotionPage.jsx
import React, { useState } from 'react';
import SetPrice from '../components/SetPrice';
import CreatePromotion from '../components/CreatePromotion';
import CreateVoucher from '../components/CreateVoucher';
import { getProductPrice, applyPromotion, applyVoucher } from '../api/apiService';

const PricingPromotionPage = () => {
  const [showForm, setShowForm] = useState('none'); // 'setPrice', 'createPromotion', 'createVoucher', 'viewPricing', 'applyPromotion', 'applyVoucher'
  
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


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Pricing & Promotion Management</h2>

      <div className="mb-3 d-flex justify-content-start flex-wrap">
        <button className="btn btn-primary me-2 mb-2" onClick={() => setShowForm('setPrice')}>Set Product Price</button>
        <button className="btn btn-primary me-2 mb-2" onClick={() => setShowForm('createPromotion')}>Create Promotion</button>
        <button className="btn btn-primary me-2 mb-2" onClick={() => setShowForm('createVoucher')}>Create Voucher</button>
        <button className="btn btn-info me-2 mb-2" onClick={() => setShowForm('viewPricing')}>View Pricing/Promotions</button>
      </div>

      {showForm === 'setPrice' && <SetPrice onPriceSet={() => setShowForm('none')} />}
      {showForm === 'createPromotion' && <CreatePromotion onPromotionCreated={() => setShowForm('none')} />}
      {showForm === 'createVoucher' && <CreateVoucher onVoucherCreated={() => setShowForm('none')} />}
      
      {showForm === 'viewPricing' && (
        <div className="card my-4">
          <div className="card-header">
            <h3>View Pricing & Apply Promotions/Vouchers</h3>
          </div>
          <div className="card-body">
            {/* View Product Price */}
            <h4 className="mt-3">Get Product Price</h4>
            <form onSubmit={handleViewProductPrice} className="d-flex mb-3">
                <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Enter Product ID"
                    value={viewPriceProductId}
                    onChange={(e) => setViewPriceProductId(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-secondary" disabled={viewPriceLoading}>
                    {viewPriceLoading ? 'Loading...' : 'Get Price'}
                </button>
            </form>
            {viewPriceError && <div className="alert alert-danger">{viewPriceError}</div>}
            {productPrice && (
                <div className="alert alert-info">
                    Current Price for Product ID {productPrice.productId}: ${productPrice.currentPrice.toFixed(2)} (Valid from {new Date(productPrice.startDate).toLocaleDateString()} to {new Date(productPrice.endDate).toLocaleDateString()})
                </div>
            )}

            {/* Apply Promotion */}
            <h4 className="mt-3">Apply Promotion to Product</h4>
            <form onSubmit={handleApplyPromotion} className="d-flex mb-3">
                <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Product ID"
                    value={applyPromoProductId}
                    onChange={(e) => setApplyPromoProductId(e.target.value)}
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    className="form-control me-2"
                    placeholder="Original Price"
                    value={applyPromoOriginalPrice}
                    onChange={(e) => setApplyPromoOriginalPrice(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-secondary" disabled={applyPromoLoading}>
                    {applyPromoLoading ? 'Applying...' : 'Apply Promotion'}
                </button>
            </form>
            {applyPromoError && <div className="alert alert-danger">{applyPromoError}</div>}
            {appliedPromoPrice !== null && (
                <div className="alert alert-info">
                    Price after promotion: ${appliedPromoPrice.toFixed(2)}
                </div>
            )}

            {/* Apply Voucher */}
            <h4 className="mt-3">Apply Voucher to Order</h4>
            <form onSubmit={handleApplyVoucher} className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Voucher Code"
                    value={applyVoucherCode}
                    onChange={(e) => setApplyVoucherCode(e.target.value)}
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    className="form-control me-2"
                    placeholder="Order Total"
                    value={applyVoucherOrderTotal}
                    onChange={(e) => setApplyVoucherOrderTotal(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-secondary" disabled={applyVoucherLoading}>
                    {applyVoucherLoading ? 'Applying...' : 'Apply Voucher'}
                </button>
            </form>
            {applyVoucherError && <div className="alert alert-danger">{applyVoucherError}</div>}
            {appliedVoucherTotal !== null && (
                <div className="alert alert-info">
                    Order Total after voucher: ${appliedVoucherTotal.toFixed(2)}
                </div>
            )}

          </div>
        </div>
      )}

      {/* Reset view */}
      {showForm !== 'none' && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-secondary" onClick={() => setShowForm('none')}>Back to Main Pricing Page</button>
        </div>
      )}
    </div>
  );
};

export default PricingPromotionPage;