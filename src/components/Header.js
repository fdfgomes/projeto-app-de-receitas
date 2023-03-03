import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';

function Header({ title }) {
  const { isExact, path: pathname } = useRouteMatch();

  const [searchBarIsVisible, setSearchBarIsVisible] = useState(false);

  return isExact
    && (
      <header className="header">
        {/* título da página */}
        <h1 data-testid="page-title">{ title }</h1>
        {/* ícones */}
        <div className="icons">
          {/* ícone profile */}
          <Link to="/profile">
            <img
              alt="Profile"
              data-testid="profile-top-btn"
              src={ profileIcon }
            />
          </Link>
          {/* ícone search */}
          <button
            className="icon-button"
            onClick={ () => setSearchBarIsVisible(!searchBarIsVisible) }
            type="button"
          >
            {
              ![
                '/profile',
                '/done-recipes',
                '/favorite-recipes',
              ].includes(pathname) && (
                <img
                  alt="Search"
                  data-testid="search-top-btn"
                  src={ searchIcon }
                />
              )
            }
          </button>
        </div>
        { searchBarIsVisible && <SearchBar /> }
      </header>
    );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
