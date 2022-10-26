import { useDispatch, useSelector } from "react-redux";
import { setDailyMenu, selectDailyMenu, setDailyMenuUpdated, selectDailyMenuUpdated } from "./DailyMenuSlice"; 

export function DailyMenu(args) {
    const url = process.env.REACT_APP_BACKEND_URL;
    const dispatch = useDispatch();
    const dailyMenu = useSelector(selectDailyMenu);
    const updateDailyMenu = useSelector(selectDailyMenuUpdated);
    if (updateDailyMenu) {
        getDailyMenu();
        dispatch(setDailyMenuUpdated(false));
    };

    async function getDailyMenu() {
        let dailyMenu;
        const response = await fetch(url + 'menu', {credentials: 'include', headers: {'Content-Type': 'application/json'}});
        const responseJS = await response.json();
        if (responseJS.hasOwnProperty('message')) {
            dailyMenu = [];
        } else {
            dailyMenu = responseJS.menu;
        }
        
        dispatch(setDailyMenu(dailyMenu));
    };

    function getDailyMenuJSX() {
        const dailyMenuJSX = [];
        for (let i=0; i < dailyMenu.length; i++) {
            const description = dailyMenu[i].description;
            const calories = dailyMenu[i].calories;
            const protein = dailyMenu[i].protein;
            const weight = dailyMenu[i].weight;

            dailyMenuJSX.push(
                <tr>
                    <td className="descriptionColumn">{description}</td>
                    <td>{calories}</td>
                    <td>{protein}</td>
                    <td>{weight}</td>
                    <td style={{'border': 'none'}}><i class="fa-solid fa-x" style={{'color': 'red'}} onClick={removeEntryFromDailyMenu}></i></td>
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

    function getSumWeight() {
        if (dailyMenu.length > 0) {
            const weightArray = dailyMenu.map((row) => row.weight);
            const sumWeight = weightArray.reduce((a, b) => a + b);
            return sumWeight;
        }
    };

    function CloseDailyMenu(e) {

        const dailyMenuBackground = document.getElementById('dailyMenuBackground');
        const dailyMenuTable = document.getElementById('dailyMenuTable');

        dailyMenuBackground.style.visibility = 'hidden';
        dailyMenuBackground.style.background = 'rgba(0, 0, 0, 0.1)';

        dailyMenuTable.style.left = '-120%';
    };

    function preventPropagation(e) {
        if (e.target.id !== 'dailyMenuBackground') {
            e.stopPropagation();
        };
    }

    async function removeEntryFromDailyMenu(e) {
        let description = '';
        const siblings = e.target.parentElement.parentElement.childNodes;
        siblings.forEach((sibling) => {
            if (sibling.className === 'descriptionColumn') {
                description = sibling.innerHTML;
            }
        });

        
        const response = await fetch(url + 'menu', {method: 'DELETE', credentials: 'include', headers: {'Content-Type':'application/json'}, body: JSON.stringify({description})})
        const responseJS = await response.json();

        if (responseJS.hasOwnProperty('message') && responseJS.message === 'Successfully deleted data entry') {
            dispatch(setDailyMenuUpdated(true));
        }
    };

    async function commitToDB(e) {
        const tableFooter = document.querySelector('#dailyMenuTable>tfoot');
        const message = document.createElement('h4');
        if (dailyMenu.length === 0) {
            message.innerHTML = 'No entries to commit!';
            tableFooter.appendChild(message);
            setTimeout(() => {
                const messageToRemove = tableFooter.lastChild;
                tableFooter.removeChild(messageToRemove);
            }, 5000);
        } else {
            let calories = 0, protein = 0;
            dailyMenu.forEach((entry) => {
                calories += entry.calories;
                protein += entry.protein;
            });
            const response = await fetch(url + 'timeseries', {method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'}, body: JSON.stringify({calories, protein})});
            const responseJS = await response.json();
            responseJS.hasOwnProperty('message') ? message.innerHTML = responseJS.message : message.innerHTML = 'Something went wrong :(';
            tableFooter.appendChild(message);
        }
    }

    return (
        <div id="dailyMenuBackground" onClick={CloseDailyMenu}>
                <table id="dailyMenuTable" onClick={preventPropagation}>
                    <thead>
                        <tr>
                            <th colSpan='5'>Your Daily Menu <i id="dailyTableClose" class="fa-solid fa-x" onClick={CloseDailyMenu}></i></th>
                            
                        </tr>
                        <tr>
                            <th scope="col">Description</th>
                            <th scope="col">Calories</th>
                            <th scope="col">Protein</th>
                            <th scope="col">Weight</th>
                        </tr>
                    </thead>

                    <tbody id="menuRows">
                        {getDailyMenuJSX()}
                    </tbody>

                    <tfoot>
                        <tr>
                            <th colSpan='4'>Totals</th>
                        </tr>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Total daily calories</th>
                            <th scope="col">Total daily protein</th>
                            <th scope="col">Total weight</th>
                        </tr>
                        <tr>
                            <td></td>
                            <td>{getSumCalories()}kcal</td>
                            <td>{getSumProtein()}g/pt</td>
                            <td>{getSumWeight()}g</td>
                        </tr>
                        <button type="button" onClick={commitToDB}>Commit</button>
                    </tfoot>                   
                </table>
               
        </div>
        
    )
}