import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleRoute = ({ requiredRole }) => {
    const { role, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    // Since our roles are "ROLE_ADMIN", "ROLE_STAFF", we can check if it matches
    // Or basic hierarchy: ADMIN > STAFF

    // For simplicity, if role matches exactly OR if user is ADMIN (admin access everything)
    const hasPermission = role === requiredRole || role === 'ROLE_ADMIN';

    return hasPermission ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleRoute;
