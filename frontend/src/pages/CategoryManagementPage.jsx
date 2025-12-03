// frontend/src/pages/CategoryManagementPage.jsx
import React, { useState } from 'react';
import CategoryList from '../components/CategoryList';
import AddCategory from '../components/AddCategory';
import EditCategory from '../components/EditCategory';
// import './CategoryManagementPage.css'; // Removed, using Bootstrap

const CategoryManagementPage = () => {
  const [editingCategory, setEditingCategory] = useState(null); // Stores category object being edited
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0); // Used to trigger CategoryList refresh

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleCategoryAdded = () => {
    setShowAddCategoryForm(false); // Hide form after adding
    triggerRefresh(); // Refresh list
  };

  const handleCategoryUpdated = () => {
    setEditingCategory(null); // Hide edit form after updating
    triggerRefresh(); // Refresh list
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowAddCategoryForm(false); // Hide add form if showing
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Category Management</h2>

      <div className="mb-3 d-flex justify-content-end">
        <button className="btn btn-success me-2" onClick={() => {
          setShowAddCategoryForm(true);
          setEditingCategory(null); // Ensure edit form is hidden
        }}>
          Add New Category
        </button>
        <button className="btn btn-info" onClick={() => {
          setShowAddCategoryForm(false);
          setEditingCategory(null); // Ensure edit form is hidden
        }}>
          View All Categories
        </button>
      </div>

      {showAddCategoryForm && (
        <AddCategory onCategoryAdded={handleCategoryAdded} />
      )}

      {editingCategory && (
        <EditCategory
          categoryId={editingCategory.id}
          onCategoryUpdated={handleCategoryUpdated}
          onCancelEdit={handleCancelEdit}
        />
      )}

      {!showAddCategoryForm && !editingCategory && (
        <CategoryList onEditCategory={handleEditCategory} refreshTrigger={refreshCounter} />
      )}
    </div>
  );
};

export default CategoryManagementPage;
