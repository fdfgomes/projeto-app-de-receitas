import propTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchDoneRecipes, fetchInProgressRecipes } from '../services/api';
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

  const [inProgressRecipes, setInProgressRecipes] = useState(fetchInProgressRecipes());

  // adicionar nova receita à lista de receitas em progresso
  const addInProgressRecipe = useCallback((newRecipe) => {
    setInProgressRecipes((currentState) => {
      // verificar se a receita já consta na lista de receitas em progresso
      let alreadyInInProgressRecipesArray = false;
      if (newRecipe.idMeal) {
        alreadyInInProgressRecipesArray = !!currentState
          .find((recipe) => recipe.idMeal && recipe.idMeal === newRecipe.idMeal);
      }
      if (newRecipe.idDrink) {
        alreadyInInProgressRecipesArray = !!currentState
          .find((recipe) => recipe.idDrink && recipe.idDrink === newRecipe.idDrink);
      }
      // não adicionar a receita caso ela já esteja na lista
      if (alreadyInInProgressRecipesArray) {
        return currentState;
      }
      return [
        ...currentState,
        newRecipe,
      ];
    });
  }, []);

  // adicionar receita à lista de receitas concluídas
  const addDoneRecipe = useCallback((doneRecipe) => {
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
      const alreadyInDoneRecipesArray = !!currentState
        .find((alreadyDoneRecipe) => alreadyDoneRecipe.id === recipe.id);
      // não adicionar a receita caso ela já esteja na lista
      if (alreadyInDoneRecipesArray) {
        return currentState;
      }
      return [
        ...currentState,
        recipe,
      ];
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

  // useMemo = Serve para não renderizar novamente os valores quando houver alguma alteração
  // nesse componente. Só renderiza na inicialização / Ou quando algum elemento que estiver
  // no array de dependencias atualizar.
  const values = useMemo(
    () => ({
      doneRecipes,
      inProgressRecipes,
      setInProgressRecipes,
      addInProgressRecipe,
      addDoneRecipe,
      searchResults,
      setSearchResults,
    }),
    [
      doneRecipes,
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
