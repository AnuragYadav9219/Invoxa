import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/services/tokenService";
import { logout as logoutAction, setCredentials } from "./authSlice";
import { deviceService } from "@/services/deviceService";
import { showError, showSuccess } from "@/components/toast/toast";

const handleAuthSuccess = (dispatch, res) => {
  tokenService.setToken(res.accessToken);
  tokenService.setUser(res.user);

  localStorage.setItem("shopId", res.user.shopId);

  dispatch(setCredentials(res.user));
};

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
        meta: {
          skipGlobalError: true,
        },
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleAuthSuccess(dispatch, data.data);

          dispatch(
            userApi.endpoints.getProfile.initiate(undefined, {
              forceRefetch: true,
            })
          );

          showSuccess("Login successful");

        } catch {
          // Handled by global axios
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
        meta: {
          skipGlobalError: true,
        },
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleAuthSuccess(dispatch, data.data);

          dispatch(
            userApi.endpoints.getProfile.initiate(undefined, {
              forceRefetch: true,
            })
          );

          showSuccess("Account created successfully");

        } catch {
          // Handled by global axios
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
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: { 
          ...data,
        },
        meta: {
          skipGlobalError: true,
        },
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;

        } catch {
          // Global handled
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
        meta: {
          skipGlobalError: true,
        },
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const res = data.data;

          if (arg.purpose === "LOGIN") {
            handleAuthSuccess(dispatch, res.auth);
          }

        } catch (err) {
          // Handled globally
        }
      }
    }),

    /* ============== RESET PASSWORD ============== */
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password/reset",
        method: "POST",
        body: data,
        meta: {
          skipGlobalError: true,
        },
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

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          tokenService.clear();
          localStorage.removeItem("shopId");

          dispatch(logoutAction());
          dispatch(baseApi.util.resetApiState());
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
          tokenService.clear();
          localStorage.removeItem("shopId");

          dispatch(logoutAction());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    /* ================= LOGOUT DEVICE ================= */
    logoutDevice: builder.mutation({
      query: (deviceId) => ({
        url: "/auth/logout-device",
        method: "POST",
        params: { deviceId },
        meta: {
          skipGlobalError: true,
        },
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showSuccess("Device logged out");
        } catch (err) {
          showError("Failed to logout device");
        }
      },
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  //   useRefreshMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useLogoutDeviceMutation,
  useGetSessionsQuery,
} = authApi;