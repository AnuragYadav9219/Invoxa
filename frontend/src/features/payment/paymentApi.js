import { baseApi } from "@/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ================ CREATE PAYMENT ================== */
        addPayment: builder.mutation({
            query: (data) => ({
                url: "/payments",
                method: "POST",
                body: data,
            }),

            invalidatesTags: ["Invoice", "Payment"],
        }),

        /* =============== GET PAYMENTS BY INVOICE ===================== */
        getPayments: builder.query({
            query: (invoiceId) => ({
                url: `/payments/${invoiceId}`,
                method: "GET",
            }),

            providesTags: (result, error, invoiceId) => [
                { type: "Payment", id: invoiceId }
            ],
        }),

        /* =============== GET PAYMENT BY ID ===================== */
        getPaymentById: builder.query({
            query: (id) => ({
                url: `/payments/${id}`,
                method: "GET",
            }),

            transformResponse: (response) => response.data,

            providesTags: (result, error, id) => [
                { type: "Payment", id }
            ],
        }),

        /* =============== UPDATE PAYMENTS ===================== */
        updatePayment: builder.mutation({
            query: ({ id, body }) => ({
                url: `/payments/${id}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["Payment", "Invoice"],
        }),

        /* =============== MARK AS PAID ===================== */
        markAsPaid: builder.mutation({
            query: (invoiceId) => ({
                url: `/payments/${invoiceId}/mark-paid`,
                method: "PUT",
            }),

            invalidatesTags: ["Invoice"],
        }),

        /* ============= GET ALL PAYMENTS ===================== */
        getAllPayments: builder.query({
            query: ({ page = 0, size = 10 }) => ({
                url: `/payments?page=${page}&size=${size}`,
                method: "GET",
            }),

            transformResponse: (response) => response.data,
            providesTags: ["Payment"],
        }),

        /* ================= FILTER PAYMENTS ==================== */
        filterPayments: builder.mutation({
            query: ({ filter, page = 0, size = 50 }) => ({
                url: `/payments/filter?page=${page}&size=${size}`,
                method: "POST",
                body: filter,
            }),

            transformResponse: (response) => response.data,
        }),

        /* =================== SOFT DELETE ======================= */
        deletePayment: builder.mutation({
            query: (id) => ({
                url: `/payments/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Payment", "Invoice"],
        }),

        /* ================ RESTORE ================= */
        restorePayment: builder.mutation({
            query: (id) => ({
                url: `/payments/${id}/restore`,
                method: "PUT",
            }),

            invalidatesTags: ["Payment"],
        }),

        /* ================= PERMANENT DELETE ================= */
        permanentDeletePayment: builder.mutation({
            query: (id) => ({
                url: `/payments/${id}/permanent`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payment"],
        }),

        /* ================= GET TRASH =================== */
        getDeletedPayments: builder.query({
            query: () => ({
                url: `/payments/trash`,
                method: "GET",
            }),

            transformResponse: (response) => response.data,
            providesTags: ["Payment"],
        }),
        
        /* ================= CREATE RAZORPAY ORDER =================== */
        createOrder: builder.mutation({
            query: (invoiceId) => ({
                url: "/payments/order",
                method: "POST",
                body: {
                    invoiceId,
                },
            }),

            transformResponse: (response) => response.data,
        }),

        /* ================= VERIFY PAYMENT =================== */
        verifyPayment: builder.mutation({
            query: (body) => ({
                url: "/payments/verify",
                method: "POST",
                body,
            }),

            transformResponse: (response) => response.data,

            invalidatesTags: ["Invoice", "Payment"],
        }),

        /* ================= CUSTOMER PAYMENT =================== */
        getPublicInvoice: builder.query({
            query: (paymentToken) => ({
                url: `/public/invoices/${paymentToken}`,
                method: "GET",
            }),

            transformResponse: (response) => response.data,
        }),

    }),
});

export const {
    useAddPaymentMutation,
    useGetPaymentsQuery,
    useUpdatePaymentMutation,
    useMarkAsPaidMutation,
    useGetAllPaymentsQuery,
    useFilterPaymentsMutation,

    useDeletePaymentMutation,
    useRestorePaymentMutation,
    usePermanentDeletePaymentMutation,
    useGetDeletedPaymentsQuery,

    useGetPaymentByIdQuery, 

    useCreateOrderMutation,
    useVerifyPaymentMutation,

    useGetPublicInvoiceQuery,
} = paymentApi;