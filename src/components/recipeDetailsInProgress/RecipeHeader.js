import propTypes from 'prop-types';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../../context/Context';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';

const copy = require('clipboard-copy');

function RecipeHeader({ data }) {
  const { favoriteRecipes, setFavoriteRecipes } = useContext(Context);
  const { pathname } = useLocation();
  const [copyMessage, setCopyMessage] = useState(false);

  const isDrink = useMemo(() => !!data.idDrink, [data]);

  // receita no formato exigido pelo requisito 34
  const recipe = useMemo(() => ({
    id: isDrink ? data.idDrink : data.idMeal,
    type: isDrink ? 'drink' : 'meal',
    nationality: data.strArea ?? '',
    category: data.strCategory,
    alcoholicOrNot: isDrink ? data.strAlcoholic : '',
    name: isDrink ? data.strDrink : data.strMeal,
    image: isDrink ? data.strDrinkThumb : data.strMealThumb,
  }), [data, isDrink]);

  // constante que armazena o estado atual da receita (favoritada ou não)
  const isFavorited = useMemo(() => !!favoriteRecipes
    .find(
      (alreadyFavoritedRecipe) => alreadyFavoritedRecipe.id === recipe.id,
    ), [favoriteRecipes, recipe]);

  // adicionar/remover receita dos favoritos
  const toggleFavorite = useCallback(() => {
    setFavoriteRecipes((currentState) => {
      // remover dos favoritos caso a receita já tenha sido favoritada
      if (isFavorited) {
        return [
          ...currentState.filter((favoritedRecipe) => favoritedRecipe.id !== recipe.id),
        ];
      }
      return [
        ...currentState,
        recipe,
      ];
    });
  }, [isFavorited, recipe, setFavoriteRecipes]);

  const handleShareClick = useCallback(() => {
    copy(`http://localhost:3000${pathname}`);
    setCopyMessage(true);
  }, [pathname]);

  return (
    <div className="recipe-header">
      <img
        alt={ recipe.name }
        data-testid="recipe-photo"
        src={ recipe.image }
      />
      <h1 data-testid="recipe-title">
        { recipe.name }
      </h1>
      <p data-testid="recipe-category">
        { isDrink ? recipe.alcoholicOrNot : recipe.category }
      </p>
      {/* botão compartilhar receita - handleclick */}
      {copyMessage && <p>Link copied!</p>}
      <button
        type="button"
        onClick={ handleShareClick }
      >
        <img
          alt="Share recipe"
          data-testid="share-btn"
          src={ shareIcon }
        />
      </button>
      {/* botão favoritar receita */}
      <button
        className="favorite-button"
        onClick={ toggleFavorite }
        type="button"
      >
        <img
          alt="Favorite recipe"
          data-testid="favorite-btn"
          src={ isFavorited ? blackHeartIcon : whiteHeartIcon }
        />
      </button>
    </div>
  );
}

RecipeHeader.propTypes = {
  data: propTypes.shape({
    idDrink: propTypes.string,
    idMeal: propTypes.string,
    strAlcoholic: propTypes.string,
    strArea: propTypes.string,
    strCategory: propTypes.string,
    strDrink: propTypes.string,
    strDrinkThumb: propTypes.string,
    strMeal: propTypes.string,
    strMealThumb: propTypes.string,
  }),
}.isRequired;

export default RecipeHeader;
