import React from 'react';
import PropTypes from 'prop-types';
import '../style/RecipeCards.css';

export default function RecipeCard({ data, recipe }) {
  return (
    <div className="container-cards">
      { recipe === 'Meals'
        ? data.map((item, index) => (
          <div
            key={ item.idMeal }
            data-testid={ `${index}-recipe-card` }
            className="card"
          >
            <img
              src={ item.strMealThumb }
              data-testid={ `${index}-card-img` }
              alt={ `${item.strMeal} recipe` }
              className="card-img-top"
            />
            <h5
              data-testid={ `${index}-card-name` }
              className="card-title"
            >
              {item.strMeal}
            </h5>
          </div>
        )) : data.map((item, index) => (
          <div
            key={ item.idDrink }
            data-testid={ `${index}-recipe-card` }
            className="card"
          >
            <img
              src={ item.strDrinkThumb }
              data-testid={ `${index}-card-img` }
              alt={ `${item.strDrink} recipe` }
              className="card-img-top"
            />
            <h5
              data-testid={ `${index}-card-name` }
              className="card-title"
            >
              {item.strDrink}
            </h5>
          </div>
        ))}
    </div>
  );
}

RecipeCard.propTypes = {
  data: PropTypes.arrayOf({}),
  recipe: PropTypes.string,
}.isRequired;
