import { getErrorMessage } from "@/components/toast/getErrorMessage";
import { showError, showWarning } from "@/components/toast/toast";
import { tokenService } from "@/services/tokenService";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
});

export const axiosBaseQuery =
    () =>
        async ({ url, method, body, params, responseType, meta }) => {
            try {
                const token = tokenService.getToken();
                const shopId = localStorage.getItem("shopId");

                const result = await axiosInstance({
                    url,
                    method,
                    data: body,
                    params,
                    responseType,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                        ...(shopId && { "X-Shop-Id": shopId }),
                    },
                });

                return { data: result.data };

            } catch (error) {
                const status = error.response?.status;

                if (status === 401) {
                    const refreshToken = tokenService.getRefreshToken();

                    if (refreshToken) {
                        try {
                            const refreshResponse = await axiosInstance.post(
                                "/auth/refresh",
                                { refreshToken }
                            );

                            const res = refreshResponse.data?.data;

                            tokenService.setToken(res.accessToken);
                            tokenService.setRefreshToken(res.refreshToken);
                            tokenService.setUser(res.user);

                            localStorage.setItem("shopId", res.user.shopId);

                            const retryResult = await axiosInstance({
                                url,
                                method,
                                data: body,
                                params,
                                responseType,
                                headers: {
                                    Authorization: `Bearer ${res.accessToken}`,
                                    "X-Shop-Id": res.user.shopId,
                                },
                            });

                            return { data: retryResult.data };

                        } catch {
                            tokenService.clear();

                            showWarning("Session expired. Please login again.");

                            if (window.location.pathname !== "/login") {
                                window.location.replace("/login");
                            }
                        }
                    } else {
                        tokenService.clear();

                        showWarning("Session expired. Please login again.");

                        if (window.location.pathname !== "/login") {
                            window.location.replace("/login");
                        }
                    }
                }

                /* ================= GLOBAL ERROR ================= */
                if (status !== 401) {
                    const feature = meta?.feature || "common";

                    const message = getErrorMessage(
                        status,
                        feature,
                        error.response?.data?.message
                    );

                    showError(message, { id: message });
                }

                return {
                    error: {
                        status,
                        data: error.response?.data || error.message,
                    },
                };
            }
        };