import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import RECIPE_IN_PROGRESS_MOCKS from './mocks/RecipeInProgress.mock';
import App from '../App';

const START_RECIPE_BTN = 'start-recipe-btn';
const FAVORITE_BTN = 'favorite-btn';

describe('Testando o componente RecipeDetails', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(RECIPE_IN_PROGRESS_MOCKS.MEALS),
    });
  });

  describe('Na rota /meals/:id-da-receita', () => {
    const ROUTE = '/meals/53014';

    it('Os detalhes da receita são renderizados corretamente', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/lookup.php?i=53014');

      const recipePhoto = screen.queryAllByTestId('recipe-photo');
      const recipeTitle = screen.queryByTestId('recipe-title');
      const recipeCategory = screen.queryByTestId('recipe-category');
      const recipeShareButton = screen.queryByTestId('share-btn');
      const recipeFavoriteButton = screen.queryByTestId(FAVORITE_BTN);
      const recipeIngredients = container.querySelectorAll('[data-testid*=ingredient-name-and-measure]');
      const recipeInstructions = screen.queryByTestId('instructions');
      const recipeYouTubePreview = screen.queryByTestId('video');

      expect(recipePhoto.length).toBeGreaterThanOrEqual(1);
      expect(recipeTitle).toBeInTheDocument();
      expect(recipeCategory).toBeInTheDocument();
      expect(recipeShareButton).toBeInTheDocument();
      expect(recipeFavoriteButton).toBeInTheDocument();
      expect(recipeIngredients).toHaveLength(11);
      expect(recipeInstructions).toBeInTheDocument();
      expect(recipeYouTubePreview).toBeInTheDocument();
    });

    it('O botão Start Recipe é renderizado corretamente', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeStartButton = screen.queryByTestId(START_RECIPE_BTN);

      expect(recipeStartButton).toBeInTheDocument();
    });

    it('Ao clicar no botão Start Recipe o usuário é direcionado à pagina de receita em progresso', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeStartButton = screen.queryByTestId(START_RECIPE_BTN);

      await act(() => userEvent.click(recipeStartButton));

      expect(history.location.pathname).toBe(`${ROUTE}/in-progress`);
    });

    it('Caso o usuário já tenha iniciado a receita o botão Continue Recipe é renderizado no lugar do botão Start Recipe', async () => {
      localStorage.setItem('inProgressRecipes', JSON.stringify(
        {
          meals: {
            53014: [
              { name: 'Water', measure: '150ml', done: true },
              { name: 'Sugar', measure: '1 tsp ', done: false },
              { name: 'Yeast', measure: '15g', done: false },
              { name: 'Plain Flour', measure: '225g', done: false },
              { name: 'Salt', measure: '1 1/2 tsp ', done: false },
              { name: 'Olive Oil', measure: 'Drizzle', done: false },
              { name: 'Passata', measure: '80g', done: false },
              { name: 'Mozzarella', measure: '70g', done: false },
              { name: 'Oregano', measure: 'Peeled and Sliced', done: false },
              { name: 'Basil', measure: 'Leaves', done: false },
              { name: 'Black Pepper', measure: 'Pinch', done: false }],
          },
        },
      ));

      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeStartButton = screen.queryByTestId(START_RECIPE_BTN);

      expect(recipeStartButton).not.toHaveTextContent(/start recipe/i);
      expect(recipeStartButton).toHaveTextContent(/continue recipe/i);
    });

    it('É possível favoritar/desfavoritar a receita', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toHaveLength(0);

      const recipeFavoriteButton = screen.queryByTestId(FAVORITE_BTN);

      act(() => userEvent.click(recipeFavoriteButton));

      expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toHaveLength(1);

      act(() => userEvent.click(recipeFavoriteButton));

      expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toHaveLength(0);
    });

    it('É possível voltar à rota anterior ao clicar no botão "voltar"', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push('/meals'));

      const firstRecipe = screen.queryByTestId('0-recipe-card');

      expect(firstRecipe).toBeInTheDocument();

      await act(() => userEvent.click(firstRecipe));

      const recipeGoBackButton = screen.queryByTestId('go-back-btn');

      expect(recipeGoBackButton).toBeInTheDocument();

      await act(() => userEvent.click(recipeGoBackButton));

      expect(history.location.pathname).toBe('/meals');
    });
  });

  describe('Na rota /drinks/:id-da-receita', () => {
    const ROUTE = '/drinks/178332';

    it('Os detalhes da receita são renderizados corretamente', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      expect(global.fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=178332');

      const recipePhoto = screen.queryAllByTestId('recipe-photo');
      const recipeTitle = screen.queryByTestId('recipe-title');
      const recipeCategory = screen.queryByTestId('recipe-category');
      const recipeShareButton = screen.queryByTestId('share-btn');
      const recipeFavoriteButton = screen.queryByTestId(FAVORITE_BTN);
      const recipeIngredients = container.querySelectorAll('[data-testid*=ingredient-name-and-measure]');
      const recipeInstructions = screen.queryByTestId('instructions');

      expect(recipePhoto.length).toBeGreaterThanOrEqual(1);
      expect(recipeTitle).toBeInTheDocument();
      expect(recipeCategory).toBeInTheDocument();
      expect(recipeShareButton).toBeInTheDocument();
      expect(recipeFavoriteButton).toBeInTheDocument();
      expect(recipeIngredients).toHaveLength(11);
      expect(recipeInstructions).toBeInTheDocument();
    });

    it('O botão Start Recipe é renderizado corretamente', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeStartButton = screen.queryByTestId(START_RECIPE_BTN);

      expect(recipeStartButton).toBeInTheDocument();
    });

    it('Ao clicar no botão Start Recipe o usuário é direcionado à pagina de receita em progresso', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeStartButton = screen.queryByTestId(START_RECIPE_BTN);

      await act(() => userEvent.click(recipeStartButton));

      expect(history.location.pathname).toBe(`${ROUTE}/in-progress`);
    });

    it('Caso o usuário já tenha iniciado a receita o botão Continue Recipe é renderizado no lugar do botão Start Recipe', async () => {
      localStorage.setItem('inProgressRecipes', JSON.stringify(
        {
          drinks: {
            178332: [
              { name: 'Watermelon', measure: '1/2 cup', done: false },
              { name: 'Mint', measure: '5', done: false },
              { name: 'Grapefruit Juice', measure: '1/3 Cup', done: false },
              { name: 'Lime', measure: 'Juice of 1/2', done: true },
              { name: 'Tequila', measure: '1 shot', done: false },
              { name: 'Watermelon', measure: 'Garnish with', done: false },
              { name: 'Mint', measure: 'Garnish with', done: false },
            ],
          },
        },
      ));

      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeStartButton = screen.queryByTestId(START_RECIPE_BTN);

      expect(recipeStartButton).not.toHaveTextContent(/start recipe/i);
      expect(recipeStartButton).toHaveTextContent(/continue recipe/i);
    });

    it('É possível favoritar/desfavoritar a receita', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toHaveLength(0);

      const recipeFavoriteButton = screen.queryByTestId(FAVORITE_BTN);

      act(() => userEvent.click(recipeFavoriteButton));

      expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toHaveLength(1);

      act(() => userEvent.click(recipeFavoriteButton));

      expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toHaveLength(0);
    });

    it('É possível voltar à rota anterior ao clicar no botão "voltar"', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      await act(() => history.push('/meals'));

      const firstRecipe = screen.queryByTestId('0-recipe-card');

      expect(firstRecipe).toBeInTheDocument();

      await act(() => userEvent.click(firstRecipe));

      const recipeGoBackButton = screen.queryByTestId('go-back-btn');

      expect(recipeGoBackButton).toBeInTheDocument();

      await act(() => userEvent.click(recipeGoBackButton));

      expect(history.location.pathname).toBe('/meals');
    });
  });
});
