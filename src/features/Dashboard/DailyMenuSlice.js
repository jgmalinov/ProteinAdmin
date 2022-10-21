import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const DailyMenuSlice = createSlice({
    name: 'DailyMenu',
    initialState: {
         dailyMenu: []
    },
    reducers: {
        setDailyMenu: (state, action) => {
            state.dailyMenu = action.payload;
        }
    }
});

export const selectDailyMenu = (state) => state.DailyMenuSlice.dailyMenu;
export const { setDailyMenu } = DailyMenuSlice.actions;
export default DailyMenuSlice.reducer;
