import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const DailyMenuSlice = createSlice({
    name: 'DailyMenu',
    initialState: {
         dailyMenu: [],
         dailyMenuUpdated: false,
    },

    reducers: {
        setDailyMenu: (state, action) => {
            state.dailyMenu = action.payload;
        },
        setDailyMenuUpdated: (state, action) => {
            state.dailyMenuUpdated = action.payload;
        }
    }
});

export const selectDailyMenu = (state) => state.DailyMenuSlice.dailyMenu;
export const selectDailyMenuUpdated = (state) => state.DailyMenuSlice.dailyMenuUpdated;
export const { setDailyMenu, setDailyMenuUpdated } = DailyMenuSlice.actions;
export default DailyMenuSlice.reducer;
