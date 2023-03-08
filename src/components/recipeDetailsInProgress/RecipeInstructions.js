import propTypes from 'prop-types';

function RecipeInstructions({ strInstructions }) {
  return (
    <div>
      <div className="mealInstructionsDiv">
        <h2 className="mealsInstructionsHeader">Instruções</h2>
        <p
          data-testid="instructions"
          className="mealInstructionsP"
        >
          { strInstructions }
        </p>
      </div>
    </div>
  );
}

RecipeInstructions.propTypes = {
  strInstructions: propTypes.string,
}.isRequired;

export default RecipeInstructions;
