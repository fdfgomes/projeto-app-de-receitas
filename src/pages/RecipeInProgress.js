import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import RecipeButton from '../components/RecipeDetails/RecipeButton';
import RecipeHeader from '../components/RecipeDetails/RecipeHeader';
import RecipeIngredients from '../components/RecipeDetails/RecipeIngredients';
import RecipeInstructions from '../components/RecipeDetails/RecipeInstructions';
import RecipeYoutube from '../components/RecipeDetails/RecipeYoutube';
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
      if (recipeInfo) {
        const recipeType = isDrink ? 'drinks' : 'meals';
        const recipeIngredientsLength = recipeInfo.ingredients.length;
        let recipeCheckedIngredientsCount = 0;
        inProgressRecipes[recipeType][id]?.forEach((ingredient) => {
          if (ingredient.done) {
            recipeCheckedIngredientsCount += 1;
          }
        });
        return recipeIngredientsLength === recipeCheckedIngredientsCount;
      }
      return false;
    },
    [recipeInfo, isDrink, inProgressRecipes, id],
  );

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
            isDrink={ isDrink }
            isRecipeInProgress
            recipeId={ id }
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
