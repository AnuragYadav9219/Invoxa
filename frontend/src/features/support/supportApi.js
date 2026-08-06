import { baseApi } from "@/api/baseApi";

export const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createTicket: builder.mutation({
            query: (body) => ({
                url: "/support",
                method: "POST",
                body,
            }),
        }),
        
    }),
});

export const {
    useCreateTicketMutation,
} = supportApi;