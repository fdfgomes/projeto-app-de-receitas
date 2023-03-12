import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import RecipeHeader from '../components/RecipeDetails/RecipeHeader';
import RecipeIngredients from '../components/RecipeDetails/RecipeIngredients';
import RecipeInstructions from '../components/RecipeDetails/RecipeInstructions';
import RecipeButton from '../components/RecipeDetails/RecipeButton';
import RecipeRecomendations
  from '../components/RecipeDetails/RecipeRecomendations';
import RecipeYoutube from '../components/RecipeDetails/RecipeYoutube';
import { fetchRecipeDetails } from '../services';
import { recipeIsInProgress } from '../helpers/recipeHelpers';
import '../styles/RecipeDetails.css';

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
            label={ recipeIsInProgress(id) ? 'Continue Recipe' : 'Start Recipe' }
            onClick={ handleClickStartRecipe }
          />
          <RecipeRecomendations />
        </>
      ) }
    </main>
  );
}

export default RecipeDetails;
