import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchRecomendations } from '../../services';
import RecipeCards from '../RecipeCards';
import '../../styles/RecipeDetails/RecipeRecommendations.css';

function RecipeRecomendations() {
  const { pathname } = useLocation();
  const [recommendations, setRecommendations] = useState([]);

  const isDrink = pathname.includes('/drinks');

  const fetchRecomendationsAPI = useCallback(async () => {
    const recommendationsLimit = 6;
    const recomendations = await fetchRecomendations(pathname);
    if (!isDrink) {
      const slicedRecomendation = recomendations.drinks?.slice(0, recommendationsLimit);
      setRecommendations(slicedRecomendation);
    } else {
      const slicedRecomendation = recomendations.meals?.slice(0, recommendationsLimit);
      setRecommendations(slicedRecomendation);
    }
  }, [isDrink, pathname]);

  useEffect(() => {
    fetchRecomendationsAPI();
  }, [fetchRecomendationsAPI]);

  return (
    <div className="recipe-recommendations">
      <h1>
        { isDrink && 'Meals suggestions'}
        {!isDrink && 'Drinks suggestions'}
      </h1>
      <RecipeCards
        data={ recommendations }
        horizontal
        type={ isDrink ? 'Meals' : 'Drinks' }
      />
    </div>
  );
}

export default RecipeRecomendations;
