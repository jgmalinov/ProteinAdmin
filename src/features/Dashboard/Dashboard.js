import { setLoggedIn, selectLoggedIn } from "../Login/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser, selectUser } from "./DashboardSlice";
import { getAge, getCalories, getProtein } from "../Utilities";

export function Dashboard(args) {
    const loggedIn = useSelector(selectLoggedIn);
    const user = useSelector(selectUser);
    const {name, weight, weightSystem, height, heightSystem, goal, gender, activityLevel} = user
    const age = getAge(user.dob);
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
        userTargets.push(<h2>Recommended calorie intake: {calorieTargets.goalCalories}kcal/day</h2>);
        userTargets.push(<h2>Recommended protein intake: {proteinTarget}</h2>);
        return userTargets;
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
            <h1 id="title">Protein Admin For the Win Malin</h1>
            <div id="stats">
                <section id="personalInfo">
                {displayUserInfo()}
                </section>

                <section id="targets">
                    {displayTargets()}
                </section>
            </div>
            <button onClick={logOut}>Logout</button>
        </div>
    );
}