import propTypes from 'prop-types';

function RecipeHeader({ src, alt, title, category }) {
  return (
    <div>
      <img
        src={ src }
        alt={ alt }
        data-testid="recipe-photo"
      />
      <p
        data-testid="recipe-title"
      >
        { title }
      </p>
      <p data-testid="recipe-category">
        { category }
      </p>
    </div>
  );
}

RecipeHeader.propTypes = {
  src: propTypes.string,
  alt: propTypes.string,
  title: propTypes.string,
  category: propTypes.string,
}.isRequired;

export default RecipeHeader;
