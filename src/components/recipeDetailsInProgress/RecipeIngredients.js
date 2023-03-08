import propTypes from 'prop-types';

function RecipeIngredients({ ingredients, isRecipeInProgress }) {
  return (
    <div>
      <ul>
        { ingredients?.map(({ name, measure }, index) => {
          // renderização do ingrediente na tela de detalhes da receita
          if (!isRecipeInProgress) {
            return (
              <li key={ `${name} ${index}` }>
                <span data-testid={ `${index}-ingredient-name-and-measure` }>
                  { `${measure} ${name}` }
                </span>
              </li>
            );
          }
          // renderização do ingrediente na tela de receita em progresso
          return (
            <li key={ `${name} ${index}` }>
              <label data-testid={ `${index}-ingredient-step` }>
                <input type="checkbox" />
                { `${measure} ${name}` }
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
  })),
  isRecipeInProgress: propTypes.bool,
}.isRequired;

export default RecipeIngredients;
