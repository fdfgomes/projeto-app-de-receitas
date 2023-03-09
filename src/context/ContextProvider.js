import propTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchInProgressRecipes } from '../services/api';
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

  const [inProgressRecipes, setInProgressRecipes] = useState(fetchInProgressRecipes());

  // adicionar nova receita à lista de receitas em progresso
  const addInProgressRecipe = useCallback(async (newRecipe) => {
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

  // atualizar o localStorage sempre que houver alteração nas receitas em progresso
  useEffect(() => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
  }, [inProgressRecipes]);

  // useMemo = Serve para não renderizar novamente os valores quando houver alguma alteração
  // nesse componente. Só renderiza na inicialização / Ou quando algum elemento que estiver
  // no array de dependencias atualizar.
  const values = useMemo(
    () => ({
      inProgressRecipes,
      setInProgressRecipes,
      addInProgressRecipe,
      searchResults,
      setSearchResults,
    }),
    [
      inProgressRecipes,
      setInProgressRecipes,
      addInProgressRecipe,
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
