import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/RecipeCards.css';

export default function RecipeCards({ data, horizontal, type }) {
  const isDrink = type === 'Drinks';

  return (
    <main>
      <div className={ `recipe-cards ${horizontal ? 'horizontal' : ''}` }>
        { data?.map((item, index) => (
          <Link
            key={ isDrink ? `${index}-${item.idDrink}` : `${index}-${item.idMeal}` }
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
  horizontal: PropTypes.bool,
  type: PropTypes.string,
}.isRequired;
