import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to extract user data from token
    const getUserFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            // Check if token is expired
            const now = Date.now() / 1000;
            if (decoded.exp < now) return null;

            return {
                id: decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                name: decoded.unique_name || decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                token
            };
        } catch (error) {
            return null;
        }
    };

    // Initialize auth state
    useEffect(() => {
        const token = localStorage.getItem('quantix_token');
        if (token) {
            const userData = getUserFromToken(token);
            if (userData) {
                setUser(userData);
            } else {
                localStorage.removeItem('quantix_token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            const { accessToken } = response.data.data;
            localStorage.setItem('quantix_token', accessToken);

            const userData = getUserFromToken(accessToken);
            setUser(userData);
            return true;
        }
        return false;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('quantix_token');
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
