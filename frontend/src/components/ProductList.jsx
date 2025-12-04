// frontend/src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../api/apiService';
// import './ProductList.css'; // Removed, using Bootstrap

const ProductList = ({ onEditProduct, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]); // Re-fetch products when refreshTrigger changes

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh the list after deletion
      } catch (err) {
        setError('Failed to delete product.');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-circle me-2"></i>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-list-ul me-2"></i>
          All Products
        </h5>
        <button className="btn btn-sm btn-outline-primary" onClick={fetchProducts}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>
      <div className="card-body">
        {products.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <p className="mt-3 text-muted">No products found. Add your first product to get started!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Image</th>
                  <th>Category</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><strong>#{product.id}</strong></td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>
                      <small className="text-muted">
                        {product.description || <em>No description</em>}
                      </small>
                    </td>
                    <td className="text-end">
                      <span className="fw-bold text-success">
                        ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                      </span>
                    </td>
                    <td className="text-center">
                      {product.imageUrl ? (
                        <a
                          href={product.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-info"
                          title="View Image"
                        >
                          <i className="bi bi-image"></i>
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary">Category #{product.categoryId}</span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit Product"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Product"
                      >
                        <i className="bi bi-trash me-1"></i>
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

export default ProductList;