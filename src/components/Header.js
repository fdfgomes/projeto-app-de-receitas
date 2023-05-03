import React, { useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUserAlt } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import Context from '../context/Context';
import SearchBar from './SearchBar';
import '../styles/components/Header.css';

function Header({ title }) {
  const { isExact, path: pathname } = useRouteMatch();

  const { searchBarIsVisible, setSearchBarIsVisible } = useContext(Context);

  return isExact
    && (
      <>
        <header className="header">
          {/* título da página */}
          <h2 data-testid="page-title">{ title }</h2>
          {/* ícones */}
          <div className="icons">
            {/* ícone profile */}
            <Link className="icon" to="/profile">
              <FaUserAlt data-testid="profile-top-btn" size={ 22 } />
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
                  <FiSearch data-testid="search-top-btn" size={ 26 } />
                </button>
              )
            }
          </div>
        </header>
        {
          searchBarIsVisible
          && ['/drinks', '/meals'].includes(pathname)
          && <SearchBar />
        }
      </>
    );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
