export function Login(args) {
    return (
        <div id="login">
            <section id="loginSection">
                <h1>Protein Admin</h1>
                <form id="loginForm">
                    <input placeholder="username"></input>
                    <input placeholder="password"></input>
                    <button type="submit">Login!</button>
                    <button type="submit">Sign in with Google</button>
                    <a id="LinkToRegister" href="/">Don't have an account? Register here!</a>
                </form>
            </section>

            <section id="logo">
                <i className="fa-solid fa-pizza-slice" id="slice1"></i>
                <i className="fa-solid fa-pizza-slice" id="slice2"></i>
                <i className="fa-solid fa-pizza-slice" id="slice3"></i>
                <i className="fa-solid fa-pizza-slice" id="slice4"></i>
                <i className="fa-solid fa-pizza-slice" id="slice5"></i>
                <i className="fa-solid fa-pizza-slice" id="slice6"></i>
            </section>

        </div>
    )
}