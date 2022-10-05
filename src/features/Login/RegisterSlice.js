import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const RegisterSlice = createSlice({
    name: 'RegistrationForm',
    initialState: {
        RegistrationForm: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            height: '',
            heightSystem: 'cm',
            weight: '',
            weightSystem: 'kg',
            activityLevel: 'BMR',
        },
        errors: []
    },
    reducers: {
        updateRegistrationForm: (state, action) => {
            const key = action.payload.key;
            const value = action.payload.value;
            state.RegistrationForm[key] = value;
        },

        clearRegistrationForm: (state) => {
        for (let key in state.RegistrationForm) {
            switch (key) {
                case 'heightSystem':
                    state.RegistrationForm[key] = 'cm'
                    break
                case 'weightSystem': 
                    state.RegistrationForm[key] = 'kg'
                    break
                default: 
                    state.RegistrationForm[key] = ''
                };
            }
        },
        updateErrors(state, action) {
            state.errors = action.payload;
        }
    }
});

export const selectErrors = (state) => state.RegisterSlice.errors;
export const selectRegistrationForm = (state) => state.RegisterSlice.RegistrationForm;
export const { updateRegistrationForm, clearRegistrationForm, updateErrors } = RegisterSlice.actions;
export default RegisterSlice.reducer;