import { createSlice } from "@reduxjs/toolkit";

const FoodSlice = createSlice({
    name: 'FoodInsertion',
    initialState: {
        foodForm: {
            category: '',
            subcategory: '',
            variation: {
                type: '',
                brand: ''
            },
            values: {
                calories: 0,
                protein: 0
            }
        }
    },
    reducers: {
        setCategory: (state, action) => {
            state.foodForm.category = action.payload;
        },
        setSubcategory: (state, action) => {
            state.foodForm.subcategory = action.payload;
        },
        setVariation: (state, action) => {
            state.foodForm.variation = action.payload;
        },
        setValues: (state, action) => {
            state.foodForm.values = action.payload;
        }
    }
});

export const selectFoodForm = (state) => state.FoodSlice.foodForm;
export const {setCategory, setSubcategory, setVariation, setValues } = FoodSlice.actions;
export default FoodSlice.reducer;