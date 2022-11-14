import { selectUser } from "../Dashboard/DashboardSlice"
import { useSelector, useDispatch } from "react-redux"
import { selectProfile, setActivityLevel, setDOB, setGoal, setHeight, setName, setWeight, setProfile } from "./EditProfileSlice";
import { setLoggedIn } from "../Login/LoginSlice";
import { useNavigate } from 'react-router-dom';
import { setTimeSeries } from "../Dashboard/DashboardSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function EditProfile() {
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTimeSeries('default'))
    });

    if (profile.name === '') {
        dispatch(setProfile({name: user.name, dob: user.dob, activityLevel: user.activityLevel, weight: user.weight, height: user.height, goal: user.goal}));
    } 

    function updateValueOuter(action) {
        return function updateValueInner(e) {
            const newValue = e.target.value;
            dispatch(action(newValue));
        };
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'edit', {method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(profile)});
        const responseJS = await response.json();
        const message = responseJS.message;
        const editProfileForm = document.getElementById('editProfileForm');

        const messageNode = document.createElement('p');
        messageNode.innerHTML = message;
        messageNode.style.backgroundColor = 'rgb(246, 246, 239)';
        messageNode.style.borderRadius = '5px';
        messageNode.style.padding = '5px';

        editProfileForm.appendChild(messageNode);
        setTimeout(() => {
            dispatch(setLoggedIn(false));
            dispatch(setTimeSeries('default'));
            navigate('/dashboard');
        }, 1000);
    }

    return (
        <div id="editProfile">
            <div className='logo'>
                <i>&#128170;</i>
                <i className='fa-solid fa-utensils'></i>
                <div className="secondBicep">
                    <i>&#128170;</i>
                </div>
            </div>
            <form id='editProfileForm' onSubmit={handleSubmit}>
                <div id="editProfileHeader">
                    <Link to='/dashboard' id="backArrowLogin"><i class="fa-solid fa-backward-step"></i></Link>
                    <h2>Edit Profile</h2>
                </div>
                
                <label>Name</label>
                <input placeholder={user.name}  onChange={updateValueOuter(setName)}></input>
                <label>DOB</label>
                <input type='date' onChange={updateValueOuter(setDOB)}></input>
                <label>Weight (kg)</label>
                <input type='number' placeholder={user.weight} onChange={updateValueOuter(setWeight)}></input>
                <label>Height (cm)</label>
                <input type='number' placeholder={user.height} onChange={updateValueOuter(setHeight)}></input>

                <label>Goal</label>
                <select onChange={updateValueOuter(setGoal)}>
                    <option value={user.goal}>--Keep the same--</option>
                    <option value="maintain">Maintain weight</option>
                    <option value="gain">Gain muscle</option>
                    <option value="lose">Lose weight</option>
                </select>

                <label>Activity Level</label>
                <select onChange={updateValueOuter(setActivityLevel)}>
                    <option value={user.activityLevel} >--Keep the same--</option>
                    <option value="BMR">Basal Metabolic Rate</option>
                    <option value="Sedentary">Sedentary: little or no exercise</option>
                    <option value="Light">Light: exercise 1-3 times/week</option>
                    <option value="Moderate">Moderate: exercise 3-4 times/week</option>
                    <option value="Active">Active: daily exercise or intense exercise 3-4 times/week</option>
                    <option value="Very Active">Very Active: intense exercise 6-7 times/week</option>
                    <option value="Extra Active">Extra Active: very intense daily exercise</option>
                </select>

                <button>CONFIRM</button>
                <p id="editProfileNote">*You only need to enter the values that you need to change, everything else remains the same by default</p>
            </form>
        </div>
    )
}