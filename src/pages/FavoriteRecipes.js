import React from 'react';
import Header from '../components/Header';
import FilterBtns from '../components/FilterBtns';
import HorizontalCard from '../components/HorizontalCard';
import '../styles/FavoriteRecipes.css';
import Footer from '../components/Footer';

function FavoriteRecipes() {
  return (
    <>
      <Header title="Favorite Recipes" />
      <main className="favorite-recipes">
        <FilterBtns />
        <HorizontalCard />
      </main>
      <Footer />
    </>
  );
}

export default FavoriteRecipes;
