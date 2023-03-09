import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import RecipeHeader from '../components/recipeDetailsInProgress/RecipeHeader';
import RecipeIngredients from '../components/recipeDetailsInProgress/RecipeIngredients';
import RecipeInstructions from '../components/recipeDetailsInProgress/RecipeInstructions';
import RecipeYoutube from '../components/recipeDetailsInProgress/RecipeYoutube';
import { fetchRecipeDetails } from '../services';
import '../style/recipeDetails.css';

function RecipeDetails() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [recipeInfo, setRecipeInfo] = useState({});

  const [recipeIsLoading, setRecipeIsLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setRecipeIsLoading(true);
    const info = await fetchRecipeDetails(id, pathname);
    setRecipeInfo(info);
    setRecipeIsLoading(false);
  }, [id, pathname]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const isDrink = pathname.includes('/drinks');

  return (
    <main>
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
        </>
      ) }
    </main>
  );
}

export default RecipeDetails;
