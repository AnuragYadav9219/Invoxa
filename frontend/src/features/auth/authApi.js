import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/services/tokenService";
import { logout as logoutAction, setCredentials } from "./authSlice";
import { toast } from "sonner";
import { scheduleSilentRefresh, stopSilentRefresh } from "@/services/refreshScheduler";
import { deviceService } from "@/services/deviceService";
import { showError, showSuccess } from "@/components/toast/toast";

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

                    showSuccess("Login successful");

                } catch (err) {
                    showError(err?.error?.data?.message || "Login failed");
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

                    showSuccess("Account created successfully");

                } catch (err) {
                    showError(err?.error?.data?.message || "Registration failed");
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

        /* =============== SEND OTP ================ */
        sendOtp: builder.mutation({
            query: ({ email, purpose }) => ({
                url: "/auth/send-otp",
                method: "POST",
                body: { email, purpose },
            }),

            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    showSuccess("OTP sent successfully");
                } catch (err) {
                    showError(err?.error?.data?.message || "Failed to send OTP");
                }
            },
        }),

        /* =============== VERIFY OTP =============== */
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: "/auth/verify-otp",
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

                    if (!res.isNewUser) {
                        const auth = res.auth;

                        console.log("AUTH: ", auth);

                        tokenService.setToken(auth.accessToken);
                        tokenService.setUser(auth.user);

                        localStorage.setItem("shopId", auth.user.shopId);

                        dispatch(setCredentials(auth.user));

                        scheduleSilentRefresh();

                        showSuccess("Login successful");
                    }

                } catch (err) {
                    showError(err?.error?.data?.message || "OTP verification failed");
                }
            }
        }),

        /* ============== RESET PASSWORD ============== */
        resetPassword: builder.mutation({
            query: (data) => ({
                url: "auth/forgot-password/reset",
                method: "POST",
                body: data,
            }),

            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    showSuccess("Password reset successful");
                } catch (err) {
                    showError(err?.error?.data?.message || "Reset failed");
                }
            }
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
    useSendOtpMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useLogoutAllMutation,
    useLogoutDeviceMutation,
    useGetSessionsQuery,
} = authApi;