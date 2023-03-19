import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import '../styles/SearchResults.css';
import '../styles/Recipes.css';

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
  const [category, setAvailableCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPopularRecipes = useCallback(async () => {
    setIsLoading(true);

    await setAvailableCategories([]);
    const availableCategories = await fetchAvailableCategories(pathname);
    setAvailableCategories(availableCategories);

    const popularRecipes = await fetchSearchResults(
      '',
      SEARCH_TYPES.NAME,
      pathname,
    ) ?? [];
    setRecipes(popularRecipes);

    setIsLoading(false); // Necessário para não chamar o componente enquanto o estado não tiver com as receitas
  }, [pathname]);

  const filterRecipesByCategory = useCallback(async (clickedCategory) => {
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
      filteredRecipes = await fetchSearchResults('', SEARCH_TYPES.NAME, pathname);
    } else {
      setSelectedCategory(clickedCategory);
      filteredRecipes = await fetchRecipesByCategory(clickedCategory, pathname);
    }
    setRecipes(filteredRecipes);
    setIsLoading(false);
  }, [isDrinksPage, pathname, selectedCategory, setSearchResults, setSelectedCategory]);

  useEffect(() => {
    fetchPopularRecipes();
  }, [fetchPopularRecipes, pathname]);

  const showLoadingAnimation = useMemo(() => !!(
    isLoading
    || searchResults.drinks.isLoading
    || searchResults.meals.isLoading
  ), [isLoading, searchResults]);

  return (
    <>
      <Header title={ isDrinksPage ? 'Drinks' : 'Meals' } />
      <main className="recipes">
        { showLoadingAnimation && <Loading /> }
        {/* botões com as categorias disponíveis */}
        <div className="available-categories">
          <h1 className="title">
            Categories
          </h1>
          <div className="category-group">
            { category.map((item, index) => (
              <button
                type="button"
                className={ `
                        btn-category
                        ${selectedCategory === item.strCategory ? 'selected' : ''}
                      `.trim() }
                data-testid={ `${item.strCategory}-category-filter` }
                key={ index }
                onClick={ () => filterRecipesByCategory(item.strCategory) }
              >
                {item.strCategory}
              </button>
            ))}
          </div>
        </div>

        {/* cards exibidos nas rotas /drinks e /meals */}
        <div className="search-results">
          { !showLoadingAnimation && (
            <div className="results-wrapper">

              {/* /meals */}
              { !isDrinksPage && (
                <>
                  {/* popular meals */}
                  { searchResults.meals.data.length === 0 && (
                    <>
                      <h1 className="title">
                        { selectedCategory === 'All' && 'Popular meals' }
                        { selectedCategory !== 'All' && `${selectedCategory}s` }
                      </h1>
                      <RecipeCards
                        data={ recipes }
                        type="Meals"
                      />
                    </>
                  ) }
                  {/* resultados da pesquisa */}
                  { searchResults.meals.data.length > 0 && (
                    <>
                      <h1 className="title primary">
                        Results for
                        <em>
                          { searchResults.meals.term }
                        </em>
                      </h1>
                      <RecipeCards
                        data={ searchResults.meals.data }
                        type="Meals"
                      />
                    </>
                  ) }

                </>
              ) }

              {/* drinks */}
              { isDrinksPage && (
                <>
                  {/* popular drinks */}
                  { searchResults.drinks.data.length === 0 && (
                    <>
                      <h1 className="title">
                        { selectedCategory === 'All' && 'Popular drinks' }
                        { selectedCategory !== 'All' && `${selectedCategory}s` }
                      </h1>
                      <RecipeCards
                        data={ recipes }
                        type="Drinks"
                      />
                    </>
                  ) }
                  {/* resultados da pesquisa */}
                  { searchResults.drinks.data.length > 0 && (
                    <>
                      <h1 className="title primary">
                        Results for
                        <em>
                          { searchResults.drinks.term }
                        </em>
                      </h1>
                      <RecipeCards
                        data={ searchResults.drinks.data }
                        type="Drinks"
                      />
                    </>
                  ) }

                </>
              ) }
            </div>
          ) }
        </div>
      </main>
      <Footer />
    </>
  );
}
