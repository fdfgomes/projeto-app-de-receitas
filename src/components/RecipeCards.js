import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/RecipeCards.css';

export default function RecipeCards({ data, type }) {
  const isDrink = type === 'Drinks';

  return (
    <main>
      <div className="recipe-cards">
        { data.map((item, index) => (
          <Link
            key={ isDrink ? `${index}-${item.idDrink}` : `${index}-${item.idMeal}` }
            to={ isDrink ? `/drinks/${item.idDrink}` : `/meals/${item.idMeal}` }
          >
            <div
              className="recipe-card"
              data-testid={ `${index}-recipe-card` }
            >
              <div className="recipe-categories">
                <button
                  className="category"
                  type="button"
                >
                  { isDrink ? item.strAlcoholic : item.strCategory }
                </button>
              </div>
              <img
                alt={ `${isDrink ? item.strDrink : item.strMeal} recipe` }
                data-testid={ `${index}-card-img` }
                src={ isDrink ? item.strDrinkThumb : item.strMealThumb }
              />
              <h2
                className="recipe-name"
                data-testid={ `${index}-card-name` }
              >
                { isDrink ? item.strDrink : item.strMeal }
              </h2>
            </div>
          </Link>
        )) }
      </div>
    </main>
  );
}

RecipeCards.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    strDrink: PropTypes.string,
    strDrinkThumb: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  })),
  type: PropTypes.string,
}.isRequired;
