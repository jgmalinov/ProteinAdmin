export function Login(args) {
    return (
        <div id="viewBody">
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
        </div>
    )
}