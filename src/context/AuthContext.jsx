import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for session
        const storedUser = localStorage.getItem('hackfest_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password, role) => {
        try {
            const response = await authApi.login(username, password, role);
            setUser(response.user);
            setIsAuthenticated(true);
            localStorage.setItem('hackfest_user', JSON.stringify(response.user));
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('hackfest_user');
    };

    const completeFirstLogin = () => {
        if (user) {
            const updatedUser = { ...user, isFirstLogin: false };
            setUser(updatedUser);
            localStorage.setItem('hackfest_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout,
            completeFirstLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
