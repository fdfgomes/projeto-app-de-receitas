import React, { useContext } from 'react';
import Header from '../components/Header';
import FilterBtns from '../components/FilterBtns';
import HorizontalCard from '../components/HorizontalCard';
import '../styles/FavoriteRecipes.css';
import Footer from '../components/Footer';
import Context from '../context/Context';

function FavoriteRecipes() {
  const { favoriteRecipes } = useContext(Context);

  return (
    <>
      <Header title="Favorite Recipes" />
      <main className="favorite-recipes">
        <FilterBtns />
        { favoriteRecipes.length === 0 && (
          <div className="message">
            <h2>
              Você não possui receitas favoritadas
            </h2>
          </div>
        ) }
        <HorizontalCard />
      </main>
      <Footer />
    </>
  );
}

export default FavoriteRecipes;
