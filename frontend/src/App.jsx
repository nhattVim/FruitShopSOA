import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProductManagementPage from "./pages/ProductManagementPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import InventoryDetailPage from "./pages/InventoryDetailPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PricingPromotionPage from "./pages/PricingPromotionPage";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Home = () => {
    const { user, role } = useAuth();
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center py-5">
                            <h1 className="display-4 mb-4">
                                <i className="bi bi-shop text-primary me-3"></i>
                                Fruit Shop Management System
                            </h1>
                            <p className="lead text-muted mb-4">
                                Welcome, <strong>{user}</strong> ({role})
                            </p>
                            <div className="row mt-5">
                                <div className="col-md-3 mb-4">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body text-center">
                                            <i className="bi bi-box-seam display-4 text-primary mb-3"></i>
                                            <h5>Products</h5>
                                            <Link to="/products" className="btn btn-outline-primary btn-sm mt-2">
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
                                            <Link to="/orders" className="btn btn-outline-success btn-sm mt-2">
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
                                            <Link to="/customers" className="btn btn-outline-info btn-sm mt-2">
                                                Go to Customers
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                {role === 'ROLE_ADMIN' && (
                                    <div className="col-md-3 mb-4">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-body text-center">
                                                <i className="bi bi-currency-dollar display-4 text-warning mb-3"></i>
                                                <h5>Pricing</h5>
                                                <Link to="/pricing" className="btn btn-outline-warning btn-sm mt-2">
                                                    Go to Pricing
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotFound = () => (
    <div className="container-fluid">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm border-0 text-center">
                    <div className="card-body py-5">
                        <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
                        <h2>404 Not Found</h2>
                        <Link to="/" className="btn btn-primary mt-3">
                            <i className="bi bi-house me-2"></i>
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

function AppContent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Hide sidebar on Login page
    if (location.pathname === '/login') {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        );
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="App d-flex">
            {isAuthenticated && <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}

            <div className={`main-content ${isAuthenticated && sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${!isAuthenticated ? 'w-100 m-0' : ''}`}>
                {isAuthenticated && <TopBar onToggleSidebar={toggleSidebar} />}

                <div className="content-wrapper">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductManagementPage />} />
                            <Route path="/categories" element={<CategoryManagementPage />} />
                            <Route path="/inventory" element={<InventoryDetailPage />} />
                            <Route path="/customers" element={<CustomerManagementPage />} />
                            <Route path="/orders" element={<OrderManagementPage />} />
                            <Route path="/orders/:id" element={<OrderDetailPage />} />

                            {/* Admin Only Routes */}
                            <Route element={<RoleRoute requiredRole="ROLE_ADMIN" />}>
                                <Route path="/pricing" element={<PricingPromotionPage />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

function Sidebar({ isOpen, onToggle }) {
    const location = useLocation();
    const { role, logout } = useAuth();

    const menuItems = [
        { to: "/", label: "Home", icon: "bi-house" },
        { to: "/products", label: "Products", icon: "bi-box-seam" },
        { to: "/categories", label: "Categories", icon: "bi-tags" },
        { to: "/inventory", label: "Inventory", icon: "bi-archive" },
        { to: "/customers", label: "Customers", icon: "bi-people" },
        { to: "/orders", label: "Orders", icon: "bi-receipt" },
    ];

    // Only show Pricing to Admin
    if (role === 'ROLE_ADMIN') {
        menuItems.push({ to: "/pricing", label: "Pricing", icon: "bi-currency-dollar" });
    }

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay d-lg-none"
                    onClick={onToggle}
                ></div>
            )}

            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-shop fs-3 text-white me-2"></i>
                        {isOpen && <span className="sidebar-brand">Fruit Shop</span>}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav flex-column">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.to ||
                                (item.to !== "/" && location.pathname.startsWith(item.to));
                            return (
                                <li key={item.to} className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive ? 'active' : ''}`}
                                        to={item.to}
                                        onClick={() => {
                                            if (window.innerWidth < 992) {
                                                onToggle();
                                            }
                                        }}
                                    >
                                        <i className={`${item.icon} me-3`}></i>
                                        {isOpen && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                        <li className="nav-item mt-4">
                            <button
                                className="nav-link btn btn-link text-start w-100 text-danger"
                                onClick={logout}
                            >
                                <i className="bi bi-box-arrow-right me-3"></i>
                                {isOpen && <span>Logout</span>}
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}

function TopBar({ onToggleSidebar }) {
    const { user } = useAuth();
    return (
        <header className="topbar">
            <div className="d-flex align-items-center justify-content-between w-100">
                <button
                    className="btn btn-link text-dark sidebar-toggle-btn"
                    onClick={onToggleSidebar}
                    type="button"
                >
                    <i className="bi bi-list fs-4"></i>
                </button>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0 me-3 d-none d-md-block">
                        <i className="bi bi-person-circle me-2 text-primary"></i>
                        {user}
                    </h5>
                    <div className="text-muted small d-none d-lg-block">
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default App;
