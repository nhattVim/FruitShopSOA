// frontend2/src/components/AddCategory.jsx
import React, { useState } from 'react';
import { createCategory } from '../api/apiService';
import './AddCategory.css'; // Assuming you'll create this for basic styling

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
    <div className="add-category-container">
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit} className="add-category-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={category.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Category added successfully!</p>}
      </form>
    </div>
  );
};

export default AddCategory;