import { useSelector, useDispatch } from "react-redux";
import { selectNutritionalTable, setNutritionalTable, setAutocomplete, selectAutocomplete } from "./LoggerSlice";
import { Autocomplete } from "./Autocomplete";

export function Logger(args) {
    const dispatch = useDispatch();
    const nutritionalTable = useSelector(selectNutritionalTable);
    let autocompleteOptions = useSelector(selectAutocomplete);
    let categories, subcategories;
    if (nutritionalTable.length === 0) {
        getNutritionalTable();
        
    } else if (autocompleteOptions.length === 0) {
        dispatch(setAutocomplete(nutritionalTable.map((row) => `${row.subcategory}-${row.description}`)));
    }
    
    console.log(autocompleteOptions);



    async function getNutritionalTable() {
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'table', {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
        const responseJS = await response.json();
        const nutritionalTable = responseJS.table;
        dispatch(setNutritionalTable(nutritionalTable));
    };

    function setCategoryOptions() {
        categories = Array.from((new Set(nutritionalTable.map((row) => row.category))).values());
        const categoriesJSX = [];
        for (let i = 0; i < categories.length; i++) {
            const categoryJSX = <option value={categories[i]}>{categories[i]}</option>
            categoriesJSX.push(categoryJSX); 
        }
        return categoriesJSX
    };

    function setSubcatOptionsAndFirstAutocompFilter(e) {
        const currentCategory = e.target.value;
        const subcategoriesJSX = [];
        const subcategoryNode = document.getElementById('loggerSubcategory');
        while (subcategoryNode.firstChild) {
            subcategoryNode.removeChild(subcategoryNode.firstChild)
        };

        const nutritionalTableFiltered = nutritionalTable.filter((row) => row.category === currentCategory); 
        subcategories = Array.from(new Set(nutritionalTableFiltered.map((row) => row.subcategory)).values());
        const initialOption = document.createElement("option");

        initialOption.value = '';
        initialOption.text = '--';
        subcategoryNode.appendChild(initialOption);

        for (let i = 0; i < subcategories.length; i++) {
            const option = document.createElement("option");
            option.value = subcategories[i];
            option.text = subcategories[i];
            subcategoryNode.appendChild(option); 
        };

        dispatch(setAutocomplete(nutritionalTableFiltered.map((row) => `${row.subcategory}-${row.description}`)));
    };

    function setSecondAutocompFilter(e) {
        const currentCategory = document.getElementById('loggerCategory').value;
        const currentSubcategory = e.target.value;
        const nutritionalTableFiltered = nutritionalTable.filter((row) => row.category === currentCategory && row.subcategory === currentSubcategory);
        dispatch(setAutocomplete(nutritionalTableFiltered.map(row => `${row.subcategory}-${row.description}`)));
    };

    function toggleFilters(e) {
        const filters = document.getElementById('filters');
        filters.style.visibility === 'visible' ? filters.style.visibility = 'hidden' : filters.style.visibility = 'visible';  
    }

    return (
        <nav>
            <section>
                <i class="fa-solid fa-filter" onClick={toggleFilters}></i>
                <Autocomplete autocompleteOptions={autocompleteOptions} />
            </section>
            
            <form id="filters" style={{'visibility': 'hidden'}}>
                    <select id="loggerCategory" onChange={setSubcatOptionsAndFirstAutocompFilter}>
                        <option value=''>--select category--</option>
                        {setCategoryOptions()}
                    </select>
                    <select id="loggerSubcategory" onChange={setSecondAutocompFilter}>
                        <option value=''>--</option>
                    </select>
                </form>
            
        </nav>
    );
}