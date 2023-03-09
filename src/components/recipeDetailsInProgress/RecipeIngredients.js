import propTypes from 'prop-types';

function RecipeIngredients({
  ingredients,
  isRecipeInProgress,
  handleClickIngredient,
}) {
  return (
    <div>
      <ul>
        { ingredients.map((ingredient, index) => {
          // renderização do ingrediente na tela de detalhes da receita
          if (!isRecipeInProgress) {
            return (
              <li key={ `${ingredient.name} ${index}` }>
                <span data-testid={ `${index}-ingredient-name-and-measure` }>
                  { `${ingredient.measure} ${ingredient.name}` }
                </span>
              </li>
            );
          }
          // renderização do ingrediente na tela de receita em progresso
          return (
            <li key={ `${ingredient.name} ${index}` }>
              <label
                className={ ingredient.done ? 'done' : '' }
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  checked={ ingredient.done }
                  onChange={ () => handleClickIngredient(index) }
                  type="checkbox"
                />
                { `${ingredient.measure} ${ingredient.name}` }
              </label>
            </li>
          );
        }) }
      </ul>
    </div>
  );
}

RecipeIngredients.propTypes = {
  ingredients: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    measure: propTypes.string,
    done: propTypes.bool,
  })),
  isRecipeInProgress: propTypes.bool,
  handleClickIngredient: propTypes.func,
}.isRequired;

export default RecipeIngredients;
