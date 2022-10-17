import { useDispatch, useSelector } from "react-redux";
import { setCategory, setSubcategory, setVariation, setValues, setSubcategoryData, selectFoodForm, selectSubcategoryData } from "./FoodSlice";

export function FoodForm(args) {
    const dispatch = useDispatch();
    const foodForm = useSelector(selectFoodForm);
    const subcategoryData = useSelector(selectSubcategoryData);

    const optionsJSX = [];
    if (subcategoryData.length === 0) {
        optionsJSX.push(<option value=''>--No available subcategories--</option>);
    } else {
        optionsJSX.push(<option value=''>--Select food subcategory--</option>);
        for (let i=0; i<subcategoryData.length; i++) {
            optionsJSX.push(<option value={subcategoryData[i]}>{subcategoryData[i].slice(0, 1).toUpperCase() + subcategoryData[i].slice(1)}</option>)
        };
    };
    
    async function getSubcategories(category) {
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + `foodform/${category}`, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, credentials: 'include'});
        const responseJS = await response.json();

        const options = [];
        if (responseJS.subcategories !== 'none') {
            for (let key in responseJS.subcategories) {
                const name = responseJS.subcategories[key].name
                options.push(name);
            }
        };

        dispatch(setSubcategoryData(options));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const url = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(url + 'foodform', {method: 'POST', headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, credentials: 'include', body: JSON.stringify(foodForm)});
    }

    function handleChange(e) {
        const property = e.target.name;
        const value = e.target.value;
        switch (property) {
            case 'type':
                dispatch(setVariation({...foodForm.variation, type: value, }))
                break;
            case 'brand':
                dispatch(setVariation({...foodForm.variation, brand: value}))
                break;
            case 'calories':
                dispatch(setValues({...foodForm.values, calories: value}))
                break;
            case 'protein':
                dispatch(setValues({...foodForm.values, protein: value}))
                break;
            case 'category':
                dispatch(setCategory(value))
                break;
            case 'subcategory':
                dispatch(setSubcategory(value));
                if (e.target.id === 'foodSubcategory2') {
                    const subcategoryDropDown = document.getElementById('foodSubcategory1');
                    subcategoryDropDown.value = '';
                }
                break;
            default:
                break;
        };
        if(e.target.id === 'foodCategory') {
            getSubcategories(value);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <select name="category" id="foodCategory" onChange={handleChange}>
                <option value='none'>--Select food category--</option>
                <option value='meat'>Meat</option>
                <option value='dairy'>Dairy</option>
                <option value='wheats'>Wheats</option>
                <option value='legumes'>Legumes</option>
                <option value='nuts'>Nuts</option>
                <option value='fruit'>Fruit</option>
                <option value='vegetables'>Vegetables</option>
                <option value='misc'>Dishes/Misc</option>
            </select>

            <select name="subcategory" id="foodSubcategory1" onChange={handleChange}>
                
                {optionsJSX}
            </select>

            <input placeholder="--Or insert a new one--" type='text' name="subcategory" id="foodSubcategory2" onChange={handleChange}></input>

            <input placeholder="--describe the food briefly (dish name, variations such as baked, roasted, origin etc.--" type='text' name="type" id="variationType" onChange={handleChange}></input>
            <input placeholder="--brand (optional)--" type='text' name="brand" id="variationBrand" onChange={handleChange}></input>

            <input placeholder="kcal per 100g" name="calories" id="valueKcal" type='number' onChange={handleChange}></input>
            <input placeholder="protein (grams) per 100g" name="protein" id="valueProt" type='number' onChange={handleChange}></input>
            
            <button type="submit">Submit!</button>
        </form>
    )
}