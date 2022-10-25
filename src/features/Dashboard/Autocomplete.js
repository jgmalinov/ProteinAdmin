import { row } from "mathjs";
import { useDispatch, useSelector  } from "react-redux";
import { setDailyMenuUpdated, setCurrentBatch, selectCurrentBatch } from "./DailyMenuSlice";
import { expandSearchBar } from "../Utilities";

export function Autocomplete({ autocompleteOptions, nutritionalTable }) {
    const dispatch = useDispatch();
    const currentBatch = useSelector(selectCurrentBatch);

    function setDatalistOptions() {
        const datalistOptions = [];
        for(let i=0; i<autocompleteOptions.length; i++) {
            datalistOptions.push(<option value={autocompleteOptions[i]}>{autocompleteOptions[i]}</option>)
        };
        return datalistOptions;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const autocompleteSearchBar = document.getElementById('autocompleteSearchBar'); 
        const autocompleteWeightBar = document.getElementById('autocompleteWeightBar');
        const mealName = autocompleteSearchBar.value;
        const mealWeight = Number(autocompleteWeightBar.value);
        let mealData = (nutritionalTable.filter((row) => `${row.subcategory}-${row.description}` === mealName));
        mealData = mealData.map((row) => {
            const name = `${row.subcategory}-${row.description}`;
            return {
                [name]: {
                    calories: row.calories * (mealWeight / 100),
                    protein: row.protein * (mealWeight / 100),
                    weight: mealWeight
                }
            }
        })[0];
        
        dispatch(setCurrentBatch(mealData));
        autocompleteSearchBar.value = '';
        autocompleteWeightBar.value = '';
    };

    async function handleConfirm(e) {
        let mealData;
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'menu', {method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(mealData)});
        dispatch(setDailyMenuUpdated(true));
    };

    function renderCurrentBatch() {
        if (currentBatch.length === 0) {
            return [<li>Please add data to your cart</li>];
        } else {
            const currentBatchJSX = [];
            for (let i=0; i < currentBatch.length; i++) {
                const mealName = Object.keys(currentBatch[i])[0];
                const mealJSX = <li>{mealName} - {currentBatch[i][mealName].calories}kcal - {currentBatch[i][mealName].protein}g/pt  ({currentBatch[i][mealName].weight}g) <i class="fa-solid fa-x" id={mealName} onClick={deleteRow}></i></li>;
                currentBatchJSX.push(mealJSX);
            };
            return currentBatchJSX;
        };
    };

    function expandCurrentBatch(e) {
        const currentBatch = document.getElementById('currentBatchContainer');
        const searchBarContainer = document.getElementById('searchBarContainer');
        if (currentBatch.style.height === '0px') {
            currentBatch.style.height = '80px';
            currentBatch.style.width = '100%';
            searchBarContainer.style.border = '1px solid black';
            searchBarContainer.style.borderRadius = '7px';
            searchBarContainer.style.marginTop = '12px';
        } else {
            currentBatch.style.height = '0px';
            currentBatch.style.width = '0px';
            searchBarContainer.style.border = 'none';
            searchBarContainer.style.borderRadius = '0px';
            searchBarContainer.style.marginTop = '6px';
        }
    };

    function deleteRow(e) {
        const mealName = e.target.id;
        dispatch(setCurrentBatch(mealName));
    }

    return (
        <form id="autocompleteContainer" onSubmit={handleSubmit}>
            <div id="searchBarContainer">
                <input type="text" list="autocompleteOptions" placeholder="Search" id="autocompleteSearchBar" style={{'outline': 'none', 'width': '0px'}} required></input>
                <input type="number" placeholder="grams" id="autocompleteWeightBar" required></input>
                <button style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteSubmitButton" disabled><i class="fa-solid fa-magnifying-glass" onDoubleClick={expandSearchBar}></i></button>
                <div id="autocompleteCartContainer"><button type="button" style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteCartButton" disabled><i class="fa-solid fa-cart-shopping" onClick={expandCurrentBatch}></i></button></div>
            </div>
            <div id="currentBatchContainer">
                <ul id="autocompleteCart">
                    {renderCurrentBatch()}
                </ul>
                <button type="button" style={{'width':'20%', 'margin': '8px 0px 12px 0px'}} onClick={handleConfirm}>Confirm</button>
            </div>

            <datalist id="autocompleteOptions">
                {setDatalistOptions()}
            </datalist>
        </form>
    )
}