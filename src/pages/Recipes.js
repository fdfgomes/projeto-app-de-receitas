import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Recipes() {
  const location = useLocation();

  const [title, setTitle] = useState('');

  useEffect(() => {
    switch (location.pathname) {
    case '/meals':
      setTitle('Meals');
      break;
    case '/drinks':
      setTitle('Drinks');
      break;
    default:
      setTitle('');
    }
  }, [location.pathname]);

  return (
    <>
      <Header title={ title } />
      <main>
        <p>Recipes</p>
      </main>
      <Footer />
    </>
  );
}

export default Recipes;
