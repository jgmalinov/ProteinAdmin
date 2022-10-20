import { createSlice } from "@reduxjs/toolkit";

const LoggerSlice = createSlice({
    name: 'Logger',
    initialState: {
        nutritionalTable: [],
        autocomplete: []
    },
    reducers: {
        setNutritionalTable: (state, action) => {
            state.nutritionalTable = action.payload
        },
        setAutocomplete: (state, action) => {
            state.autocomplete = action.payload;
        }
    }
});

export const selectNutritionalTable = (state) => state.LoggerSlice.nutritionalTable;
export const selectAutocomplete = (state) => state.LoggerSlice.autocomplete;
export const { setNutritionalTable, setAutocomplete } = LoggerSlice.actions;
export default LoggerSlice.reducer;
