import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, validateToken } from '../api/apiService';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded.sub);
                    setRole(decoded.role);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const token = await apiLogin({ username, password });
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            setUser(decoded.sub);
            setRole(decoded.role);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        role,
        isAuthenticated,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
