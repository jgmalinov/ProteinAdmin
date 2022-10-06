import { selectSuccessfulRegistration, updateSuccessfulRegistration } from "./RegisterSlice";
import { setEmail, setPassword, selectCredentials, setLoggedIn, selectLoggedIn } from "./LoginSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";


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

    function handleSubmit(e) {
        e.preventDefault();
        if (justRegistered) {
            dispatch(updateSuccessfulRegistration(false));
        };
        const protocol = process.env.REACT_APP_BACKEND_PROTOCOL;
        const host =  process.env.REACT_APP_BACKEND_HOST;
        const port = process.env.REACT_APP_BACKEND_PORT;
        const pathname = window.location.pathname;
        const url = protocol + '//' + host + ':' + port + pathname;
       
        fetch(url, {method: 'POST', body: JSON.stringify(credentials),  headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}})
        .then((res) => {
            console.log(res);
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
                {renderJustRegistered()}
                <form id="loginForm" onSubmit={handleSubmit}>
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