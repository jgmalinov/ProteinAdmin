import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
    name: 'Dashboard',
    initialState: {
        user: {}
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
});

export const selectUser = (state) => state.DashboardSlice.user;
export const { setUser } = DashboardSlice.actions;
export default DashboardSlice.reducer; 