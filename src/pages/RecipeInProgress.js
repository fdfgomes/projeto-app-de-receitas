import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import RecipeButton from '../components/recipeDetailsInProgress/RecipeButton';
import RecipeHeader from '../components/recipeDetailsInProgress/RecipeHeader';
import RecipeIngredients from '../components/recipeDetailsInProgress/RecipeIngredients';
import RecipeInstructions from '../components/recipeDetailsInProgress/RecipeInstructions';
import RecipeYoutube from '../components/recipeDetailsInProgress/RecipeYoutube';
import Context from '../context/Context';
import { fetchRecipeDetails } from '../services';

function RecipeInProgress() {
  const { id } = useParams();
  const { pathname } = useLocation();

  const [recipeInfo, setRecipeInfo] = useState({});

  const [recipeIsLoading, setRecipeIsLoading] = useState(true);

  const { addInProgressRecipe, setInProgressRecipes } = useContext(Context);

  const fetchDetails = useCallback(async (recipeId) => {
    setRecipeIsLoading(true);
    const info = await fetchRecipeDetails(recipeId, pathname);
    setRecipeInfo(info);
    setRecipeIsLoading(false);
    // adicionar receita à lista de receitas em progresso
    addInProgressRecipe(info);
  }, [addInProgressRecipe, pathname]);

  const isDrink = pathname.includes('/drinks');

  const toggleCheckbox = useCallback((ingredientIndex) => {
    const newRecipeState = recipeInfo;
    // alterar o estado do ingrediente clicado
    newRecipeState.ingredients[ingredientIndex].done = !newRecipeState
      .ingredients[ingredientIndex].done;
    // atualizar o estado global
    setInProgressRecipes((currentState) => ([
      ...currentState.map(
        (recipeInProgress) => {
          const isDrinkRecipe = !!recipeInProgress.idDrink;
          if (isDrinkRecipe && recipeInProgress.idDrink === id) {
            return newRecipeState;
          }
          if (!isDrinkRecipe && recipeInProgress.idMeal === id) {
            return newRecipeState;
          }
          return recipeInProgress;
        },
      ),
    ]));
  }, [id, recipeInfo, setInProgressRecipes]);

  useEffect(() => {
    fetchDetails(id);
  }, [fetchDetails, id]);

  return (
    <main className="recipe-details">
      { recipeIsLoading && <Loading /> }
      { !recipeIsLoading && (
        <>
          <RecipeHeader
            src={ isDrink ? recipeInfo.strDrinkThumb : recipeInfo.strMealThumb }
            alt={ isDrink ? recipeInfo.strDrink : recipeInfo.strMeal }
            title={ isDrink ? recipeInfo.strDrink : recipeInfo.strMeal }
            category={ isDrink ? recipeInfo.strAlcoholic : recipeInfo.strCategory }
          />
          <RecipeIngredients
            ingredients={ recipeInfo.ingredients }
            isRecipeInProgress
            toggleCheckbox={ toggleCheckbox }
          />
          <RecipeInstructions
            strInstructions={ recipeInfo.strInstructions }
          />
          <RecipeYoutube
            strYoutube={ recipeInfo.strYoutube }
            isDrink={ isDrink }
          />
          <RecipeButton
            id="finish-recipe-btn"
            label="Finish recipe"
          />
        </>
      ) }
    </main>
  );
}

export default RecipeInProgress;
