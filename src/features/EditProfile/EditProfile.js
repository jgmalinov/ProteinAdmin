import { selectUser } from "../Dashboard/DashboardSlice"
import { useSelector } from "react-redux"

export function EditProfile() {
    const user = useSelector(selectUser);

    return (
        <div id="editProfile">
            <form id='editProfileForm'>
                <label>Name</label>
                <input placeholder={user.name} value={user.name}></input>
                <label>DOB</label>
                <input type='date' placeholder={user.dob} value={user.dob.slice(0, 10)}></input>
                <label>Weight (kg)</label>
                <input type='number' placeholder={user.weight} value={user.weight}></input>
                <label>Height (cm)</label>
                <input type='number' placeholder={user.height} value={user.height}></input>

                <label>Goal</label>
                <select>
                    <option value={user.goal}>--Keep the same--</option>
                    <option value="maintain">Maintain weight</option>
                    <option value="gain">Gain muscle</option>
                    <option value="lose">Lose weight</option>
                </select>

                <label>Activity Level</label>
                <select>
                    <option value={user.activityLevel}>--Keep the same--</option>
                    <option value="BMR">Basal Metabolic Rate</option>
                    <option value="Sedentary">Sedentary: little or no exercise</option>
                    <option value="Light">Light: exercise 1-3 times/week</option>
                    <option value="Moderate">Moderate: exercise 3-4 times/week</option>
                    <option value="Active">Active: daily exercise or intense exercise 3-4 times/week</option>
                    <option value="Very Active">Very Active: intense exercise 6-7 times/week</option>
                    <option value="Extra Active">Extra Active: very intense daily exercise</option>
                </select>

                <button>CONFIRM</button>
            </form>
        </div>
    )
}