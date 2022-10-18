import { createSlice } from "@reduxjs/toolkit";

const LoggerSlice = createSlice({
    name: 'Logger',
    initialState: {
        nutritionalTable: {}
    },
    reducers: {
        setNutritionalTable: (state, action) => {
            state.nutritionalTable = action.payload
        }
    }
});

export const selectNutritionalTable = (state) => state.LoggerSlice.nutritionalTable;
export const { setNutritionalTable } = LoggerSlice.actions;
export default LoggerSlice.reducer;

