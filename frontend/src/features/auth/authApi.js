import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/services/tokenService";
import { logout, setCredentials } from "./authSlice";

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
} = authApi;