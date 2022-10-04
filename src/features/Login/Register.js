export function Register() {
    return (
        <div id="viewBody">
            <form id="registerForm">
                <h1>Registration Form</h1>
                <input className="mainInput" placeholder="email"></input>
                <input className="mainInput" placeholder="password"></input>
                <input className="mainInput" placeholder="name"></input>
                <input className="mainInput" placeholder="date of birth"></input>
                
                
                <fieldset>
                    <legend>Height</legend>
                    <input className="mainInput" placeholder="height" type="number"/>
                    <input type="radio" id='Metric' value="Metric" name="heightSystem" defaultChecked/>
                    <label for='Metric'>Metric</label>

                    <input type="radio" id='Imperial' value="Imperial" name="heightSystem"></input>
                    <label for='Imperial'>Imperial</label>
                </fieldset>

                
                <fieldset>
                    <legend>Weight</legend>
                    <input className="mainInput" placeholder="weight" type="number"></input>
                    <input type="radio" id='Kg' value="Kg" name="weightSystem" defaultChecked/>
                    <label for='Kg'>Kg</label>

                    <input type="radio" id='Lbs' value="Lbs" name="weightSystem"/>
                    <label for='Lbs'>Lbs</label>  
                </fieldset>
                <button type="submit">Register!</button>
            </form>
        </div>
    )
};
