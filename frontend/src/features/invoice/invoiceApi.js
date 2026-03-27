import { baseApi } from "@/api/baseApi";

export const invoiceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ================== GET / FILTER ================== */
        getInvoices: builder.query({
            query: ({ page = 0, size = 10, search, status, fromDate, toDate, sort }) => ({
                url: "/invoices/filter",
                method: "POST",
                params: {
                    page,
                    size,
                },
                body: {
                    search: search || null,
                    status: status === "ALL" ? null : status,
                    fromDate: fromDate || null,
                    toDate: toDate || null,
                    sort: sort || "dueDate,desc",
                },
                meta: { feature: "invoice" },
            }),

            transformResponse: (response) => response.data,

            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${JSON.stringify(queryArgs)}`;
            },

            providesTags: (result) =>
                result?.content
                    ? [
                        ...result.content.map(({ id }) => ({
                            type: "Invoice",
                            id,
                        })),
                        { type: "Invoice", id: "LIST" },
                    ]
                    : [{ type: "Invoice", id: "LIST" }],
        }),

        /* ================ GET RECENT INVOICES ============== */
        getRecentInvoice: builder.query({
            query: (limit = 5) => ({
                url: "/invoices/recent",
                method: "GET",
                params: { limit },
                meta: { feature: "invoice" },
            }),

            transformResponse: (response) => response.data,

            providesTags: [{ type: "Invoice", id: "LIST" }],
        }),

        /* ================== GET ONE ================== */
        getInvoiceById: builder.query({
            query: (id) => ({
                url: `/invoices/${id}`,
                method: "GET",
                meta: { feature: "invoice" },
            }),
            providesTags: (result, error, id) => [
                { type: "Invoice", id },
            ],
        }),

        /* ================== CREATE ================== */
        createInvoice: builder.mutation({
            query: (data) => ({
                url: "/invoices",
                method: "POST",
                body: data,
                meta: { feature: "invoice" },
            }),

            

            invalidatesTags: [{ type: "Invoice", id: "LIST" }],
        }),

        /* ================== UPDATE ================== */
        updateInvoice: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/invoices/${id}`,
                method: "PUT",
                body: data,
                meta: { feature: "invoice" },
            }),

            invalidatesTags: (result, error, { id }) => [
                { type: "Invoice", id },
                { type: "Invoice", id: "LIST" },
            ],
        }),

        /* ================== DELETE ================== */
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: `/invoices/${id}`,
                method: "DELETE",
                meta: { feature: "invoice" },
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Invoice", id },
                { type: "Invoice", id: "LIST" },
            ],
        }),

        /* ================== DOWNLOAD PDF ================== */
        downloadInvoicePDF: builder.mutation({
            query: (id) => ({
                url: `/invoices/${id}/pdf`,
                method: "GET",
                responseType: "blob",
                meta: { feature: "invoice" },
            }),

            async transformResponse(response, meta, arg) {
                const url = window.URL.createObjectURL(response);
                const link = document.createElement("a");

                link.href = url;
                link.setAttribute("download", `invoice-${arg}.pdf`);

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(url);

                return { success: true };
            },
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceByIdQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useDeleteInvoiceMutation,
    useDownloadInvoicePDFMutation,
    useGetRecentInvoiceQuery
} = invoiceApi;
