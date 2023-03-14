import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Context from '../context/Context';
import { fetchSearchResults, SEARCH_TYPES } from '../services/api';
import '../styles/SearchBar.css';

export default function SearchBar() {
  const { searchResults, setSearchResults } = useContext(Context);

  const { pathname } = useLocation();

  const history = useHistory();

  // nome da rota atual sem a / (exemplo: rota /meals retorna apenas meals)
  const currentRoute = useMemo(() => pathname.split('/')[1], [pathname]);

  // duas chaves: drinks e meals
  // uma para cada página da aplicação
  const [searchTerm, setSearchTerm] = useState({
    drinks: '',
    meals: '',
  });

  // duas chaves: drinks e meals
  // uma para cada página da aplicação
  const [searchType, setSearchType] = useState({
    drinks: SEARCH_TYPES.NAME,
    meals: SEARCH_TYPES.NAME,
  });

  const handleChange = useCallback(({ target }) => {
    const { type, value } = target;
    // input de texto
    if (type === 'text') {
      setSearchTerm((currentState) => ({
        ...currentState,
        [currentRoute]: value,
      }));
    }
    // radio buttons
    if (type === 'radio') {
      setSearchType((currentState) => ({
        ...currentState,
        [currentRoute]: value,
      }));
    }
  }, [currentRoute, setSearchTerm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    // se o usuário tiver escolhido filtrar pela primeira letra
    // e digitar mais de 1 caractere exibir mensagem de alerta
    if (
      searchType[currentRoute] === SEARCH_TYPES.FIRST_LETTER
      && searchTerm[currentRoute].length > 1
    ) {
      return toast.error('Your search must have only 1 (one) character');
    }
    // mudar estado para loading
    setSearchResults((currentState) => ({
      ...currentState,
      [currentRoute]: {
        ...currentState[currentRoute],
        isLoading: true,
      },
    }));
    // requisição à api
    const data = await fetchSearchResults(
      searchTerm[currentRoute],
      searchType[currentRoute],
      pathname,
    );
    // atualizar estado no ContextProvider com o retorno da api
    setSearchResults((currentState) => ({
      ...currentState,
      [currentRoute]: {
        data,
        isLoading: false,
        term: searchTerm[currentRoute],
      },
    }));
  }, [currentRoute, pathname, searchTerm, searchType, setSearchResults]);

  // lógica executada sempre que uma nova busca é feita
  useEffect(() => {
    const NO_RESULTS_FOUND = 'Sorry, we haven\'t found any recipes for these filters.';

    const SEARCH_RESULTS_LENGTH = searchResults[currentRoute]?.data?.length ?? 0;
    const SEARCH_TERM = searchResults[currentRoute]?.term;

    const SEARCH_IS_LOADING = searchResults[currentRoute]?.isLoading;

    // exibir mensagem ao usuário caso a pesquisa não retorne resultados
    if (SEARCH_RESULTS_LENGTH === 0 && SEARCH_TERM !== '' && !SEARCH_IS_LOADING) {
      toast.error(NO_RESULTS_FOUND);
    }

    // direcionar o usuário à página com os detalhes da receita
    // caso a pesquisa retorne apenas 1 resultado
    if (SEARCH_RESULTS_LENGTH === 1 && !SEARCH_IS_LOADING) {
      const id = currentRoute === 'meals'
        ? searchResults[currentRoute].data[0].idMeal
        : searchResults[currentRoute].data[0].idDrink;
      history.push(`/${currentRoute}/${id}`);
    }
  }, [history, currentRoute, searchResults]);

  const isDrink = pathname.includes('/drinks');

  return (
    <form className="search-bar" onSubmit={ handleSubmit }>
      <label className="search-input-wrapper">
        <FiSearch className="search-icon" color="#b7a761" size={ 24 } />
        <input
          className="search-input"
          data-testid="search-input"
          onChange={ handleChange }
          placeholder={ `Search ${isDrink ? 'drinks' : 'meals'}...` }
          required
          type="text"
          value={ pathname === '/meals' ? searchTerm.meals : searchTerm.drinks }
        />
      </label>
      <div className="radio-buttons">
        <label>
          <input
            checked={ searchType[currentRoute] === SEARCH_TYPES.NAME }
            data-testid={ SEARCH_TYPES.NAME }
            name="search-type"
            onChange={ handleChange }
            type="radio"
            value={ SEARCH_TYPES.NAME }
          />
          Name
        </label>
        <label>
          <input
            checked={ searchType[currentRoute] === SEARCH_TYPES.INGREDIENT }
            data-testid={ SEARCH_TYPES.INGREDIENT }
            name="search-type"
            onChange={ handleChange }
            type="radio"
            value={ SEARCH_TYPES.INGREDIENT }
          />
          Ingredient
        </label>
        <label>
          <input
            checked={ searchType[currentRoute] === SEARCH_TYPES.FIRST_LETTER }
            data-testid={ SEARCH_TYPES.FIRST_LETTER }
            name="search-type"
            onChange={ handleChange }
            type="radio"
            value={ SEARCH_TYPES.FIRST_LETTER }
          />
          Letter
        </label>
      </div>
      <button
        data-testid="exec-search-btn"
        disabled={ searchResults[currentRoute]?.isLoading }
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
