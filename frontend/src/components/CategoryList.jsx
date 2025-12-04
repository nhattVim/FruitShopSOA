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

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading categories...</p>
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

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-list-ul me-2"></i>
          All Categories
        </h5>
        <button className="btn btn-sm btn-outline-primary" onClick={fetchCategories}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>
      <div className="card-body">
        {categories.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <p className="mt-3 text-muted">No categories found. Add your first category to get started!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td><strong>#{category.id}</strong></td>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td>
                      <small className="text-muted">
                        {category.description || <em>No description</em>}
                      </small>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onEditCategory(category)}
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit Category"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Category"
                      >
                        <i className="bi bi-trash me-1"></i>
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
