// frontend2/src/pages/ProductManagementPage.jsx
import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import AddProduct from '../components/AddProduct';
import EditProduct from '../components/EditProduct';
import './ProductManagementPage.css'; // For basic styling of the page

const ProductManagementPage = () => {
  const [editingProduct, setEditingProduct] = useState(null); // Stores product object being edited
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0); // Used to trigger ProductList refresh

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleProductAdded = () => {
    setShowAddProductForm(false); // Hide form after adding
    triggerRefresh(); // Refresh list
  };

  const handleProductUpdated = () => {
    setEditingProduct(null); // Hide edit form after updating
    triggerRefresh(); // Refresh list
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProductForm(false); // Hide add form if showing
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="product-management-page">
      <h2>Product Management</h2>

      <div className="action-buttons">
        <button onClick={() => {
          setShowAddProductForm(true);
          setEditingProduct(null); // Ensure edit form is hidden
        }}>Add New Product</button>
        <button onClick={() => {
          setShowAddProductForm(false);
          setEditingProduct(null); // Ensure edit form is hidden
        }}>View All Products</button>
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
