import { selectSuccessfulRegistration, updateSuccessfulRegistration } from "./RegisterSlice";
import { setEmail, setPassword, selectCredentials, setLoggedIn, selectLoggedIn } from "./LoginSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { useEffect } from "react";


export function Login(args) {
    const justRegistered = useSelector(selectSuccessfulRegistration);
    const dispatch = useDispatch();
    const credentials = useSelector(selectCredentials);
    const loggedIn = useSelector(selectLoggedIn);

    function renderJustRegistered() {
        if (justRegistered) {
            return (<h2>You have successfully registered! Please log-in to your account</h2>)
        } else {
            return
        }
    };

    useEffect(() => {
        async function checkLoginStatus() {
            const url = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(url + 'login/status', {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
            const responseMsg = await response.text();

            if (responseMsg === 'Authenticated') {
                dispatch(setLoggedIn(true));
            }
        }
        checkLoginStatus();
    }) 

    function handleSubmit(e) {
        e.preventDefault();
        if (justRegistered) {
            dispatch(updateSuccessfulRegistration(false));
        };
        const errorMessageBox = document.getElementById('errorMessages');
        const protocol = process.env.REACT_APP_BACKEND_PROTOCOL;
        const host =  process.env.REACT_APP_BACKEND_HOST;
        const port = process.env.REACT_APP_BACKEND_PORT;
        const pathname = window.location.pathname;
        const url = protocol + '//' + host + ':' + port + pathname;
       
        fetch(url, {method: 'POST', 
                    redirect: 'follow', 
                    body: JSON.stringify(credentials),  
                    headers: {'Content-Type': 'application/json'}, 
                    credentials: "include"})
        .then(async (res) => {
            const outcome = await res.text();
            if (outcome === 'Success') {
                dispatch(setLoggedIn(true));
            } else if (outcome === 'Email is not registered') {
                errorMessageBox.innerHTML = 'Email is not registered'
            } else {
                errorMessageBox.innerHTML = 'Incorrect password'
            };
        })
        .catch((err) => {
            console.log(err);
        });
        
    };

    function handleChange(e) {
        e.target.id === 'emailField' ? dispatch(setEmail(e.target.value)) : dispatch(setPassword(e.target.value));
    }

    return (
        <div id="viewBody">
            <section id="loginSection">
                <h1>Protein Admin</h1>
                {loggedIn ? <Navigate to={'/dashboard'}/> : undefined}
                {renderJustRegistered()}
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div id="errorMessages"></div>
                    <input placeholder="email" id="emailField" onChange={handleChange}></input>
                    <input placeholder="password" id="passwordField" onChange={handleChange}></input>
                    <button type="submit">Login!</button>
                    <button type="submit">Sign in with Google</button>
                    <Link id="LinkToRegister" to="/register">Don't have an account? Register here!</Link>
                </form>
            </section>
        </div>
    )
}