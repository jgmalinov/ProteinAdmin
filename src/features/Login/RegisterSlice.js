import { createSlice } from "@reduxjs/toolkit";

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
            weightSystem: 'kg'
        }
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
        }
    }
});


export const selectRegistrationForm = (state) => state.RegisterSlice.RegistrationForm;
export const { updateRegistrationForm, clearRegistrationForm } = RegisterSlice.actions;
export default RegisterSlice.reducer;