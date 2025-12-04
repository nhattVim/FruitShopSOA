// frontend/src/components/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { createProduct, getAllCategories } from '../api/apiService';

const AddProduct = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
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
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
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
                  value={product.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
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
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description (optional)"
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
                  value={product.categoryId}
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
                value={product.imageUrl}
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
          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || loadingCategories}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Adding Product...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Add Product
                </>
              )}
            </button>
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
              Product added successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;