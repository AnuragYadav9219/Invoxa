import { baseApi } from "@/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ================= Dashboard =================

        getDashboard: builder.query({
            query: (days = 30) => ({
                url: "/dashboard",
                method: "GET",
                params: { days },
            }),

            transformResponse: ({ data }) => data,

            providesTags: ["Dashboard"],
        }),

        // ================= Revenue Trend =================

        getRevenueTrend: builder.query({
            query: (days = 30) => ({
                url: "/dashboard/revenue-trend",
                method: "GET",
                params: { days },
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