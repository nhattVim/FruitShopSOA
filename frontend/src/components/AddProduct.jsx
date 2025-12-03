// frontend/src/components/AddProduct.jsx
import React, { useState } from 'react';
import { createProduct } from '../api/apiService';
// import './AddProduct.css'; // Removed, using Bootstrap

const AddProduct = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!product.name || !product.price || !product.categoryId) {
      setError('Name, Price, and Category ID are required.');
      setLoading(false);
      return;
    }

    try {
      // Convert price and categoryId to appropriate types
      const productToCreate = {
        ...product,
        price: parseFloat(product.price),
        categoryId: parseInt(product.categoryId, 10),
      };
      await createProduct(productToCreate);
      setSuccess(true);
      setProduct({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryId: '',
      }); // Clear form
      if (onProductAdded) {
        onProductAdded(); // Notify parent to refresh list
      }
    } catch (err) {
      setError('Failed to add product. Please check your input and try again.');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Add New Product</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price:</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">Image URL:</label>
            <input
              type="text"
              className="form-control"
              id="imageUrl"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">Category ID:</label>
            <input
              type="number"
              className="form-control"
              id="categoryId"
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Product added successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;