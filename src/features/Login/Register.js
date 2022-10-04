export function Register(args) {
    function handleSubmit(e) {
        e.preventDefault();
        const host = process.env.REACT_APP_BACKEND_HOST;
        const port = process.env.REACT_APP_BACKEND_PORT;
        console.log(host, port);
        /* const response = await fetch() */
    };

    return (
        <div id="viewBody">
            <form id="registerForm" onSubmit={handleSubmit}>
                <h1>Registration Form</h1>
                <input className="mainInput" placeholder="email" type="email" name="email" id="email"></input>
                <input className="mainInput" placeholder="password" type="password" name="password" id="password"></input>
                <input className="mainInput" placeholder="confirm password" type="password" name="password2" id="password2"></input>
                <input className="mainInput" placeholder="name" type="text" id="name" name="name"></input>
                <input className="mainInput" placeholder="date of birth" type="date" id="DOB" name="DOB"></input>
                
                
                <fieldset>
                    <legend>Height</legend>
                    <input className="mainInput" placeholder="height" type="number" name="height" id="height"/>

                    <input type="radio" id='cm'  name="heightSystem" defaultChecked/>
                    <label htmlFor='cm'>Metric</label>

                    <input type="radio" id='ft' name="heightSystem"></input>
                    <label htmlFor='ft'>Imperial</label>
                </fieldset>

                
                <fieldset>
                    <legend>Weight</legend>
                    <input className="mainInput" placeholder="weight" type="number" name="weight"></input>
                    <input type="radio" id='kg' name="weightSystem" defaultChecked/>
                    <label htmlFor='Kg'>Kg</label>

                    <input type="radio" id='lbs' name="weightSystem"/>
                    <label htmlFor='Lbs'>Lbs</label>  
                </fieldset>
                <button type="submit">Register!</button>
            </form>
        </div>
    )
};
