import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: null,
};

const errorSlice = createSlice({
    name: "globalError",
    initialState,
    reducers: {
        setGlobalError(state, action) {
            state.error = action.payload;
        },

        clearGlobalError(state) {
            state.error = null;
        },
    },
});

export const {
    setGlobalError,
    clearGlobalError,
} = errorSlice.actions;

export default errorSlice.reducer;