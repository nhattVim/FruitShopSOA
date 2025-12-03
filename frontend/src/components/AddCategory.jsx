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
    <div className="card my-4">
      <div className="card-header">
        <h3>Add New Category</h3>
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
              value={category.name}
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
              value={category.description}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">Category added successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default AddCategory;