import PropTypes from 'prop-types';

export default function RecipeButton({ id, label }) {
  return (
    <button
      className="recipe-action-button"
      data-testid={ id }
      type="button"
    >
      { label }
    </button>
  );
}

RecipeButton.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
