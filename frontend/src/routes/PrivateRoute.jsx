import { tokenService } from '@/utils/tokenService';
import React from 'react'
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const token = tokenService.getToken();

    if (!token) {
        return <Navigate to="/login" replace />
    }
    return children;
}
