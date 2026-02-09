import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PrivateRoute({ children, allowedRoles }) {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* Placeholder for loading spinner until component is built */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // First login: must change password before accessing any protected page
    if (user?.isFirstLogin) {
        const isChangePasswordPage = location.pathname === '/change-password';
        if (!isChangePasswordPage) {
            return <Navigate to="/change-password" replace />;
        }
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
}
