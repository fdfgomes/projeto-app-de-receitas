import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Button from '../components/RecipeDetails/Button';
import Header from '../components/RecipeDetails/Header';
import Ingredients from '../components/RecipeDetails/Ingredients';
import Instructions from '../components/RecipeDetails/Instructions';
import Video from '../components/RecipeDetails/Video';
import Context from '../context/Context';
import { fetchRecipeDetails } from '../services';
import setPageTitle from '../utils/setPageTitle';
import { APP_SHORT_NAME } from '../constants';

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

  useEffect(() => {
    let pageTitle = APP_SHORT_NAME;

    if (recipeIsLoading) {
      pageTitle = `Loading... - ${APP_SHORT_NAME}`;
    }

    if (!recipeIsLoading && (recipeInfo.strDrink || recipeInfo.strMeal)) {
      if (isDrink) {
        pageTitle = `${recipeInfo.strDrink} - ${APP_SHORT_NAME}`;
      }
      if (!isDrink) {
        pageTitle = `${recipeInfo.strMeal} - ${APP_SHORT_NAME}`;
      }
    }

    setPageTitle(pageTitle);
  }, [isDrink, recipeInfo, recipeIsLoading]);

  return (
    <main className="recipe-details">
      { recipeIsLoading && <Loading /> }
      { !recipeIsLoading && (
        <>
          <Header data={ recipeInfo } />
          <Ingredients
            ingredients={ recipeInfo.ingredients }
            isDrink={ isDrink }
            isRecipeInProgress
            recipeId={ id }
          />
          <Instructions
            strInstructions={ recipeInfo.strInstructions }
          />
          <Video
            strYoutube={ recipeInfo.strYoutube }
            isDrink={ isDrink }
          />
          <Button
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
