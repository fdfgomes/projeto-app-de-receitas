import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function RecipeCard({ item, index, isDrink }) {
  return (
    <Link
      to={ isDrink ? `/drinks/${item.idDrink}` : `/meals/${item.idMeal}` }
    >
      <div
        className="recipe-card"
        data-testid={ `${index}-recipe-card` }
      >
        {/* label com a categoria da receita */}
        <div className="recipe-categories">
          {/* exibir apenas se houver valor nas propriedades strAlcoholic ou strCategory */}
          {(isDrink ? item.strAlcoholic : item.strCategory) && (
            <button
              className="category"
              type="button"
            >
              { isDrink ? item.strAlcoholic : item.strCategory }
            </button>
          )}
        </div>
        <div className="img-wrapper">
          <LazyLoadImage
            alt={ `${isDrink ? item.strDrink : item.strMeal} recipe` }
            data-testid={ `${index}-card-img` }
            effect="blur"
            src={ isDrink ? item.strDrinkThumb : item.strMealThumb }
          />
        </div>
        <h2
          className="recipe-name"
          data-testid={ `${index}-card-name` }
        >
          { isDrink ? item.strDrink : item.strMeal }
        </h2>
      </div>
    </Link>
  );
}

RecipeCard.propTypes = {
  item: PropTypes.shape({
    strDrink: PropTypes.string,
    strDrinkThumb: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  }),
  index: PropTypes.number,
  isDrink: PropTypes.bool,
}.isRequired;

export default RecipeCard;
