import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import RecipeHeader from '../components/recipeDetailsInProgress/RecipeHeader';
import RecipeIngredients from '../components/recipeDetailsInProgress/RecipeIngredients';
import RecipeInstructions from '../components/recipeDetailsInProgress/RecipeInstructions';
import RecipeButton from '../components/recipeDetailsInProgress/RecipeButton';
import RecipeRecomendations
  from '../components/recipeDetailsInProgress/RecipeRecomendations';
import RecipeYoutube from '../components/recipeDetailsInProgress/RecipeYoutube';
import { fetchRecipeDetails } from '../services';

function RecipeDetails() {
  const { id } = useParams();
  const { pathname } = useLocation();

  const history = useHistory();

  const [recipeInfo, setRecipeInfo] = useState({});

  const [recipeIsLoading, setRecipeIsLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setRecipeIsLoading(true);
    const info = await fetchRecipeDetails(id, pathname);
    setRecipeInfo(info);
    setRecipeIsLoading(false);
  }, [id, pathname]);

  const handleClickStartRecipe = useCallback(() => {
    history.push(`${pathname}/in-progress`);
  }, [history, pathname]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const isDrink = pathname.includes('/drinks');

  return (
    <main className="recipe-details">
      { recipeIsLoading && <Loading /> }
      { !recipeIsLoading && (
        <>
          <RecipeHeader data={ recipeInfo } />
          <RecipeIngredients
            ingredients={ recipeInfo.ingredients }
          />
          <RecipeInstructions
            strInstructions={ recipeInfo.strInstructions }
          />
          <RecipeYoutube
            strYoutube={ recipeInfo.strYoutube }
            isDrink={ isDrink }
          />
          <RecipeButton
            disabled={ false }
            id="start-recipe-btn"
            label={ recipeInfo.inProgress ? 'Continue recipe' : 'Start recipe' }
            onClick={ handleClickStartRecipe }
          />
          <RecipeRecomendations />
        </>
      ) }
    </main>
  );
}

export default RecipeDetails;
