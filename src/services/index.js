export async function fetchMealsApi() {
  try {
    const data = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .catch((error) => console.log(error));
    return data.meals;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchDrinksApi() {
  try {
    const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .catch((error) => console.log(error));
    return data.drinks;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchMealsCategories() {
  try {
    const data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.meals;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchDrinksCategories() {
  try {
    const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.drinks;
  } catch (err) {
    console.error(err);
  }
}
export async function fetchMealsByCategory(category) {
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.meals;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchDrinksByCategory(category) {
  try {
    const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.drinks;
  } catch (err) {
    console.error(err);
  }
}
