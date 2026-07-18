import { baseApi } from "@/api/baseApi";

export const invoicePdfApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPdfInvoice: builder.query({
            query: ({ invoiceId, token }) => ({
                url: `/public/print/${invoiceId}`,
                method: "GET",
            }),

            transformResponse: (res) => res.data,
        }),

        getPdfShop: builder.query({
            query: (shopId) => ({
                url: `/public/shops/${shopId}`,
                method: "GET",
            }),

            transformResponse: (res) => res.data,
        }),
    }),
});

export const {
    useGetPdfInvoiceQuery,
    useGetPdfShopQuery,
} = invoicePdfApi;