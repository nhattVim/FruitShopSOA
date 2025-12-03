// frontend/src/components/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { getProductById, updateProduct } from '../api/apiService';
// import './EditProduct.css'; // Removed, using Bootstrap

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

  if (loading) return <div className="text-center my-4">Loading product details...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  if (!product) return <div className="alert alert-warning" role="alert">Product not found or invalid ID.</div>;

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Edit Product (ID: {productId})</h3>
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
              value={product.name || ''}
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
              value={product.description || ''}
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
              value={product.price || ''}
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
              value={product.imageUrl || ''}
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
              value={product.categoryId || ''}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          {onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
              Cancel
            </button>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Product updated successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default EditProduct;