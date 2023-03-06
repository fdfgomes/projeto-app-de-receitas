export async function fetchMealsApi() {
  const data = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then((response) => response.json())
    .catch((error) => console.log(error));

  return data.meals;
}

export async function fetchDrinksApi() {
  const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return data.drinks;
}

export async function fetchMealsCategories() {
  const data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
    .then((response) => response.json())
    .catch((error) => console.log(error));

  return data.meals;
}

export async function fetchDrinksCategories() {
  const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
    .then((response) => response.json())
    .catch((error) => console.log(error));

  return data.drinks;
}
