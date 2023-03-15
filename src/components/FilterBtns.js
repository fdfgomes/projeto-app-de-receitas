import React from 'react';
import PropTypes from 'prop-types';

function FilterBtns({ handleClickFilter }) {
  return (
    <div className="categories">
      <button
        className="category-button"
        data-testid="filter-by-all-btn"
        onClick={ () => handleClickFilter('all') }
      >
        All
      </button>
      <button
        className="category-button"
        data-testid="filter-by-meal-btn"
        onClick={ () => handleClickFilter('meal') }
      >
        Meals
      </button>
      <button
        className="category-button"
        data-testid="filter-by-drink-btn"
        onClick={ () => handleClickFilter('drink') }
      >
        Drinks
      </button>
    </div>
  );
}

FilterBtns.propTypes = {
  handleClickFilter: PropTypes.func,
}.isRequired;

export default FilterBtns;
