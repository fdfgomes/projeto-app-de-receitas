import { fullfillRecipesIngredientsDoneProperty } from '../helpers/recipeHelpers';

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
    // fazer requisição à api
    const response = await fetch(endpoint);
    const data = await response.json();
    // quando nenhum item é encontrado na busca a api retorna null
    // a lógica abaixo é para, ao invés de retornar null, retornar um array vazio
    const dataKeys = Object.keys(data);
    if (data[dataKeys[0]] === null) {
      data[dataKeys[0]] = [];
    }
    // criar propriedade ingredients
    const recipe = data[dataKeys[0]][0];
    const recipeKeys = Object.keys(recipe);
    // array com os ingredientes da receita
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
    recipe.ingredients = fullfillRecipesIngredientsDoneProperty(
      recipeId,
      recipeIngredients,
    );
    // extrair apenas o id do vídeo no youtube
    const videoId = recipe.strYoutube?.split('https://www.youtube.com/watch?v=')[1];
    recipe.strYoutube = videoId;
    // retornar receita
    return recipe;
  } catch (_err) {
    // console.error(err);
  }
};

export const fetchRecomendations = async (route) => {
  let endpoint = '';
  if (route.includes('/meals')) {
    endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
  } else {
    endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  }
  try {
    const response = await fetch(endpoint);
    const data = response.json();
    // console.log(data.meals);
    return data;
  } catch (_error) {
    // console.error(error);
  }
};
