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

// https://stackoverflow.com/questions/55088482/jest-not-implemented-window-alert
beforeAll(() => {
  window.alert = () => null;
});

describe('Testando o componente SearchBar', () => {
  it('É renderizado com um input de texto, 3 inputs do tipo radio e um botão de enviar os dados do formulário ao clicar no ícone de pesquisa do componente Header', async () => {
    const { container, history } = renderWithRouterAndContext(<App />);

    act(() => history.push('/meals'));

    const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

    userEvent.click(searchIcon);

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

      userEvent.click(searchIcon);

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

      userEvent.click(searchIcon);

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

      userEvent.click(searchIcon);

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const letterRadioButton = screen.getByLabelText(/letter/i);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      expect(letterRadioButton).toBeInTheDocument();

      userEvent.type(textInput, TEXT_INPUT_VALUE);
      userEvent.click(letterRadioButton);
      userEvent.click(submitButton);

      expect(global.fetch).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${TEXT_INPUT_VALUE}`);

      await waitFor(() => {
        const recipeCards = container.querySelectorAll(RECIPE_CARD);
        expect(recipeCards).toHaveLength(12);
      });
    });

    it('Exibe mensagem de alerta caso o usuário selecione a busca pela primeira letra do nome da bebida e digite mais de um caractere no input de texto', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'alert');

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      userEvent.click(searchIcon);

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const letterRadioButton = screen.getByLabelText(/letter/i);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      expect(letterRadioButton).toBeInTheDocument();

      userEvent.type(textInput, 'vvv');
      userEvent.click(letterRadioButton);
      userEvent.click(submitButton);

      expect(global.alert).toHaveBeenCalled();
    });

    it('Exibe mensagem de alerta caso a busca não retorne nenhum resultado', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      const TEXT_INPUT_VALUE = 'coca-cola';

      jest.spyOn(global, 'alert');
      jest.spyOn(global, 'fetch')
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.DRINKS.NO_RESULTS),
        });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      userEvent.click(searchIcon);

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      await act(() => {
        userEvent.type(textInput, TEXT_INPUT_VALUE);
        userEvent.click(submitButton);
      });

      expect(global.fetch).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${TEXT_INPUT_VALUE}`);
      expect(global.alert).toHaveBeenCalled();
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

      userEvent.click(searchIcon);

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

      userEvent.click(searchIcon);

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

      userEvent.click(searchIcon);

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

      userEvent.click(searchIcon);

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

    it('Exibe mensagem de alerta caso o usuário selecione a busca pela primeira letra do nome da receita e digite mais de um caractere no input de texto', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'alert');

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      userEvent.click(searchIcon);

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const letterRadioButton = screen.getByLabelText(/letter/i);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      expect(letterRadioButton).toBeInTheDocument();

      userEvent.type(textInput, 'sss');
      userEvent.click(letterRadioButton);
      userEvent.click(submitButton);

      expect(global.alert).toHaveBeenCalled();
    });

    it('Exibe mensagem de alerta caso a busca não retorne nenhum resultado', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'alert');
      jest.spyOn(global, 'fetch')
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.MEALS.NO_RESULTS),
        });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      userEvent.click(searchIcon);

      const textInput = screen.getByTestId(SEARCH_INPUT);
      const submitButton = screen.getByTestId(SEARCH_SUBMIT_BUTTON);

      await act(() => {
        userEvent.type(textInput, 'lasanha');
        userEvent.click(submitButton);
      });

      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=lasanha');
      expect(global.alert).toHaveBeenCalled();
    });

    it('Direciona o usuário à página com os detalhes da receita caso a busca retorne apenas 1 resultado', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      jest.spyOn(global, 'fetch')
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(SEARCH_BAR_MOCKS.MEALS.SINGLE_RESULT),
        });

      act(() => history.push(ROUTE));

      const searchIcon = screen.getByTestId(SEARCH_TOP_BTN);

      userEvent.click(searchIcon);

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
