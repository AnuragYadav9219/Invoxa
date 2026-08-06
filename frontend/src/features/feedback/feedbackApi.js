import { baseApi } from "@/api/baseApi";

export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        submitFeedback: builder.mutation({
            query: (body) => ({
                url: "/feedback",
                method: "POST",
                body,
                meta: {
                    skipGlobalError: false,
                },
            }),
        }),

    }),
});

export const {
    useSubmitFeedbackMutation,
} = feedbackApi;