import { useAuth } from '@/hooks/authHooks';
import React from 'react'
import { Navigate } from 'react-router-dom';

export default function RoleRoute({ children, allowedRoles }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children;
}
