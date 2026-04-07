import { baseApi } from "@/api/baseApi";

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================== GET / FILTER ================== */
    getInvoices: builder.query({
      query: ({ page = 0, size = 10, search, status, fromDate, toDate, sort }) => ({
        url: "/invoices/filter",
        method: "POST",
        params: { page, size },
        body: {
          search: search || null,
          status: status === "ALL" ? null : status,
          fromDate: fromDate || null,
          toDate: toDate || null,
          sort: sort || "dueDate,desc",
        },
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res.data,

      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${JSON.stringify(queryArgs)}`,

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

    /* ================ GET RECENT ================= */
    getRecentInvoice: builder.query({
      query: (limit = 5) => ({
        url: "/invoices/recent",
        method: "GET",
        params: { limit },
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res.data,
      providesTags: [{ type: "Invoice", id: "LIST" }],
    }),

    /* ================== GET ONE ================= */
    getInvoiceById: builder.query({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "GET",
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res.data,

      providesTags: (result, error, id) => [
        { type: "Invoice", id },
      ],
    }),

    /* ================== CREATE ================= */
    createInvoice: builder.mutation({
      query: (data) => ({
        url: "/invoices",
        method: "POST",
        body: data,
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res,
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),

    /* ================== UPDATE ================= */
    updateInvoice: builder.mutation({
      query: ({ id, body }) => ({
        url: `/invoices/${id}`,
        method: "PUT",
        body,
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res,
      invalidatesTags: (result, error, { id }) => [
        { type: "Invoice", id },
        { type: "Invoice", id: "LIST" },
      ],
    }),

    /* ================== DELETE (SOFT) ================= */
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res,

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          invoiceApi.util.updateQueryData("getInvoices", undefined, (draft) => {
            if (draft?.content) {
              draft.content = draft.content.filter((i) => i.id !== id);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: [{ type: "Invoice", id: "TRASH" }],
    }),

    /* ================= RESTORE ================= */
    restoreInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}/restore`,
        method: "POST",
      }),

      invalidatesTags: [
        { type: "Invoice", id: "LIST" },
        { type: "Invoice", id: "TRASH" },
      ],
    }),

    /* ================= TRASH ================= */
    getDeletedInvoices: builder.query({
      query: () => ({
        url: "/invoices/trash",
        method: "GET",
      }),

      transformResponse: (res) => res.data,

      providesTags: [{ type: "Invoice", id: "TRASH" }],
    }),

    /* ================= PERMANENT DELETE ================= */
    permanentDeleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}/permanent`,
        method: "DELETE",
      }),

      invalidatesTags: [
        { type: "Invoice", id: "LIST" },
        { type: "Invoice", id: "TRASH" },
      ],
    }),

    /* ================= DOWNLOAD PDF ================= */
    downloadInvoicePDF: builder.mutation({
      async queryFn(id) {
        try {
          const token = localStorage.getItem("token");
          const user = JSON.parse(localStorage.getItem("user"));
          const shopId = user?.shopId;

          if (!token || !shopId) {
            throw new Error("Auth missing");
          }

          const res = await fetch(
            `http://localhost:8080/api/invoices/${id}/pdf`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Shop-Id": shopId,
              },
            }
          );

          if (!res.ok) throw new Error("Failed to fetch PDF");

          const blob = await res.blob();

          if (blob.type !== "application/pdf") {
            const text = await blob.text();
            console.error("Invalid response:", text);
            throw new Error("Invalid PDF response");
          }

          return { data: blob };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),

});

/* ================= EXPORT HOOKS ================= */
export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useRestoreInvoiceMutation,
  useGetDeletedInvoicesQuery,
  usePermanentDeleteInvoiceMutation,
  useDownloadInvoicePDFMutation,
  useGetRecentInvoiceQuery,
} = invoiceApi;