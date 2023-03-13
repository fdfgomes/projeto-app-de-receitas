import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchRecomendations } from '../../services';
import '../../style/recomendationCard.css';

function RecipeRecomendations() {
  const { pathname } = useLocation();
  const [recipes, setRecipes] = useState([]);

  const fetchRecomendationsAPI = useCallback(async () => {
    const recipesLimit = 6;
    const recomendations = await fetchRecomendations(pathname);
    if (pathname.includes('/meals')) {
      const slicedRecomendation = recomendations.drinks?.slice(0, recipesLimit);
      setRecipes(slicedRecomendation);
    } else {
      const slicedRecomendation = recomendations.meals?.slice(0, recipesLimit);
      setRecipes(slicedRecomendation);
    }
  }, [pathname]);

  useEffect(() => {
    fetchRecomendationsAPI();
  }, [fetchRecomendationsAPI]);

  const isDrink = pathname.includes('/drinks');
  return (
    <div>
      { isDrink
        ? (
          <div className="outer">
            <div className="flex-container">
              {recipes?.map((elem, i) => (
                <span
                  key={ elem.idMeal }
                  data-testid={ `${i}-recommendation-card` }
                  className="recomendationCard"
                >
                  <img src={ elem.strMealThumb } alt={ elem.strMeal } />
                  <p data-testid={ `${i}-recommendation-title` }>{ elem.strMeal }</p>
                </span>
              ))}
            </div>
          </div>
        )
        : (
          <div className="outer">
            <div className="flex-container">
              {recipes?.map((elem, i) => (
                <span
                  key={ elem.idDrink }
                  data-testid={ `${i}-recommendation-card` }
                  className="recomendationCard"
                >
                  <img src={ elem.strDrinkThumb } alt={ elem.strDrink } />
                  <p data-testid={ `${i}-recommendation-title` }>{ elem.strDrink }</p>
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export default RecipeRecomendations;
