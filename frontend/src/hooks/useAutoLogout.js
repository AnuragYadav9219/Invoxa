import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { logout } from "@/features/auth/authSlice";
import { tokenService } from "@/services/tokenService";
import { isTokenExpired } from "@/utils/authUtils";

export const useAutoLogout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = tokenService.getToken();

        if (!token || isTokenExpired(token)) {
            tokenService.clear();
            dispatch(logout());
            window.location.href = "/login";
        }
    }, []);
};