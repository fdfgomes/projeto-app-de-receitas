import propTypes from 'prop-types';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';

function RecipeHeader({ src, alt, title, category }) {
  return (
    <div className="recipe-header">
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
      {/* botão compartilhar receita */}
      <button type="button">
        <img
          alt="Share recipe"
          data-testid="share-btn"
          src={ shareIcon }
        />
      </button>
      {/* botão favoritar receita */}
      <button type="button">
        <img
          alt="Favorite recipe"
          data-testid="favorite-btn"
          src={ whiteHeartIcon }
        />
      </button>
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
