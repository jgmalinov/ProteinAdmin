export function Autocomplete({ autocompleteOptions }) {
    function setDatalistOptions() {
        const datalistOptions = [];
        for(let i=0; i<autocompleteOptions.length; i++) {
            datalistOptions.push(<option value={autocompleteOptions[i]}>{autocompleteOptions[i]}</option>)
        };
        return datalistOptions;
    };

    return (
        <div id="autocompleteContainer">
            <input type="text" list="autocompleteOptions" placeholder="Search" id="autocompleteSearchBar"></input>
            <datalist id="autocompleteOptions">
                {setDatalistOptions()}
            </datalist>
        </div>
    )
}