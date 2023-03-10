import propTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { recipeIsDone, recipeIsInProgress } from '../helpers/recipeHelpers';
import {
  fetchDoneRecipes,
  fetchFavoriteRecipes,
  fetchInProgressRecipes,
} from '../services/api';
import Context from './Context';

function ContextProvider({ children }) {
  // duas chaves: drinks e meals
  // uma para cada página da aplicação
  const [searchResults, setSearchResults] = useState({
    drinks: {
      data: [],
      isLoading: false,
      term: '',
    },
    meals: {
      data: [],
      isLoading: false,
      term: '',
    },
  });

  const [doneRecipes, setDoneRecipes] = useState(fetchDoneRecipes());

  const [favoriteRecipes, setFavoriteRecipes] = useState(fetchFavoriteRecipes());

  const [inProgressRecipes, setInProgressRecipes] = useState(fetchInProgressRecipes());

  // adicionar nova receita à lista de receitas em progresso
  const addInProgressRecipe = useCallback((newRecipe) => {
    setInProgressRecipes((currentState) => {
      // verificar se a receita a ser adicionado é uma receita de bebida
      const isDrinkRecipe = !!newRecipe.idDrink;
      // id da nova receita a ser adicionada
      const newRecipeId = isDrinkRecipe ? newRecipe.idDrink : newRecipe.idMeal;
      // verificar se a receita já consta na lista de receitas em progresso
      const recipeAlreadyInProgress = recipeIsInProgress(newRecipeId);
      // adicionar receita à lista de receitas em progreso caso ela não esteja na lista
      if (!recipeAlreadyInProgress) {
        const recipeProp = isDrinkRecipe ? 'drinks' : 'meals';
        return {
          ...currentState,
          [recipeProp]: {
            [newRecipeId]: [
              ...newRecipe.ingredients,
            ],
          },
        };
      }
      return currentState;
    });
  }, []);

  // adicionar receita à lista de receitas concluídas
  const addDoneRecipe = useCallback((doneRecipe) => {
    // verificar se a receita a ser adicionado é uma receita de bebida
    const isDrinkRecipe = !!doneRecipe.idDrink;
    // formatar objeto receita antes de adicioná-lo à lista de receitas concluídas
    const recipe = {
      alcoholicOrNot: isDrinkRecipe ? doneRecipe.strAlcoholic : '',
      category: doneRecipe.strCategory,
      doneDate: new Date(),
      id: isDrinkRecipe ? doneRecipe.idDrink : doneRecipe.idMeal,
      image: isDrinkRecipe ? doneRecipe.strDrinkThumb : doneRecipe.strMealThumb,
      name: isDrinkRecipe ? doneRecipe.strDrink : doneRecipe.strMeal,
      nationality: doneRecipe.strArea ?? '',
      tags: doneRecipe.strTags ? doneRecipe.strTags.split(',') : [],
      type: isDrinkRecipe ? 'drink' : 'meal',
    };
    // adicionar objeto receita formatado à lista de receitas concluídas
    setDoneRecipes((currentState) => {
      // verificar se a receita já consta na lista de receitas concluídas
      const alreadyInDoneRecipesArray = recipeIsDone(recipe.id);
      // adicionar a receita caso ela não esteja na lista de receitas concluídas
      if (!alreadyInDoneRecipesArray) {
        return [
          ...currentState,
          recipe,
        ];
      }
      return currentState;
    });
  }, []);

  // atualizar o localStorage sempre que houver alteração nas receitas em progresso
  useEffect(() => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
  }, [inProgressRecipes]);

  // atualizar o localStorage sempre que houver alteração nas receitas concluídas
  useEffect(() => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  }, [doneRecipes]);

  // atualizar o localStorage sempre que houver alteração nas receitas favoritadas
  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  // useMemo = Serve para não renderizar novamente os valores quando houver alguma alteração
  // nesse componente. Só renderiza na inicialização / Ou quando algum elemento que estiver
  // no array de dependencias atualizar.
  const values = useMemo(
    () => ({
      doneRecipes,
      favoriteRecipes,
      setFavoriteRecipes,
      inProgressRecipes,
      setInProgressRecipes,
      addInProgressRecipe,
      addDoneRecipe,
      searchResults,
      setSearchResults,
    }),
    [
      doneRecipes,
      favoriteRecipes,
      setFavoriteRecipes,
      inProgressRecipes,
      setInProgressRecipes,
      addInProgressRecipe,
      addDoneRecipe,
      searchResults,
      setSearchResults],
  );

  return (
    <Context.Provider value={ values }>
      { children }
    </Context.Provider>
  );
}

ContextProvider.propTypes = {
  children: propTypes.element,
}.isRequired;

export default ContextProvider;
