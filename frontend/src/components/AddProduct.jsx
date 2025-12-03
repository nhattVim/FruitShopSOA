// frontend2/src/components/AddProduct.jsx
import React, { useState } from 'react';
import { createProduct } from '../api/apiService';
import './AddProduct.css'; // Assuming you'll create this for basic styling

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
    <div className="add-product-container">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryId">Category ID:</label>
          <input
            type="number"
            id="categoryId"
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Product added successfully!</p>}
      </form>
    </div>
  );
};

export default AddProduct;