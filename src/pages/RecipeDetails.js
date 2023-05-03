import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Header from '../components/RecipeDetails/Header';
import Ingredients from '../components/RecipeDetails/Ingredients';
import Instructions from '../components/RecipeDetails/Instructions';
import Button from '../components/RecipeDetails/Button';
import Recommendations from '../components/RecipeDetails/Recommendations';
import Video from '../components/RecipeDetails/Video';
import { fetchRecipeDetails } from '../services';
import { recipeIsInProgress } from '../helpers/recipeHelpers';
import '../styles/pages/RecipeDetails.css';

function RecipeDetails() {
  const { id } = useParams();

  const { pathname } = useLocation();

  const history = useHistory();

  const isDrink = pathname.includes('/drinks');

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

  return (
    <main className="recipe-details">
      { recipeIsLoading && <Loading /> }
      { !recipeIsLoading && (
        <>
          <Header data={ recipeInfo } />
          <Ingredients
            ingredients={ recipeInfo.ingredients }
          />
          <Instructions
            strInstructions={ recipeInfo.strInstructions }
          />
          <Video
            strYoutube={ recipeInfo.strYoutube }
            isDrink={ isDrink }
          />
          <Button
            disabled={ false }
            id="start-recipe-btn"
            label={ recipeIsInProgress(id) ? 'Continue Recipe' : 'Start Recipe' }
            onClick={ handleClickStartRecipe }
          />
          <Recommendations />
        </>
      ) }
    </main>
  );
}

export default RecipeDetails;
