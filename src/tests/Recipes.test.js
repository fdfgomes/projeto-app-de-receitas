import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';
import { drinkCategories, meals, mealsCategories } from './mocks/mockData';

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
const OTHER_UNKNOW_CATEGORY = 'Other / Unknown-category-filter';
const COCOA_CATEGORY = 'Cocoa-category-filter';

describe('Testa funcionamento da pagina de receitas', () => {
  it('As categorias na rota /meals são renderizadas corretamente', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: () => jest.jf().mockResolvedValue(mealsCategories),
    });
    act(() => {
      history.push('/meals');
    });
    waitFor(async () => {
      const loading = await screen.findByText('Loading...');
      expect(loading).toBeInTheDocument();
    });
    expect(history.location.pathname).toBe('/meals');
    expect(global.fetch).toHaveBeenCalled();
    waitFor(async () => {
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
    global.fetch = jest.fn().mockResolvedValue({
      json: () => jest.jf().mockResolvedValue(drinkCategories),
    });
    act(() => {
      history.push('/drinks');
    });

    waitFor(async () => {
      const loading = await screen.findByText('Loading...');
      expect(loading).toBeInTheDocument();
    });

    expect(history.location.pathname).toBe('/drinks');

    expect(global.fetch).toHaveBeenCalled();
    waitFor(async () => {
      const all = await screen.getByTestId(ALL_CATEGORY);
      const ordinary = await screen.getByTestId(ORDINARY_CATEGORY);
      const cocktail = await screen.getByTestId(COCKTAIL_CATEGORY);
      const shake = await screen.getByTestId(SHAKE_CATEGORY);
      const other = await screen.getByTestId(OTHER_UNKNOW_CATEGORY);
      const cocoa = await screen.getByTestId(COCOA_CATEGORY);
      expect(all).toBeInTheDocument();
      expect(ordinary).toBeInTheDocument();
      expect(cocktail).toBeInTheDocument();
      expect(shake).toBeInTheDocument();
      expect(other).toBeInTheDocument();
      expect(cocoa).toBeInTheDocument();
    });
  });

  it('Testa se as receitas da rota /meals são renderizadas corretamente', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: () => jest.jf().mockResolvedValue(meals),
    });

    act(() => {
      history.push('/meals');
    });

    expect(history.location.pathname).toBe('/meals');
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');

    waitFor(async () => {
      await expect(screen.getAllByTestId(/-recipe-card$/i)).toHaveLength(12);
    });

    waitFor(async () => {
      const bigMacImg = await screen.getByTestId('11-card-img');
      const goat = await screen.getByTestId(GOAT_CATEGORY);
      const category = 'Goat';

      expect(bigMacImg).toBeInTheDocument();
      expect(bigMacImg.src).toBe('https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg');

      act(() => {
        userEvent.click(goat);
      });

      expect(global.fetch).toHaveBeenCalledWith(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);

      const roastedGoat = await screen.getByText('Mbuzi Choma (Roasted Goat)');
      expect(roastedGoat).toBeInTheDocument();

      expect(screen.getAllByTestId(/-recipe-card$/i)).toHaveLength(1);

      expect(bigMacImg).not.toBeInTheDocument();

      act(() => {
        userEvent.click(goat);
      });

      waitFor(async () => {
        expect(roastedGoat).not.toBeInTheDocument();
        expect(bigMacImg).toBeInTheDocument();
        await expect(screen.getAllByTestId(/-recipe-card$/i)).toHaveLength(12);
      });
    });
  });

  it('Testa se as receitas da rota /drinks são renderizadas corretamente', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    act(() => {
      history.push('/drinks');
    });

    expect(history.location.pathname).toBe('/drinks');
    expect(global.fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');

    waitFor(async () => {
      const cocoa = await screen.getByTestId(COCOA_CATEGORY);

      userEvent.click(cocoa);

      await expect(cardImg).toHaveLength(12);
    });
  });
});
