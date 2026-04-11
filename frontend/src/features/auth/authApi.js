import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/services/tokenService";
import { logout, setCredentials } from "./authSlice";
import { toast } from "sonner";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ============ LOGIN ============= */
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: {
                    ...data,
                    deviceId: "web-app",
                    deviceName: "Chrome",
                },
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    const res = data.data;

                    tokenService.setToken(res.accessToken);
                    tokenService.setRefreshToken(res.refreshToken);
                    tokenService.setUser(res.user);

                    localStorage.setItem("shopId", res.user.shopId);

                    dispatch(setCredentials(res.user));

                } catch (err) {
                    toast.error("Login failed", {
                        description:
                            err?.error?.data?.message || "Invalid credentials",
                    });
                }
            },
        }),

        /* ================ REGISTER =================== */
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: {
                    ...data,
                    deviceId: "web-app",
                    deviceName: "Chrome",
                },
            }),

            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const res = data.data;

                    tokenService.setToken(res.accessToken);
                    tokenService.setRefreshToken(res.refreshToken);
                    tokenService.setUser(res.user);

                    localStorage.setItem("shopId", res.user.shopId);

                    dispatch(setCredentials(res.user));

                } catch (err) {
                    toast.error("Account Creation failed", {
                        description:
                            err?.error?.data?.message || "Please try again later",
                    });
                }
            },
        }),

        /* ============== LOGOUT ================ */
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    tokenService.clear();
                    localStorage.removeItem("shopId");
                    dispatch(logout());
                    window.location.replace("/login");
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
} = authApi;