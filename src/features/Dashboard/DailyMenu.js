import { useDispatch, useSelector } from "react-redux";
import { setDailyMenu, selectDailyMenu } from "./DailyMenuSlice"; 

function DailyMenu(args) {
    const dispatch = useDispatch();
    const dailyMenu = useSelector(selectDailyMenu);
    if (dailyMenu.length === 0) {
        getDailyMenu()
    };

    async function getDailyMenu() {
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'menu', {credentials: 'include', headers: {'Content-Type': 'application/json'}});
        const responseJS = await response.json();
        const DailyMenu = responseJS.menu;
        dispatch(setDailyMenu(DailyMenu));
    };

    return (
        <table>
            <thead>
                <tr>
                    <th colSpan='3'>Your Daily Menu</th>
                </tr>
                <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Calories</th>
                    <th scope="col">Protein</th>
                </tr>
            </thead>

            <tbody>
                
            </tbody>
        </table>
    )
}