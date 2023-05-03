import { useCallback, useContext, useMemo } from 'react';
import propTypes from 'prop-types';
import Context from '../../context/Context';
import '../../styles/pages/RecipeDetails/Ingredients.css';

function Ingredients({ ingredients, isDrink, isRecipeInProgress, recipeId }) {
  const { inProgressRecipes, setInProgressRecipes } = useContext(Context);

  // constante que armazena o progresso da receita
  const recipeProgress = useMemo(() => {
    if (isDrink) {
      if (inProgressRecipes.drinks && inProgressRecipes.drinks[recipeId]) {
        return inProgressRecipes.drinks[recipeId];
      }
      return ingredients;
    }
    if (!isDrink) {
      if (inProgressRecipes.meals && inProgressRecipes.meals[recipeId]) {
        return inProgressRecipes.meals[recipeId];
      }
      return ingredients;
    }
    return ingredients;
  }, [inProgressRecipes, ingredients, isDrink, recipeId]);

  // alternar estado dos ingredientes (concluído/não concluído)
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
    <div className="recipe-ingredients">
      <h2>Ingredients</h2>
      <ul>
        { ingredients.map((ingredient, index) => {
          // renderização do ingrediente na tela de detalhes da receita
          if (!isRecipeInProgress) {
            return (
              <li key={ `${index}-${ingredient.name}` }>
                <span data-testid={ `${index}-ingredient-name-and-measure` }>
                  { `${ingredient.measure ?? ''} ${ingredient.name}` }
                </span>
              </li>
            );
          }
          // renderização do ingrediente na tela de receita em progresso
          return (
            <li key={ `${index}-${ingredient.name}` }>
              <label
                className={ `
                  ingredient-in-progress
                  ${recipeProgress[index].done ? 'done' : ''}
                `.trim() }
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  checked={ recipeProgress[index].done }
                  onChange={ () => toggleCheckbox(index) }
                  type="checkbox"
                />
                { `${ingredient.measure ?? ''} ${ingredient.name}` }
              </label>
            </li>
          );
        }) }
      </ul>
    </div>
  );
}

Ingredients.propTypes = {
  ingredients: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    measure: propTypes.string,
    done: propTypes.bool,
  })),
  isDrink: propTypes.bool,
  isRecipeInProgress: propTypes.bool,
  recipeId: propTypes.string,
}.isRequired;

export default Ingredients;
