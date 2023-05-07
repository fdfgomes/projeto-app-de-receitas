import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Context from '../context/Context';
import RecipeCards from '../components/RecipeCards';
import Loading from '../components/Loading';
import {
  fetchAvailableCategories,
  fetchRecipesByCategory,
  fetchSearchResults,
  SEARCH_TYPES,
} from '../services/api';
import '../styles/pages/Recipes.css';
import { APP_SHORT_NAME, SKELETON_CATEGORIES } from '../constants';
import setPageTitle from '../utils/setPageTitle';

export default function Recipes() {
  const { pathname } = useLocation();

  const isDrinksPage = useMemo(() => pathname.includes('/drinks'), [pathname]);

  const {
    searchResults,
    setSearchResults,
    selectedCategory,
    setSelectedCategory,
  } = useContext(Context);

  const [recipes, setRecipes] = useState([]);
  const [category, setAvailableCategories] = useState(SKELETON_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  const [
    availableCategoriesAreLoading,
    setAvailableCategoriesAreLoading,
  ] = useState(false);

  const fetchPopularRecipes = useCallback(async () => {
    setIsLoading(true);

    setAvailableCategoriesAreLoading(true);
    await setAvailableCategories(SKELETON_CATEGORIES);
    const availableCategories = await fetchAvailableCategories(pathname);
    setAvailableCategories(availableCategories);
    setAvailableCategoriesAreLoading(false);

    const popularRecipes = (
      await fetchSearchResults('', SEARCH_TYPES.NAME, pathname)
    ) ?? [];

    setRecipes(popularRecipes);

    setIsLoading(false); // Necessário para não chamar o componente enquanto o estado não tiver com as receitas
  }, [pathname]);

  const filterRecipesByCategory = useCallback(
    async (clickedCategory) => {
      setIsLoading(true);
      // resetar pesquisa
      await setSearchResults((currentState) => ({
        ...currentState,
        [isDrinksPage ? 'drinks' : 'meals']: {
          data: [],
          term: '',
        },
      }));
      let filteredRecipes = [];
      if (selectedCategory === clickedCategory || clickedCategory === 'All') {
        setSelectedCategory('All');
        filteredRecipes = await fetchSearchResults(
          '',
          SEARCH_TYPES.NAME,
          pathname,
        );
      } else {
        setSelectedCategory(clickedCategory);
        filteredRecipes = await fetchRecipesByCategory(
          clickedCategory,
          pathname,
        );
      }
      setRecipes(filteredRecipes);
      setIsLoading(false);
    },
    [
      isDrinksPage,
      pathname,
      selectedCategory,
      setSearchResults,
      setSelectedCategory,
    ],
  );

  useEffect(() => {
    fetchPopularRecipes();
  }, [fetchPopularRecipes, pathname]);

  const showLoadingAnimation = useMemo(
    () => !!(
      isLoading || searchResults.drinks.isLoading || searchResults.meals.isLoading
    ),
    [isLoading, searchResults],
  );

  const sectionTitle = useMemo(
    () => {
      if (!isDrinksPage) {
        if (searchResults.meals.data.length > 0) {
          return (
            <>
              Results for
              {' '}
              <em>{searchResults.meals.term}</em>
            </>
          );
        }
        if (selectedCategory === 'All') {
          return 'Popular meals';
        }
      }
      if (isDrinksPage) {
        if (selectedCategory === 'All') {
          return 'Popular drinks';
        }
        if (searchResults.drinks.data.length > 0) {
          return (
            <>
              Results for
              {' '}
              <em>{searchResults.drinks.term}</em>
            </>
          );
        }
      }
      return selectedCategory !== 'All' && `${selectedCategory}s`;
    },
    [
      isDrinksPage,
      searchResults.meals.data,
      searchResults.meals.term,
      searchResults.drinks.data,
      searchResults.drinks.term,
      selectedCategory,
    ],
  );

  useEffect(() => {
    setPageTitle(`${isDrinksPage ? 'Drinks' : 'Meals'} - ${APP_SHORT_NAME}`);
  }, [isDrinksPage]);

  return (
    <>
      <Header title={ isDrinksPage ? 'Drinks' : 'Meals' } />
      <main className="recipes">
        {showLoadingAnimation && <Loading />}
        {/* botões com as categorias disponíveis */}
        <div className="available-categories">
          <h1 className="title">Categories</h1>
          <div className="category-group">
            {category.map((item, index) => (
              <button
                className={ `
                  btn-category
                  ${selectedCategory === item.strCategory ? 'selected' : ''}
                  ${availableCategoriesAreLoading ? 'animate-pulse' : ''}
                `.trim() }
                data-testid={ `${item.strCategory}-category-filter` }
                key={ index }
                onClick={ () => filterRecipesByCategory(item.strCategory) }
                style={ {
                  width: availableCategoriesAreLoading ? '60px' : 'fit-content',
                } }
                type="button"
              >
                {item.strCategory}
              </button>
            ))}
          </div>
        </div>

        {/* cards exibidos nas rotas /drinks e /meals */}
        <div className="search-results">
          {!showLoadingAnimation && (
            <div className="results-wrapper">
              {/* título da seção */}
              <h1 className="title">
                {sectionTitle}
              </h1>
              {/* rota /meals */}
              {!isDrinksPage && (
                <>
                  {/* popular meals */}
                  {searchResults.meals.data.length === 0 && (
                    <RecipeCards data={ recipes } type="Meals" />
                  )}
                  {/* resultados da pesquisa */}
                  {searchResults.meals.data.length > 0 && (
                    <RecipeCards
                      data={ searchResults.meals.data }
                      type="Meals"
                    />
                  )}
                </>
              )}
              {/* rota /drinks */}
              {isDrinksPage && (
                <>
                  {/* popular drinks */}
                  {searchResults.drinks.data.length === 0 && (
                    <RecipeCards data={ recipes } type="Drinks" />
                  )}
                  {/* resultados da pesquisa */}
                  {searchResults.drinks.data.length > 0 && (
                    <RecipeCards
                      data={ searchResults.drinks.data }
                      type="Drinks"
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
