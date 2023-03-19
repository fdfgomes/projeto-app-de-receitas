import React, { useCallback, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiDrink } from 'react-icons/bi';
import { GiMeal } from 'react-icons/gi';
import Context from '../context/Context';
import '../styles/Footer.css';

function Footer() {
  const { pathname } = useLocation();

  const {
    setSelectedCategory,
    setSearchResults,
  } = useContext(Context);

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

  const handleClick = useCallback(
    async (searchType) => {
      if (pathname === `/${searchType}`) {
        resetSearchResults(searchType);
      }
      setSelectedCategory('All');
    },
    [pathname, resetSearchResults, setSelectedCategory],
  );

  return (
    <footer data-testid="footer">
      <div className="footer-box">
        <Link onClick={ () => handleClick('meals') } to="/meals">
          <GiMeal data-testid="meals-bottom-btn" size={ 34 } />
        </Link>
        <Link onClick={ () => handleClick('drinks') } to="/drinks">
          <BiDrink data-testid="drinks-bottom-btn" size={ 34 } />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
