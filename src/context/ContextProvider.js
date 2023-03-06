import propTypes from 'prop-types';
import { useMemo, useState } from 'react';
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

  // useMemo = Serve para não renderizar novamente os valores quando houver alguma alteração
  // nesse componente. Só renderiza na inicialização / Ou quando algum elemento que estiver
  // no array de dependencias atualizar.
  const values = useMemo(() => ({
    searchResults,
    setSearchResults,
  }), [searchResults, setSearchResults]);

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
