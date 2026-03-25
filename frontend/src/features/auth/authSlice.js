import { createSlice } from "@reduxjs/toolkit";
import { tokenService } from "@/services/tokenService";

const initialState = {
    user: tokenService.getUser(),
    isAuthenticated: !!tokenService.getToken(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            tokenService.clear();
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;