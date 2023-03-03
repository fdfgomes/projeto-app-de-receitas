import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/RenderWithRouter';

describe('Testes referentes ao componente Footer.js', () => {
  it('O footer deve ser renderizado na página /meals', () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/meals');
    });

    const footer = screen.getByTestId('footer');

    expect(footer).toBeInTheDocument();
  });

  it('O footer deve ser renderizado na página /drinks', () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/drinks');
    });

    const footer = screen.getByTestId('footer');

    expect(footer).toBeInTheDocument();
  });

  it('O footer deve ser renderizado na página /profile', () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/profile');
    });

    const footer = screen.getByTestId('footer');

    expect(footer).toBeInTheDocument();
  });

  it('Ao clicar nos ícones, deve realizar o devido redirecionamento', () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/profile');
    });

    const mealsBtn = screen.getByTestId('meals-bottom-btn');
    expect(mealsBtn).toBeInTheDocument();

    userEvent.click(mealsBtn);
    expect(history.location.pathname).toBe('/meals');

    act(() => {
      history.push('/profile');
    });

    const drinksBtn = screen.getByTestId('drinks-bottom-btn');
    expect(drinksBtn).toBeInTheDocument();
    userEvent.click(drinksBtn);
    expect(history.location.pathname).toBe('/drinks');
  });
});
