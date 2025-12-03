// frontend/src/components/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../api/apiService';
// import './CategoryList.css'; // Removed, using Bootstrap

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

  if (loading) return <div className="text-center my-4">Loading categories...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

  return (
    <div className="card my-4">
      <div className="card-header">
        <h3>Available Categories</h3>
      </div>
      <div className="card-body">
        {categories.length === 0 ? (
          <p className="text-center">No categories found. Add some!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
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
                      <button onClick={() => onEditCategory(category)} className="btn btn-sm btn-primary me-2">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
