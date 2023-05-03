import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import logoImage from '../images/logo-image.png';
import setPageTitle from '../utils/setPageTitle';
import { APP_NAME } from '../constants';

function Login() {
  const history = useHistory();

  const [email, setEmail] = useState('');

  const [isDisabled, setIsDisabled] = useState(true);

  const [password, setPassword] = useState('');

  useEffect(() => {
    const enableButton = () => {
      const minLenghtPassword = 6;
      const passwordValidation = password.length > minLenghtPassword;
      const emailValidation = (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).test(email);
      if (passwordValidation && emailValidation) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };
    enableButton();
  }, [password, email]);

  const handleSubmit = useCallback(() => {
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/meals');
  }, [email, history]);

  useEffect(() => {
    setPageTitle(APP_NAME);
  }, []);

  return (
    <main className="login">
      <div className="wrapper">
        <div className="logo">
          <img alt="Recipes App - Logo" className="image" src={ logoImage } />
          <h1 className="title">Recipes App</h1>
          <h2 className="subtitle">Meals & Drinks</h2>
        </div>
        <div className="separator" />
        <div className="greetings">
          <span className="message">
            Please enter your credentials to access your account
          </span>
        </div>
        <form onSubmit={ handleSubmit }>
          <label htmlFor="emailInput">
            <input
              data-testid="email-input"
              name="emailInput"
              placeholder="email@example.com"
              onChange={ ({ target }) => setEmail(target.value) }
              type="email"
              value={ email }
            />
          </label>
          <label htmlFor="passwordInput">
            <input
              data-testid="password-input"
              name="passwordInput"
              onChange={ ({ target }) => setPassword(target.value) }
              placeholder="Password"
              type="password"
              value={ password }
            />
          </label>
          <button
            data-testid="login-submit-btn"
            disabled={ isDisabled }
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
