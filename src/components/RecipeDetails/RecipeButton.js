import PropTypes from 'prop-types';
import '../../styles/RecipeDetails/RecipeButton.css';

export default function RecipeButton({ disabled, id, label, onClick }) {
  return (
    <button
      className="recipe-button"
      data-testid={ id }
      disabled={ disabled }
      onClick={ onClick }
      type="button"
    >
      { label }
    </button>
  );
}

RecipeButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
