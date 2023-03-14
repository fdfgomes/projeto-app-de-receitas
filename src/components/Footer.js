import React, { useCallback, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiDrink } from 'react-icons/bi';
import { GiMeal } from 'react-icons/gi';
// import drinkIcon from '../images/drinkIcon.svg';
// import mealIcon from '../images/mealIcon.svg';
import '../styles/Footer.css';
import Context from '../context/Context';

function Footer() {
  const { pathname } = useLocation();

  const { setSearchResults } = useContext(Context);

  const resetSearchResults = useCallback((searchType) => {
    setSearchResults((currentState) => ({
      ...currentState,
      [searchType]: {
        ...[searchType],
        data: [],
        isLoading: false,
        term: '',
      },
    }));
  }, [setSearchResults]);

  const handleClick = useCallback((searchType) => {
    if (pathname === `/${searchType}`) {
      resetSearchResults(searchType);
    }
  }, [pathname, resetSearchResults]);

  return (
    <footer data-testid="footer">
      <div className="footer-box">
        <Link onClick={ () => handleClick('meals') } to="/meals">
          {/* <img src={ mealIcon } alt="meals" data-testid="meals-bottom-btn" /> */}
          <GiMeal size={ 34 } />
        </Link>
        <Link onClick={ () => handleClick('drinks') } to="/drinks">
          {/* <img src={ drinkIcon } alt="drinks" data-testid="drinks-bottom-btn" /> */}
          <BiDrink size={ 34 } />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
