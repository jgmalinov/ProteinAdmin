import { useDispatch, useSelector } from "react-redux";
import { setCategory, setSubcategory, setVariation, setValues, selectFoodForm } from "./FoodSlice";

export function FoodForm(args) {
    const dispatch = useDispatch();
    const foodForm = useSelector(selectFoodForm);

    function handleSubmit(e) {
        return
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
                dispatch(setSubcategory(value))
                break;
            default:
                break;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <select name="category" id="foodCategory" onChange={handleChange}>
                <option value=''>--Select food category--</option>
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
                <option value=''>--Select food subcategory--</option>
                <option value='meat'>Meat</option>
                <option value='dairy'>Dairy</option>
                <option value='wheats'>Wheats</option>
                <option value='legumes'>Legumes</option>
                <option value='nuts'>Nuts</option>
                <option value='fruit'>Fruit</option>
                <option value='vegetables'>Vegetables</option>
                <option value='misc'>Dishes/Misc</option>
            </select>

            <input placeholder="--Or insert a new one--" type='text' name="subcategory" id="foodSubcategory2" onChange={handleChange}></input>

            <input placeholder="--describe the food briefly (dish name, variations such as baked, roasted, origin etc.--" type='text' name="type" id="variationType" onChange={handleChange}></input>
            <input placeholder="--brand (optional)--" type='text' name="brand" id="variationBrand" onChange={handleChange}></input>

            <input placeholder="kcal per 100g" name="calories" id="valueKcal" onChange={handleChange}></input>
            <input placeholder="protein (grams) per 100g" name="protein" id="valueProt" onChange={handleChange}></input>
            
            <button type="submit">Submit!</button>
        </form>
    )
}