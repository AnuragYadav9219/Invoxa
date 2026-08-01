import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/api/baseApi";
import invoiceReducer from "@/features/invoice/invoiceSlice";
import authReducer from "@/features/auth/authSlice";
import paymentReducer from "@/features/payment/paymentSlice";
import errorReducer from "@/features/error/errorSlice";
import { apiErrorMiddleware } from "@/features/error/apiErrorMiddleware";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        invoiceUI: invoiceReducer,
        paymentUI: paymentReducer,
        auth: authReducer,
        globalError: errorReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(apiErrorMiddleware),
});