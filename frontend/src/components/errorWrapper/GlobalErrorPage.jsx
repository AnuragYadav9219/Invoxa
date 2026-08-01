import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ApiErrorPage from './ApiErrorPage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearGlobalError } from '@/features/error/errorSlice';
import { baseApi } from '@/api/baseApi';

export default function GlobalErrorPage() {
    const dispatch = useDispatch();
    const { state } = useLocation();
    const navigate = useNavigate();

    const error = state?.error;
    const from = state?.from || "/dashboard";

    const serverUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

    useEffect(() => {
        let cancelled = false;

        const checkHealth = async () => {
            try {
                const res = await axios.get(
                    `${serverUrl}/actuator/health`,
                    {
                        timeout: 5000,
                    }
                );

                if (cancelled) return;

                if (res.data.status === "UP") {
                    dispatch(clearGlobalError());
                    dispatch(baseApi.util.resetApiState());
                    navigate(from, { replace: true });
                    return;
                }

            } catch (err) {
                // ignore
            }

            if (!cancelled) {
                setTimeout(checkHealth, 3000);
            }
        };

        checkHealth();

        return () => {
            cancelled = true;
        };
        
    }, [dispatch, navigate, from, serverUrl]);

    return (
        <ApiErrorPage
            error={error}
        />
    );
}
