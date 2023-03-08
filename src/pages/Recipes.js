import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchResults from '../components/SearchResults';
import Context from '../context/Context';
import RecipeCard from '../components/RecipeCards';
import Loading from '../components/Loading';

import {
  fetchDrinksApi,
  fetchDrinksCategories,
  fetchMealsApi,
  fetchMealsCategories,
} from '../services';

export default function Recipes() {
  const { pathname } = useLocation();

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
  const [lastCategory, setLastCategory] = useState(undefined);

  const fetchApiData = async (type) => {
    const recipesLimit = 12;
    const categoryLimit = 5;

    if (type === 'Meals') {
      const meals = await fetchMealsApi() ?? [];
      const mealsCategory = await fetchMealsCategories() ?? [];
      const mealsResult = meals.slice(0, recipesLimit);// Define apenas as 12 primeiras receitas
      const mealsCategoryResult = mealsCategory.slice(0, categoryLimit);// Define 5 categorias para ser renderizadas na tela

      setData(mealsResult);
      setCategory(mealsCategoryResult);
      setRecipe('Meals');
      setIsLoading(false);// Necessário para não chamar o componente enquanto o estado não tiver com as receitas
    } else if (type === 'Drinks') {
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

  const recipesByCategory = async (itemCategory) => {
    const recipesLimit = 12;
    if (title === 'Meals') {
      if (lastCategory === itemCategory) {
        setIsLoading(true);
        const meals = await fetchMealsCategories('All') ?? [];
        const mealsResult = meals.slice(0, recipesLimit);// Define apenas as 12 primeiras receitas

        setData(mealsResult);
        setLastCategory('All');
        setIsLoading(false);
      }
      setIsLoading(true);
      const meals = await fetchMealsCategories(itemCategory) ?? [];
      const mealsResult = meals.slice(0, recipesLimit);

      setData(mealsResult);
      setLastCategory(itemCategory);
      setIsLoading(false);
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
      <main>
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
            <div className="search-results">
              <div className="category-group">
                <button
                  type="button"
                  className="btn-category"
                  data-testid="All-category-filter"
                  key={ -0 }
                  onClick={ () => recipesByCategory('All') }
                >
                  All
                </button>
                { category.map((item, index) => (
                  <button
                    type="button"
                    className="btn-category"
                    data-testid={ `${item.strCategory}-category-filter` }
                    key={ index }
                    onClick={ async () => recipesByCategory(item.strCategory) }
                  >
                    {item.strCategory}
                  </button>
                ))}
              </div>
              {
                isLoading ? <Loading />
                  : <RecipeCard data={ data } recipe={ recipe } category={ category } />
              }
            </div>
          )
        }
      </main>
      <Footer />
    </>
  );
}
