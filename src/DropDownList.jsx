import PropTypes from 'prop-types'

function DropDownList({setName, getDishIngredients, setDefaultCal, setDefaultCarb, setDefaultFat, setDefaultProt, setDefaultWeight, setIsDish, performCalculation, ingredients, dishes, weightInput, selectorRef}){

    function dropDownUpdater(type) {
        if (type == 'ingredients'){
            return (
            ingredients.map((i, index) => {
                console.log(ingredients.length)
                return(
                    <option value={i.name} onClick={() => {performCalculation(weightInput, i.name); setName(i.name); setIsDish(false)}
                                      } key={i.name+index}>{i.name}</option>
                )
            })
        )
        } else if (type == 'dishes') {
            return (
                dishes.map((i) => {
                return(
                    <option value={i.name} onClick={(e) => {performCalculation(weightInput, i.name);
                                                            setName(i.name);
                                                            getDishIngredients(e.target.value);
                                                            setDefaultCal(i.calories);
                                                            setDefaultCarb(i.carbohydrates);
                                                            setDefaultFat(i.fats);
                                                            setDefaultProt(i.proteins); 
                                                            setDefaultWeight(i.weight)
                                                            setIsDish(true)}} key={i.name+1}>{i.name}</option>
                    )
                })
            )
        }
    }

    return(
        ingredients.length || dishes.length ?
        <select className='ingredients-select-element' id='ingredients' ref={selectorRef} onClick={()=>dropDownUpdater('ingredients')}>
                <optgroup label="Ingredients:">
                {
                    dropDownUpdater('ingredients')
                }      
                </optgroup>
                <optgroup label="Dishes:">
                {
                    dropDownUpdater('dishes')
                }
                </optgroup>
        </select>
        :
        <p>The list is empty.</p>       
    )
}

DropDownList.propTypes = {
    setName: PropTypes.any,
    getDishIngredients: PropTypes.any, 
    setDefaultCal: PropTypes.any, 
    setDefaultCarb: PropTypes.any, 
    setDefaultFat: PropTypes.any, 
    setDefaultProt: PropTypes.any, 
    setDefaultWeight: PropTypes.any, 
    setIsDish: PropTypes.any, 
    performCalculation: PropTypes.any, 
    ingredients: PropTypes.any, 
    dishes: PropTypes.any, 
    weightInput: PropTypes.any, 
    selectorRef: PropTypes.any, 
    setIngredients: PropTypes.any, 
    setDishes: PropTypes.any
}

export default DropDownList