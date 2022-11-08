import { Link } from "react-router-dom";

export function Sidebar({logOut, closeSideBar}) {
    return (
        <div id="sidebarDim">
            <div id="sidebarBackground">
                <ul id="sidebar">
                    <li className="sidebarElement"><Link to='/foodform'>Add nutritional data</Link></li>
                    <li className="sidebarElement">Settings</li>
                    <li className="sidebarElement"><Link to='/help'>Help</Link></li>
                    <li className="sidebarElement" onClick={logOut}>Logout</li>
                </ul>
                <i class="fa-solid fa-x" id='sidebarX' onClick={closeSideBar}></i>
            </div>
        </div>
    )
} 