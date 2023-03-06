import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';

describe('Testes referentes a página de perfil', () => {
  afterEach(() => localStorage.clear());

  const TEST_EMAIL = 'email@teste.com';
  const TEST_PASSWORD = '123456789';
  it('A página deve renderizar o email digitado na página de login', () => {
    const { history } = renderWithRouterAndContext(<App />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const sendButton = screen.getByTestId('login-submit-btn');

    userEvent.type(emailInput, TEST_EMAIL);
    userEvent.type(passwordInput, TEST_PASSWORD);
    userEvent.click(sendButton);

    act(() => {
      history.push('/profile');
    });

    const userEmail = screen.getByTestId('profile-email');
    expect(userEmail).toHaveTextContent(TEST_EMAIL);
  });

  it('A página não renderiza email caso não haja email salvo no localStorge', () => {
    const { history } = renderWithRouterAndContext(<App />);

    act(() => history.push('/profile'));

    const userEmail = screen.getByTestId('profile-email');
    expect(userEmail).toBeEmptyDOMElement();
  });

  it('Ao clicar no botão Done Recipes, deve realizar o devido redirecionamento', () => {
    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/profile');
    });

    const doneRecipesBtn = screen.getByTestId('profile-done-btn');
    userEvent.click(doneRecipesBtn);
    expect(history.location.pathname).toBe('/done-recipes');
  });
  it('Ao clicar no botão Favorite Recipes, deve realizar o devido redirecionamento', () => {
    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/profile');
    });

    const favoriteRecipesBtn = screen.getByTestId('profile-favorite-btn');
    userEvent.click(favoriteRecipesBtn);
    expect(history.location.pathname).toBe('/favorite-recipes');
  });
  it('Ao clicar no botão logout, deve realizar o devido redirecionamento e limpar o localstorage', () => {
    const clear = jest.spyOn(Storage.prototype, 'clear');
    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/profile');
    });

    const logoutBtn = screen.getByTestId('profile-logout-btn');
    userEvent.click(logoutBtn);
    expect(clear).toHaveBeenCalled();
    expect(history.location.pathname).toBe('/');
    clear.mockClear();
  });
});
