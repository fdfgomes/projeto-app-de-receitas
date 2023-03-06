import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../../context/Context';
import Card from './Card';

const SEARCH_RESULTS_LIMIT = 12;

export default function SearchResults() {
  const { searchResults } = useContext(Context);

  const { pathname } = useLocation();

  return (
    <div className="search-results">
      <h1>
        Results for
        <em>
          { pathname === '/meals' && searchResults.meals.term }
          { pathname === '/drinks' && searchResults.drinks.term }
        </em>
      </h1>
      <div className="wrapper">
        { pathname === '/meals'
          && searchResults.meals.data.map((result, index) => index < SEARCH_RESULTS_LIMIT
            && (
              <Card
                data={ result }
                index={ index }
                key={ result.idMeal }
                type="meal"
              />
            ))}
        { pathname === '/drinks'
          && searchResults.drinks.data.map((result, index) => index < SEARCH_RESULTS_LIMIT
            && (
              <Card
                data={ result }
                index={ index }
                key={ result.idDrink }
                type="drink"
              />
            ))}
      </div>
    </div>
  );
}
