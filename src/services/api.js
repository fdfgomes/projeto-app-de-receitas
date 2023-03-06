export const SEARCH_TYPES = {
  FIRST_LETTER: 'first-letter-search-radio',
  INGREDIENT: 'ingredient-search-radio',
  NAME: 'name-search-radio',
};

export const fetchSearchResults = async (searchTerm, searchType, route) => {
  // searchTerm --> termo de pesquisa digitado pelo usuário
  // searchType --> tipo de pesquisa selecionado pelo usuário (nome, ingrediente ou primeira letra)
  // route --> de qual página a chamada à função foi feita (página /meals ou /drinks)

  let endpoint = '';

  switch (searchType) {
  case SEARCH_TYPES.NAME:
    if (route === '/meals') {
      endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    } else {
      endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    }
    break;
  case SEARCH_TYPES.INGREDIENT:
    if (route === '/meals') {
      endpoint = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
    } else {
      endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
    }
    break;
  case SEARCH_TYPES.FIRST_LETTER:
    if (route === '/meals') {
      endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';
    } else {
      endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';
    }
    break;
  default:
    break;
  }

  endpoint += searchTerm;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    // quando nenhum item é encontrado na busca a api returna null
    // a lógica abaixo é para, ao invés de retornar null, retornar um array vazio
    const dataKeys = Object.keys(data);
    if (data[dataKeys[0]] === null) {
      data[dataKeys[0]] = [];
    }
    return data[dataKeys[0]];
  } catch (err) {
    console.error(err);
  }
};
