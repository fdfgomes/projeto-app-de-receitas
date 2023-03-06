import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchResults from '../components/SearchResults';
import Context from '../context/Context';

function Recipes() {
  const { pathname } = useLocation();

  const {
    searchResults: {
      meals: {
        data: mealsSearchResults,
      },
      drinks: {
        data: drinksSearchResults,
      },
    },
  } = useContext(Context);

  const [title, setTitle] = useState('');

  useEffect(() => {
    switch (pathname) {
    case '/meals':
      setTitle('Meals');
      break;
    case '/drinks':
      setTitle('Drinks');
      break;
    default:
      setTitle('');
    }
  }, [pathname]);

  return (
    <>
      <Header title={ title } />
      <main>
        {/* resultados da pesquisa */}
        { pathname === '/meals' && mealsSearchResults.length > 0 && <SearchResults /> }
        { pathname === '/drinks' && drinksSearchResults.length > 0 && <SearchResults /> }
        <p>Recipes</p>
      </main>
      <Footer />
    </>
  );
}

export default Recipes;
