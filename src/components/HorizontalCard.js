import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import Context from '../context/Context';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

const copy = require('clipboard-copy');

export default function HorizontalCard({ filteredFavoriteRecipes }) {
  // pegando a lista de receitas do estado global
  const { favoriteRecipes, setFavoriteRecipes } = useContext(Context);

  // verifica se a receita está favoritada ou não, código baseado na solução do felipe gomes
  // no desenvolvimento da tela de detalhes
  const isFavorited = (recipe) => favoriteRecipes.find(
    (faveRecipe) => faveRecipe.id === recipe.id,
  );

  // remove um item da lista de favoritos. Código baseado na solução do felipe gomes
  // no desenvolvimento da tela de detalhes
  const toggleFavorite = (recipe) => {
    setFavoriteRecipes((currentFavorites) => {
      if (isFavorited) {
        return [
          ...currentFavorites.filter(
            (favoritedRecipe) => favoritedRecipe.id !== recipe.id,
          ),

        ];
      }
      return [
        ...currentFavorites,
        recipe,
      ];
    });
  };

  // copia o link da página de detalhes da receita específica, preciso bolar um jeito de
  // adicionar o elemento com o texto no clique sem acionar o elemento de texto em todos os
  // cards da lista

  const handleClickShare = (recipe) => {
    if (recipe.type === 'meal') {
      copy(`http://localhost:3000/meals/${recipe.id}`);
    } else {
      copy(`http://localhost:3000/drinks/${recipe.id}`);
    }
    toast.success('Link copied!');
  };

  return (
    <section className="favorited-recipes">
      {/* caso a lista de favoritos esteja vazia, exibe um texto, do contrário,
      popula a tela com cards */}
      { filteredFavoriteRecipes.map((recipe, index) => (
        <div className="favorite-recipe-card" key={ recipe.id }>
          {/* ternário que renderiza os elementos especificos
            caso seja uma comida ou bebida */}
          { recipe.type === 'meal'
            ? (
              <>
                {/* links da imagem e nome da receita como pede o requisito 56.
                  Por algum motivo, o cypress n reconhece o link da imagem */}
                <Link
                  className="recipe-image"
                  to={ `/meals/${recipe.id}` }
                >
                  <img
                    alt={ recipe.name }
                    data-testid={ `${index}-horizontal-image` }
                    src={ recipe.image }
                  />
                </Link>
                <Link
                  className="recipe-name"
                  to={ `/meals/${recipe.id}` }
                >
                  <h4 data-testid={ `${index}-horizontal-name` }>{ recipe.name }</h4>
                </Link>
                <p
                  className="recipe-category"
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  {`${recipe.nationality} - ${recipe.category}`}
                </p>
              </>
            ) : (
              <>
                <Link
                  className="recipe-image"
                  to={ `/drinks/${recipe.id}` }
                >
                  <img
                    alt={ recipe.name }
                    data-testid={ `${index}-horizontal-image` }
                    src={ recipe.image }
                  />
                </Link>
                <Link
                  className="recipe-name"
                  to={ `/drinks/${recipe.id}` }
                >
                  <h4 data-testid={ `${index}-horizontal-name` }>{ recipe.name }</h4>
                </Link>
                <p
                  className="recipe-category"
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  { recipe.alcoholicOrNot }
                </p>
              </>
            ) }

          <div className="buttons-share-and-favorite">
            <button
              data-testid={ `${index}-horizontal-share-btn` }
              onClick={ () => handleClickShare(recipe) }
            >
              <img
                alt="Share button"
                src={ shareIcon }
              />
            </button>
            <button
              data-testid={ `${index}-horizontal-favorite-btn` }
              onClick={ () => toggleFavorite(recipe) }
            >
              <img
                alt="Favorite button"
                src={ isFavorited(recipe) ? blackHeartIcon : whiteHeartIcon }
              />
            </button>
          </div>
        </div>
      )) }
    </section>
  );
}

HorizontalCard.propTypes = {
  filteredFavoriteRecipes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    nationality: PropTypes.string,
    category: PropTypes.string,
    alcoholicOrNot: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
  })),
}.isRequired;

// estrutura do objeto recebido:
//  {
//   "id": "52771",
//   "type": "meal", ou "drink"
//   "nationality": "Italian",
//   "category": "Vegetarian",
//   "alcoholicOrNot": "",
//   "name": "Spicy Arrabiata Penne",
//   "image": "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg"
// }
