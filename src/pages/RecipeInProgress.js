import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
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

  const history = useHistory();

  const [recipeInfo, setRecipeInfo] = useState(null);

  const [recipeIsLoading, setRecipeIsLoading] = useState(true);

  const {
    addInProgressRecipe,
    addDoneRecipe,
    inProgressRecipes,
    setInProgressRecipes,
  } = useContext(Context);

  const isDrink = useMemo(() => pathname.includes('/drinks'), [pathname]);

  const fetchDetails = useCallback(async (recipeId) => {
    setRecipeIsLoading(true);
    const info = await fetchRecipeDetails(recipeId, pathname);
    setRecipeInfo(info);
    setRecipeIsLoading(false);
    // adicionar receita à lista de receitas em progresso
    addInProgressRecipe(info);
  }, [addInProgressRecipe, pathname]);

  const allCheckboxesAreChecked = useMemo(
    () => {
      if (recipeInfo && inProgressRecipes) {
        const recipeIngredientsLength = recipeInfo.ingredients.length;
        let recipeCheckedIngredientsCount = 0;
        recipeInfo.ingredients.forEach((ingredient) => {
          if (ingredient.done) {
            recipeCheckedIngredientsCount += 1;
          }
        });
        return recipeIngredientsLength === recipeCheckedIngredientsCount;
      }
      return false;
    },
    [recipeInfo, inProgressRecipes],
  );

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

  const handleClickFinishRecipe = useCallback((recipe) => {
    addDoneRecipe(recipe);
    history.push('/done-recipes');
  }, [addDoneRecipe, history]);

  useEffect(() => {
    fetchDetails(id);
  }, [fetchDetails, id]);

  return (
    <main className="recipe-details">
      { recipeIsLoading && <Loading /> }
      { !recipeIsLoading && (
        <>
          <RecipeHeader data={ recipeInfo } />
          <RecipeIngredients
            ingredients={ recipeInfo.ingredients }
            isRecipeInProgress
            handleClickIngredient={ toggleCheckbox }
          />
          <RecipeInstructions
            strInstructions={ recipeInfo.strInstructions }
          />
          <RecipeYoutube
            strYoutube={ recipeInfo.strYoutube }
            isDrink={ isDrink }
          />
          <RecipeButton
            disabled={ !allCheckboxesAreChecked }
            id="finish-recipe-btn"
            label="Finish recipe"
            onClick={ () => handleClickFinishRecipe(recipeInfo) }
          />
        </>
      ) }
    </main>
  );
}

export default RecipeInProgress;
