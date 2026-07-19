import { baseApi } from "@/api/baseApi";

export const invoicePdfApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPdfData: builder.query({
            query: ({ invoiceId }) => ({
                url: `/public/print/${invoiceId}`,
                method: "GET",
            }),

            transformResponse: (res) => res.data,
        }),

    }),
});

export const {
    useGetPdfDataQuery,
} = invoicePdfApi;