import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

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

  const handleClick = useCallback(() => {
    localStorage.setItem('user', JSON.stringify({ email }));
    // Aqui talvez tenha uma lógica pra alterar pro /drinks? talvez não?
    history.push('/meals');
  }, []);

  return (
    <main>
      <h1>Login</h1>
      <label htmlFor="emailInput">
        <input
          type="email"
          name="emailInput"
          data-testid="email-input"
          value={ email }
          onChange={ ({ target }) => setEmail(target.value) }
        />
      </label>
      <label htmlFor="passwordInput">
        <input
          type="password"
          name="passwordInput"
          data-testid="password-input"
          value={ password }
          onChange={ ({ target }) => setPassword(target.value) }
        />
      </label>
      <button
        data-testid="login-submit-btn"
        disabled={ isDisabled }
        onClick={ () => handleClick() }
      >
        Enter
      </button>
    </main>
  );
}

export default Login;
