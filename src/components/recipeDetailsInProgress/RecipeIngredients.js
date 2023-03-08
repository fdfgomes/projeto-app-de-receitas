import propTypes from 'prop-types';

function RecipeIngredients({ ingredients }) {
  return (
    <div>
      <ul>
        { ingredients?.map((elem, i) => (
          <li
            key={ `${elem.name} ${i}` }
          >
            <span data-testid={ `${i}-ingredient-name-and-measure` }>
              {`${elem.measure}` }
            </span>
            <span data-testid={ `${i}-ingredient-name-and-measure` }>
              {`${elem.name}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

RecipeIngredients.propTypes = {
  ingredients: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    measure: propTypes.string,
  })),
}.isRequired;

export default RecipeIngredients;
