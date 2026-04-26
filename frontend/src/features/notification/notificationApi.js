import { baseApi } from "@/api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ============ GET ALL ============ */
        getNotifications: builder.query({
            query: () => ({
                url: "/notifications",
                method: "GET",
            }),
            transformResponse: (res) => res.data,

            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Notification", id })),
                        { type: "Notification", id: "LIST" },
                    ]
                    : [{ type: "Notification", id: "LIST" }],
        }),

        /* ============ UNREAD COUNT ============ */
        getUnreadCount: builder.query({
            query: () => ({
                url: "/notifications/unread-count",
                method: "GET",
            }),
            transformResponse: (res) => res.data,
            providesTags: [{ type: "Notification", id: "COUNT" }],
        }),

        /* ============ MARK AS READ (SINGLE) ============ */
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "POST",
            }),

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationApi.util.updateQueryData(
                        "getNotifications",
                        undefined,
                        (draft) => {
                            const item = draft.find((n) => n.id === id);
                            if (item) item.isRead = true;
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },

            invalidatesTags: [{ type: "Notification", id: "COUNT" }],
        }),

        /* ============ MARK ALL AS READ ============ */
        markAllAsRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "POST",
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationApi.util.updateQueryData(
                        "getNotifications",
                        undefined,
                        (draft) => {
                            draft.forEach((n) => {
                                n.isRead = true;
                            });
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },

            invalidatesTags: [{ type: "Notification", id: "COUNT" }],
        }),

        /* ============ FAILED ============ */
        getFailedNotifications: builder.query({
            query: () => ({
                url: "/notifications/failed",
                method: "GET",
            }),
            transformResponse: (res) => res.data,
        }),

        /* ============ RETRYING ============ */
        getRetryingNotifications: builder.query({
            query: () => ({
                url: "/notifications/retrying",
                method: "GET",
            }),
            transformResponse: (res) => res.data,
        }),

        /* ============ SENT ============ */
        getSentNotifications: builder.query({
            query: () => ({
                url: "/notifications/sent",
                method: "GET",
            }),
            transformResponse: (res) => res.data,
        }),

    }),
});

export const {
    useGetNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useGetFailedNotificationsQuery,
    useGetRetryingNotificationsQuery,
    useGetSentNotificationsQuery,
} = notificationApi;