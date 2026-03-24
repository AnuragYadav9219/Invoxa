import { axiosBaseQuery } from "./baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery(),

    tagTypes: ["Auth", "Invoice"],

    endpoints: () => ({}),
});