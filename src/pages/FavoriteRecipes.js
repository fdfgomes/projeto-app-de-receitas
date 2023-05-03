import React, { useCallback, useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Filters from '../components/Filters';
import HorizontalCard from '../components/HorizontalCard';
import Footer from '../components/Footer';
import Context from '../context/Context';
import '../styles/pages/FavoriteRecipes.css';

function FavoriteRecipes() {
  const { favoriteRecipes } = useContext(Context);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const [filteredFavoriteRecipes, setFilteredFavoriteRecipes] = useState([]);

  const handleClickFilter = useCallback(
    (category) => {
      let filteredFavorites = favoriteRecipes;
      if (category === 'meal') {
        filteredFavorites = favoriteRecipes.filter(
          (favoriteRecipe) => favoriteRecipe.type === 'meal',
        );
      }
      if (category === 'drink') {
        filteredFavorites = favoriteRecipes.filter(
          (favoriteRecipe) => favoriteRecipe.type === 'drink',
        );
      }
      setSelectedCategory(category);
      setFilteredFavoriteRecipes(filteredFavorites);
    },
    [favoriteRecipes],
  );

  useEffect(() => {
    setFilteredFavoriteRecipes(favoriteRecipes);
  }, [favoriteRecipes]);

  return (
    <>
      <Header title="Favorite Recipes" />
      <main className="favorite-recipes">
        <Filters
          handleClickFilter={ handleClickFilter }
          selectedCategory={ selectedCategory }
        />
        {filteredFavoriteRecipes.length === 0 && (
          <div className="message">
            <h2>No recipes found</h2>
          </div>
        )}
        <HorizontalCard filteredFavoriteRecipes={ filteredFavoriteRecipes } />
      </main>
      <Footer />
    </>
  );
}

export default FavoriteRecipes;
