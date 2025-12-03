// frontend2/src/components/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { getProductById, updateProduct } from '../api/apiService';
import './EditProduct.css'; // Assuming you'll create this for basic styling

const EditProduct = ({ productId, onProductUpdated, onCancelEdit }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError('Failed to fetch product for editing.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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

    if (!product.name || !product.price || !product.categoryId) {
      setError('Name, Price, and Category ID are required.');
      setLoading(false);
      return;
    }

    try {
      const productToUpdate = {
        ...product,
        price: parseFloat(product.price),
        categoryId: parseInt(product.categoryId, 10),
      };
      await updateProduct(productId, productToUpdate);
      setSuccess(true);
      if (onProductUpdated) {
        onProductUpdated(); // Notify parent to refresh list
      }
    } catch (err) {
      setError('Failed to update product. Please check your input and try again.');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!product) return <div>Product not found or invalid ID.</div>;

  return (
    <div className="edit-product-container">
      <h3>Edit Product (ID: {productId})</h3>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price || ''}
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
            value={product.imageUrl || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryId">Category ID:</label>
          <input
            type="number"
            id="categoryId"
            name="categoryId"
            value={product.categoryId || ''}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
        {onCancelEdit && (
          <button type="button" onClick={onCancelEdit} className="cancel-button">
            Cancel
          </button>
        )}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Product updated successfully!</p>}
      </form>
    </div>
  );
};

export default EditProduct;