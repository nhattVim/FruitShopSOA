// frontend/src/components/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { getProductById, updateProduct, getAllCategories } from '../api/apiService';

const EditProduct = ({ productId, onProductUpdated, onCancelEdit }) => {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, categoriesData] = await Promise.all([
          getProductById(productId),
          getAllCategories()
        ]);
        setProduct(productData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        setError('Failed to fetch product for editing.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };
    if (productId) {
      fetchData();
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
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!product.name || !product.price || !product.categoryId) {
      setError('Name, Price, and Category ID are required.');
      setSubmitting(false);
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
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading product details...</p>
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

  if (!product) {
    return (
      <div className="alert alert-warning d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <div>Product not found or invalid ID.</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-warning text-dark">
        <h4 className="mb-0">
          <i className="bi bi-pencil-square me-2"></i>
          Edit Product (ID: {productId})
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">
                Product Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="name"
                name="name"
                value={product.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="price" className="form-label fw-semibold">
                Price <span className="text-danger">*</span>
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={product.price || ''}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={product.description || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="categoryId" className="form-label fw-semibold">
                Category <span className="text-danger">*</span>
              </label>
              {loadingCategories ? (
                <div className="form-control">
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Loading categories...
                </div>
              ) : (
                <select
                  className="form-select form-select-lg"
                  id="categoryId"
                  name="categoryId"
                  value={product.categoryId || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} (ID: {category.id})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="imageUrl" className="form-label fw-semibold">Image URL</label>
              <input
                type="url"
                className="form-control form-control-lg"
                id="imageUrl"
                name="imageUrl"
                value={product.imageUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {product.imageUrl && (
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Preview: <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a>
                </small>
              )}
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-warning btn-lg flex-fill" disabled={submitting || loadingCategories}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Update Product
                </>
              )}
            </button>
            {onCancelEdit && (
              <button type="button" onClick={onCancelEdit} className="btn btn-outline-secondary btn-lg">
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
            )}
          </div>
          {error && (
            <div className="alert alert-danger mt-3 d-flex align-items-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success mt-3 d-flex align-items-center">
              <i className="bi bi-check-circle me-2"></i>
              Product updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProduct;