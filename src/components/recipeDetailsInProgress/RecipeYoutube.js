import propTypes from 'prop-types';
import YouTube from 'react-youtube';

function RecipeYoutube({ strYoutube, isDrink }) {
  const opts = {
    width: '100%',
  };

  return (
    <div>
      {
        !isDrink && (
          <div data-testid="video">
            <YouTube
              videoId={ strYoutube }
              opts={ opts }
            />
          </div>
        )
      }
    </div>
  );
}

RecipeYoutube.propTypes = {
  strYoutube: propTypes.string,
  isDrink: propTypes.string,
}.isRequired;

export default RecipeYoutube;
