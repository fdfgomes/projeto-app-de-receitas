import React from 'react';
import PropTypes from 'prop-types';

function FilterBtns({
  handleClickFilter,
  selectedCategory,
}) {
  return (
    <div className="categories">
      <button
        className={ `
          btn-category ${selectedCategory === 'all' ? 'selected' : ''}
        `.trim() }
        data-testid="filter-by-all-btn"
        onClick={ () => handleClickFilter('all') }
      >
        All
      </button>
      <button
        className={ `
          btn-category ${selectedCategory === 'meal' ? 'selected' : ''}
        `.trim() }
        data-testid="filter-by-meal-btn"
        onClick={ () => handleClickFilter('meal') }
      >
        Meals
      </button>
      <button
        className={ `
          btn-category ${selectedCategory === 'drink' ? 'selected' : ''}
        `.trim() }
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
