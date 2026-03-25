import { tokenService } from "@/services/tokenService";
import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
});

export const axiosBaseQuery =
    () =>
        async ({ url, method, data, params }) => {
            try {
                const token = tokenService.getToken();

                const result = await axiosInstance({
                    url,
                    method,
                    data,
                    params,
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                });

                return { data: result.data };
            } catch (error) {
                const status = error.response?.status;

                /* AUTO LOGOUT */
                if (status === 401) {
                    const refreshToken = localStorage.getItem("refreshToken");

                    if (refreshToken) {
                        try {
                            const refreshResponse = await axiosInstance.post(
                                "/auth/refresh",
                                { refreshToken }
                            );

                            const newAccessToken = refreshResponse.data.data.accessToken;

                            tokenService.setToken(newAccessToken);

                            // retry original request
                            const retryResult = await axiosInstance({
                                url,
                                method,
                                data,
                                params,
                                headers: {
                                    Authorization: `Bearer ${newAccessToken}`,
                                },
                            });

                            return { data: retryResult.data };

                        } catch {
                            tokenService.clear();
                            window.location.href = "/login";
                        }
                    } else {
                        tokenService.clear();
                        window.location.href = "/login";
                    }
                }

                /* GLOBAL ERROR */
                toast.error("API Error", {
                    description:
                        error.response?.data?.message ||
                        error.message ||
                        "Something went wrong",
                });

                return {
                    error: {
                        status,
                        data: error.response?.data || error.message,
                    },
                };
            }
        };