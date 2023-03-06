import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';

const PROFILE_TOP_BTN = 'profile-top-btn';
const SEARCH_TOP_BTN = 'search-top-btn';
const SEARCH_INPUT = 'search-input';

describe('Testando o componente Header', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({
      email: 'teste@teste.com',
    }));
  });

  it('Não é renderizado nas rotas /, /meals/:id-da-receita, /drinks/:id-da-receita, /meals/:id-da-receita/in-progress e /drinks/:id-da-receita/in-progress', () => {
    const { container, history } = renderWithRouterAndContext(<App />);

    const routes = [
      '/',
      '/meals/1',
      '/drinks/1',
      '/meals/1/in-progress',
      '/drinks/1/in-progress',
    ];

    routes.forEach((route) => {
      act(() => history.push(route));

      const headerElement = container.querySelector('header.header');

      expect(headerElement).not.toBeInTheDocument();
    });
  });

  it('É renderizado com título e ícones de perfil e pesquisa nas rotas /meals e /drinks', () => {
    const { history } = renderWithRouterAndContext(<App />);

    const routes = [
      {
        name: 'Drinks',
        pathname: '/drinks',
      },
      {
        name: 'Meals',
        pathname: '/meals',
      },
    ];

    routes.forEach(({ name, pathname }) => {
      act(() => history.push(pathname));

      const title = screen.getByRole('heading', { level: 1, name: new RegExp(name, 'i') });
      const profileIcon = screen.getByTestId(PROFILE_TOP_BTN);
      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      expect(title).toBeInTheDocument();
      expect(profileIcon).toBeInTheDocument();
      expect(searchIcon).toBeInTheDocument();
    });
  });

  it('É renderizado com título, ícone de perfil e sem o ícone de pesquisa nas rotas /profile, /done-recipes e /favorite-recipes', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    const routes = [
      {
        name: 'Profile',
        pathname: '/profile',
      },
      {
        name: 'Done Recipes',
        pathname: '/done-recipes',
      },
      {
        name: 'Favorite Recipes',
        pathname: '/favorite-recipes',
      },
    ];

    routes.forEach(({ name, pathname }) => {
      act(() => history.push(pathname));

      const title = screen.getByRole('heading', { level: 1, name: new RegExp(name, 'i') });
      const profileIcon = screen.getByTestId(PROFILE_TOP_BTN);
      const searchIcon = screen.queryByTestId(SEARCH_TOP_BTN);

      expect(title).toBeInTheDocument();
      expect(profileIcon).toBeInTheDocument();
      expect(searchIcon).not.toBeInTheDocument();
    });
  });

  it('É possível alternar a visibilidade do componente SearchBar ao clicar no ícone de pesquisa', () => {
    const { history } = renderWithRouterAndContext(<App />);

    act(() => history.push('/meals'));

    const searchIcon = screen.queryByTestId(SEARCH_TOP_BTN);

    expect(screen.queryByTestId(SEARCH_INPUT)).not.toBeInTheDocument();

    userEvent.click(searchIcon);

    expect(screen.queryByTestId(SEARCH_INPUT)).toBeInTheDocument();

    userEvent.click(searchIcon);

    expect(screen.queryByTestId(SEARCH_INPUT)).not.toBeInTheDocument();
  });

  it('Ao clicar no ícone de perfil o usuário é redirecionado à rota /profile', () => {
    const { history } = renderWithRouterAndContext(<App />);

    act(() => history.push('/meals'));

    const profileIcon = screen.getByTestId(PROFILE_TOP_BTN);

    userEvent.click(profileIcon);

    expect(history.location.pathname).toBe('/profile');
  });
});

// Para mais informações sobre o uso do localStorage no jest:
// https://jogilvyt.medium.com/storing-and-testing-state-in-localstorage-with-react-fdf8b8b211a4
