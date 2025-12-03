import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductManagementPage from "./pages/ProductManagementPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import InventoryDetailPage from "./pages/InventoryDetailPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PricingPromotionPage from "./pages/PricingPromotionPage"; // Import PricingPromotionPage

// Placeholder Components - these will be replaced later
const Home = () => (
    <div className="container mt-4">
        <h2>Welcome to Fruit Shop Management</h2>
        <p>
            Use the navigation above to manage products, categories, and more.
        </p>
    </div>
);
const NotFound = () => (
    <div className="container mt-4">
        <h2>404 Not Found</h2>
        <p>The page you are looking for does not exist.</p>
    </div>
);

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
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
                        <div
                            className="collapse navbar-collapse"
                            id="navbarNav"
                        >
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/products">
                                        Products
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/categories">
                                        Categories
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/inventory">
                                        Inventory
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/customers">
                                        Customers
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">
                                        Orders
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/pricing">
                                        Pricing & Promotions
                                    </Link>{" "}
                                    {/* New Pricing Link */}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container mt-4">
                    {" "}
                    {/* Bootstrap container for main content */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/products"
                            element={<ProductManagementPage />}
                        />
                        <Route
                            path="/categories"
                            element={<CategoryManagementPage />}
                        />
                        <Route
                            path="/inventory"
                            element={<InventoryDetailPage />}
                        />
                        <Route
                            path="/customers"
                            element={<CustomerManagementPage />}
                        />
                        <Route
                            path="/orders"
                            element={<OrderManagementPage />}
                        />
                        <Route
                            path="/orders/:id"
                            element={<OrderDetailPage />}
                        />
                        <Route
                            path="/pricing"
                            element={<PricingPromotionPage />}
                        />{" "}
                        {/* New Pricing Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
