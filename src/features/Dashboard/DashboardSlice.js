import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
    name: 'Dashboard',
    initialState: {
        user: {},
        sidebarOn: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setSidebarOn: (state, action) => {
            state.sidebarOn = action.payload;
        }
    }
});

export const selectSidebarOn = (state) => state.DashboardSlice.sidebarOn;
export const selectUser = (state) => state.DashboardSlice.user;
export const { setUser, setSidebarOn } = DashboardSlice.actions;
export default DashboardSlice.reducer; 