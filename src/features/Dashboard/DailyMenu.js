import { useDispatch, useSelector } from "react-redux";
import { setDailyMenu, selectDailyMenu, setDailyMenuUpdated, selectDailyMenuUpdated } from "./DailyMenuSlice"; 

export function DailyMenu(args) {
    const dispatch = useDispatch();
    const dailyMenu = useSelector(selectDailyMenu);
    const dailyMenuUpdated = useSelector(selectDailyMenuUpdated);
    if (dailyMenu.length === 0 || dailyMenuUpdated) {
        getDailyMenu();
        dispatch(setDailyMenuUpdated(false));
    };

    async function getDailyMenu() {
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'menu', {credentials: 'include', headers: {'Content-Type': 'application/json'}});
        const responseJS = await response.json();
        const DailyMenu = responseJS.menu;
        dispatch(setDailyMenu(DailyMenu));
    };

    function getDailyMenuJSX() {
        const dailyMenuJSX = [];
        for (let i=0; i < dailyMenu.length; i++) {
            const description = dailyMenu[i].description;
            const calories = dailyMenu[i].calories;
            const protein = dailyMenu[i].protein;

            dailyMenuJSX.push(
                <tr>
                    <td>{description}</td>
                    <td>{calories}</td>
                    <td>{protein}</td>
                </tr>
            )
        };

        return dailyMenuJSX;
    };

    function getSumCalories() {
        if (dailyMenu.length > 0) {
            const caloriesArray = dailyMenu.map((row) => row.calories);
            const sumCalories = caloriesArray.reduce((a, b) => a + b);
            return sumCalories;
        }
    };

    function getSumProtein() {
        if (dailyMenu.length > 0) {
            const proteinArray = dailyMenu.map((row) => row.protein);
            const sumProtein = proteinArray.reduce((a, b) => a + b);
            return sumProtein;
        }
    };

    function CloseDailyMenu(e) {
        const dailyMenuBackground = document.getElementById('dailyMenuBackground');
        const dailyMenuTable = document.getElementById('dailyMenuTable');

        dailyMenuBackground.style.visibility = 'hidden';
        dailyMenuBackground.style.background = 'rgba(0, 0, 0, 0.1)';

        dailyMenuTable.style.left = '-120%';
    };

    return (
        <div id="dailyMenuBackground" onClick={CloseDailyMenu}>
                <table id="dailyMenuTable">
                    <thead>
                        <tr>
                            <th colSpan='3'>Your Daily Menu <i class="fa-solid fa-x" onClick={CloseDailyMenu}></i></th>
                            
                        </tr>
                        <tr>
                            <th scope="col">Description</th>
                            <th scope="col">Calories</th>
                            <th scope="col">Protein</th>
                        </tr>
                    </thead>

                    <tbody>
                        {getDailyMenuJSX()}
                    </tbody>

                    <tfoot>
                        <tr>
                            <th colSpan='3'>Totals</th>
                        </tr>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Total daily calories</th>
                            <th scope="col">Total daily protein</th>
                        </tr>
                        <tr>
                            <td></td>
                            <td>{getSumCalories()}</td>
                            <td>{getSumProtein()}</td>
                        </tr>
                    </tfoot>
                </table>
        </div>
        
    )
}