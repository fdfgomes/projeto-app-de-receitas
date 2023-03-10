import { fetchInProgressRecipes } from '../services/api';

// função que retorna se a receita está na lista de receitas concluídas ou não
export const recipeIsDone = (recipeId) => {
  // recuperar receitas consluídas salvas no localStorage
  const doneRecipes = fetchDoneRecipes();
  // retornar se a receita recebida como parâmetro da função está na lista de receitas concluídas do localStorage
  return !!doneRecipes.find(({ id: doneRecipeId }) => (doneRecipeId === recipeId));
};

// função que retorna se a receita está na lista de receitas em progresso ou não
export const recipeIsInProgress = (recipeId) => {
  // recuperar receitas em progresso salvas no localStorage
  const inProgressRecipes = fetchInProgressRecipes();
  // array com os ids de todas as receitas em progresso
  let inProgressRecipesIds = [];
  // pegar os ids das receitas em progresso
  // drinks
  if (inProgressRecipes.drinks) {
    const inProgressDrinks = Object.keys(inProgressRecipes.drinks);
    inProgressRecipesIds = [
      ...inProgressRecipesIds,
      ...inProgressDrinks,
    ];
  }
  // meals
  if (inProgressRecipes.meals) {
    const inProgressMeals = Object.keys(inProgressRecipes.meals);
    inProgressRecipesIds = [
      ...inProgressRecipesIds,
      ...inProgressMeals,
    ];
  }
  // retornar se a receita recebida como parâmetro da função está na lista de receitas em progresso do localStorage
  return !!inProgressRecipesIds
    .find((inProgressRecipeId) => (inProgressRecipeId === recipeId));
};

// função para verificar se a receita esta na lista de receitas em progresso
// e criar propriedade done que indica se o ingrediente já foi marcado como concluído ou não
export const fullfillRecipesIngredientsDoneProperty = (recipeId, recipeIngredients) => {
  // verificar se a receita esta na lista de receitas em progresso do localStorage
  // se estiver, retornar os estados dos ingredientes (propriedade done) do localStorage
  if (recipeIsInProgress(recipeId)) {
    // recuperar receitas em progresso salvas no localStorage
    const inProgressRecipes = fetchInProgressRecipes();
    // pegar os ids das receitas de bebida em progresso
    const inProgressDrinks = inProgressRecipes.drinks
      ? Object.keys(inProgressRecipes.drinks)
      : [];
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
