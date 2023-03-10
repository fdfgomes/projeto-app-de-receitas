import { fetchInProgressRecipes } from './api';

export async function fetchMealsApi() {
  try {
    const data = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .catch((error) => console.log(error));
    return data.meals;
  } catch (err) {
    // console.error(err);
  }
}

export async function fetchDrinksApi() {
  try {
    const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .catch((error) => console.log(error));
    return data.drinks;
  } catch (err) {
    // console.error(err);
  }
}

// função para verificar se a receita esta na lista de receitas em progresso
export const recipeIsInProgress = (recipeId) => {
  // recuperar receitas em progresso salvas no localStorage
  const inProgressRecipes = fetchInProgressRecipes();
  // pegar os ids das receitas em progresso
  const inProgressMeals = Object.keys(inProgressRecipes.meals);
  const inProgressDrinks = Object.keys(inProgressRecipes.drinks);
  // criar array com todas as receitas em progresso
  const inProgressRecipesIds = [
    ...inProgressMeals,
    ...inProgressDrinks,
  ];
  // verificar se a receita recebida como parâmetro da função está na lista de receitas em progresso do localStorage
  const currentRecipe = !!inProgressRecipesIds
    .find((inProgressRecipeId) => (inProgressRecipeId === recipeId));
  return currentRecipe;
};

// função para verificar se a receita esta na lista de receitas em progresso
// e criar propriedade done que indica se o ingrediente já foi marcado como concluído ou não
const fullfillIngredientsDoneProperty = (recipeId, recipeIngredients) => {
  // verificar se a receita esta na lista de receitas em progresso do localStorage
  // se estiver, retornar os estados dos ingredientes (propriedade done) do localStorage
  if (recipeIsInProgress(recipeId)) {
    // recuperar receitas em progresso salvas no localStorage
    const inProgressRecipes = fetchInProgressRecipes();
    // pegar os ids das receitas de bebida em progresso
    const inProgressDrinks = Object.keys(inProgressRecipes.drinks);
    // verificar se é uma receita de bebida
    const isDrinkRecipe = !!inProgressDrinks.find((id) => id === recipeId);
    // retornar os estados dos ingredientes (propriedade done) do localStorage
    return inProgressRecipes[isDrinkRecipe ? 'drinks' : 'meals'][recipeId];
  }
  // se não estiver, definir todos os estados dos ingredientes (propriedade done) como false
  return recipeIngredients.map((ingredient) => ({
    ...ingredient,
    done: false,
  }));
};

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
    recipe.ingredients = fullfillIngredientsDoneProperty(
      recipeId,
      recipeIngredients,
    );
    // propriedade inProgress que indica se a receita já está em progresso ou não
    recipe.inProgress = recipeIsInProgress(recipeId);
    // extrair apenas o id do vídeo no youtube
    const videoId = recipe.strYoutube?.split('https://www.youtube.com/watch?v=')[1];
    recipe.strYoutube = videoId;
    // retornar receita
    return recipe;
  } catch (err) {
    console.error(err);
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
  } catch (error) {
    console.error(error);
  }
};

export async function fetchMealsCategories() {
  try {
    const data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.meals;
  } catch (err) {
    // console.error(err);
  }
}

export async function fetchDrinksCategories() {
  try {
    const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.drinks;
  } catch (err) {
    // console.error(err);
  }
}
