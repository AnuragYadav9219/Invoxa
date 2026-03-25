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
                data: {
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

                    dispatch(setCredentials(res.user));

                } catch (err) {
                    console.error("Login failed");
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
                    dispatch(logout());
                }
            },
        }),

        /* =============== REFRESH =================== */
        refresh: builder.mutation({
            query: () => ({
                url: "/auth/refresh",
                method: "POST",
                data: {
                    refreshToken: localStorage.getItem("refreshToken"),
                },
            }),

            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const res = data.data;
                    tokenService.setToken(res.accessToken);
                } catch {
                    tokenService.clear();
                    window.location.href = "/login";
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRefreshMutation,
} = authApi;