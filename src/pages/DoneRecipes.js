import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import Footer from '../components/Footer';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [copyMsg, setCopyMsg] = useState([]);

  useEffect(() => {
    const storedDoneRecipes = JSON.parse(localStorage
      .getItem('doneRecipes')) || []; setDoneRecipes(storedDoneRecipes);
  }, []);

  useEffect(() => {
    setRecipes(doneRecipes);
  }, [doneRecipes]);

  const filterTypes = {
    all: () => setRecipes(doneRecipes),
    meal: () => setRecipes(doneRecipes
      .filter((targetRecipe) => targetRecipe.type === 'meal')),
    drink: () => setRecipes(doneRecipes
      .filter((targetRecipe) => targetRecipe.type === 'drink')),
  };

  const handleFilterTypes = ({ target }) => {
    const clickedTarget = target.name;
    filterTypes[clickedTarget]();
  };

  const generalHandler = () => {
    setRecipes(doneRecipes);
  };

  return (
    <div>

      <Header
        title="Done Recipes"
      />

      <section>
        <button
          data-testid="filter-by-all-btn"
          name="all"
          type="button"
          onClick={ generalHandler }
        >
          All
        </button>

        <button
          data-testid="filter-by-meal-btn"
          name="meal"
          type="button"
          onClick={ (e) => handleFilterTypes(e) }
        >
          Meals
        </button>

        <button
          data-testid="filter-by-drink-btn"
          name="drink"
          type="button"
          onClick={ (e) => handleFilterTypes(e) }
        >
          Beverages
        </button>
      </section>

      <main>
        {recipes.map((recipe, index) => (
          <div key={ index }>
            <Link to={ `${recipe.type}s/${recipe.id}` }>
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                alt={ recipe.name }
                style={ { width: '80px' } }
              />
              {recipe.type === 'meal' ? (
                <>
                  <p data-testid={ `${index}-horizontal-top-text` }>
                    {`${recipe.nationality} - ${recipe.category}`}
                  </p>
                  <p data-testid={ `${index}-${recipe.tags[0]}-horizontal-tag` }>
                    { recipe.tags[0] }
                  </p>
                  <p data-testid={ `${index}-${recipe.tags[1]}-horizontal-tag` }>
                    { recipe.tags[1] }
                  </p>
                </>
              ) : (
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {recipe.alcoholicOrNot}
                </p>
              )}
              <p data-testid={ `${index}-horizontal-done-date` }>{ recipe.doneDate }</p>
              <p data-testid={ `${index}-horizontal-name` }>{ recipe.name }</p>
            </Link>

            <button
              type="button"
              onClick={ () => {
                clipboardCopy(`http://localhost:3000/${recipe.type}s/${recipe.id}`);
                setCopyMsg(true);
              } }
            >
              <img
                src={ shareIcon }
                alt="Share Icon"
                data-testid={ `${index}-horizontal-share-btn` }
              />
              {copyMsg && <span>Link copied!</span>}
            </button>

          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default DoneRecipes;
