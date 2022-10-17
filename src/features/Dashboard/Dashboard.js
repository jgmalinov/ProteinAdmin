import { setLoggedIn, selectLoggedIn } from "../Login/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser, selectUser, setSidebarOn, selectSidebarOn, setTimeSeries, selectTimeSeries, setStats, selectStats } from "./DashboardSlice";
import { getAge, getCalories, getProtein, BarChartConfig, createBarChart, calculateCurrentStatus} from "../Utilities";
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
    let stats = useSelector(selectStats);

    useEffect(() => {
        async function BarChart(timeSeries) {
            const barChartData = await BarChartConfig(timeSeries, undefined, email, goalCalories, goalProtein);
            if (stats.timeSeries !== timeSeries) {
                dispatch(setStats({timeSeries, ...calculateCurrentStatus(barChartData.labels, barChartData.calories, barChartData.protein, timeSeries, goalCalories, goalProtein)}));
            }
            createBarChart(timeSeries, barChartData);
        }
        BarChart(timeSeries);
    })

    function displayUserInfo() {
        const userStats = [];
        userStats.push(<h2 className="userStats">{name}</h2>);
        userStats.push(<ul>
                            <li className="userStats">Age: {age}</li>
                            <li className="userStats">Weight: {height + heightSystem}</li>
                            <li className="userStats">Height: {weight + weightSystem}</li>
                            <li className="userStats">Activity Level: {activityLevel}</li>
                      </ul>)
        userStats.push();
        return userStats;
    };

    function displayTargets() {
        const userTargets = [];
        const calorieTargets = calorieData;
        const proteinTarget = proteinData;
        userTargets.push(<h2>Goal: {goal.slice(0, 1).toUpperCase() + goal.slice(1)}</h2>);
        userTargets.push(<ul>
            <li>Recommended calorie intake: {Math.round(calorieTargets.goalCalories)} kcal/day</li>
            <li>Recommended protein intake: {Math.round(proteinTarget)} g/day</li>
        </ul>);
        console.log(userTargets);
        return userTargets;
    };

    function displayCurrentStatus() {
        const userStats = [];
        userStats.push(
            <ul>
                <h3>Calories</h3>
                <li>Calorie Intake Trend: {stats.absTrendCalories} ({stats.absTrendCalories === 'negative' ? 'increasingly deviating from target' : 'lesser deviation from target'})</li>
                <li>Average {stats.timeSeries} calorie intake: {stats.meanCaloriesOverall}kcal</li>
                <li>Average {stats.timeSeries} deviation from calorie goal: {stats.stdCaloriesOverall}kcal</li>
                <li>Average quarterly % change in deviation from calorie goal: {stats.stdChangeCalories}% ({stats.stdChangeCalories > 0 ? 'closer to target' : stats.stdChangeCalories < 0 ? 'further from target' : ''})</li>
                <li>{stats.timeSeries === 'daily' ? `Calories left until today's target met: ${stats.caloriesLeftNow}kcal` : ''}</li>
                <h3>Protein</h3>
                <li>Protein Intake Trend: {stats.absTrendProtein} ({stats.absTrendProtein === 'negative' ? 'increasingly falling short of the target' : 'approaching/exceeding the target'})</li>
                <li>Average {stats.timeSeries} protein intake: {stats.meanProteinOverall}g</li>
                <li>Average {stats.timeSeries} deviation from protein goal: {stats.stdProteinOverall}g</li>
                <li>Average quarterly % change in protein intake: {stats.meanChangeProtein}% ({stats.meanChangeProtein > 0 ? 'higher intake' : stats.stdChangeCalories < 0 ? 'reduced intake' : ''})</li>
                <li>{stats.timeSeries === 'daily' ? `Protein left until today's target met: ${stats.proteinLeftNow}g` : ''}</li>

            </ul>
        );
        console.log(userStats);
        return userStats;
    }

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

                    <section id="currentStatus">
                        {displayCurrentStatus()}
                    </section>
                </div>

                <div id="visualData">
                    <section id='charts'>
                        <div id="chartContainerCalories" style={{position: 'relative', height: '55vh', width: '45vw'}}>
                            <canvas id="CalorieChart"></canvas>
                        </div>
                        <div id="chartContainerProtein" style={{position: 'relative', height: '55vh', width: '45vw'}}>
                            <canvas id="ProteinChart"></canvas>
                        </div>
                    </section>

                    <section id="visualDataUI">
                        <button onClick={changeChartView} id='monthly'>Monthly</button>
                        <button onClick={changeChartView} id='daily'>Daily</button>
                    </section>
                </div>
            </div>
        )
    };

    return (
        <div>
            {user === undefined ? undefined : renderContent()}
        </div>
        )
};

/* <Bar options={barChartData.options} data={barChartData.data} /> */