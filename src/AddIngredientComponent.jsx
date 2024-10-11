import { useState, useRef } from 'react'
import './addIngredient.css'
import PropTypes from 'prop-types'

const regex=/^[0-9.]+$/;

function AddIngredientComponent({data, setData}){
    
    const [name, setName] = useState("")
    const [calories, setCalories] = useState(0)
    const [fat, setFat] = useState(0)
    const [carb, setCarb] = useState(0)
    const [protein, setProtein] = useState(0)
    const [weight, setWeight] = useState(0)

    const [savePrompt, setSavePrompt] = useState(false)
    const [savedPrompt, setSavedPrompt] = useState(false)

    const mainRef = useRef();

    const nameRef = useRef();
    const weightRef = useRef();
    const calRef = useRef();
    const carbRef = useRef();
    const fatRef = useRef();
    const proteinRef = useRef();

    function setAndSave(newData){
        setData(newData)
        localStorage.setItem('ingredientlist', JSON.stringify(newData))
    }
    
    function saveIngredient(event){
        event.preventDefault()
        let calculatedCalories = 0.00;
        let calculatedFat = 0.00;
        let calculatedCarb = 0.00;
        let calculatedProtein = 0.00;

        let ingredientToSave = {};

        if (name !== '' && weight > 0.00 && calories > 0.00 && fat > 0.00 && carb > 0.00 && protein > 0.00){
            calculatedCalories = (calories / weight) * 100
            calculatedFat = (fat / weight) * 100
            calculatedCarb = (carb / weight) * 100
            calculatedProtein = (protein / weight) * 100

            ingredientToSave = {
                name: name,
                calories: calculatedCalories.toFixed(2),
                carbohydrates: calculatedCarb.toFixed(2),
                proteins: calculatedProtein.toFixed(2),
                fats: calculatedFat.toFixed(2),
                dish: false
            }
            const newIngredient = [...data, ingredientToSave]
            console.log(newIngredient)
            setAndSave(newIngredient)
            setSavedPrompt(true)
        }
        setSavePrompt(false)
        console.log(data)
    }
    
    function trimText(text){
        const trimmedName = text.trim()
        setName(trimmedName)
        console.log(trimmedName)
    }

    function calorieSetter(event){
        if (event.target.value.match(regex)){
            event.target.style["border-color"] = ""
            setCalories(event.target.value)
        } else {
            event.target.style["border-color"] = "red";
            setCalories(0.00)
        }
    }
    
    function carbSetter(event){
        if (event.target.value.match(regex)){
            event.target.style["border-color"] = ""
            setCarb(event.target.value)
        } else {
            event.target.style["border-color"] = "red";
            setCarb(0.00)
        }
    }
    
    function fatSetter(event){
        if (event.target.value.match(regex)){
            event.target.style["border-color"] = ""
            setFat(event.target.value)
        } else {
            event.target.style["border-color"] = "red";
            setFat(0.00)
        }
    }
    
    function proteinSetter(event){
        if (event.target.value.match(regex)){
            event.target.style["border-color"] = ""
            setProtein(event.target.value)
        } else {
            event.target.style["border-color"] = "red";
            setProtein(0.00)
        }
    }
    
    function weightSetter(event){
        if (event.target.value.match(regex)){
            event.target.style["border-color"] = ""
            setWeight(event.target.value)
        } else {
            event.target.style["border-color"] = "red";
            setWeight(0.00)
        }
    }
    
    function validateForm(event){
        event.preventDefault();
        trimText(name);
        if (name === ''){
            nameRef.current.style.borderStyle = "solid"
            nameRef.current.style.borderColor = "red"
        }
        if (weight <= 0.00 || !weightRef.current.value.match(regex)){
            weightRef.current.style.borderStyle = "solid"
            weightRef.current.style.borderColor = "red"
        }
        if (calories <= 0.00 || !calRef.current.value.match(regex)){
            calRef.current.style.borderStyle = "solid"
            calRef.current.style.borderColor = "red"
        }        
        if (carb <= 0.00 || !carbRef.current.value.match(regex)){
            carbRef.current.style.borderStyle = "solid"
            carbRef.current.style.borderColor = "red"
        }
        if (fat <= 0.00 || !fatRef.current.value.match(regex)){
            fatRef.current.style.borderStyle = "solid"
            fatRef.current.style.borderColor = "red"
        }
        if (protein <= 0.00 || !proteinRef.current.value.match(regex)){
            proteinRef.current.style.borderStyle = "solid"
            proteinRef.current.style.borderColor = "red"
        }
        if (name !== '' && weight > 0.00 && calories > 0.00 && fat > 0.00 && carb > 0.00 && protein > 0.00){
            data.map(i => {
                if (i.name === name){
                    setName('')
                    nameRef.current.value = '';
                    nameRef.current.placeholder = `"${name}" is already in the database.`;
                    nameRef.current.style.borderStyle = "solid";
                    nameRef.current.style.borderColor = "red";
                    setSavePrompt(false);  
                    return;
                } 
            })
                if(nameRef.current.placeholder != `"${name}" is already in the database.`){
                    setSavePrompt(true);
                    mainRef.current.classList.add('active-modal')                
            }    
        }
    }

    return(
        <div className="ingredient-wrapper">
            { savePrompt &&
            <div className='prompt-wrapper'>
                <div className='pop-up'><p>Save &quot;{name}&quot;?</p>
                    <div className='pop-up-buttons'>
                        <button onClick={(e) => {saveIngredient(e)}}>Yes</button>
                        <button onClick={()=>{setSavePrompt(false); mainRef.current.classList.remove('active-modal')}}>No</button>
                    </div>
                </div>
            </div>
            }
            { savedPrompt &&
            <div className='prompt-wrapper'>
                <div className='pop-up'>
                    <p>&quot;{name}&quot; was added to the database.</p>
                    <button onClick={() => {setSavedPrompt(); mainRef.current.classList.remove('active-modal') }}>Confirm</button>
                </div>
            </div>
            }
            <form ref={mainRef} className='add-component-main-container'> 
                <div className="name-weight">
                    <input value={name} required type='text' ref={nameRef} placeholder="Name" onChange={e => {setName(e.target.value)}} onClick={e => e.target.style={backgroundColor: ""}}></input>
                    <input type="number" ref={weightRef} className="weight" onChange={(e) => {weightSetter(e)}} placeholder="Weight" onClick={e => e.target.style={backgroundColor: ""}}></input> 
                </div>
                <div className="macros-container">
                    <input required type="number" ref={calRef} onChange={(e) => {calorieSetter(e)}} placeholder="Calories" onClick={e => e.target.style={backgroundColor: ""}}></input>
                    <input required type="number" ref={carbRef} onChange={(e) => {carbSetter(e)}} placeholder="Carbohydrates" onClick={e => e.target.style={backgroundColor: ""}}></input> 
                    <input required type="number" ref={fatRef} onChange={(e) => {fatSetter(e)}} placeholder="Fat" onClick={e => e.target.style={backgroundColor: ""}}></input> 
                    <input required type="number" ref={proteinRef} onChange={(e) => {proteinSetter(e)}} placeholder="Protein" onClick={e => e.target.style={backgroundColor: ""}}></input> 
                </div>
                <button className='add-save-button' onClick={(e)=>{validateForm(e)}}>Save</button>
            </form>          
        </div>
    );
}
AddIngredientComponent.propTypes = {
    data: PropTypes.any,
    setData: PropTypes.any
}

export default AddIngredientComponent