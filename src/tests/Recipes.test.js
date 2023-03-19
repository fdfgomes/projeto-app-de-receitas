import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';
import fetch from '../../cypress/mocks/fetch';

// Meals Category
const ALL_CATEGORY = 'All-category-filter';
const BEEF_CATEGORY = 'Beef-category-filter';
const BREAKFEAST_CATEGORY = 'Breakfast-category-filter';
const CHICKEN_CATEGORY = 'Chicken-category-filter';
const DESERT_CATEGORY = 'Dessert-category-filter';
const GOAT_CATEGORY = 'Goat-category-filter';

// Drinks Category
const ORDINARY_CATEGORY = 'Ordinary Drink-category-filter';
const COCKTAIL_CATEGORY = 'Cocktail-category-filter';
const SHAKE_CATEGORY = 'Shake-category-filter';
const COCOA_CATEGORY = 'Cocoa-category-filter';

describe('Testa funcionamento da pagina de receitas', () => {
  it('As categorias na rota /meals são renderizadas corretamente', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    await act(() => history.push('/meals'));

    expect(history.location.pathname).toBe('/meals');
    expect(global.fetch).toHaveBeenCalled();

    const all = screen.queryByTestId(ALL_CATEGORY);
    const beef = screen.queryByTestId(BEEF_CATEGORY);
    const breakfast = screen.queryByTestId(BREAKFEAST_CATEGORY);
    const chicken = screen.queryByTestId(CHICKEN_CATEGORY);
    const desert = screen.queryByTestId(DESERT_CATEGORY);
    const goat = screen.queryByTestId(GOAT_CATEGORY);

    expect(all).toBeInTheDocument();
    expect(beef).toBeInTheDocument();
    expect(breakfast).toBeInTheDocument();
    expect(chicken).toBeInTheDocument();
    expect(desert).toBeInTheDocument();
    expect(goat).toBeInTheDocument();
  });

  it('As categorias na rota /drinks são renderizadas corretamente', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    await act(() => history.push('/drinks'));

    expect(history.location.pathname).toBe('/drinks');

    expect(global.fetch).toHaveBeenCalled();

    const all = screen.queryByTestId(ALL_CATEGORY);
    const ordinary = screen.queryByTestId(ORDINARY_CATEGORY);
    const cocktail = screen.queryByTestId(COCKTAIL_CATEGORY);
    const shake = screen.queryByTestId(SHAKE_CATEGORY);
    const cocoa = screen.queryByTestId(COCOA_CATEGORY);

    expect(all).toBeInTheDocument();
    expect(ordinary).toBeInTheDocument();
    expect(cocktail).toBeInTheDocument();
    expect(shake).toBeInTheDocument();
    expect(cocoa).toBeInTheDocument();
  });

  it('Testa se as receitas da rota /meals são renderizadas corretamente', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push('/meals'));

    expect(history.location.pathname).toBe('/meals');
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');

    expect(screen.queryAllByTestId(/-recipe-card$/i)).toHaveLength(12);
  });

  it('Testa se as receitas da rota /drinks são renderizadas corretamente', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push('/drinks'));

    expect(history.location.pathname).toBe('/drinks');
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');

    expect(screen.queryAllByTestId(/-recipe-card$/i)).toHaveLength(12);
  });

  it('Testa se as categorias /meals funcionam corretamente', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push('/meals'));

    expect(history.location.pathname).toBe('/meals');

    const bigMacImg = screen.queryByTestId('11-card-img');

    expect(bigMacImg).toBeInTheDocument();
    expect(bigMacImg.src).toBe('https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg');

    const all = screen.queryByTestId(ALL_CATEGORY);
    const category = 'Goat';
    const goat = screen.queryByTestId(GOAT_CATEGORY);

    await act(async () => userEvent.click(goat));

    expect(global.fetch).toHaveBeenCalledWith(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);

    const roastedGoat = screen.queryByText('Mbuzi Choma (Roasted Goat)');

    expect(roastedGoat).toBeInTheDocument();

    expect(screen.queryAllByTestId(/-recipe-card$/i)).toHaveLength(1);

    expect(bigMacImg).not.toBeInTheDocument();

    await act(async () => userEvent.click(goat));

    expect(screen.queryByText('Mbuzi Choma (Roasted Goat)')).not.toBeInTheDocument();
    expect(screen.queryByTestId('11-card-img')).toBeInTheDocument();

    await act(async () => userEvent.click(all));

    expect(screen.queryAllByTestId(/-recipe-card$/i)).toHaveLength(12);
  });

  it('Testa se as categorias /drinks funcionam corretamentes', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push('/drinks'));

    expect(screen.queryByTestId('page-title').innerHTML).toBe('Drinks');
    expect(history.location.pathname).toBe('/drinks');

    const d747 = screen.queryByTestId('4-card-img');
    const shake = screen.queryByTestId(SHAKE_CATEGORY);

    expect(d747).toBeInTheDocument();
    expect(d747.src).toBe('https://www.thecocktaildb.com/images/media/drink/xxsxqy1472668106.jpg');

    await act(async () => userEvent.click(shake));

    expect(global.fetch).toHaveBeenCalledTimes(3);

    const avalanche = screen.queryByText('Avalanche');
    const blindRussian = screen.queryByText('Blind Russian');
    const chocolateMonkey = screen.queryByText('Chocolate Monkey');

    expect(avalanche).toBeInTheDocument();
    expect(blindRussian).toBeInTheDocument();
    expect(chocolateMonkey).toBeInTheDocument();

    await act(async () => userEvent.click(shake));

    expect(avalanche).not.toBeInTheDocument();
    expect(blindRussian).not.toBeInTheDocument();
    expect(chocolateMonkey).not.toBeInTheDocument();

    expect(screen.getByTestId('4-card-img')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/-recipe-card$/i)).toHaveLength(12);
  });

  it('Testa se ao clicar em uma receita é redirecionado para pagina de detalhes', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push('/meals'));

    expect(history.location.pathname).toBe('/meals');

    const firstMeal = screen.queryByTestId('0-card-name');

    expect(firstMeal.innerHTML).toBe('Corba');

    await act(async () => userEvent.click(firstMeal));

    expect(history.location.pathname).toBe('/meals/52977');

    await act(() => history.push('/drinks'));

    const firstDrink = screen.queryByTestId('0-card-name');

    expect(firstDrink.innerHTML).toBe('GG');

    await act(async () => userEvent.click(firstDrink));

    expect(history.location.pathname).toBe('/drinks/15997');
  });
});
