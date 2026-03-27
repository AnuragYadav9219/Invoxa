import { baseApi } from "@/api/baseApi";

export const itemApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* =========== GET ALL ITEMS ========== */
        getItems: builder.query({
            query: () => ({
                url: "/items",
                method: "GET",
            }),

            transformResponse: (response) => response.data,

            providesTags: ["Item"],
        }),

        /* =========== CREATE ITEMS ============ */
        createItem: builder.mutation({
            query: (data) => ({
                url: "/items",
                method: "POST",
                body: data,
                meta: { feature: "item" },
            }),

            invalidatesTags: ["Item"],
        }),

        /* ============ UPDATE ITEM ============ */
        updateItem: builder.mutation({
            query: ({ id, body }) => ({
                url: `/items/${id}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["Item"],
        }),

        /* =========== DELETE ITEM ============ */
        deleteItem: builder.mutation({
            query: (id) => ({
                url: `/items/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Item"],
        }),
    }),
});

export const {
    useGetItemsQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = itemApi;