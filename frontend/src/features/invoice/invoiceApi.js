import { baseApi } from "@/api/baseApi";

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================== GET / FILTER ================== */
    getInvoices: builder.query({
      query: ({ page = 0, size = 50, search, status, fromDate, toDate, sort }) => ({
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

    /* ================= CUSTOMER INVOICES ================= */
    getInvoicesByCustomer: builder.query({
      query: (customerName) => ({
        url: "/invoices/by-customer",
        method: "GET",
        params: { customerName },
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res.data,

      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({
              type: "Invoice",
              id,
            })),
          ]
          : [],
    }),

    /* ================= CUSTOMER SUMMARY ================= */
    getCustomerSummary: builder.query({
      query: () => ({
        url: "/invoices/customers-summary",
        method: "GET",
        meta: { feature: "invoice" },
      }),

      transformResponse: (res) => res.data,

      providesTags: [{ type: "Invoice", id: "CUSTOMERS" }],
    }),

    /* ================== CREATE ================= */
    createInvoice: builder.mutation({
      query: (data) => {

        if (!data?.items?.length) {
          throw new Error("Invoice must contain items");
        }

        const formattedItems = data.items.map((item) => {

          if (!item.itemId) throw new Error("ItemId missing");
          if (!item.quantity || item.quantity <= 0)
            throw new Error("Invalid quantity");

          return {
            itemId: item.itemId,
            quantity: Number(item.quantity),
            unit: item.unit || null,
            customPrice:
              item.customPrice !== undefined &&
                item.customPrice !== ""
                ? Number(item.customPrice)
                : null,
          };
        });

        return {
          url: "/invoices",
          method: "POST",
          body: {
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail,
            customerAddress: data.customerAddress,
            dueDate: data.dueDate,
            items: formattedItems,
          },
          meta: { feature: "invoice" },
        };
      },

      transformResponse: (res) => res,
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),


    /* ================== UPDATE ================= */
    updateInvoice: builder.mutation({
      query: ({ id, body }) => {

        if (!id) throw new Error("Invoice ID required");
        if (!body?.items?.length)
          throw new Error("Invoice must contain items");

        const formattedItems = body.items.map((item) => {

          if (!item.itemId) throw new Error("ItemId missing");
          if (!item.quantity || item.quantity <= 0)
            throw new Error("Invalid quantity");

          return {
            itemId: item.itemId,
            quantity: Number(item.quantity),
            unit: item.unit || null,
            customPrice:
              item.customPrice !== undefined &&
                item.customPrice !== ""
                ? Number(item.customPrice)
                : null,
          };
        });

        return {
          url: `/invoices/${id}`,
          method: "PUT",
          body: {
            ...body,
            items: formattedItems,
          },
          meta: { feature: "invoice" },
        };
      },

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

      invalidatesTags: [
        { type: "Invoice", id: "LIST" },
        { type: "Invoice", id: "TRASH" }
      ],
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
      async queryFn({ id }) {
        try {
          const token = localStorage.getItem("token");
          const user = JSON.parse(localStorage.getItem("user"));
          const shopId = user?.shopId;

          if (!token || !shopId) {
            throw new Error("Auth missing");
          }

          const element = document.getElementById("invoice-root");

          if (!element) {
            throw new Error("Invoice DOM not found");
          }

          const html = `
        <html>
          <head>
            <meta charset="UTF-8" />
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `;

          const res = await fetch(`http://localhost:8080/api/invoices/pdf`, {
            method: "POST",
            headers: {
              "Content-Type": "text/html",
              Authorization: `Bearer ${token}`,
              "X-Shop-Id": shopId,
            },
            body: html,
          });

          if (!res.ok) {
            throw new Error("Unauthorized or PDF failed");
          }

          const blob = await res.blob();

          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");

          return { data: true };

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
  useGetInvoicesByCustomerQuery,
  useGetCustomerSummaryQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useRestoreInvoiceMutation,
  useGetDeletedInvoicesQuery,
  usePermanentDeleteInvoiceMutation,
  useDownloadInvoicePDFMutation,
  useGetRecentInvoiceQuery,
} = invoiceApi;