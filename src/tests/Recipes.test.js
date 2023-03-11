import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
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

const LOADING = 'Loading...';

describe('Testa funcionamento da pagina de receitas', () => {
  it('As categorias na rota /meals são renderizadas corretamente', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    act(() => {
      history.push('/meals');
    });

    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });
    expect(history.location.pathname).toBe('/meals');
    expect(global.fetch).toHaveBeenCalled();

    await waitFor(async () => {
      const all = await screen.getByTestId(ALL_CATEGORY);
      const beef = await screen.getByTestId(BEEF_CATEGORY);
      const breakfast = await screen.getByTestId(BREAKFEAST_CATEGORY);
      const chicken = await screen.getByTestId(CHICKEN_CATEGORY);
      const desert = await screen.getByTestId(DESERT_CATEGORY);
      const goat = await screen.getByTestId(GOAT_CATEGORY);
      expect(all).toBeInTheDocument();
      expect(beef).toBeInTheDocument();
      expect(breakfast).toBeInTheDocument();
      expect(chicken).toBeInTheDocument();
      expect(desert).toBeInTheDocument();
      expect(goat).toBeInTheDocument();
    });
  });

  it('As categorias na rota /drinks são renderizadas corretamente', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    act(() => {
      history.push('/drinks');
    });

    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });

    expect(history.location.pathname).toBe('/drinks');

    expect(global.fetch).toHaveBeenCalled();

    await waitFor(() => {
      const all = screen.getByTestId(ALL_CATEGORY);
      const ordinary = screen.getByTestId(ORDINARY_CATEGORY);
      const cocktail = screen.getByTestId(COCKTAIL_CATEGORY);
      const shake = screen.getByTestId(SHAKE_CATEGORY);
      const cocoa = screen.getByTestId(COCOA_CATEGORY);
      expect(all).toBeInTheDocument();
      expect(ordinary).toBeInTheDocument();
      expect(cocktail).toBeInTheDocument();
      expect(shake).toBeInTheDocument();
      expect(cocoa).toBeInTheDocument();
    });
  });

  it('Testa se as receitas da rota /meals são renderizadas corretamente', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/meals');
    });

    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });

    expect(history.location.pathname).toBe('/meals');
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');

    await waitFor(() => {
      expect(screen.getAllByTestId(/-recipe-card$/i)).toHaveLength(12);
    });
  });

  it('Testa se as receitas da rota /drinks são renderizadas corretamente', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/drinks');
    });
    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });

    expect(history.location.pathname).toBe('/drinks');
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');

    expect(await screen.findAllByTestId(/-recipe-card$/i)).toHaveLength(12);
  });

  it('Testa se as categorias /meals funcionam corretamente', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/meals');
    });
    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });

    expect(history.location.pathname).toBe('/meals');

    const bigMacImg = await screen.findByTestId('11-card-img');

    const all = await screen.findByTestId(ALL_CATEGORY);
    const goat = await screen.findByTestId(GOAT_CATEGORY);
    const category = 'Goat';

    expect(bigMacImg).toBeInTheDocument();
    expect(bigMacImg.src).toBe('https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg');

    act(() => {
      userEvent.click(goat);
    });
    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);

    const roastedGoat = await screen.findByText('Mbuzi Choma (Roasted Goat)');

    expect(screen.queryByText(LOADING)).not.toBeInTheDocument();
    expect(roastedGoat).toBeInTheDocument();

    expect(await screen.findAllByTestId(/-recipe-card$/i)).toHaveLength(1);

    expect(bigMacImg).not.toBeInTheDocument();

    await act(() => {
      userEvent.click(goat);
      waitFor(() => {
        const loading = screen.queryByText(LOADING);
        expect(loading).toBeInTheDocument();
      });
    });

    await waitFor(() => {
      expect(screen.queryByText(LOADING)).not.toBeInTheDocument();
      expect(screen.queryByText('Mbuzi Choma (Roasted Goat)')).not.toBeInTheDocument();
      expect(screen.getByTestId('11-card-img')).toBeInTheDocument();
    });

    await act(() => {
      userEvent.click(all);
      waitFor(() => {
        const loading = screen.queryByText(LOADING);
        expect(loading).toBeInTheDocument();
      });
    });

    expect(await screen.findAllByTestId(/-recipe-card$/i)).toHaveLength(12);
  });

  it('Testa se as categorias /drinks funcionam corretamentes', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/drinks');
    });
    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });

    expect(screen.queryByTestId('page-title').innerHTML).toBe('Drinks');
    expect(history.location.pathname).toBe('/drinks');

    const d747 = await screen.findByTestId('4-card-img');
    const shake = await screen.findByTestId(SHAKE_CATEGORY);

    expect(d747).toBeInTheDocument();
    expect(d747.src).toBe('https://www.thecocktaildb.com/images/media/drink/xxsxqy1472668106.jpg');

    act(() => {
      userEvent.click(shake);
      waitFor(() => {
        const loading = screen.queryByText(LOADING);
        expect(loading).toBeInTheDocument();
      });
    });

    expect(global.fetch).toHaveBeenCalledTimes(3);

    const avalanche = await screen.findByText('Avalanche');
    const blindRussian = await screen.findByText('Blind Russian');
    const chocolateMonkey = await screen.findByText('Chocolate Monkey');

    expect(avalanche).toBeInTheDocument();
    expect(blindRussian).toBeInTheDocument();
    expect(chocolateMonkey).toBeInTheDocument();

    act(() => {
      userEvent.click(shake);
      waitFor(() => {
        const loading = screen.queryByText(LOADING);
        expect(loading).toBeInTheDocument();
      });
    });

    await waitFor(async () => {
      expect(avalanche).not.toBeInTheDocument();
      expect(blindRussian).not.toBeInTheDocument();
      expect(chocolateMonkey).not.toBeInTheDocument();

      expect(screen.getByTestId('4-card-img')).toBeInTheDocument();
      expect(await screen.findAllByTestId(/-recipe-card$/i)).toHaveLength(12);
    });
  });

  it('Testa se ao clicar em uma receita é redirecionado para pagina de detalhes', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn(fetch);

    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/meals');
    });

    expect(history.location.pathname).toBe('/meals');

    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).toBeInTheDocument();
    });

    const firstMeal = await screen.findByTestId('0-card-name');
    expect(firstMeal.innerHTML).toBe('Corba');

    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).not.toBeInTheDocument();
    });

    await act(() => {
      userEvent.click(firstMeal);
    });

    expect(history.location.pathname).toBe('/meals/52977');

    const drinkBtn = await screen.findByTestId('drinks-bottom-btn');

    await act(() => {
      userEvent.click(drinkBtn);
      waitFor(() => {
        const loading = screen.queryByText(LOADING);
        expect(loading).toBeInTheDocument();
      });
    });

    expect(history.location.pathname).toBe('/drinks');

    await waitFor(() => {
      const loading = screen.queryByText(LOADING);
      expect(loading).not.toBeInTheDocument();
    });

    const firstDrink = await screen.findByTestId('0-card-name');
    expect(firstDrink.innerHTML).toBe('GG');

    await act(() => {
      userEvent.click(firstDrink);
    });

    expect(history.location.pathname).toBe('/drinks/15997');
  });
});
