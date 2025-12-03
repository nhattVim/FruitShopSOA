// frontend2/src/components/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../api/apiService';
import './CategoryList.css'; // Assuming you'll create this for basic styling

const CategoryList = ({ onEditCategory, refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]); // Re-fetch categories when refreshTrigger changes

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories(); // Refresh the list after deletion
      } catch (err) {
        setError('Failed to delete category.');
        console.error('Error deleting category:', err);
      }
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="category-list-container">
      <h3>Available Categories</h3>
      {categories.length === 0 ? (
        <p>No categories found. Add some!</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button onClick={() => onEditCategory(category)}>Edit</button>
                  <button onClick={() => handleDelete(category.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryList;