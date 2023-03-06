import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { fetchDrinksApi, fetchMealsApi } from '../services';
import RecipeCard from '../components/RecipeCards';

function Recipes() {
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [data, setData] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiData = async (type) => {
    const recipesLimit = 12;
    if (type === 'Meals') {
      const meals = await fetchMealsApi();
      const mealsResult = meals.slice(0, recipesLimit);// Define apenas as 12 primeiras receitas
      setData(mealsResult);
      setRecipe('Meals');
      setIsLoading(false); // Necessário para não chamar o componente enquanto o estado não tiver com as receitas
    } else if (type === 'Drinks') {
      const drinks = await fetchDrinksApi();
      const drinksResult = drinks.slice(0, recipesLimit);

      setData(drinksResult);
      setRecipe('Drinks');
      setIsLoading(false);
    } else {
      console.log('Parametro não definido.');
    }
  };

  useEffect(() => {
    switch (location.pathname) {
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
  }, [location.pathname]);

  return (
    <>
      <Header title={ title } />
      <main>
        {isLoading ? <Loading />
          : <RecipeCard data={ data } recipe={ recipe } />}
      </main>
      <Footer />
    </>
  );
}

export default Recipes;
