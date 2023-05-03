import PropTypes from 'prop-types';
import '../../styles/pages/RecipeDetails/Button.css';

export default function Button({ disabled, id, label, onClick }) {
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

Button.propTypes = {
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
