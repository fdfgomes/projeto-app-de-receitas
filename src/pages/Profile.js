import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile() {
  const { email } = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Header title="Profile" />
      <main>
        <h2>Profile</h2>
        {/* email do usuário */}
        <h4 data-testid="profile-email">{email}</h4>
        <div>
          {/* div com os links de redirecionamento */}
          <Link data-testid="profile-done-btn" to="/done-recipes">
            Done Recipes
          </Link>
          <Link to="/favorite-recipes">
            <button data-testid="profile-favorite-btn">Favorite Recipes</button>
          </Link>
          {/* no caso do link que redireciona p/ a pagina inicial, o localstorage
            deve ter todas suas chaves limpas */}
          <Link to="/" onClick={ () => { localStorage.clear(); } }>
            <button data-testid="profile-logout-btn">Logout</button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
