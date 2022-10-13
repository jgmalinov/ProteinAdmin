import { setLoggedIn, selectLoggedIn } from "../Login/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser, selectUser, setSidebarOn, selectSidebarOn, setTimeSeries, selectTimeSeries } from "./DashboardSlice";
import { getAge, getCalories, getProtein, BarChartConfig, createBarChart} from "../Utilities";
import { Sidebar } from "./Sidebar";
import { Bar } from 'react-chartjs-2';
import { useEffect } from "react";

export function Dashboard(args) {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const timeSeries = useSelector(selectTimeSeries);
    const {name, weight, weightSystem, height, heightSystem, goal, gender, activityLevel, email} = user;
    const age = getAge(user.dob);
    const calorieData = getCalories(goal, weight, height, age, gender, activityLevel);
    const proteinData = getProtein(weight);
    const CaloriesAsNum = Math.round(Number(calorieData.goalCalories));
    const ProteinAsNum = Math.round(Number(proteinData));
    const goalCalories = ['daily', 'default'].includes(timeSeries) ? CaloriesAsNum : CaloriesAsNum * 30.437;
    const goalProtein = ['daily', 'default'].includes(timeSeries) ? ProteinAsNum : ProteinAsNum * 30.437;
    const loggedIn = useSelector(selectLoggedIn);
    const sidebarOn = useSelector(selectSidebarOn);

    useEffect(() => {
        async function BarChart(timeSeries) {
            const barChartData = await BarChartConfig(timeSeries, undefined, email, goalCalories, goalProtein);
            createBarChart(timeSeries, barChartData);
        }
        BarChart(timeSeries);
    })
        


    function renderContent() {
        return (
                <div id="dashboard">
                {loggedIn ? undefined : <Navigate to='/login' />}
                <header>
                    <h1 id="title">Protein Admin</h1>
                    <i className="fa-solid fa-bars" onClick={openSideBar}></i>
                </header>

                <Sidebar logOut={logOut} closeSideBar={closeSideBar}/>

                <div id="stats">
                    <section id="personalInfo">
                    {displayUserInfo()}
                    </section>

                    <section id="targets">
                        {displayTargets()}
                    </section>
                </div>

                <div id="charts">
                    <div id="chartContainer" style={{position: 'relative', height: '51vh', width: '75vw'}}>
                        <canvas id="myChart"></canvas>
                    </div>
                    
                    <button onClick={changeChartView} id='monthly'>Monthly</button>
                    <button onClick={changeChartView} id='daily'>Daily</button>
                </div>
            </div>
        )
    }

    function displayUserInfo() {
        const userStats = [];
        userStats.push(<h2 className="userStats">{name}</h2>);
        userStats.push(<h2 className="userStats">Age: {age}</h2>);
        userStats.push(<h2 className="userStats">Weight: {height + heightSystem}</h2>);
        userStats.push(<h2 className="userStats">Height: {weight + weightSystem}</h2>);
        userStats.push(<h2 className="userStats">Activity Level: {activityLevel}</h2>);
        return userStats;
    };

    function displayTargets() {
        const userTargets = [];
        const calorieTargets = calorieData;
        const proteinTarget = proteinData;
        userTargets.push(<h2>Goal: {goal}</h2>);
        userTargets.push(<h2>Recommended calorie intake: {calorieTargets.goalCalories} kcal/day</h2>);
        userTargets.push(<h2>Recommended protein intake: {proteinTarget} g/day</h2>);
        return userTargets;
    };

    function openSideBar(e) {
        const sideBar = document.getElementById('sidebar');
        const sidebarBackground = document.getElementById('sidebarDim');
        sidebarBackground.style.visibility = 'visible';
        sidebarBackground.style.background = 'rgba(0, 0, 0, 0.75)';
        sideBar.style.width = '20vw';
    };

    function closeSideBar(e) {
        const sideBar = document.getElementById('sidebar');
        const sidebarBackground = document.getElementById('sidebarDim');
        sidebarBackground.style.visibility = 'hidden';
        sidebarBackground.style.background = 'rgba(0, 0, 0, 0.1)';
        sideBar.style.width = '0px';
    };

    function changeChartView(e) {
        if (e.target.id === 'monthly') {
            dispatch(setTimeSeries('monthly'));
        } else {
            dispatch(setTimeSeries('daily'));
        }
    };

    async function logOut(e) {
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'logout', {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });
        console.log(response);
        const responseMessage = await response.text();
        if (responseMessage === 'logged out') {
            dispatch(setLoggedIn(false));
            dispatch(setUser({}));
        }
    };

    return (
        <div>
            {user === undefined ? undefined : renderContent()}
        </div>
        )
};

/* <Bar options={barChartData.options} data={barChartData.data} /> */