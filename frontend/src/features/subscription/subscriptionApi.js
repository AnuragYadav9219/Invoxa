import { baseApi } from "@/api/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ================== GET PLANS ================== */
        getPlans: builder.query({
            query: () => ({
                url: "/subscriptions/plans",
                method: "GET",
            }),

            providesTags: ["Subscription"],
        }),

        /* ================== GET DASHBOARD ================== */
        getDashboard: builder.query({
            query: () => ({
                url: "/subscriptions/dashboard",
                method: "GET",
            }),

            providesTags: ["Subscription"],
        }),

        /* ================== GET PAYMENTS HISTORY ================== */
        getPaymentHistory: builder.query({
            query: () => ({
                url: "/subscriptions/payments",
                method: "GET",
            }),

            providesTags: ["Subscription"],
        }),

        /* ================== CREATE CHECKOUT ================== */
        createCheckout: builder.mutation({
            query: ({ planId }) => ({
                url: "/subscriptions/checkout",
                method: "POST",
                body: { planId },
            }),
        }),

        /* ================== VERIFY PAYMENT ================== */
        verifyPayment: builder.mutation({
            query: (body) => ({
                url: "/subscriptions/verify",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Subscription"],
        }),

        /* ================== GET BILLING INFO. ================== */
        getBillingInformation: builder.query({
            query: () => ({
                url: "/subscriptions/billing",
                method: "GET",
            }),

            transformResponse: (res) => res.data,

            providesTags: [{ type: "Subscription", id: "BILLING" }],
        })
    }),
});

export const {
    useGetPlansQuery,
    useGetDashboardQuery,
    useLazyGetPaymentHistoryQuery,
    useCreateCheckoutMutation,
    useVerifyPaymentMutation,
    useGetBillingInformationQuery,
} = subscriptionApi;