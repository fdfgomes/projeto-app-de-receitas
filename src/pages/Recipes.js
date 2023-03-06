import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchResults from '../components/SearchResults';
import Context from '../context/Context';
import RecipeCard from '../components/RecipeCards';
import Loading from '../components/Loading';
import { fetchDrinksApi, fetchMealsApi } from '../services';

function Recipes() {
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiData = async (type) => {
    const recipesLimit = 12;
    if (type === 'Meals') {
      const meals = await fetchMealsApi() ?? [];
      const mealsResult = meals.slice(0, recipesLimit);// Define apenas as 12 primeiras receitas
      setData(mealsResult);
      setRecipe('Meals');
      setIsLoading(false); // Necessário para não chamar o componente enquanto o estado não tiver com as receitas
    } else if (type === 'Drinks') {
      const drinks = await fetchDrinksApi() ?? [];
      const drinksResult = drinks.slice(0, recipesLimit);

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
              <h1>Recipes</h1>
              { isLoading ? <Loading /> : <RecipeCard data={ data } recipe={ recipe } /> }
            </div>
          )
        }
      </main>
      <Footer />
    </>
  );
}

export default Recipes;
