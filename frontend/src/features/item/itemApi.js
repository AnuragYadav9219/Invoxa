// import { baseApi } from "@/api/baseApi";

// export const itemApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({

//         /* =========== GET ALL ITEMS ========== */
//         getItems: builder.query({
//             query: () => ({
//                 url: "/items",
//                 method: "GET",
//             }),

//             transformResponse: (response) => response.data,
//             providesTags: ["Item"],
//         }),

//         /* =========== CREATE ITEMS ============ */
//         createItem: builder.mutation({
//             query: (data) => ({
//                 url: "/items",
//                 method: "POST",
//                 body: data,
//                 meta: { feature: "item" },
//             }),

//             transformResponse: (response) => response,
//             invalidatesTags: ["Item"],
//         }),

//         /* ============ UPDATE ITEM ============ */
//         updateItem: builder.mutation({
//             query: ({ id, body }) => ({
//                 url: `/items/${id}`,
//                 method: "PUT",
//                 body,
//             }),

//             transformResponse: (response) => response,
//             invalidatesTags: ["Item"],
//         }),

//         /* =========== DELETE ITEM ============ */
//         deleteItem: builder.mutation({
//             query: (id) => ({
//                 url: `/items/${id}`,
//                 method: "DELETE",
//             }),

//             transformResponse: (response) => response,
//             invalidatesTags: ["Item"],
//         }),

//         /* ================ RESTORE ITEM =============== */
//         restoreItem: builder.mutation({
//             query: (id) => ({
//                 url: `/items/${id}/restore`,
//                 method: "POST",
//             }),

//             transformResponse: (response) => response,
//             invalidatesTags: ["Item"],
//         }),

//         /* ============== GET TRASH ================= */
//         getDeletedItems: builder.query({
//             query: () => "/items/trash",
//             transformResponse: (response) => response.data,
//             providesTags: ["Item"],
//         }),

//         /* ============= PERMANENT DELETE ============ */
//         permanentDeleteItem: builder.mutation({
//             query: (id) => ({
//                 url: `/items/${id}/permanent`,
//                 method: "DELETE",
//             }),
//             transformResponse: (response) => response,
//             invalidatesTags: ["Item"],
//         }),

//     }),
// });

// export const {
//     useGetItemsQuery,
//     useCreateItemMutation,
//     useUpdateItemMutation,
//     useDeleteItemMutation,
//     useRestoreItemMutation,
//     useGetDeletedItemsQuery,
//     usePermanentDeleteItemMutation,
// } = itemApi;




























import { baseApi } from "@/api/baseApi";

export const itemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========== GET ALL ITEMS ========== */
    getItems: builder.query({
      query: () => ({
        url: "/items",
        method: "GET",
      }),

      transformResponse: (res) => res.data,

      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Item", id })),
            { type: "Item", id: "LIST" },
          ]
          : [{ type: "Item", id: "LIST" }],
    }),

    /* =========== CREATE ITEM ============ */
    createItem: builder.mutation({
      query: (data) => ({
        url: "/items",
        method: "POST",
        body: data,
      }),

      transformResponse: (res) => res,
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),

    /* ============ UPDATE ITEM ============ */
    updateItem: builder.mutation({
      query: ({ id, body }) => ({
        url: `/items/${id}`,
        method: "PUT",
        body,
      }),

      transformResponse: (res) => res,

      invalidatesTags: (result, error, { id }) => [
        { type: "Item", id },
      ],
    }),

    /* =========== DELETE ITEM (SOFT) ============ */
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/items/${id}`,
        method: "DELETE",
      }),

      transformResponse: (res) => res,

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          itemApi.util.updateQueryData("getItems", undefined, (draft) => {
            return draft.filter((item) => item.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: [{ type: "Item", id: "TRASH" }],
    }),

    /* ================ RESTORE ITEM =============== */
    restoreItem: builder.mutation({
      query: (id) => ({
        url: `/items/${id}/restore`,
        method: "POST",
      }),

      transformResponse: (res) => res,

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          itemApi.util.updateQueryData("getDeletedItems", undefined, (draft) => {
            return draft.filter((item) => item.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),

    /* ============== GET TRASH ================= */
    getDeletedItems: builder.query({
      query: () => ({
        url: "/items/trash",
        method: "GET",
      }),

      transformResponse: (res) => res.data,
      providesTags: [{ type: "Item", id: "TRASH" }],
    }),

    /* ============= PERMANENT DELETE ============ */
    permanentDeleteItem: builder.mutation({
      query: (id) => ({
        url: `/items/${id}/permanent`,
        method: "DELETE",
      }),

      transformResponse: (res) => res,

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          itemApi.util.updateQueryData("getDeletedItems", undefined, (draft) => {
            return draft.filter((item) => item.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: [
        { type: "Item", id: "TRASH" },
        { type: "Item", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useRestoreItemMutation,
  useGetDeletedItemsQuery,
  usePermanentDeleteItemMutation,
} = itemApi;