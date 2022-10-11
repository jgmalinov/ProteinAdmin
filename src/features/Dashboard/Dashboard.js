import { setLoggedIn, selectLoggedIn } from "../Login/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser, selectUser, setSidebarOn, selectSidebarOn } from "./DashboardSlice";
import { getAge, getCalories, getProtein, BarChartConfig } from "../Utilities";
import { Sidebar } from "./Sidebar";
import { Bar } from 'react-chartjs-2';
import { useRef } from "react";

export function Dashboard(args) {
    const loggedIn = useSelector(selectLoggedIn);
    const sidebarOn = useSelector(selectSidebarOn);
    const user = useSelector(selectUser);
    const {name, weight, weightSystem, height, heightSystem, goal, gender, activityLevel} = user
    const age = getAge(user.dob);
    const barChartRef = useRef();
    const barChartConfigData = BarChartConfig('default', barChartRef, 'gogotkd24@gmail.com');
    const dispatch = useDispatch();

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
        const calorieTargets = getCalories(goal, weight, height, age, gender, activityLevel);
        const proteinTarget = getProtein(weight)
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
        const chart = barChartRef.current;
        console.log(chart.data);
    }

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
                <button onClick={changeChartView}>Monthly</button>
                <button onClick={changeChartView}>Daily</button>
            </div>
        </div>
    );
};

               /* <Bar options={options} data={data} ref={barChartRef}/> */