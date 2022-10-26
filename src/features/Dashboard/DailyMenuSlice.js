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
            if (typeof action.payload === 'object' && !Array.isArray(action.payload)) {
                let duplicate = false;
                const newItemName = Object.keys(action.payload)[0];
                for (let i=0; i<state.currentBatch.length; i++) {
                    const currentBatchItemName = Object.keys(state.currentBatch[i])[0];
                    
                    if (newItemName === currentBatchItemName) {
                        const weight = action.payload[newItemName].weight;
                        state.currentBatch[i][currentBatchItemName].calories += action.payload[newItemName].calories;
                        state.currentBatch[i][currentBatchItemName].protein += action.payload[newItemName].protein;
                        state.currentBatch[i][currentBatchItemName].weight += weight;
                        duplicate = true;
                        break;
                    };
                };
                if (!duplicate) {
                    state.currentBatch.push(action.payload);
                };
            } else if (typeof action.payload === 'string') {
                for (let i=0; i<state.currentBatch.length; i++) {
                    const currentBatchItemName = Object.keys(state.currentBatch[i])[0];
                    if (action.payload === currentBatchItemName) {
                        state.currentBatch.splice(i, 1)
                    };
                }
            } else {
                state.currentBatch = [];
            };
        }
    }
});

export const selectDailyMenu = (state) => state.DailyMenuSlice.dailyMenu;
export const selectDailyMenuUpdated = (state) => state.DailyMenuSlice.dailyMenuUpdated;
export const selectCurrentBatch = (state) => state.DailyMenuSlice.currentBatch;
export const { setDailyMenu, setDailyMenuUpdated, setCurrentBatch } = DailyMenuSlice.actions;
export default DailyMenuSlice.reducer;
