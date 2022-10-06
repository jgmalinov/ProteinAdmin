import { createSlice } from "@reduxjs/toolkit";

const LoginSlice = createSlice({
    name: 'Login',
    initialState: {
        credentials: {
            email: '',
            password: '',
        },
        loggedIn: false
    },

    reducers: {
        setEmail: (state, action) => {
            state.credentials.email = action.payload;
        },
        setPassword: (state, action) => {
            state.credentials.password = action.payload;
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        }
    }
});

export const selectLoggedIn = (state) => state.LoginSlice.loggedIn;
export const selectCredentials = (state) => state.LoginSlice.credentials;
export const {setEmail, setPassword, setLoggedIn} = LoginSlice.actions;
export default LoginSlice.reducer; 