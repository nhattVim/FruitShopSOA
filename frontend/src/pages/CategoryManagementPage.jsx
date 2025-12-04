// frontend/src/pages/CategoryManagementPage.jsx
import React, { useState } from 'react';
import CategoryList from '../components/CategoryList';
import AddCategory from '../components/AddCategory';
import EditCategory from '../components/EditCategory';

const CategoryManagementPage = () => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleCategoryAdded = () => {
    setShowAddCategoryForm(false);
    triggerRefresh();
  };

  const handleCategoryUpdated = () => {
    setEditingCategory(null);
    triggerRefresh();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowAddCategoryForm(false);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-tags me-2"></i>
          Category Management
        </h2>
        <div>
          {!showAddCategoryForm && !editingCategory ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                setShowAddCategoryForm(true);
                setEditingCategory(null);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Category
            </button>
          ) : (
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => {
                setShowAddCategoryForm(false);
                setEditingCategory(null);
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Categories
            </button>
          )}
        </div>
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
