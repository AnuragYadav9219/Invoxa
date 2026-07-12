import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/services/tokenService";
import { setCredentials, logout as logoutAction } from "../auth/authSlice";
import { showError, showSuccess } from "@/components/toast/toast";

export const userApi = baseApi.injectEndpoints({
  tagTypes: ["User"],

  endpoints: (builder) => ({

    /* ================= GET PROFILE ================= */
    getProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),

      providesTags: ["User"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = data.data;

          tokenService.setUser(user);
          dispatch(setCredentials(user));

        } catch (err) {
          console.error("Profile fetch failed", err);
        }
      },
    }),

    /* ================= UPDATE PROFILE ================= */
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["User"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = data.data;

          tokenService.setUser(user);
          dispatch(setCredentials(user));

          showSuccess("Profile updated successfully");

        } catch (err) {
          showError("Update failed", {
            description:
              err?.error?.data?.message || "Something went wrong",
          });
        }
      },
    }),

    /* ============== CHANGE PASSWORD =============== */
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/users/change-password",
        method: "PUT",
        body,
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showSuccess("Password updated successfully");

        } catch (err) {
          showError("Password update failed", {
            description:
              err?.error?.data?.message || "Something went wrong",
          });
        }
      },
    }),

    /* ================= DELETE ACCOUNT ================= */

    sendDeleteOtp: builder.mutation({
      query: () => ({
        url: "/users/delete/send-otp",
        method: "POST",
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showSuccess("OTP sent for account deletion");

        } catch (err) {
          showError("Failed to send OTP", {
            description:
              err?.error?.data?.message || "Try again",
          });
        }
      },
    }),

    deleteAccount: builder.mutation({
      query: (body) => ({
        url: "/users/me",
        method: "DELETE",
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          showSuccess("Account deleted successfully");

          tokenService.clear();
          localStorage.removeItem("shopId");

          dispatch(logoutAction());
          dispatch(baseApi.util.resetApiState());

        } catch (err) {
          showError("Delete failed", {
            description:
              err?.error?.data?.message || "Invalid OTP or password",
          });
        }
      },
    }),

    /* ================= RECOVER ACCOUNT ================= */

    sendRecoverOtp: builder.mutation({
      query: (email) => ({
        url: "/users/recover/send-otp",
        method: "POST",
        body: { email },
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showSuccess("Recovery OTP sent");

        } catch (err) {
          showError("Failed to send OTP", {
            description:
              err?.error?.data?.message || "Try again",
          });
        }
      },
    }),

    recoverAccount: builder.mutation({
      query: (body) => ({
        url: "/users/recover",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showSuccess("Account recovered successfully");

        } catch (err) {
          showError("Recovery failed", {
            description:
              err?.error?.data?.message || "Invalid OTP",
          });
        }
      },
    }),

    /* =============== UPLOAD PROFILE IMAGE ================== */
    uploadProfileImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: "/users/profile-image",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Profile"],

      async onQueryStarted(file, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            userApi.util.updateQueryData(
              "getProfile",
              undefined,
              (draft) => {
                draft.data.profileImage = data.data.url;
              }
            )
          );
        } catch { }
      }
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,

  useSendDeleteOtpMutation,
  useDeleteAccountMutation,

  useSendRecoverOtpMutation,
  useRecoverAccountMutation,

  useUploadProfileImageMutation,
} = userApi;