import React, { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../context/Context';
import RecipeCards from './RecipeCards';

export default function SearchResults() {
  const { searchResults } = useContext(Context);

  const { pathname } = useLocation();

  const isDrink = useMemo(() => pathname === '/drinks', [pathname]);

  return (
    <div className="search-results">
      <h1 className="title primary">
        Results for
        <em>
          { !isDrink && searchResults.meals.term }
          { isDrink && searchResults.drinks.term }
        </em>
      </h1>
      <RecipeCards
        data={ isDrink ? searchResults.drinks.data : searchResults.meals.data }
        recipe={ isDrink ? 'Drinks' : 'Meals' }
      />
    </div>
  );
}
