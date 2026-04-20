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
      query: (data) => {

        const formattedData = {
          name: data.name,
          price: Number(data.price),
          defaultUnit: data.defaultUnit,
          allowedUnits: data.allowedUnits || [],
        };

        return {
          url: "/items",
          method: "POST",
          body: formattedData,
        };
      },

      transformResponse: (res) => res,
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),

    /* ============ UPDATE ITEM ============ */
    updateItem: builder.mutation({
      query: ({ id, body }) => {

        if (!id) {
          throw new Error("Item ID required");
        }

        if (!body) {
          console.error("Missing body in update:", { id, body });
          throw new Error("Update body missing");
        }

        const formattedData = {
          name: body.name,
          price: Number(body.price),
          defaultUnit: body.defaultUnit,
          allowedUnits: body.allowedUnits || [],
        };

        return {
          url: `/items/${id}`,
          method: "PUT",
          body: formattedData,
        };
      },

      transformResponse: (res) => res,

      invalidatesTags: (result, error, { id }) => [
        { type: "Item", id },
        { type: "Item", id: "LIST" },
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