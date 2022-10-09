import { setLoggedIn, selectLoggedIn } from "../Login/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function Dashboard(args) {
    const loggedIn = useSelector(selectLoggedIn);
    const dispatch = useDispatch();
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
        }
    }
    return (
        <div>
            {loggedIn ? undefined : <Navigate to='/login' />}
            <h1>Protein Admin For the Win Malin</h1>
            <div id="stats">
                <section id="personalInfo"></section>
                <section id="targets"></section>
            </div>
            <button onClick={logOut}>Logout</button>
        </div>
    );
}