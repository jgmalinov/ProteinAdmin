import { row } from "mathjs";
import { useDispatch  } from "react-redux";
import { setDailyMenuUpdated } from "./DailyMenuSlice";

export function Autocomplete({ autocompleteOptions, nutritionalTable }) {
    const dispatch = useDispatch();

    function setDatalistOptions() {
        const datalistOptions = [];
        for(let i=0; i<autocompleteOptions.length; i++) {
            datalistOptions.push(<option value={autocompleteOptions[i]}>{autocompleteOptions[i]}</option>)
        };
        return datalistOptions;
    };

    function setOnClickExpand(e) {
        const autocompleteSearchBar = document.getElementById('autocompleteSearchBar');
        autocompleteSearchBar.style.width = '250px';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const autocompleteSearchBar = document.getElementById('autocompleteSearchBar');
        autocompleteSearchBar.style.width = '0px';

        const mealName = document.getElementById('autocompleteSearchBar').value;
        let mealData = (nutritionalTable.filter((row) => `${row.subcategory}-${row.description}` === mealName));
        mealData = mealData.map((row) => {
            const name = `${row.subcategory}-${row.description}`;
            return {
                [name]: {
                    calories: row.calories,
                    protein: row.protein
                }
            }
        })[0]
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'menu', {method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(mealData)});
        dispatch(setDailyMenuUpdated(true));
    }

    return (
        <form id="autocompleteContainer" onSubmit={handleSubmit}>
            <input type="text" list="autocompleteOptions" placeholder="Search" id="autocompleteSearchBar" style={{'outline': 'none'}}></input>
            <button style={{'backgroundColor': 'transparent', 'border': 'none'}}><i class="fa-solid fa-magnifying-glass" onDoubleClick={setOnClickExpand}></i></button>
            <datalist id="autocompleteOptions">
                {setDatalistOptions()}
            </datalist>
        </form>
    )
}