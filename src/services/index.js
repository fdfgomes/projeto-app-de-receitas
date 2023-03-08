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

export const fetchRecipeDetails = async (recipeId, route) => {
  // recipeId --> id da receita
  // route --> de qual página a chamada à função foi feita (página /meals ou /drinks)
  let endpoint = '';
  if (route.includes('/meals')) {
    endpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;
  } else {
    endpoint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipeId}`;
  }
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    // quando nenhum item é encontrado na busca a api retorna null
    // a lógica abaixo é para, ao invés de retornar null, retornar um array vazio
    const dataKeys = Object.keys(data);
    if (data[dataKeys[0]] === null) {
      data[dataKeys[0]] = [];
    }
    // criar propriedade ingredients
    // array com os ingredientes da receita
    const recipe = data[dataKeys[0]][0];
    const recipeKeys = Object.keys(recipe);
    const recipeIngredients = [];
    recipeKeys.forEach((key) => {
      if (key.includes('strIngredient')) {
        const ingredientIndex = key.split('strIngredient')[1];
        const ingredientMeasureKey = `strMeasure${ingredientIndex}`;
        if (recipe[key]) {
          recipeIngredients.push({
            name: recipe[key],
            measure: recipe[ingredientMeasureKey],
          });
        }
      }
    });
    recipe.ingredients = recipeIngredients;
    const videoId = recipe.strYoutube?.split('https://www.youtube.com/watch?v=')[1];
    recipe.strYoutube = videoId;
    return recipe;
  } catch (err) {
    console.error(err);
  }
};
