import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';

function Header({ title }) {
  const { pathname } = useLocation();

  return (
    <header className="header">
      {/* título da página */}
      <h1 data-testid="page-title">{ title }</h1>
      {/* ícones */}
      <div className="icons">
        {/* ícone profile */}
        <img
          alt="Profile"
          data-testid="profile-top-btn"
          src={ profileIcon }
        />
        {/* ícone search */}
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
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
