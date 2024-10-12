import { useState, useEffect, useRef } from 'react'
import './ingredients.css'
// import icon from './assets/icon.png'
import DropDownList from './DropDownList'
import { MdDeleteForever } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";


function IngredientComponent(){  
    const [data, setData] = useState(JSON.parse(localStorage.getItem('ingredientlist')) || [])
    const [ingredients, setIngredients] = useState(data.filter((i) => i.dish == false)) 
    const [dishes, setDishes] = useState(data.filter((i) => i.dish == true))
    
    const [name, setName] = useState(data.length ? data[0].name : '');
    const [calories, setCalories] = useState();
    const [carb, setCarb] = useState();
    const [fat, setFat] = useState();
    const [protein, setProtein] = useState();

    const [defaultCal, setDefaultCal] = useState(null);
    const [defaultCarb, setDefaultCarb] = useState(null);
    const [defaultFat, setDefaultFat] = useState(null);
    const [defaultProt, setDefaultProt] = useState(null);
    const [defaultWeight, setDefaultWeight] = useState(null);
    const [usedIngredients, setUsedIngredients] = useState([]);

    const [totalCalories, setTotalCalories] = useState(0);
    const [totalCarb, setTotalCarb] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    
    const [weightInput, setWeight] = useState();
    
    const [render, setRender] = useState(false);
    const [deletionPrompt, setDeletionPrompt] = useState(false);
    const [savePrompt, setSavePrompt] = useState(false)
    
    const [isDish, setIsDish] = useState(Boolean);

    const [dishObject, setDishObject] = useState([]);
    const [dishName, setDishName] = useState('')

    const selectorRef = useRef();
    const mainRef = useRef();
    const dishNameInputRef = useRef();
    const selectorDivRef = useRef();

    useEffect(() => {
        calculateTotal()
    })

    useEffect(() => {
        localStorage.setItem('ingredientlist', JSON.stringify(data))   
    },[data])
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function setAndSave(newData){
        localStorage.setItem('ingredientlist', JSON.stringify(newData))
        setData(newData)
        setIngredients(newData.filter((i) => i.dish == false))
        setDishes(newData.filter((i) => i.dish == true))          
    }
     
    function setMacros(funcName = name, funcCalories = calories, funcCarbs = carb, funcFats = fat, funcProtein = protein){
        setName(funcName);
        setCalories(funcCalories);
        setCarb(funcCarbs);
        setFat(funcFats);
        setProtein(funcProtein);
    }

    function performCalculation(weight=weightInput, nameCheck = name){        
        const weightNum = parseFloat(weight);   
        if (name !== '' && weightNum > 0){
            data.map(i => {
                if (i.name === nameCheck){
                    setRender(true)
                    const newCal = ((i.calories / 100) * weight).toFixed(1);
                    const newCarb = ((i.carbohydrates / 100) * weight).toFixed(1);
                    const newFat = ((i.fats / 100) * weight).toFixed(1);
                    const newProtein = ((i.proteins / 100) * weight).toFixed(1);  
                    setMacros(name, newCal, newCarb, newFat, newProtein);
                }
            })                        
        } else {
            console.log('error')
            setRender(false)
        }
    }

    function addToDish() {
        performCalculation(weightInput, name)
        const ingredientToAppend = {
            "id": dishObject.length,
            "name": name,
            "calories": calories,
            "carbohydrates": carb,
            "proteins": protein,
            "fats": fat,
            "weight": weightInput}
        
        setDishObject(prevIngredient => [...prevIngredient, ingredientToAppend])
        console.log(dishObject)
    }

    function calculateTotal(){
        let totalCaloriesVar = 0.0;
        let totalCarbVar = 0.0;
        let totalFatVar = 0.0;
        let totalProteinVar = 0.0;
        let totalWeightVar = 0;

        dishObject.map(i => {
            totalCaloriesVar = totalCaloriesVar + parseFloat(i.calories)
            totalCarbVar = totalCarbVar + parseFloat(i.carbohydrates)
            totalFatVar = totalFatVar + parseFloat(i.fats)
            totalProteinVar = totalProteinVar + parseFloat(i.proteins)
            totalWeightVar = totalWeightVar + Number(i.weight)
        })
        setTotalCalories(totalCaloriesVar.toFixed(1))
        setTotalCarb(totalCarbVar.toFixed(1))
        setTotalFat(totalFatVar.toFixed(1))
        setTotalProtein(totalProteinVar.toFixed(1))
        setTotalWeight(totalWeightVar.toFixed(0))  
    }

    function removeIngredient(index){
        console.log(index)
        const updatedIngredients = dishObject.filter((_element, i) => i !== index)
        setDishObject(updatedIngredients)
    }
    
    function getDishIngredients(e){
        const filterByName = (dishes.filter((i) => i.name == e))
        setUsedIngredients(filterByName[0].ingredients)
    }
    
    function saveDish(){   
        let dishToSave = {};
        let dishIngredients = []
        dishObject.map(i => {dishIngredients.push(`${i.name} (${i.weight}g)`)})

        const calIn100g = ((totalCalories/totalWeight) * 100).toFixed(1);
        const carbIn100g = ((totalCarb/totalWeight) * 100).toFixed(1);
        const protIn100g = ((totalProtein/totalWeight) * 100).toFixed(1);
        const fatIn100g = ((totalFat/totalWeight) * 100).toFixed(1);

        if (dishName != ''){
            dishToSave = {
                "name": capitalizeFirstLetter(dishName),
                "calories": calIn100g,
                "carbohydrates": carbIn100g,
                "proteins": protIn100g,
                "fats": fatIn100g,
                "weight": totalWeight,
                "dish": true,
                "ingredients": dishIngredients}
            }
        data.map(i => {
            if (dishToSave.name === i.name){
                // dishToSave.name = dishToSave.name + " copy"
                dishNameInputRef.current.placeholder = `"${dishName}" is already in the database`
            } else {
                const newDish = [...data, dishToSave]
                setAndSave(newDish)
                setSavePrompt(false)
                reset()   
            }
        })
             
    }

    function deleteIngredient(){
        console.log(selectorDivRef.current.lastChild.value)
        const newIngredients = data.filter((i) => selectorDivRef.current.lastChild.value.trim() != i.name.trim() )        
        setRender(false)
        setDeletionPrompt(false)
        setAndSave(newIngredients)              
        reset()
    }
    
    function reset() {
        setRender(false);
        setName('');
        selectorRef.current.value = '';
        setDishObject([]);
        setDishName('') 
        setTotalCalories(0); 
        setTotalCarb(0); 
        setTotalFat(0); 
        setTotalProtein(0);
        setIsDish(false)
        setWeight('')
    }

    function validateDishName() {
        data.map(i => {
            if (dishNameInputRef.current.value === i.name){
                // dishToSave.name = dishToSave.name + " copy"
                dishNameInputRef.current.placeholder = `Duplicate`;
                dishNameInputRef.current.style["border-color"] = "red";
                setDishName('')
                setSavePrompt(false);
            }
            else {
                setSavePrompt(true);
            }
        })
    }

    return(
        <>
            <div className="ingredients-wrapper">
                    <div ref={mainRef} className='ingredients-dropdown-and-delete-icon'>
                        <div ref={selectorDivRef} className='ingredients-dropdown-delete-weight-container'>
                            <DropDownList
                                setName={setName}
                                getDishIngredients={getDishIngredients}
                                setDefaultCal={setDefaultCal}
                                setDefaultCarb={setDefaultCarb}
                                setDefaultFat={setDefaultFat}
                                setDefaultProt={setDefaultProt}
                                setDefaultWeight={setDefaultWeight}
                                setIsDish={setIsDish}
                                performCalculation={performCalculation}
                                ingredients={ingredients}
                                setIngredients={setIngredients}
                                dishes={dishes}
                                setDishes={setDishes}
                                weightInput={weightInput}
                                selectorRef={selectorRef}
                            />                     
                        </div>
                        {name != '' ? <input className='ingredients-weight-input' value={weightInput} onClick={() => weightInput <= 0 && setWeight('')} onChange={(e)=>{performCalculation(e.target.value); console.log(weightInput); setWeight(e.target.value)}} placeholder='Input weight' type='number' min='0' max='10000' style={weightInput <= 0 ? {borderColor: "red"} : null}></input> : <></>}
                        {name != '' ? <MdDeleteForever className='ingredients-svg' onClick={()=>{setDeletionPrompt(true)}}/> : <></>}
                    </div>
                { deletionPrompt &&
                <div className='prompt-wrapper'>
                    <div className='pop-up'><p>Delete &quot;{name}&quot;?</p>
                        <div className='ingredients-yes-no-buttons'>
                            <button onClick={()=>{deleteIngredient()}}>Yes</button>
                            <button onClick={()=>{setDeletionPrompt(false)}}>No</button>
                        </div>
                    </div>
                </div>
                }
                { savePrompt &&
                <div className='prompt-wrapper'>
                    <div className='pop-up'>
                        <p>Save &quot;{dishName}&quot;?</p>
                        <div className='ingredients-yes-no-buttons'>
                            <button onClick={()=>{saveDish()}}>Yes</button>
                            <button onClick={()=>{setSavePrompt(false)}}>No</button>
                        </div>
                    </div>
                </div>
                }               
                <div className='ingredients-box'>
                    {!render ? (
                        <></>
                    ) : (!isDish ?
                        <>
                        <div className='ingredients-main-container'>
                            <div className='ingredients-macro-container'>
                                    <h2>{name} {weightInput > 0 ? `(${weightInput}g)` : ''}:</h2>
                                        <div className='ingredients-ingredient-macro'>
                                            <p><b>Calories:</b> {calories}cal</p>
                                            <p><b>Fat:</b> {fat}g</p>
                                            <p><b>Carbohydrate:</b> {carb}g</p>
                                            <p><b>Protein:</b> {protein}g</p>
                                        </div>
                                    {render && !isDish ? <button className='ingredients-add-button' onClick={() => addToDish()}>Add to Dish</button> : <></>}                                   
                            </div>
                            { dishObject.length != 0 
                            ?    
                            <div className='ingredients-ingredients'>
                            <h2>Current Dish: </h2>                        
                                <div className='dish-object-container'>
                                    <ul>
                                    {dishObject.map((i, index) => {
                                        return (
                                        <div className='ingredients-dish-ingredient-container' key={i.name+index}>
                                            <span className='ingredients-name-and-icon'>
                                                <h3>{i.name} ({i.weight}g):</h3>
                                                {/* <img id={index+1} className="remove-button" onClick={() => removeIngredient(index)} src={icon} alt="remove-icon"/> */}
                                                <RxCross2 id={index+1} className="remove-button" onClick={() => removeIngredient(index)}/>
                                            </span>
                                            <ul className='ingredients-dish-ingredient-macro'>
                                                <li><strong>Calories:</strong> {i.calories}cal</li>
                                                <li><strong>Fat:</strong> {i.fats}g</li>
                                                <li><strong>Carbohydrate:</strong> {i.carbohydrates}g</li>
                                                <li><strong>Protein:</strong> {i.proteins}g</li>                                                
                                            </ul>
                                        </div>
                                        )  
                                    })}
                                    </ul>
                                </div>                           
                            </div>
                            : 
                            <></>
                            }
                            { dishObject.length !== 0 
                            ?
                            <div className='ingredients-total-main'>
                                <h2>Total ({totalWeight}g): </h2>
                                <div className='ingredients-total'>
                                    <div className='ingredients-total-macro'>
                                        <p><strong>Calories:</strong> {totalCalories}cal</p>
                                        <p><strong>Fat:</strong> {totalFat}g</p>
                                        <p><strong>Carbohydrate:</strong> {totalCarb}g</p>
                                        <p><strong>Protein:</strong> {totalProtein}g</p>
                                    </div>
                                    <div className='savedish-container'>
                                        <input ref={dishNameInputRef} value={dishName} onClick={() => {dishNameInputRef.current.placeholder = 'Input Name'; dishNameInputRef.current.style["border-color"] = "";}}onChange={(e) => setDishName(e.target.value)} placeholder='Input Name'></input>
                                        <button onClick={()=>{dishName != '' ? validateDishName() : setSavePrompt(false)}}>Save</button>
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                            }
                        </div>                    
                        </>
                        :
                        <>
                            <div className='main-dish-container'>
                                <h2>{name} {weightInput > 0 ? `(${weightInput}g):` : ''}</h2>
                                    <div className='ingredients-dish-macro-container'>
                                        <div className='ingredients-calulated-macro'>
                                            <h3>Calculated Macro ({weightInput}g): </h3>
                                            <div className='ingredients-calculated-macro-div'>
                                                <p><strong>Calories:</strong> {calories} cal</p>
                                                <p><strong>Fat:</strong> {fat}g</p>
                                                <p><strong>Carbohydrate:</strong> {carb}g</p>
                                                <p><strong>Protein:</strong> {protein}g</p>
                                            </div>
                                        </div>
                                        <div className='ingredients-original-macro'>
                                            <h3>Original Macro (100g): </h3>
                                            <div className='ingredients-calculated-macro-div'>
                                                <p><strong>Calories:</strong> {defaultCal} cal</p>
                                                <p><strong>Fat:</strong> {defaultFat}g</p>
                                                <p><strong>Carbohydrate:</strong> {defaultCarb}g</p>
                                                <p><strong>Protein:</strong> {defaultProt}g</p>
                                            </div>
                                        </div>
                                        <div className='ingredients-used-ingredients-container'>
                                            <h3>Used Ingredients:</h3>                          
                                            <ul className='used-ingredients'>
                                                <p><strong>Total:</strong> {defaultWeight}g</p>
                                                {usedIngredients.map((i, index) => {return (<li key={index}>{i}</li>)})} 
                                            </ul>                           
                                        </div>
                                    </div>
                            </div>
                        </>
                    )
                }
                </div>
                <div className='buttons-container'>
                    {dishes.length || ingredients.length ? <button onClick={() => performCalculation(weightInput)} className='calc-button'>Calculate</button> : <></>}
                    {render ? <button onClick={() => {reset()}} className='reset-button'>Reset</button> : <></>}
                </div>
            </div>
            
        </>
    );
}

export default IngredientComponent
