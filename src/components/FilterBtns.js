import React from 'react';

function FilterBtns() {
  return (
    <div className="categories">
      <button
        className="category-button"
        data-testid="filter-by-all-btn"
      >
        All
      </button>
      <button
        className="category-button"
        data-testid="filter-by-meal-btn"
      >
        Meals
      </button>
      <button
        className="category-button"
        data-testid="filter-by-drink-btn"
      >
        Drinks
      </button>
    </div>
  );
}

export default FilterBtns;
