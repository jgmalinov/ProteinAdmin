import { createSlice } from "@reduxjs/toolkit";

const EditProfileSlice = createSlice({
    name: 'EditProfile',
    initialState: {
        profile: {
            name: '',
            dob: '',
            weight: '',
            height: '',
            goal: '',
            activityLevel: ''
        }
    },
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setName: (state, action) => {
            state.profile.name = action.payload;
        },
        setDOB: (state, action) => {
            state.profile.dob = action.payload;
        },
        setWeight: (state, action) => {
            state.profile.weight = action.payload;
        },
        setHeight: (state, action) => {
            state.profile.height = action.payload;
        },
        setGoal: (state, action) => {
            state.profile.goal = action.payload;
        },
        setActivityLevel: (state, action) => {
            state.profile.activityLevel = action.payload;
        }
    }
});

export const selectProfile = (state) => state.EditProfileSlice.profile;
export const {setProfile, setName, setDOB, setWeight, setHeight, setGoal, setActivityLevel} = EditProfileSlice.actions;
export default EditProfileSlice.reducer;
