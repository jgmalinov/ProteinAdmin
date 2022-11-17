import { selectSuccessfulRegistration, updateSuccessfulRegistration } from "./RegisterSlice";
import { setEmail, setPassword, selectCredentials, setLoggedIn, selectLoggedIn } from "./LoginSlice";
import { setUser, selectUser } from "../Dashboard/DashboardSlice";
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
            const responseJS = await response.json();
            const responseMsg = responseJS.status;
            const user = responseJS.user;

            if (responseMsg === 'Authenticated') {
                dispatch(setLoggedIn(true));
                dispatch(setUser(user));
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
            const response = await res.json();
            if (response.status === 'Success') {
                dispatch(setLoggedIn(true));
                dispatch(setUser(response.user));
            } else if (res.status === 'Email is not registered') {
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
            <section id="loginSection" data-testid='loginSection'>
                {loggedIn ? <Navigate to={'/dashboard'}/> : undefined}
                {renderJustRegistered()}
                <div className='logo'>
                    <i>&#128170;</i>
                    <i className='fa-solid fa-utensils'></i>
                    <div className="secondBicep">
                        <i>&#128170;</i>
                    </div>
                </div>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div id="headerLoginForm">
                        <Link to='/' id="backArrowLogin"><i class="fa-solid fa-backward-step"></i></Link>
                        <h1 className="textLogo">Protein Admin</h1>
                    </div>


                    <div id="errorMessages"></div>

                    <div id='loginInputsContainer'>
                        <input type='email' placeholder="Email" id="emailField" onChange={handleChange}></input>
                        <input type='password' placeholder="Password" id="passwordField" onChange={handleChange}></input>
                    </div>

                    <div id="loginButtonsContainer">
                        <button type="submit">Login!</button>
                        <button type="submit">Sign in with Google</button>
                        <Link id="linkToRegister" to="/register">Don't have an account? Register here!</Link>
                    </div>
                    
                </form>
            </section>
        </div>
    )
}