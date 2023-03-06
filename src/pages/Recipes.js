import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import RecipeCard from '../components/RecipeCards';
import {
  fetchDrinksApi,
  fetchDrinksCategories,
  fetchMealsApi,
  fetchMealsCategories,
} from '../services';

function Recipes() {
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [data, setData] = useState('');
  const [recipe, setRecipe] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiData = async (type) => {
    const recipesLimit = 12;
    const categoryLimit = 5;

    if (type === 'Meals') {
      const meals = await fetchMealsApi();
      const mealsCategory = await fetchMealsCategories();

      const mealsResult = meals.slice(0, recipesLimit);// Define apenas as 12 primeiras receitas
      const mealsCategoryResult = mealsCategory.slice(0, categoryLimit);// Define 5 categorias para ser renderizadas na tela

      setData(mealsResult);
      setCategory(mealsCategoryResult);
      setRecipe('Meals');
      setIsLoading(false);// Necessário para não chamar o componente enquanto o estado não tiver com as receitas
    } else if (type === 'Drinks') {
      const drinks = await fetchDrinksApi();
      const drinksCategory = await fetchDrinksCategories();

      const drinksCategoryResult = drinksCategory.slice(0, categoryLimit);
      const drinksResult = drinks.slice(0, recipesLimit);

      setCategory(drinksCategoryResult);
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
          : <RecipeCard data={ data } recipe={ recipe } category={ category } />}
      </main>
      <Footer />
    </>
  );
}

export default Recipes;
