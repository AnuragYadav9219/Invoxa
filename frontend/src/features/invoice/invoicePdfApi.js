import { baseApi } from "@/api/baseApi";

export const invoicePdfApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPdfInvoice: builder.query({
            query: (invoiceId) => ({
                url: `/internal/invoices/${invoiceId}`,
                method: "GET",
            }),
        }),

        getPdfShop: builder.query({
            query: (shopId) => ({
                url: `/internal/shops/${shopId}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetPdfInvoiceQuery,
    useGetPdfShopQuery,
} = invoicePdfApi;