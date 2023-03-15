import React, { useContext, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUserAlt } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import Context from '../context/Context';
// import profileIcon from '../images/profileIcon.svg';
// import searchIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';
import '../styles/Header.css';

function Header({ title }) {
  const { isExact, path: pathname } = useRouteMatch();

  const { searchBarIsVisible, setSearchBarIsVisible } = useContext(Context);

  useEffect(() => {
    setSearchBarIsVisible(false);
  }, [pathname, setSearchBarIsVisible]);

  return isExact
    && (
      <header className="header">
        {/* título da página */}
        <h2 data-testid="page-title">{ title }</h2>
        {/* ícones */}
        <div className="icons">
          {/* ícone profile */}
          <Link className="icon" to="/profile">
            {/* <img
              alt="Profile"
              data-testid="profile-top-btn"
              src={ profileIcon }
            /> */}
            <FaUserAlt size={ 22 } />
          </Link>
          {/* ícone search */}
          {
            ![
              '/profile',
              '/done-recipes',
              '/favorite-recipes',
            ].includes(pathname) && (
              <button
                className="icon icon-button"
                onClick={ () => setSearchBarIsVisible(!searchBarIsVisible) }
                type="button"
              >
                {/* <img
                    alt="Search"
                    data-testid="search-top-btn"
                    src={ searchIcon }
                  /> */}
                <FiSearch size={ 26 } />
              </button>
            )
          }
        </div>
        {
          searchBarIsVisible
          && ['/drinks', '/meals'].includes(pathname)
          && <SearchBar />
        }
      </header>
    );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
