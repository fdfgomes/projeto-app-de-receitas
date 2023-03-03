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
        <h4 data-testid="profile-email">{email}</h4>
        <div>
          <Link to="/done-recipes">
            <button data-testid="profile-done-btn">Done Recipes</button>
          </Link>
          <Link to="/favorite-recipes">
            <button data-testid="profile-favorite-btn">Favorite Recipes</button>
          </Link>
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
