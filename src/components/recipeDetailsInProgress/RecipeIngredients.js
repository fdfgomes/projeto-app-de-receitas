import { useCallback, useContext, useMemo } from 'react';
import propTypes from 'prop-types';
import Context from '../../context/Context';

function RecipeIngredients({ ingredients, isDrink, isRecipeInProgress, recipeId }) {
  const { inProgressRecipes, setInProgressRecipes } = useContext(Context);

  const recipeProgress = useMemo(() => {
    if (isDrink) {
      return inProgressRecipes.drinks[recipeId];
    }
    return inProgressRecipes.meals[recipeId];
  }, [inProgressRecipes, isDrink, recipeId]);

  const toggleCheckbox = useCallback((ingredientIndex) => {
    setInProgressRecipes((currentState) => {
      const updatedState = currentState;
      const recipeType = isDrink ? 'drinks' : 'meals';
      const currentCheckboxState = currentState[recipeType][recipeId][ingredientIndex]
        .done;
      const updatedCheckboxState = !currentCheckboxState;
      updatedState[recipeType][recipeId][ingredientIndex].done = updatedCheckboxState;
      return {
        ...updatedState,
      };
    });
  }, [isDrink, recipeId, setInProgressRecipes]);

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
                className={ recipeProgress[index].done ? 'done' : '' }
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  checked={ recipeProgress[index].done }
                  onChange={ () => toggleCheckbox(index) }
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
  isDrink: propTypes.bool,
  isRecipeInProgress: propTypes.bool,
  recipeId: propTypes.string,
}.isRequired;

export default RecipeIngredients;
