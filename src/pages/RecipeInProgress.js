import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import RecipeButton from '../components/recipeDetailsInProgress/RecipeButton';
import RecipeHeader from '../components/recipeDetailsInProgress/RecipeHeader';
import RecipeIngredients from '../components/recipeDetailsInProgress/RecipeIngredients';
import RecipeInstructions from '../components/recipeDetailsInProgress/RecipeInstructions';
import RecipeYoutube from '../components/recipeDetailsInProgress/RecipeYoutube';
import { fetchRecipeDetails } from '../services';

function RecipeInProgress() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [recipeInfo, setRecipeInfo] = useState({});

  const fetchDetails = useCallback(async () => {
    const info = await fetchRecipeDetails(id, pathname);
    setRecipeInfo(info);
  }, [id, pathname]);

  const isDrink = pathname.includes('/drinks');

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <main className="recipe-details">
      <RecipeHeader
        src={ isDrink ? recipeInfo.strDrinkThumb : recipeInfo.strMealThumb }
        alt={ isDrink ? recipeInfo.strDrink : recipeInfo.strMeal }
        title={ isDrink ? recipeInfo.strDrink : recipeInfo.strMeal }
        category={ isDrink ? recipeInfo.strAlcoholic : recipeInfo.strCategory }
      />
      <RecipeIngredients
        ingredients={ recipeInfo.ingredients }
        isRecipeInProgress
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
    </main>
  );
}

export default RecipeInProgress;
