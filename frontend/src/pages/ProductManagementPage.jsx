// frontend/src/pages/ProductManagementPage.jsx
import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import AddProduct from '../components/AddProduct';
import EditProduct from '../components/EditProduct';

const ProductManagementPage = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleProductAdded = () => {
    setShowAddProductForm(false);
    triggerRefresh();
  };

  const handleProductUpdated = () => {
    setEditingProduct(null);
    triggerRefresh();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProductForm(false);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-box-seam me-2"></i>
          Product Management
        </h2>
        <div>
          {!showAddProductForm && !editingProduct ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                setShowAddProductForm(true);
                setEditingProduct(null);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Product
            </button>
          ) : (
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => {
                setShowAddProductForm(false);
                setEditingProduct(null);
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Products
            </button>
          )}
        </div>
      </div>

      {showAddProductForm && (
        <AddProduct onProductAdded={handleProductAdded} />
      )}

      {editingProduct && (
        <EditProduct
          productId={editingProduct.id}
          onProductUpdated={handleProductUpdated}
          onCancelEdit={handleCancelEdit}
        />
      )}

      {!showAddProductForm && !editingProduct && (
        <ProductList onEditProduct={handleEditProduct} refreshTrigger={refreshCounter} />
      )}
    </div>
  );
};

export default ProductManagementPage;
