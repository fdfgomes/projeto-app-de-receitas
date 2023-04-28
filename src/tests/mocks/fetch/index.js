const mealCategories = require('./mealCategories');
const meals = require('./meals');
const goatMeals = require('./goatMeals');
const drinkCategories = require('./drinkCategories');
const drinks = require('./drinks');
const milkDrinks = require('./milkDrinks');
const singleMeal = require('./singleMeal');
const singleDrink = require('./singleDrink');

const fetch = (url) => Promise.resolve({
  status: 200,
  ok: true,
  json: () => {
    if (url === 'https://www.themealdb.com/api/json/v1/1/list.php?c=list') return Promise.resolve(mealCategories);
    if (url === 'https://www.themealdb.com/api/json/v1/1/search.php?s=') return Promise.resolve(meals);
    if (url === 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Goat') return Promise.resolve(goatMeals);
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list') return Promise.resolve(drinkCategories);
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=') return Promise.resolve(drinks);
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Shake') return Promise.resolve(milkDrinks);
    if (url === 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52977') return Promise.resolve(singleMeal);
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997') return Promise.resolve(singleDrink);
  },
});

module.exports = fetch;
