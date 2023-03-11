import React from 'react';

function FilterBtns() {
  return (
    <div>
      <button data-testid="filter-by-all-btn">All</button>
      <button data-testid="filter-by-meal-btn">Meals</button>
      <button data-testid="filter-by-drink-btn">Drinks</button>
    </div>
  );
}

export default FilterBtns;
