import React from 'react';
import Header from '../components/Header';
import FilterBtns from '../components/FilterBtns';
import HorizontalCard from '../components/HorizontalCard';

function FavoriteRecipes() {
  return (
    <>
      <Header title="Favorite Recipes" />
      <main>
        <FilterBtns />
        <HorizontalCard />
      </main>
    </>
  );
}

export default FavoriteRecipes;
