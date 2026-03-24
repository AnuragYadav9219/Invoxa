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
                data: {
                    search: search || null,
                    status: status || null,         
                    fromDate: fromDate || null,
                    toDate: toDate || null,
                    sort: sort || "dueDate,desc",
                },
            }),

            transformResponse: (response) => response.data,

            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return endpointName + JSON.stringify(queryArgs);
            },

            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({
                            type: "Invoice",
                            id,
                        })),
                        { type: "Invoice", id: "LIST" },
                    ]
                    : [{ type: "Invoice", id: "LIST" }],
        }),

        /* ================== GET ONE ================== */
        getInvoiceById: builder.query({
            query: (id) => ({
                url: `/invoices/${id}`,
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
                data,
            }),
            invalidatesTags: [{ type: "Invoice", id: "LIST" }],
        }),

        /* ================== DELETE ================== */
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: `/invoices/${id}`,
                method: "DELETE",
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
                responseHandler: async (response) => {
                    const blob = await response.blob();

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");

                    link.href = url;
                    link.setAttribute("download", `invoice-${id}.pdf`);

                    document.body.appendChild(link);
                    link.click();

                    return { success: true };
                },
            }),
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceByIdQuery,
    useCreateInvoiceMutation,
    useDeleteInvoiceMutation,
    useDownloadInvoicePDFMutation,
} = invoiceApi;