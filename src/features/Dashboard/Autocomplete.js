import { row } from "mathjs";
import { useDispatch, useSelector  } from "react-redux";
import { setDailyMenuUpdated, setCurrentBatch, selectCurrentBatch, setInputMethod, selectInputMethod, setInputMethodChanged, selectDailyMenuUpdated, selectInputMethodChanged } from "./DailyMenuSlice";
import { expandSearchBar, modifySearchBar, expandCurrentBatch } from "../Utilities";
import { useEffect } from "react";

export function Autocomplete({ autocompleteOptions, nutritionalTable }) {
    const dispatch = useDispatch();
    const currentBatch = useSelector(selectCurrentBatch);
    const inputMethod = useSelector(selectInputMethod);
    const inputMethodChanged = useSelector(selectInputMethodChanged);
    let isSingleClick = true;


    useEffect(() => {
        if(inputMethodChanged) {
            const autocompleteContainer = document.getElementById('autocompleteContainer')
            if (autocompleteContainer.style.width === '2rem') {
                setTimeout(() => {
                    expandSearchBar(inputMethod);
                }, 300);
             }
            dispatch(setInputMethodChanged(false));
        }
    })


    function setDatalistOptions() {
        const datalistOptions = [];
        for(let i=0; i<autocompleteOptions.length; i++) {
            datalistOptions.push(<option value={autocompleteOptions[i]}>{autocompleteOptions[i]}</option>)
        };
        return datalistOptions;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        let mealData;
        if (inputMethod === 'search') {
            const autocompleteSearchBar = document.getElementById('autocompleteSearchBar'); 
            const autocompleteWeightBar = document.getElementById('autocompleteWeightBar');
            const mealName = autocompleteSearchBar.value;
            const mealWeight = Number(autocompleteWeightBar.value);
            mealData = (nutritionalTable.filter((row) => `${row.subcategory}-${row.description}` === mealName));
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
            autocompleteSearchBar.value = '';
            autocompleteWeightBar.value = '';
        } else {
            const batchInputs = document.getElementsByClassName('batchInputs');
            let calories = batchInputs[0].value, protein = batchInputs[1].value, weight=batchInputs[2].value;
            mealData = {
                'Manual Input': {
                    calories: calories * (weight / 100),
                    protein: protein * (weight / 100),
                    weight,
                }
            };
            for (let i=0; i<batchInputs.length; i++) {
                batchInputs[i].value = '';
            }
        }

        dispatch(setCurrentBatch(mealData));

    };

    async function handleConfirm(e) {
        if (currentBatch.length === 0) {
            alert('Please add an entry before confirmation');
            return;
        }
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'menu', {method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(currentBatch)})
                        .then((res) => console.log(res));
    
        dispatch(setDailyMenuUpdated(true));
        dispatch(setCurrentBatch([]));
    };

    function renderCurrentBatch() {
        if (currentBatch.length === 0) {
            return [<li>Please add data to your cart</li>];
        } else {
            const currentBatchJSX = [];
            for (let i=0; i < currentBatch.length; i++) {
                const mealName = Object.keys(currentBatch[i])[0];
                const mealJSX = <li>{mealName} - {Number(currentBatch[i][mealName].calories).toFixed(1)}kcal - {Number(currentBatch[i][mealName].protein).toFixed(1)}g/pt  ({Number(currentBatch[i][mealName].weight).toFixed(1)}g) <i class="fa-solid fa-x" id={mealName} onClick={deleteRow}></i></li>;
                currentBatchJSX.push(mealJSX);
            };
            return currentBatchJSX;
        };
    };

    function modifySearchBar(e) {
        expandSearchBar(inputMethod);
    };

    function deleteRow(e) {
        const mealName = e.target.id;
        dispatch(setCurrentBatch(mealName));
    };

    function renderInputs() {
        let inputsJSX;
        if (inputMethod === 'search') {
            inputsJSX = (
                <div id="searchBarContainer">
                    <input type="text" list="autocompleteOptions" placeholder="Search" id="autocompleteSearchBar" style={{'outline': 'none'}} required></input>
                    <input type="number" placeholder="grams" id="autocompleteWeightBar" required></input>
                    <button type="button" style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteModifyButton" onClick={singleClickHandler} onDoubleClick={doubleClickHandler}>{renderIconBasedOnInputMethod()}</button>
                    <div id="autocompleteCartContainer">
                        <button type="button" style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteCartButton" disabled><i class="fa-solid fa-caret-down" onClick={expandCurrentBatch}></i></button>
                        <button type="submit" style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteSubmitButton"><i class="fa-brands fa-golang"></i></button>
                    </div>
                </div>
            )
        } else {
            inputsJSX = (
                <div id="searchBarContainer">
                    <input className="batchInputs" type='number' placeholder="calories" required></input>
                    <input className="batchInputs" type='number' placeholder="protein"  required></input>
                    <input className="batchInputs" type='number' placeholder="weight"  required></input>
                    <button type="button" style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteModifyButton" onClick={singleClickHandler} onDoubleClick={doubleClickHandler}>{renderIconBasedOnInputMethod()}</button>
                    <div id="autocompleteCartContainer">
                        <button type="button" style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteCartButton" disabled><i class="fa-solid fa-caret-down" onClick={expandCurrentBatch}></i></button>
                        <button type="submit" style={{'backgroundColor': 'transparent', 'border': 'none'}} id="autocompleteSubmitButton"><i class="fa-brands fa-golang"></i></button>
                    </div>
                    
                </div>
            )
        };
        return inputsJSX;
    };

    function toggleInputMethod(e) {
        const autocompleteContainer = document.getElementById('autocompleteContainer');

         if (inputMethod === 'search') {
            dispatch(setInputMethod('input'));
         } else {
            dispatch(setInputMethod('search'));
         };

         if (autocompleteContainer.style.width !== '2rem') {
            expandSearchBar(inputMethod);
         }
        
        dispatch(setInputMethodChanged(true));
    };

    function singleClickHandler(e) {
        isSingleClick = true;
        setTimeout(() => {
            if (isSingleClick) {
                modifySearchBar(e);
            }
        }, 200);
    };

    function doubleClickHandler(e) {
        isSingleClick = false;
        toggleInputMethod(e);
    }

    function renderIconBasedOnInputMethod() {
        const icon = inputMethod === 'search' ? <i class="fa-solid fa-magnifying-glass" ></i> : <i class="fa-regular fa-keyboard"></i>;
        return icon;
    }

    return (
        <div id="autocomplete">
            <div id="autocompleteContainer" style={{'width': '2rem'}}>
                <form  onSubmit={handleSubmit} id='autocompleteForm'>
                    {renderInputs()}
                </form>

                <div id="currentBatchContainer" style={{'height': '0px'}}>
                    <ul id="autocompleteCart">
                        {renderCurrentBatch()}
                    </ul>
                    <button type="button" style={{'width':'20%', 'margin': '8px 0px 12px 0px'}} onClick={handleConfirm}>CONFIRM</button>
                </div>

                <datalist id="autocompleteOptions">
                    {setDatalistOptions()}
                </datalist>
            </div>
        </div>
    )
}