import { baseApi } from "@/api/baseApi";

export const shopApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* =========== GET SHOP ============== */
        getShop: builder.query({
            query: (shopId) => ({
                url: `/shops/${shopId}`,
                method: "GET",
            }),

            providesTags: ["Shop"],
        }),

        /* =========== UPDATE SHOP =============== */
        updateShop: builder.mutation({
            query: ({ shopId, data }) => ({
                url: `/shops/${shopId}`,
                method: "PUT",
                data,
            }),

            invalidatesTags: ["Shop"],
        }),
    }),
});

export const {
    useGetShopQuery,
    useUpdateShopMutation,
} = shopApi;