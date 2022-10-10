import { useSelector, useDispatch } from "react-redux";
import { updateRegistrationForm, selectRegistrationForm, updateErrors, selectErrors, updateSuccessfulRegistration, selectSuccessfulRegistration } from "./RegisterSlice";
import { Navigate } from "react-router-dom";


export function Register(args) {
    const justRegistered = useSelector(selectSuccessfulRegistration);
    const registrationForm = useSelector(selectRegistrationForm);
    const errors = useSelector(selectErrors);
    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(updateErrors([]));
        const protocol = process.env.REACT_APP_BACKEND_PROTOCOL;
        const host =  process.env.REACT_APP_BACKEND_HOST;
        const port = process.env.REACT_APP_BACKEND_PORT;
        const pathname = window.location.pathname;
        const url = protocol + '//' + host + ':' + port + pathname;
        const response = await fetch(url, {method: 'POST', body: JSON.stringify(registrationForm), headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
        const responseJS = response.json();
        console.log(responseJS);
        responseJS.then((res) => {
            if (res.errors) {
                dispatch(updateErrors(res.errors));
            } else if (res.message && res.message === 'Successfully registered!') {
                dispatch(updateSuccessfulRegistration(true));
            }
        });
    };

    function handleChange(e) {
        let key, value;
        if (e.target.name === 'weightSystem' || e.target.name === 'heightSystem') {
            key = e.target.name;
            value = e.target.id;
        } else {
            key = e.target.name;
            value = e.target.value;
        }

        dispatch(updateRegistrationForm({key, value}));
    };

    function renderErrors() {
        const errorMessages = [];
        if (errors) {
            errors.forEach((err) => {
                const errJSX = <h3>{err.message}</h3>;
                errorMessages.push(errJSX)
            });
            return <div id="errors">{errorMessages}</div>
        };
    };

    return (
        <div id="viewBody">
            {justRegistered ? <Navigate replace to='/login'/> : undefined}
            {renderErrors()}
            <form id="registerForm" onSubmit={handleSubmit}>
                <h1>Registration Form</h1>
                <input className="mainInput" placeholder="email" type="email" name="email" id="email" onChange={handleChange}></input>
                <input className="mainInput" placeholder="password" type="password" name="password" id="password" onChange={handleChange}></input>
                <input className="mainInput" placeholder="confirm password" type="password" name="confirmPassword" id="confirmPassword" onChange={handleChange}></input>
                <input className="mainInput" placeholder="name" type="text" id="name" name="name" onChange={handleChange}></input>
                <input className="mainInput" placeholder="date of birth" type="date" id="DOB" name="DOB" onChange={handleChange}></input>
                
                
                <fieldset>
                    <legend>Height</legend>
                    <input className="mainInput" placeholder="height" type="number" name="height" id="height" onChange={handleChange}/>

                    <input type="radio" id='cm'  name="heightSystem" defaultChecked onChange={handleChange}/>
                    <label htmlFor='cm'>Metric</label>

                    <input type="radio" id='ft' name="heightSystem" onChange={handleChange}></input>
                    <label htmlFor='ft'>Imperial</label>
                </fieldset>

                
                <fieldset>
                    <legend>Weight</legend>
                    <input className="mainInput" placeholder="weight" type="number" name="weight" onChange={handleChange}></input>
                    <input type="radio" id='kg' name="weightSystem" defaultChecked onChange={handleChange}/>
                    <label htmlFor='kg'>Kg</label>

                    <input type="radio" id='lbs' name="weightSystem" onChange={handleChange}/>
                    <label htmlFor='lbs'>Lbs</label>  
                </fieldset>

                <label htmlFor="gender">Gender</label>
                <select name="gender" id="gender" onChange={handleChange}>
                    <option value="">--Please choose an option--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label htmlFor="activityLevel">Activity level</label>
                <select name="activityLevel" id='activityLevel' onChange={handleChange}>
                    <option value="">--Please choose an option--</option>
                    <option value="BMR">Basal Metabolic Rate</option>
                    <option value="Sedentary">Sedentary: little or no exercise</option>
                    <option value="Light">Light: exercise 1-3 times/week</option>
                    <option value="Moderate">Moderate: exercise 3-4 times/week</option>
                    <option value="Active">Active: daily exercise or intense exercise 3-4 times/week</option>
                    <option value="Very Active">Very Active: intense exercise 6-7 times/week</option>
                    <option value="Extra Active">Extra Active: very intense daily exercise</option>
                </select>

                <label htmlFor="goal">Fitness goal</label>
                <select name="goal" id="goal" onChange={handleChange}>
                    <option value="">--Please choose an option--</option>
                    <option value="maintain">Maintain weight</option>
                    <option value="gain">Gain muscle</option>
                    <option value="lose">Lose weight</option>
                </select>

                <button type="submit">Register!</button>
            </form>
        </div>
    )
};
