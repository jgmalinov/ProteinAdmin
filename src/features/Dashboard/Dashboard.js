import { setLoggedIn, selectLoggedIn } from "../Login/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser, selectUser, setSidebarOn, selectSidebarOn, setTimeSeries, selectTimeSeries, setStats, selectStats, setCaloriesToday, selectCaloriesToday, setProteinToday, selectProteinToday, setUpdateDashboard, selectUpdateDashboard, setCalorieCardFlipped, selectCalorieCardFlipped, setProteinCardFlipped, selectProteinCardFlipped } from "./DashboardSlice";
import { getAge, getCalories, getProtein, BarChartConfig, createBarChart, calculateCurrentStatus} from "../Utilities";
import { Sidebar } from "./Sidebar";
import { Bar } from 'react-chartjs-2';
import { useEffect } from "react";
import { Logger } from "./Logger";
import { DailyMenu } from "./DailyMenu";
import e from "cors";


export function Dashboard(args) {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const {name, weight, weightSystem, height, heightSystem, goal, gender, activityLevel, email} = user;
    const timeSeries = useSelector(selectTimeSeries);
    const age = getAge(user.dob);
    const calorieData = getCalories(goal, weight, height, age, gender, activityLevel);
    const proteinData = getProtein(weight);
    const CaloriesAsNum = Math.round(Number(calorieData.goalCalories));
    const ProteinAsNum = Math.round(Number(proteinData));

    // simple daily calories and protein data and goal 
    const caloriesToday = useSelector(selectCaloriesToday);
    const proteinToday = useSelector(selectProteinToday);
    const goalCalories = ['daily', 'default'].includes(timeSeries) ? CaloriesAsNum : CaloriesAsNum * 30.437;
    const goalProtein = ['daily', 'default'].includes(timeSeries) ? ProteinAsNum : ProteinAsNum * 30.437;

    getDailyCaloriesAndProtein();
    
    // simple daily calories and protein data and goal

    const loggedIn = useSelector(selectLoggedIn);
    const sidebarOn = useSelector(selectSidebarOn);
    let stats = useSelector(selectStats);
    const calorieCardFlipped = useSelector(selectCalorieCardFlipped);
    const proteinCardFlipped = useSelector(selectProteinCardFlipped);
    const updateDashboard = useSelector(selectUpdateDashboard);


    useEffect(() => {
        if (updateDashboard) {
            dispatch(setUpdateDashboard(false));
        };

        async function BarChart(timeSeries) {
            const barChartData = await BarChartConfig(timeSeries, undefined, email, goalCalories, goalProtein);
            if (stats.timeSeries !== timeSeries) {
                dispatch(setStats({timeSeries, ...calculateCurrentStatus(barChartData.labels, barChartData.calories, barChartData.protein, timeSeries, goalCalories, goalProtein)}));
            }
            createBarChart(timeSeries, barChartData);
        }
        BarChart(timeSeries);
        const statusLiteCalories = document.querySelector('#currentStatusCalories>.statusLite');
        const differenceCalories = Number(goalCalories) - Number(caloriesToday);
        if (differenceCalories > 50) {
            statusLiteCalories.style.backgroundColor = 'rgb(241, 244, 196)';
        } else if (differenceCalories < 50 && differenceCalories > -50) {
            statusLiteCalories.style.backgroundColor = 'aquamarine';
        } else {
            statusLiteCalories.style.backgroundColor = 'rgb(240, 134, 134)';
        };

        const statusLiteProtein = document.querySelector('#currentStatusProtein>.statusLite');
        const differenceProtein = Number(goalProtein) - Number(proteinToday);
        if (differenceProtein > 0) {
            statusLiteProtein.style.backgroundColor = 'rgb(240, 134, 134)';
        } else {
            statusLiteProtein.style.backgroundColor = 'aquamarine';
        };
    });

    async function getDailyCaloriesAndProtein(caloriesOrProtein) {
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + `daily/data`, {credentials: 'include', headers: {'Content-Type': 'application/json'}});
        const responseJS = await response.json();
        const calories = responseJS.calories, protein = responseJS.protein;
        dispatch(setCaloriesToday(calories));
        dispatch(setProteinToday(protein));
    };

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

    function displayCalorieStatusLite() {
        const userStats = [];
        userStats.push(
            <div className="statusLite">
                <h2>{timeSeries === 'monthly' ? 'Monthly' : 'Daily'} Calories</h2>
                <h2>{Number(caloriesToday).toFixed(1)} / {Number(goalCalories).toFixed(1)}kcal</h2>
            </div>
        );
        return userStats;
    };

    function displayCalorieStatus() {
        const userStats = [];
        userStats.push(
            <div className="statusDetailed">
                <h2>Calories</h2>
                <ul>
                    <li>Calorie Intake Trend: {stats.absTrendCalories === 'positive' ? <i class="fa-solid fa-arrow-trend-up"></i> : <i class="fa-solid fa-arrow-trend-down"></i>} ({stats.absTrendCalories === 'negative' ? 'increasingly deviating from target' : 'lesser deviation from target'})</li>
                    <li>Average {stats.timeSeries === 'monthly' ? 'monthly' : 'daily'} calorie intake: {stats.meanCaloriesOverall}kcal</li>
                    <li>Average {stats.timeSeries === 'monthly' ? 'monthly' : 'daily'} deviation from calorie goal: {stats.stdCaloriesOverall}kcal</li>
                    <li>Average {stats.timeSeries === 'monthly' ? 'quarterly' : 'weekly'} % change in deviation from calorie goal: {stats.stdChangeCalories}% ({stats.stdChangeCalories > 0 ? 'closer to target' : stats.stdChangeCalories < 0 ? 'further from target' : ''})</li>
                    {stats.timeSeries === 'daily' ? <li>Calories left until today's target met: {Number(stats.caloriesLeftNow).toFixed(2)}kcal</li> : ''}
                </ul>
            </div>
        );
        return userStats;
    };

    
    function displayProteinStatusLite() {
        const userStats = [];
        userStats.push(
            <div className="statusLite">
                <h2>{timeSeries === 'monthly' ? 'Monthly' : 'Daily'} Protein</h2>
                <h2>{Number(proteinToday).toFixed(1)} / {Number(goalProtein).toFixed(1)}g</h2>
            </div>
        );
        return userStats;
    };

    function displayProteinStatus() {
        const userStats = [];
        userStats.push(
            <div className="statusDetailed">
                <h2>Protein</h2>
                <ul>
                    <li>Protein Intake Trend: {stats.absTrendProtein === 'positive' ? <i class="fa-solid fa-arrow-trend-up"></i> : <i class="fa-solid fa-arrow-trend-down"></i>} ({stats.absTrendProtein === 'negative' ? 'increasingly falling short of the target' : 'approaching/exceeding the target'})</li>
                    <li>Average {stats.timeSeries === 'monthly' ? 'monthly' : 'daily'} protein intake: {stats.meanProteinOverall}g</li>
                    <li>Average {stats.timeSeries === 'monthly' ? 'monthly' : 'daily'} deviation from protein goal: {stats.stdProteinOverall}g</li>
                    <li>Average {stats.timeSeries === 'monthly' ? 'quarterly' : 'weekly'} % change in protein intake: {stats.meanChangeProtein}% ({stats.meanChangeProtein > 0 ? 'higher intake' : stats.stdChangeCalories < 0 ? 'reduced intake' : ''})</li>
                    {stats.timeSeries === 'daily' ? <li>Protein left until today's target met: {Number(stats.proteinLeftNow).toFixed(2)}g</li> : ''}
                </ul>
            </div>

        );
        return userStats;
    };

    function toggleCaloriesInfo() {
        const currentStatusCalories = document.getElementById('currentStatusCalories');
        if (calorieCardFlipped) {
            currentStatusCalories.style.transform = 'rotateY(0deg)';
            dispatch(setCalorieCardFlipped(false));
        } else {
            currentStatusCalories.style.transform = 'rotateY(180deg)';
            dispatch(setCalorieCardFlipped(true));
        }
    };

    
    function toggleProteinInfo() {
        const currentStatusProtein = document.getElementById('currentStatusProtein');
        if (proteinCardFlipped) {
            currentStatusProtein.style.transform = 'rotateY(0deg)';
            dispatch(setProteinCardFlipped(false));    
        } else {
            currentStatusProtein.style.transform = 'rotateY(180deg)';
            dispatch(setProteinCardFlipped(true));
        };
    };

    function openSideBar(e) {
        const sideBar = document.getElementById('sidebar');
        const sidebarBackground = document.getElementById('sidebarDim');
        const sidebarX = document.getElementById('sidebarX');
        sidebarBackground.style.visibility = 'visible';
        sidebarBackground.style.background = 'rgba(0, 0, 0, 0.75)';
        sideBar.style.width = '300px';
        sidebarX.style.right = '20px';
    };

    function closeSideBar(e) {
        const sideBar = document.getElementById('sidebar');
        const sidebarBackground = document.getElementById('sidebarDim');
        const sidebarX = document.getElementById('sidebarX');
        sidebarBackground.style.visibility = 'hidden';
        sidebarBackground.style.background = 'rgba(0, 0, 0, 0.1)';
        sideBar.style.width = '0px';
        sidebarX.style.right = '-20px';
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

    function toggleFilters(e) {
        const filters = document.getElementById('filters');
        const loggerCategory = document.getElementById('loggerCategory');
        const loggerSubcategory = document.getElementById('loggerSubcategory');
        if (filters.style.height === '0px') {
            filters.style.height = '50px';
            loggerCategory.style.opacity = '1';
            loggerCategory.disabled = false;
            loggerSubcategory.style.opacity = '1';
            loggerSubcategory.disabled = false;

        } else {
            filters.style.height = '0px';
            loggerCategory.style.opacity = '0';
            loggerSubcategory.style.opacity = '0';
            loggerCategory.disabled = true;
            loggerSubcategory.disabled = true;
        }       
    };

    function openDailyMenu(e) {
        const dailyMenuBackground = document.getElementById('dailyMenuBackground');
        const dailyMenuTable = document.getElementById('dailyMenuTable');

        dailyMenuBackground.style.visibility = 'visible';
        dailyMenuBackground.style.background = 'rgba(0, 0, 0, 0.6)';

        dailyMenuTable.style.left = '0%';
    };

    function renderContent() {
        return (
            <div id="dashboard">
                <header>
                    <h1 id="title">Protein Admin</h1>
                    <Logger />
                    <div id="sideBarIconContainer">
                        <i class="fa-solid fa-filter" onClick={toggleFilters}></i>
                        <i class="fa-solid fa-utensils" style={{'fontSize': '25px', 'marginRight': '15px'}} onClick={openDailyMenu}></i>
                        <i className="fa-solid fa-bars" onClick={openSideBar}></i>
                    </div>
                    
                </header>

                <Sidebar logOut={logOut} closeSideBar={closeSideBar}/>
                <DailyMenu />

                <div id="stats">
                
                    <section class='overviewStats' id="personalInfo">
                        {displayUserInfo()}
                    </section>

                    <section class='overviewStats' id="targets">
                        {displayTargets()}
                    </section>

                    <section id="currentStatusCalories" onClick={toggleCaloriesInfo}>
                            {displayCalorieStatus()}
                            {displayCalorieStatusLite()}
                    </section>

                    <section id="currentStatusProtein" onClick={toggleProteinInfo}>
                            {displayProteinStatus()}
                            {displayProteinStatusLite()}
                    </section>
                </div>

                <div id="visualData">
                    <section id='charts'>
                        <div id="chartContainerCalories" style={{position: 'relative', height: '40vh', width: '46.98vw'}}>
                            <canvas id="CalorieChart"></canvas>
                        </div>
                        <div id="chartContainerProtein" style={{position: 'relative', height: '40vh', width: '46.97vw'}}>
                            <canvas id="ProteinChart"></canvas>
                        </div>
                    </section>

                    <section id="visualDataUI">
                        <button onClick={changeChartView} id='monthly'>MONTHLY</button>
                        <button onClick={changeChartView} id='daily'>DAILY</button>
                    </section>
                </div>
            </div>
        )
    };

    return (
        <div>
            {!loggedIn ? <Navigate to='/login' /> : renderContent()}
        </div>
        )
};

/* <Bar options={barChartData.options} data={barChartData.data} /> */