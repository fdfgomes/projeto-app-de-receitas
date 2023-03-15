import React, { useCallback, useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import FilterBtns from '../components/FilterBtns';
import HorizontalCard from '../components/HorizontalCard';
import '../styles/FavoriteRecipes.css';
import Footer from '../components/Footer';
import Context from '../context/Context';

function FavoriteRecipes() {
  const { favoriteRecipes } = useContext(Context);

  const [filteredFavoriteRecipes, setFilteredFavoriteRecipes] = useState([]);

  const handleClickFilter = useCallback((category) => {
    let filteredFavorites = favoriteRecipes;
    if (category === 'meal') {
      filteredFavorites = favoriteRecipes
        .filter((favoriteRecipe) => favoriteRecipe.type === 'meal');
    }
    if (category === 'drink') {
      filteredFavorites = favoriteRecipes
        .filter((favoriteRecipe) => favoriteRecipe.type === 'drink');
    }
    setFilteredFavoriteRecipes(filteredFavorites);
  }, [favoriteRecipes]);

  useEffect(() => {
    setFilteredFavoriteRecipes(favoriteRecipes);
  }, [favoriteRecipes]);

  return (
    <>
      <Header title="Favorite Recipes" />
      <main className="favorite-recipes">
        <FilterBtns handleClickFilter={ handleClickFilter } />
        { filteredFavoriteRecipes.length === 0 && (
          <div className="message">
            <h2>
              No recipes found
            </h2>
          </div>
        ) }
        <HorizontalCard
          filteredFavoriteRecipes={ filteredFavoriteRecipes }
        />
      </main>
      <Footer />
    </>
  );
}

export default FavoriteRecipes;
