import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductManagementPage from './pages/ProductManagementPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import InventoryDetailPage from './pages/InventoryDetailPage'; // Import InventoryDetailPage
import './App.css'; // Keep existing styles for now

// Placeholder Components - these will be replaced later
const Home = () => (
  <div>
    <h2>Welcome to Fruit Shop Management</h2>
    <p>Use the navigation above to manage products, categories, and more.</p>
  </div>
);
const NotFound = () => (
  <div>
    <h2>404 Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductManagementPage />} />
            <Route path="/categories" element={<CategoryManagementPage />} />
            <Route path="/inventory" element={<InventoryDetailPage />} /> {/* Use the new component */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



