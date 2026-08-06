import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import ApiErrorPage from "./ApiErrorPage";

import { clearGlobalError } from "@/features/error/errorSlice";
import { baseApi } from "@/api/baseApi";
import ServerStartingLoader from "../loaders/ServerStartingLoader";

export default function GlobalErrorPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const error = state?.error;
    const from = state?.from || "/dashboard";

    const serverUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

    const isBackendStarting =
        navigator.onLine &&
        (error?.status === "FETCH_ERROR" ||
            error?.status === "TIMEOUT_ERROR");

    useEffect(() => {
        if (!isBackendStarting) return;

        dispatch(clearGlobalError());

        let cancelled = false;
        let timeoutId;

        const checkHealth = async () => {
            try {
                const res = await axios.get(
                    `${serverUrl}/actuator/health`,
                    {
                        timeout: 10000,
                    }
                );

                if (cancelled) return;

                if (res.data?.status === "UP") {
                    dispatch(clearGlobalError());
                    dispatch(baseApi.util.resetApiState());

                    navigate(from, {
                        replace: true,
                    });

                    return;
                }
            } catch (err) {
                // Server still starting
            }

            if (!cancelled) {
                timeoutId = setTimeout(checkHealth, 3000);
            }
        };

        checkHealth();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [
        isBackendStarting,
        dispatch,
        navigate,
        from,
        serverUrl,
    ]);

    // Backend is waking up
    if (isBackendStarting) {
        return <ServerStartingLoader />;
    }

    // Other errors
    return (
        <ApiErrorPage
            error={error}
        />
    );
}