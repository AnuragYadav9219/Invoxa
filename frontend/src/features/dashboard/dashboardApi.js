import { baseApi } from "@/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ================= Dashboard =================

        getDashboard: builder.query({
            query: () => ({
                url: "/dashboard",
                method: "GET",
            }),

            transformResponse: ({ data }) => data,

            providesTags: ["Dashboard"],
        }),

        // ================= Revenue Trend =================

        getRevenueTrend: builder.query({
            query: () => ({
                url: "/dashboard/revenue-trend",
                method: "GET",
            }),

            transformResponse: ({ data }) => data,

            providesTags: ["Dashboard"],
        }),

    }),
});

export const {
    useGetDashboardQuery,
    useGetRevenueTrendQuery,
} = dashboardApi;