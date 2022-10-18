import { useSelector, useDispatch } from "react-redux";
import { selectNutritionalTable, setNutritionalTable } from "./LoggerSlice";
import { Autocomplete } from "./Autocomplete";

export function Logger(args) {
    const dispatch = useDispatch();
    const nutritionalTable = useSelector(selectNutritionalTable);
    const autocompleteOptions = nutritionalTable.map((row) => `${row.subcategory}-${row.description}`);
    console.log(autocompleteOptions);

    if (Object.keys(nutritionalTable).length === 0) {
        getNutritionalTable();
    };

    async function getNutritionalTable() {
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'table', {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
        const responseJS = await response.json();
        const nutritionalTable = responseJS.table;
        dispatch(setNutritionalTable(nutritionalTable));
    };

    return (
        <Autocomplete autocompleteOptions={autocompleteOptions} />
    );
}