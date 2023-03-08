import propTypes from 'prop-types';
import YouTube from 'react-youtube';

function RecipeYoutube({ strYoutube, isDrink }) {
  return (
    <div>
      {
        !isDrink && (
          <div data-testid="video">
            <YouTube
              videoId={ strYoutube }
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
