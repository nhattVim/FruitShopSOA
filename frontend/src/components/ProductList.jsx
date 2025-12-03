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

  if (loading) return <div className="text-center my-4">Loading products...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Available Products</h3>
      </div>
      <div className="card-body">
        {products.length === 0 ? (
          <p className="text-center">No products found. Add some!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image URL</th>
                  <th>Category ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price ? product.price.toFixed(2) : 'N/A'}</td>
                    <td>
                      {product.imageUrl && (
                        <a href={product.imageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">
                          View Image
                        </a>
                      )}
                    </td>
                    <td>{product.categoryId}</td>
                    <td>
                      <button onClick={() => onEditProduct(product)} className="btn btn-sm btn-primary me-2">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-danger">
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