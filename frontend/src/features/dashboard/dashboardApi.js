import { baseApi } from "@/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getDashboard: builder.query({
            query: () => ({
                url: "/dashboard",
                method: "GET",
            }),

            transformResponse: (response) => response.data,

            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetDashboardQuery } = dashboardApi;