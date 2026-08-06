import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function GlobalErrorProvider({ children }) {
    const error = useSelector(
        (state) => state.globalError.error
    );

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!error) return;
        if (location.pathname === "/error") return;

        if(location.state?.fromError) return;

        navigate("/error", {
            replace: true,
            state: {
                error,
                from: location.pathname,
                fromError: true,
            },
        });
    }, [error, location, navigate]);

    return children;
}