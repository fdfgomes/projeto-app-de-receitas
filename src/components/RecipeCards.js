import React from 'react';
import PropTypes from 'prop-types';
import '../style/RecipeCards.css';

export default function RecipeCard({ data, recipe, category }) {
  return (
    <>
      {
      /* Categorias */
      }
      <div className="category-group">
        <button
          type="button"
          className="btn-category"
          data-testid="All-category-filter"
          key={ -0 }
        >
          All
        </button>
        { category.map((item, index) => (
          <button
            type="button"
            className="btn-category"
            data-testid={ `${item.strCategory}-category-filter` }
            key={ index }
          >
            {item.strCategory}
          </button>
        ))}
      </div>
      {
      /* Cards */
      }
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
    </>
  );
}

RecipeCard.propTypes = {
  data: PropTypes.arrayOf({}),
  recipe: PropTypes.string,
}.isRequired;
