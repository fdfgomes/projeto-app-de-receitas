import React from 'react';
import PropTypes from 'prop-types';

export default function RecipeCard({ data, recipe }) {
  const isDrink = recipe === 'Drinks';
  return (
    <main>
      <div className="wrapper">
        { data.map((item, index) => (
          <div
            className="recipe-card"
            data-testid={ `${index}-recipe-card` }
            key={ isDrink ? item.idDrink : item.idMeal }
          >
            <img
              alt={ `${isDrink ? item.strDrink : item.strMeal} recipe` }
              data-testid={ `${index}-card-img` }
              src={ isDrink ? item.strDrinkThumb : item.strMealThumb }
            />
            <h2
              className="card-name"
              data-testid={ `${index}-card-name` }
            >
              { isDrink ? item.strDrink : item.strMeal }
            </h2>
          </div>
        )) }
      </div>
    </main>
  );
}

RecipeCard.propTypes = {
  data: PropTypes.shape({
    strDrink: PropTypes.string,
    strDrinkThumb: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  }),
  recipe: PropTypes.string,
}.isRequired;
