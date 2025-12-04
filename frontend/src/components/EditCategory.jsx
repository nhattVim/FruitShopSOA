// frontend/src/components/EditCategory.jsx
import React, { useState, useEffect } from 'react';
import { getCategoryById, updateCategory } from '../api/apiService';
// import './EditCategory.css'; // Removed, using Bootstrap

const EditCategory = ({ categoryId, onCategoryUpdated, onCancelEdit }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await getCategoryById(categoryId);
        setCategory(data);
      } catch (err) {
        setError('Failed to fetch category for editing.');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

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

    if (!category.name) {
      setError('Category Name is required.');
      setLoading(false);
      return;
    }

    try {
      await updateCategory(categoryId, category);
      setSuccess(true);
      if (onCategoryUpdated) {
        onCategoryUpdated(); // Notify parent to refresh list
      }
    } catch (err) {
      setError('Failed to update category. Please check your input and try again.');
      console.error('Error updating category:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading category details...</p>
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

  if (!category) {
    return (
      <div className="alert alert-warning d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <div>Category not found or invalid ID.</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-warning text-dark">
        <h4 className="mb-0">
          <i className="bi bi-pencil-square me-2"></i>
          Edit Category (ID: {categoryId})
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
                value={category.name || ''}
                onChange={handleChange}
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
                value={category.description || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-warning btn-lg flex-fill" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Update Category
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
              Category updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditCategory;