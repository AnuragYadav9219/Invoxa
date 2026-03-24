import { tokenService } from "@/utils/tokenService";
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
                    tokenService.clear();
                    window.location.href = "/login";
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