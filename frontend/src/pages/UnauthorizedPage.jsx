import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <i className="bi bi-shield-lock display-1 text-danger mb-4"></i>
                <h1 className="display-4">Access Denied</h1>
                <p className="lead text-muted mb-4">
                    You do not have permission to view this page.
                </p>
                <Link to="/" className="btn btn-primary">
                    <i className="bi bi-house me-2"></i>
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
