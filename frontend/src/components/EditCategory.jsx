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

  if (loading) return <div className="text-center my-4">Loading category details...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  if (!category) return <div className="alert alert-warning" role="alert">Category not found or invalid ID.</div>;

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Edit Category (ID: {categoryId})</h3>
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
              value={category.name || ''}
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
              value={category.description || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {loading ? 'Updating...' : 'Update Category'}
          </button>
          {onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
              Cancel
            </button>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Category updated successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default EditCategory;