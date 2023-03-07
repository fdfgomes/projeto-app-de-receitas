import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';
import { drinkCategories, mealsCategories } from './mocks/mockData';

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
  beforeEach(() => {
  //
  });
  test('Se as categorias da página são renderizada corretamente', async () => {
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

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: () => jest.jf().mockResolvedValue(drinkCategories),
    });

    act(() => {
      history.push('/drinks');
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
});
