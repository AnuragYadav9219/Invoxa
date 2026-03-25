import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/api/baseApi";
import invoiceReducer from "@/features/invoice/invoiceSlice";
import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        invoiceUI: invoiceReducer,
        auth: authReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});