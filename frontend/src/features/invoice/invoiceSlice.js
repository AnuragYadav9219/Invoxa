import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
    name: "invoiceUI",
    initialState: {
        page: 0,
        size: 10,
        filters: {},
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
    },
});

export const { setPage, setFilters } = invoiceSlice.actions;
export default invoiceSlice.reducer;