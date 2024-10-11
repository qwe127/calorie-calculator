import { useState} from 'react'

import IngredientComponent from './IngredientComponent';
import DishComponent from './DishComponent';
import AddIngredientComponent from './AddIngredientComponent';

import './App.css'

function App() {
  const [data, setData] = useState(JSON.parse(localStorage.getItem('ingredientlist')) || [])  
  const [Ingredients, setIngredients] = useState(false);
  const [Dish, setDish] = useState(false);
  const [AddIngredient, setAddIngredient] = useState(true);
   
    
    function checkTab(){
    if (Ingredients === true){
      return <IngredientComponent/>;
    }
    else if (Dish === true){
      return <DishComponent/>;
    }
    else if (AddIngredient === true){
      return <AddIngredientComponent
        data={data}
        setData={setData}
      />;
    }
  };

  function tabSelector(event, tab) {
    
    switch(tab){
      case "Ingredients":
        setIngredients(true);
        setDish(false);
        setAddIngredient(false);
        console.log(event)
        break;
      case "Dish":
        setIngredients(false);
        setDish(true);
        setAddIngredient(false);
        break;
      case "Add":
        setIngredients(false);
        setDish(false);
        setAddIngredient(true);
        break;
    }
  }

  return (
    <>
      <div className="wrapper">
        <header>
          <button id = "ingredientsButton" onClick={(event) => {tabSelector(event, "Ingredients")}}>Ingredients</button>
          <button id = "add-button" onClick={(event) => {tabSelector(event, "Add")}}>Add Ingredient</button>

        </header>
        {checkTab()}
      </div>

    </>
  )
}

export default App
