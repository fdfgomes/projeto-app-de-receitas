import React from 'react';
import PropTypes from 'prop-types';

export default function SearchCard({ data, index, type }) {
  const isDrink = type === 'drink';

  return (
    <div className="recipe-card" data-testid={ `${index}-recipe-card` }>
      <img
        alt={ isDrink ? data.strDrink : data.strMeal }
        data-testid={ `${index}-card-img` }
        src={ isDrink ? data.strDrinkThumb : data.strMealThumb }
      />
      <h2 className="card-name" data-testid={ `${index}-card-name` }>
        { isDrink ? data.strDrink : data.strMeal }
      </h2>
    </div>
  );
}

SearchCard.propTypes = {
  data: PropTypes.shape({
    strDrink: PropTypes.string,
    strDrinkThumb: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};
