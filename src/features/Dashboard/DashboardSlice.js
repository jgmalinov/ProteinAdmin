import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
    name: 'Dashboard',
    initialState: {
        user: {},
        sidebarOn: false,
        timeSeries: 'default' 
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setSidebarOn: (state, action) => {
            state.sidebarOn = action.payload;
        },
        setTimeSeries: (state, action) => {
            state.timeSeries = action.payload;
        }
    }
});

export const selectTimeSeries = (state) => state.DashboardSlice.timeSeries;
export const selectSidebarOn = (state) => state.DashboardSlice.sidebarOn;
export const selectUser = (state) => state.DashboardSlice.user;
export const { setUser, setSidebarOn, setTimeSeries } = DashboardSlice.actions;
export default DashboardSlice.reducer; 

/* options: {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: `Placeholder`
        }
    }
},
data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
        {
            label: 'Calories',
            data: [1200, 1300, 1400],
            backgroundColor: 'blue'
        },
        {
            label: 'Protein',
            data: [120, 130, 140],
            backgroundColor: 'green'
        }
    ]
} */