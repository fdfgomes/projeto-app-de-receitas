import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../context/Context';
import RecipeCard from './RecipeCards';

export default function SearchResults() {
  const { searchResults } = useContext(Context);

  const { pathname } = useLocation();

  const isDrink = pathname === '/drinks';

  return (
    <div className="search-results">
      <h1>
        Results for
        <em>
          { !isDrink && searchResults.meals.term }
          { isDrink && searchResults.drinks.term }
        </em>
      </h1>
      <RecipeCard
        data={ isDrink ? searchResults.drinks.data : searchResults.meals.data }
        recipe={ isDrink ? 'Drinks' : 'Meals' }
      />
    </div>
  );
}
