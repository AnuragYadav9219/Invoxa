import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/services/tokenService";
import { logout as logoutAction, setCredentials } from "./authSlice";
import { toast } from "sonner";
import { scheduleSilentRefresh, stopSilentRefresh } from "@/services/refreshScheduler";
import { deviceService } from "@/services/deviceService";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ================= LOGIN ================= */
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: {
                    ...data,
                    deviceId: deviceService.getDeviceId(),
                    deviceName: deviceService.getDeviceName(),
                },
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const res = data.data;

                    tokenService.setToken(res.accessToken);
                    tokenService.setUser(res.user);

                    localStorage.setItem("shopId", res.user.shopId);

                    dispatch(setCredentials(res.user));

                    scheduleSilentRefresh();

                } catch (err) {
                    toast.error("Login failed", {
                        description:
                            err?.error?.data?.message || "Invalid credentials",
                    });
                }
            },
        }),

        /* ================= REGISTER ================= */
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: {
                    ...data,
                    deviceId: deviceService.getDeviceId(),
                    deviceName: deviceService.getDeviceName(),
                },
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const res = data.data;

                    tokenService.setToken(res.accessToken);
                    tokenService.setUser(res.user);

                    localStorage.setItem("shopId", res.user.shopId);

                    dispatch(setCredentials(res.user));

                    scheduleSilentRefresh();

                } catch (err) {
                    toast.error("Account Creation failed", {
                        description:
                            err?.error?.data?.message || "Please try again later",
                    });
                }
            },
        }),

        /* ================= REFRESH ================= */
        refresh: builder.mutation({
            query: () => ({
                url: "/auth/refresh",
                method: "POST",
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const res = data.data;

                    tokenService.setToken(res.accessToken);
                    tokenService.setUser(res.user);

                    localStorage.setItem("shopId", res.user.shopId);

                    dispatch(setCredentials(res.user));

                    scheduleSilentRefresh();

                } catch (err) {
                    tokenService.clear();
                    localStorage.removeItem("shopId");
                    dispatch(logoutAction());
                }
            },
        }),

        /* ============== GET SESSIONS ============== */
        getSessions: builder.query({
            query: () => ({
                url: "/auth/sessions",
                method: "GET",
            }),
            providesTags: ["Auth"],
        }),

        /* ================= LOGOUT ================= */
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),

            invalidatesTags: ["Auth"],

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    stopSilentRefresh();

                    tokenService.clear();
                    localStorage.removeItem("shopId");
                    dispatch(logoutAction());
                }
            },
        }),

        /* ================= LOGOUT ALL ================= */
        logoutAll: builder.mutation({
            query: () => ({
                url: "/auth/logout-all",
                method: "POST",
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    stopSilentRefresh();

                    tokenService.clear();
                    localStorage.removeItem("shopId");
                    dispatch(logoutAction());

                    toast.success("Logged out from all devices");
                }
            },
        }),

        /* ================= LOGOUT DEVICE ================= */
        logoutDevice: builder.mutation({
            query: (deviceId) => ({
                url: "/auth/logout-device",
                method: "POST",
                params: { deviceId },
            }),

            invalidatesTags: ["Auth"],

            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success("Device logged out");
                } catch (err) {
                    toast.error("Failed to logout device");
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshMutation,
    useLogoutMutation,
    useLogoutAllMutation,
    useLogoutDeviceMutation,
    useGetSessionsQuery,
} = authApi;