import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineCheck } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/Profile.css';
import setPageTitle from '../utils/setPageTitle';
import { APP_SHORT_NAME } from '../constants';

function Profile() {
  const { email } = JSON.parse(localStorage.getItem('user')) ?? '';

  useEffect(() => {
    setPageTitle(`Profile - ${APP_SHORT_NAME}`);
  }, []);

  return (
    <>
      <Header title="Profile" />
      <main className="profile">
        {/* <h2>Profile</h2> */}
        <FaUserCircle color="#7b6e38" size={ 150 } />
        {/* email do usuário */}
        <h4 data-testid="profile-email">{email}</h4>
        {/* div com os links de redirecionamento */}
        <Link data-testid="profile-done-btn" to="/done-recipes">
          <AiOutlineCheck />
          {' '}
          Done Recipes
        </Link>
        <Link data-testid="profile-favorite-btn" to="/favorite-recipes">
          <AiFillHeart />
          {' '}
          Favorite Recipes
        </Link>
        {/* no caso do link que redireciona p/ a pagina inicial, o localstorage
            deve ter todas suas chaves limpas */}
        <Link
          data-testid="profile-logout-btn"
          onClick={ () => localStorage.clear() }
          to="/"
        >
          <IoExitOutline />
          {' '}
          Logout
        </Link>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
