import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 0,
  pageSize: 10,
  filters: {
    search: "",
    status: "ALL",
    sort: "DATE_DESC",
    fromDate: "",
    toDate: "",
  },
};

const invoiceSlice = createSlice({
  name: "invoiceUI",
  initialState,
  reducers: {
    /* ================= PAGE ================= */
    setPage: (state, action) => {
      state.page = action.payload;
    },

    /* ================= PAGE SIZE ================= */
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 0; // reset page
    },

    /* ================= UPDATE SINGLE FILTER ================= */
    updateFilter: (state, action) => {
      const { key, value } = action.payload;

      state.filters[key] = value;
      state.page = 0; // auto reset page
    },

    /* ================= SET MULTIPLE FILTERS ================= */
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.page = 0;
    },

    /* ================= RESET ================= */
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 0;
    },
  },
});

export const {
  setPage,
  setPageSize,
  updateFilter,
  setFilters,
  resetFilters,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;