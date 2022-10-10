export function Sidebar({logOut, closeSideBar}) {
    return (
        <div id="sidebarDim">
            <div id="sidebarBackground">
                <ul id="sidebar">
                    <li className="sidebarElement">Settings</li>
                    <li className="sidebarElement" onClick={logOut}>Logout</li>
                </ul>
                <i class="fa-solid fa-x" onClick={closeSideBar}></i>
            </div>
        </div>
    )
} 