import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import ProductManagementPage from "./pages/ProductManagementPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import InventoryDetailPage from "./pages/InventoryDetailPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PricingPromotionPage from "./pages/PricingPromotionPage";

const Home = () => (
    <div className="container-fluid mt-4">
        <div className="row">
            <div className="col-12">
                <div className="card shadow-sm border-0">
                    <div className="card-body text-center py-5">
                        <h1 className="display-4 mb-4">
                            <i className="bi bi-shop text-primary me-3"></i>
                            Fruit Shop Management System
                        </h1>
                        <p className="lead text-muted mb-4">
                            Manage your fruit shop operations with ease
                        </p>
                        <div className="row mt-5">
                            <div className="col-md-3 mb-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <i className="bi bi-box-seam display-4 text-primary mb-3"></i>
                                        <h5>Products</h5>
                                        <p className="text-muted small">Manage product catalog</p>
                                        <Link to="/products" className="btn btn-outline-primary btn-sm">
                                            Go to Products
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <i className="bi bi-receipt display-4 text-success mb-3"></i>
                                        <h5>Orders</h5>
                                        <p className="text-muted small">View and manage orders</p>
                                        <Link to="/orders" className="btn btn-outline-success btn-sm">
                                            Go to Orders
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <i className="bi bi-people display-4 text-info mb-3"></i>
                                        <h5>Customers</h5>
                                        <p className="text-muted small">Customer management</p>
                                        <Link to="/customers" className="btn btn-outline-info btn-sm">
                                            Go to Customers
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <i className="bi bi-currency-dollar display-4 text-warning mb-3"></i>
                                        <h5>Pricing</h5>
                                        <p className="text-muted small">Pricing & promotions</p>
                                        <Link to="/pricing" className="btn btn-outline-warning btn-sm">
                                            Go to Pricing
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const NotFound = () => (
    <div className="container-fluid mt-4">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm border-0 text-center">
                    <div className="card-body py-5">
                        <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
                        <h2>404 Not Found</h2>
                        <p className="text-muted">The page you are looking for does not exist.</p>
                        <Link to="/" className="btn btn-primary">
                            <i className="bi bi-house me-2"></i>
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                    <div className="container-fluid">
                        <Link className="navbar-brand fw-bold" to="/">
                            <i className="bi bi-shop me-2"></i>
                            Fruit Shop Admin
                        </Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <NavLink to="/" label="Home" icon="bi-house" />
                                <NavLink to="/products" label="Products" icon="bi-box-seam" />
                                <NavLink to="/categories" label="Categories" icon="bi-tags" />
                                <NavLink to="/inventory" label="Inventory" icon="bi-archive" />
                                <NavLink to="/customers" label="Customers" icon="bi-people" />
                                <NavLink to="/orders" label="Orders" icon="bi-receipt" />
                                <NavLink to="/pricing" label="Pricing" icon="bi-currency-dollar" />
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container-fluid mt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductManagementPage />} />
                        <Route path="/categories" element={<CategoryManagementPage />} />
                        <Route path="/inventory" element={<InventoryDetailPage />} />
                        <Route path="/customers" element={<CustomerManagementPage />} />
                        <Route path="/orders" element={<OrderManagementPage />} />
                        <Route path="/orders/:id" element={<OrderDetailPage />} />
                        <Route path="/pricing" element={<PricingPromotionPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

function NavLink({ to, label, icon }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <li className="nav-item">
            <Link 
                className={`nav-link ${isActive ? 'active fw-semibold' : ''}`} 
                to={to}
            >
                <i className={`${icon} me-1`}></i>
                {label}
            </Link>
        </li>
    );
}

export default App;
