import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const DailyMenuSlice = createSlice({
    name: 'DailyMenu',
    initialState: {
         dailyMenu: [],
         dailyMenuUpdated: true,
         currentBatch: []
    },

    reducers: {
        setDailyMenu: (state, action) => {
            state.dailyMenu = action.payload;
        },
        setDailyMenuUpdated: (state, action) => {
            state.dailyMenuUpdated = action.payload;
        },
        setCurrentBatch: (state, action) => {
            state.currentBatch.push(action.payload);
        }
    }
});

export const selectDailyMenu = (state) => state.DailyMenuSlice.dailyMenu;
export const selectDailyMenuUpdated = (state) => state.DailyMenuSlice.dailyMenuUpdated;
export const selectCurrentBatch = (state) => state.DailyMenuSlice.currentBatch;
export const { setDailyMenu, setDailyMenuUpdated, setCurrentBatch } = DailyMenuSlice.actions;
export default DailyMenuSlice.reducer;
