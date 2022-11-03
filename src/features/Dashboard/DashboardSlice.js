import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
    name: 'Dashboard',
    initialState: {
        user: {},
        sidebarOn: false,
        timeSeries: 'default',
        stats: '',
        caloriesToday: '?',
        caloriesInfo: 'lite',
        proteinToday: '?',
        proteinInfo: 'lite',
        updateDashboard: false
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
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setCaloriesToday: (state, action) => {
            state.caloriesToday = action.payload;
        },
        setCaloriesInfo: (state, action) => {
            state.caloriesInfo = action.payload;
        },
        setProteinToday: (state, action) => {
            state.proteinToday = action.payload;
        },
        setProteinInfo: (state, action) => {
            state.proteinInfo = action.payload;
        },
        setUpdateDashboard: (state, action) => {
            state.updateDashboard = action.payload;
        }

    }
});

export const selectStats = (state) => state.DashboardSlice.stats;
export const selectTimeSeries = (state) => state.DashboardSlice.timeSeries;
export const selectSidebarOn = (state) => state.DashboardSlice.sidebarOn;
export const selectUser = (state) => state.DashboardSlice.user;
export const selectCaloriesToday = (state) => state.DashboardSlice.caloriesToday;
export const selectProteinToday = (state) => state.DashboardSlice.proteinToday;
export const selectCaloriesInfo = (state) => state.DashboardSlice.caloriesInfo;
export const selectProteinInfo = (state) => state.DashboardSlice.proteinInfo;
export const selectUpdateDashboard = (state) => state.DashboardSlice.updateDashboard;
export const { setUser, setSidebarOn, setTimeSeries, setStats, setCaloriesToday, setProteinToday, setCaloriesInfo, setProteinInfo, setUpdateDashboard} = DashboardSlice.actions;
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