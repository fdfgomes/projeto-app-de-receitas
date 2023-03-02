import propTypes from 'prop-types';
import { useMemo } from 'react';
import Context from './Context';

function ContextProvider({ children }) {
  // const values = {
  //   test: '',
  // };

  // useMemo = Serve para não renderizar novamente os valores quando houver alguma alteração
  // nesse componente. Só renderiza na inicialização / Ou quando algum elemento que estiver
  // no array de dependencias atualizar.
  const values = useMemo(() => ({
    test: '',
    test2: '',
  }), []);

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
