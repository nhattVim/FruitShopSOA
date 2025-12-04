// frontend/src/components/AddCategory.jsx
import React, { useState } from 'react';
import { createCategory } from '../api/apiService';
// import './AddCategory.css'; // Removed, using Bootstrap

const AddCategory = ({ onCategoryAdded }) => {
  const [category, setCategory] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!category.name) {
      setError('Category Name is required.');
      setLoading(false);
      return;
    }

    try {
      await createCategory(category);
      setSuccess(true);
      setCategory({
        name: '',
        description: '',
      }); // Clear form
      if (onCategoryAdded) {
        onCategoryAdded(); // Notify parent to refresh list
      }
    } catch (err) {
      setError('Failed to add category. Please check your input and try again.');
      console.error('Error adding category:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Category
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label fw-semibold">
                Category Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                value={category.description}
                onChange={handleChange}
                placeholder="Enter category description (optional)"
              />
            </div>
          </div>
          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Adding Category...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Add Category
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
              Category added successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCategory;