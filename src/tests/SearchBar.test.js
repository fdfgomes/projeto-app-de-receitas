import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';
import SEARCH_BAR_MOCKS from './mocks/SearchBar.mocks';

// const PROFILE_TOP_BTN = 'profile-top-btn';
const SEARCH_TOP_BTN = 'search-top-btn';
const SEARCH_INPUT = 'search-input';
const SEARCH_SUBMIT_BUTTON = 'exec-search-btn';
const RECIPE_CARD = '.recipe-card';

beforeAll(() => {
  // https://stackoverflow.com/questions/55088482/jest-not-implemented-window-alert
  window.alert = () => null;
  // https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Testando o componente SearchBar', () => {
  it('É renderizado com um input de texto, 3 inputs do tipo radio e um botão de enviar os dados do formulário ao clicar no ícone de pesquisa do componente Header', async () => {
    const { container, history } = renderWithRouterAndContext(<App />);

    act(() => history.push('/meals'));

    const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

    act(() => userEvent.click(searchIcon));

    const textInput = screen.getByTestId(SEARCH_INPUT);
    const radioButtons = container.querySelectorAll(
      '.radio-buttons input[type=radio]',
    );
    const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

    expect(textInput).toBeInTheDocument();
    expect(radioButtons.length).toBe(3);
    expect(submitButton).toBeInTheDocument();
  });

  describe('/drinks', () => {
    afterEach(() => jest.clearAllMocks());

    const ROUTE = '/drinks';

    it('É possível realizar uma busca por nome de bebida', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      const TEXT_INPUT_VALUE = 'gin';

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.DRINKS.NAME),
      });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      userEvent.type(textInput, TEXT_INPUT_VALUE);

      act(() => userEvent.click(submitButton));

      expect(global.fetch).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${TEXT_INPUT_VALUE}`);

      await waitFor(() => {
        const recipeCards = container.querySelectorAll(RECIPE_CARD);
        expect(recipeCards).toHaveLength(12);
      });
    });

    it('É possível realizar uma busca por bebidas utilizando o nome de um ingrediente', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      const TEXT_INPUT_VALUE = 'lemon';

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.DRINKS.INGREDIENT),
      });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const ingredientRadioButton = screen.getByLabelText(/ingredient/i);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      expect(ingredientRadioButton).toBeInTheDocument();

      userEvent.type(textInput, TEXT_INPUT_VALUE);
      userEvent.click(ingredientRadioButton);
      userEvent.click(submitButton);

      expect(global.fetch).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${TEXT_INPUT_VALUE}`);

      await waitFor(() => {
        const recipeCards = container.querySelectorAll(RECIPE_CARD);
        expect(recipeCards).toHaveLength(12);
      });
    });

    it('É possível realizar uma busca considerando apenas a primeira letra do nome da bebida', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      const TEXT_INPUT_VALUE = 'v';

      jest.spyOn(global, 'fetch')
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.DRINKS.FIRST_LETTER),
        });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const letterRadioButton = screen.getByLabelText(/letter/i);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      expect(letterRadioButton).toBeInTheDocument();

      userEvent.type(textInput, TEXT_INPUT_VALUE);
      userEvent.click(letterRadioButton);

      act(() => userEvent.click(submitButton));

      expect(global.fetch).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${TEXT_INPUT_VALUE}`);

      await waitFor(() => {
        const recipeCards = container.querySelectorAll(RECIPE_CARD);
        expect(recipeCards).toHaveLength(12);
      });
    });

    it('Direciona o usuário à página com os detalhes da bebida caso a busca retorne apenas 1 resultado', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      const TEXT_INPUT_VALUE = 'gin';

      jest.spyOn(global, 'fetch')
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.DRINKS.SINGLE_RESULT),
        });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      await act(() => {
        userEvent.type(textInput, TEXT_INPUT_VALUE);
        userEvent.click(submitButton);
      });

      expect(global.fetch).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${TEXT_INPUT_VALUE}`);
      expect(history.location.pathname).toBe('/drinks/11410');
    });
  });

  describe('/meals', () => {
    afterEach(() => jest.clearAllMocks());

    const ROUTE = '/meals';

    it('É possível realizar uma busca por nome de comida', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.MEALS.NAME),
      });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      userEvent.type(textInput, 'lasagna');

      act(() => userEvent.click(submitButton));

      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=lasagna');

      await waitFor(() => {
        const recipeCards = container.querySelectorAll(RECIPE_CARD);
        expect(recipeCards).toHaveLength(2);
      });
    });

    it('É possível realizar uma busca por receitas utilizando o nome de um ingrediente', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.MEALS.INGREDIENT),
      });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const ingredientRadioButton = screen.getByLabelText(/ingredient/i);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      expect(ingredientRadioButton).toBeInTheDocument();

      userEvent.type(textInput, 'tomatoes');
      userEvent.click(ingredientRadioButton);
      userEvent.click(submitButton);

      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=tomatoes');

      await waitFor(() => {
        const recipeCards = container.querySelectorAll(RECIPE_CARD);
        expect(recipeCards).toHaveLength(12);
      });
    });

    it('É possível realizar uma busca considerando apenas a primeira letra do nome da receita', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'fetch')
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.MEALS.FIRST_LETTER),
        });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const letterRadioButton = screen.getByLabelText(/letter/i);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      expect(letterRadioButton).toBeInTheDocument();

      userEvent.type(textInput, 's');
      userEvent.click(letterRadioButton);
      userEvent.click(submitButton);

      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?f=s');

      await waitFor(() => {
        const recipeCards = container.querySelectorAll(RECIPE_CARD);
        expect(recipeCards).toHaveLength(12);
      });
    });

    it('Direciona o usuário à página com os detalhes da receita caso a busca retorne apenas 1 resultado', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'fetch')
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.MEALS.SINGLE_RESULT),
        });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      act(() => userEvent.click(searchIcon));

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      await act(() => {
        userEvent.type(textInput, 'pizza');
        userEvent.click(submitButton);
      });

      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=pizza');
      expect(history.location.pathname).toBe('/meals/53014');
    });
  });
});
