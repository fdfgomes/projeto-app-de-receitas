import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import '../../styles/RecipeCards.css';
import RecipeCard from './RecipeCard';

export default function RecipeCards({ data, horizontal, type }) {
  const isDrink = useMemo(() => type === 'Drinks', [type]);

  return (
    <main>
      <div className={ `recipe-cards ${horizontal ? 'horizontal' : ''}` }>
        { data?.map((item, index) => (
          <RecipeCard
            index={ index }
            isDrink={ isDrink }
            item={ item }
            key={ isDrink ? `${index}-${item.idDrink}` : `${index}-${item.idMeal}` }
          />
        )) }
      </div>
    </main>
  );
}

RecipeCards.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    strDrink: PropTypes.string,
    strDrinkThumb: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  })),
  horizontal: PropTypes.bool,
  type: PropTypes.string,
}.isRequired;
