import propTypes from 'prop-types';
import { useCallback, useContext, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BiChevronLeft } from 'react-icons/bi';
import toast from 'react-hot-toast';
import Context from '../../context/Context';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import '../../styles/RecipeDetails/RecipeHeader.css';

const copy = require('clipboard-copy');

function RecipeHeader({ data }) {
  const { pathname } = useLocation();

  const history = useHistory();

  const {
    favoriteRecipes,
    setFavoriteRecipes,
    searchResults,
    setSearchResults,
    previousSelectedCategory,
    setPreviousSelectedCategory,
    selectedCategory,
    setSelectedCategory,
  } = useContext(Context);

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

  const handleClickShare = useCallback(() => {
    // remover o /in-progress do pathname na página de receita em progresso
    const url = `http://localhost:3000${pathname.split('/in-progress')[0]}`;
    copy(url);
    toast.success('Link copied!');
  }, [pathname]);

  const handleClickGoBack = useCallback(
    async () => {
      const searchResultsType = `${recipe.type}s`;
      if (searchResults[searchResultsType].data.length === 1) {
        await setSearchResults((currentState) => ({
          ...currentState,
          [searchResultsType]: {
            ...currentState[searchResultsType],
            data: [],
            term: '',
          },
        }));
      }
      if (selectedCategory.includes('search results')) {
        await setSelectedCategory(previousSelectedCategory);
        setPreviousSelectedCategory('All');
      }
      history.goBack();
    },
    [
      history,
      previousSelectedCategory,
      setPreviousSelectedCategory,
      recipe.type,
      searchResults,
      selectedCategory,
      setSearchResults,
      setSelectedCategory,
    ],
  );

  return (
    <div className="recipe-header">
      {/* imagem da receita (mobile) */}
      <img
        alt={ recipe.name }
        className="recipe-photo mobile"
        data-testid="recipe-photo"
        src={ recipe.image }
      />

      {/* nome da receita */}
      <div className="recipe-name">

        <h1 data-testid="recipe-title">
          { recipe.name }
        </h1>

        {/* imagem da receita (desktop) */}
        <img
          alt={ recipe.name }
          className="recipe-photo desktop"
          data-testid="recipe-photo"
          src={ recipe.image }
        />

        {/* categoria da receita */}
        <p data-testid="recipe-category">
          { isDrink ? recipe.alcoholicOrNot : recipe.category }
        </p>
      </div>

      {/* botões de compartilhar e favoritar receita */}
      <div className="top-buttons">
        <button
          onClick={ handleClickGoBack }
          type="button"
        >
          <BiChevronLeft size={ 26 } />
        </button>
        {/* botão compartilhar receita - handleclick */}
        {/* {copyMessage && <p>Link copied!</p>} */}
        <button
          type="button"
          onClick={ handleClickShare }
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
