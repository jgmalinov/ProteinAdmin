export function Autocomplete({ autocompleteOptions }) {
    function setDatalistOptions() {
        const datalistOptions = [];
        for(let i=0; i<autocompleteOptions.length; i++) {
            datalistOptions.push(<option value={autocompleteOptions[i]}>{autocompleteOptions[i]}</option>)
        };
        return datalistOptions;
    };

    function setOnClickExpand(e) {
        document.getElementById('autocompleteSearchBar').focus();
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(e.target.value);
    }

    return (
        <form id="autocompleteContainer" onSubmit={handleSubmit}>
            <input type="text" list="autocompleteOptions" placeholder="Search" id="autocompleteSearchBar"></input>
            <button style={{'backgroundColor': 'transparent', 'border': 'none'}}><i class="fa-solid fa-magnifying-glass" onMouseEnter={setOnClickExpand}></i></button>
            <datalist id="autocompleteOptions">
                {setDatalistOptions()}
            </datalist>
        </form>
    )
}