import { useSelector, useDispatch } from "react-redux";
import { updateRegistrationForm, selectRegistrationForm } from "./RegisterSlice";

export function Register(args) {
    const registrationForm = useSelector(selectRegistrationForm);
    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();
        const protocol = process.env.REACT_APP_BACKEND_PROTOCOL;
        const host =  process.env.REACT_APP_BACKEND_HOST;
        const port = process.env.REACT_APP_BACKEND_PORT;
        const pathname = window.location.pathname;
        const url = protocol + '//' + host + ':' + port + pathname;
        console.log(url);
        console.log(registrationForm);
        const response = await fetch(url, {method: 'POST', body: JSON.stringify(registrationForm), headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
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
    }

    return (
        <div id="viewBody">
            <form id="registerForm" onSubmit={handleSubmit}>
                <h1>Registration Form</h1>
                <input className="mainInput" placeholder="email" type="email" name="email" id="email" onChange={handleChange}></input>
                <input className="mainInput" placeholder="password" type="password" name="password" id="password" onChange={handleChange}></input>
                <input className="mainInput" placeholder="confirm password" type="password" name="password2" id="password2" onChange={handleChange}></input>
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
                    <label htmlFor='Kg'>Kg</label>

                    <input type="radio" id='lbs' name="weightSystem" onChange={handleChange}/>
                    <label htmlFor='Lbs'>Lbs</label>  
                </fieldset>
                <button type="submit">Register!</button>
            </form>
        </div>
    )
};
