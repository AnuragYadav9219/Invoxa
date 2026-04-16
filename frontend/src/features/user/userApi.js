import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/services/tokenService";
import { setCredentials } from "../auth/authSlice";
import { toast } from "sonner";

export const userApi = baseApi.injectEndpoints({
    tagTypes: ["User"],

    endpoints: (builder) => ({

        /* ================= GET PROFILE ================= */
        getProfile: builder.query({
            query: () => ({
                url: "/user/profile",
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
                url: "/user/profile",
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

                    toast.success("Profile updated successfully");

                } catch (err) {
                    toast.error("Update failed", {
                        description:
                            err?.error?.data?.message || "Something went wrong",
                    });
                }
            },
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
} = userApi;