// frontend2/src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../api/apiService';
import './ProductList.css'; // Assuming you'll create this for basic styling

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

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="product-list-container">
      <h3>Available Products</h3>
      {products.length === 0 ? (
        <p>No products found. Add some!</p>
      ) : (
        <table className="product-table">
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
                <td><a href={product.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></td>
                <td>{product.categoryId}</td>
                <td>
                  <button onClick={() => onEditProduct(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;