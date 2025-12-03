// frontend2/src/components/EditCategory.jsx
import React, { useState, useEffect } from 'react';
import { getCategoryById, updateCategory } from '../api/apiService';
import './EditCategory.css'; // Assuming you'll create this for basic styling

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

  if (loading) return <div>Loading category details...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!category) return <div>Category not found or invalid ID.</div>;

  return (
    <div className="edit-category-container">
      <h3>Edit Category (ID: {categoryId})</h3>
      <form onSubmit={handleSubmit} className="edit-category-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={category.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={category.description || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Category'}
        </button>
        {onCancelEdit && (
          <button type="button" onClick={onCancelEdit} className="cancel-button">
            Cancel
          </button>
        )}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Category updated successfully!</p>}
      </form>
    </div>
  );
};

export default EditCategory;