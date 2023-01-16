import { useSelector, useDispatch } from "react-redux";
import { updateRegistrationForm, selectRegistrationForm, updateErrors, selectErrors, updateSuccessfulRegistration, selectSuccessfulRegistration } from "./RegisterSlice";
import { Link, Navigate } from "react-router-dom";
import { getCalories, getProtein, getAge} from "../Utilities";


export function Register(args) {
    const justRegistered = useSelector(selectSuccessfulRegistration);
    const registrationForm = useSelector(selectRegistrationForm);
    const errors = useSelector(selectErrors);
    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(updateErrors([]));
    
        const url = process.env.REACT_APP_BACKEND_URL + 'register/';

        let {goal, weight, height, DOB, gender, activityLevel} = registrationForm;
        const age = getAge(DOB);
        const caloriesTarget = getCalories(goal, Number(weight), Number(height), age, gender, activityLevel).goalCalories;
        const proteinTarget = getProtein(weight);

        const response = await fetch(url + `?calories=${caloriesTarget}&protein=${proteinTarget}`, {method: 'POST', body: JSON.stringify(registrationForm), headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
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
        <div id="viewBodyRegister">
            {justRegistered ? <Navigate replace to='/login'/> : undefined}
            {renderErrors()}
            <div className='logo'>
                    <i>&#128170;</i>
                    <i className='fa-solid fa-utensils'></i>
                    <div className="secondBicep">
                        <i>&#128170;</i>
                    </div>
                </div>
            <form id="registerForm" onSubmit={handleSubmit}>
                <div>
                    <Link to='/'><i class="fa-solid fa-backward-step"></i></Link>
                    <h1 className="textLogo">Registration Form</h1>
                </div> 
    
                <input className="mainInput" placeholder="email" type="email" name="email" id="email" onChange={handleChange} required></input>
                <input className="mainInput" placeholder="password" type="password" name="password" id="password" onChange={handleChange} required></input>
                <input className="mainInput" placeholder="confirm password" type="password" name="confirmPassword" id="confirmPassword" onChange={handleChange} required></input>
                <input className="mainInput" placeholder="name" type="text" id="name" name="name" onChange={handleChange} required></input>
                <input className="mainInput" placeholder="date of birth" type="date" id="DOB" name="DOB" onChange={handleChange} required></input>
                
                
                <fieldset>
                    <input className="mainInput" placeholder="height" type="number" name="height" id="height" onChange={handleChange} required/>

                    <input type="radio" id='cm'  name="heightSystem" defaultChecked onChange={handleChange} required/>
                    <label htmlFor='cm'>Metric</label>

                    <input type="radio" id='ft' name="heightSystem" onChange={handleChange} required></input>
                    <label htmlFor='ft'>Imperial</label>
                </fieldset>

                
                <fieldset>
                    <input className="mainInput" placeholder="weight" type="number" name="weight" id="weight" onChange={handleChange} required></input>
                    <input type="radio" id='kg' name="weightSystem" defaultChecked onChange={handleChange} required/>
                    <label htmlFor='kg'>Kg</label>

                    <input type="radio" id='lbs' name="weightSystem" onChange={handleChange} required/>
                    <label htmlFor='lbs'>Lbs</label>  
                </fieldset>

                <label htmlFor="gender">Gender</label>
                <select name="gender" id="gender" onChange={handleChange} required>
                    <option value="">--Please choose an option--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label htmlFor="activityLevel">Activity level</label>
                <select name="activityLevel" id='activityLevel' onChange={handleChange} required>
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
                <select name="goal" id="goal" onChange={handleChange} required>
                    <option value="">--Please choose an option--</option>
                    <option value="maintain">Maintain weight</option>
                    <option value="gain">Gain muscle</option>
                    <option value="lose">Lose weight</option>
                </select>

                <button type="submit">REGISTER!</button>
            </form>
        </div>
    )
};
