import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchResults from '../components/SearchResults';
import Context from '../context/Context';
import RecipeCards from '../components/RecipeCards';
import Loading from '../components/Loading';
import '../styles/SearchResults.css';
import '../styles/Recipe.css';

import {
  fetchDrinksApi,
  fetchDrinksCategories,
  fetchMealsApi,
  fetchMealsCategories,
} from '../services';

export default function Recipes() {
  const { pathname } = useLocation();

  const isDrink = useMemo(() => pathname.includes('/drinks'), [pathname]);

  const {
    searchResults: {
      meals: {
        data: mealsSearchResults,
      },
      drinks: {
        data: drinksSearchResults,
      },
    },
  } = useContext(Context);

  const [title, setTitle] = useState('');
  const [data, setData] = useState('');
  const [recipe, setRecipe] = useState('');
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiData = async (type) => {
    const recipesLimit = 12;
    const categoryLimit = 5;

    if (type === 'Meals') {
      setIsLoading(true);

      const meals = await fetchMealsApi() ?? [];
      const mealsCategory = await fetchMealsCategories() ?? [];
      const mealsResult = meals.slice(0, recipesLimit);// Define apenas as 12 primeiras receitas
      const mealsCategoryResult = mealsCategory.slice(0, categoryLimit);// Define 5 categorias para ser renderizadas na tela

      setData(mealsResult);
      setCategory(mealsCategoryResult);
      setRecipe('Meals');
      setIsLoading(false);// Necessário para não chamar o componente enquanto o estado não tiver com as receitas
    } else if (type === 'Drinks') {
      setIsLoading(true);

      const drinks = await fetchDrinksApi() ?? [];
      const drinksCategory = await fetchDrinksCategories() ?? [];

      const drinksResult = drinks.slice(0, recipesLimit);
      const drinksCategoryResult = drinksCategory.slice(0, categoryLimit);

      setCategory(drinksCategoryResult);
      setData(drinksResult);
      setRecipe('Drinks');
      setIsLoading(false);
    } else {
      console.log('Parametro não definido.');
    }
  };

  useEffect(() => {
    switch (pathname) {
    case '/meals':
      setTitle('Meals');
      fetchApiData('Meals');
      break;
    case '/drinks':
      setTitle('Drinks');
      fetchApiData('Drinks');
      break;
    default:
      setTitle('');
    }
  }, [pathname]);

  return (
    <>
      <Header title={ title } />
      <main className="recipes">
        { isLoading && <Loading /> }
        {/* resultados da pesquisa */}
        { pathname === '/meals' && mealsSearchResults.length > 0 && <SearchResults /> }
        { pathname === '/drinks' && drinksSearchResults.length > 0 && <SearchResults /> }
        {
          // renderizar apenas se o usuário estiver na rota /meals ou /drinks
          // e não tiver feito nenhuma pesquisa
          ['/meals', '/drinks'].includes(pathname)
          && mealsSearchResults.length === 0
          && drinksSearchResults.length === 0
          && (
            <>
              {/* botões com as categorias disponíveis */}
              <div className="available-categories">
                <h1 className="title">
                  Categories
                </h1>
                <div className="category-group">
                  <button
                    type="button"
                    className="btn-category"
                    data-testid="All-category-filter"
                    key={ -0 }
                  >
                    All
                  </button>
                  { category.map((item, index) => (
                    <button
                      type="button"
                      className="btn-category"
                      data-testid={ `${item.strCategory}-category-filter` }
                      key={ index }
                    >
                      {item.strCategory}
                    </button>
                  ))}
                </div>
              </div>
              {/* cards exibidos nas rotas /drinks e /meals */}
              <div className="search-results">
                { !isLoading && (
                  <div className="results-wrapper">
                    <h1 className="title">
                      Popular
                      {' '}
                      { isDrink ? 'drinks' : 'meals' }
                    </h1>
                    <RecipeCards data={ data } type={ recipe } />
                  </div>
                ) }
              </div>
            </>
          )
        }
      </main>
      <Footer />
    </>
  );
}
