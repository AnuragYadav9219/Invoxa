import { baseApi } from "@/api/baseApi";
import { tokenService } from "@/utils/tokenService";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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

            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    const { accessToken, email } = data.data;

                    tokenService.setToken(accessToken);
                    tokenService.setUser({ email });
                } catch (err) {
                    console.error("Login failed");
                }
            },
        }),
    }),
});

export const { useLoginMutation } = authApi;