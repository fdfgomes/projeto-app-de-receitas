import propTypes from 'prop-types';
import '../../styles/RecipeDetails/RecipeInstructions.css';

function RecipeInstructions({ strInstructions }) {
  return (
    <div className="recipe-instructions">
      <h2 className="mealsInstructionsHeader">Instructions</h2>
      <p data-testid="instructions">
        { strInstructions }
      </p>
    </div>
  );
}

RecipeInstructions.propTypes = {
  strInstructions: propTypes.string,
}.isRequired;

export default RecipeInstructions;
