import propTypes from 'prop-types';
import '../../styles/pages/RecipeDetails/Instructions.css';

function Instructions({ strInstructions }) {
  return (
    <div className="recipe-instructions">
      <h2 className="mealsInstructionsHeader">Instructions</h2>
      <p data-testid="instructions">
        { strInstructions }
      </p>
    </div>
  );
}

Instructions.propTypes = {
  strInstructions: propTypes.string,
}.isRequired;

export default Instructions;
