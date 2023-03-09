import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import RECIPE_IN_PROGRESS_MOCKS from './mocks/RecipeInProgress.mock';
import App from '../App';

const RECIPE_INGREDIENTS = '[data-testid*=ingredient-step]';
const RECIPE_INGREDIENTS_CHECKBOXES = '[data-testid*=ingredient-step] input';
const FINISH_RECIPE_BUTTON = 'finish-recipe-btn';

describe('Testando o componente RecipeInProgress', () => {
  describe('Na rota /meals/:id-da-receita', () => {
    const ROUTE = '/meals/53014/in-progress';

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(RECIPE_IN_PROGRESS_MOCKS.MEALS),
      });
      localStorage.clear();
    });

    it('Os detalhes da receita são renderizados corretamente', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      act(() => history.push(ROUTE));

      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/lookup.php?i=53014');

      const recipePhoto = await screen.findByTestId('recipe-photo');
      const recipeTitle = await screen.findByTestId('recipe-title');
      const recipeCategory = await screen.findByTestId('recipe-category');
      const recipeShareButton = await screen.findByTestId('share-btn');
      const recipeFavoriteButton = await screen.findByTestId('favorite-btn');
      const recipeIngredients = await container.querySelectorAll('[data-testid*=ingredient-step]');
      const recipeInstructions = await screen.findByTestId('instructions');
      const recipeYouTubePreview = await screen.findByTestId('video');

      expect(recipePhoto).toBeInTheDocument();
      expect(recipeTitle).toBeInTheDocument();
      expect(recipeCategory).toBeInTheDocument();
      expect(recipeShareButton).toBeInTheDocument();
      expect(recipeFavoriteButton).toBeInTheDocument();
      expect(recipeIngredients).toHaveLength(11);
      expect(recipeInstructions).toBeInTheDocument();
      expect(recipeYouTubePreview).toBeInTheDocument();
    });

    it('O botão Finish recipe é renderizado corretamente', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      act(() => history.push(ROUTE));

      const finishRecipeButton = await screen.findByTestId(FINISH_RECIPE_BUTTON);

      expect(finishRecipeButton).toBeInTheDocument();
      expect(finishRecipeButton).toBeDisabled();
    });

    it('É possível marcar os ingredientes como concluídos', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeIngredients = await container.querySelectorAll(RECIPE_INGREDIENTS);
      let recipeIngredientsCheckboxes = await container
        .querySelectorAll(RECIPE_INGREDIENTS_CHECKBOXES);

      expect(recipeIngredientsCheckboxes[0]).not.toBeChecked();

      userEvent.click(recipeIngredients[0]);

      recipeIngredientsCheckboxes = await container
        .querySelectorAll(RECIPE_INGREDIENTS_CHECKBOXES);

      expect(recipeIngredientsCheckboxes[0]).toBeChecked();
    });

    it('Quando todos os ingredientes estiverem marcados como concluídos é possível adicionar a receita à lista de receitas concluídas', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeIngredientsCheckboxes = await container
        .querySelectorAll(RECIPE_INGREDIENTS_CHECKBOXES);

      recipeIngredientsCheckboxes.forEach(async (ingredientCheckbox) => {
        act(() => {
          userEvent.click(ingredientCheckbox);
        });
      });

      const finishRecipeButton = await screen.findByTestId(FINISH_RECIPE_BUTTON);

      expect(finishRecipeButton).not.toBeDisabled();

      act(() => {
        userEvent.click(finishRecipeButton);
      });

      expect(history.location.pathname).toBe('/done-recipes');
    });
  });

  describe('Na rota /drinks/:id-da-receita', () => {
    const ROUTE = '/drinks/178332/in-progress';

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(RECIPE_IN_PROGRESS_MOCKS.DRINKS),
      });
      localStorage.clear();
    });

    it('Os detalhes da receita são renderizados corretamente', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      act(() => history.push(ROUTE));

      expect(global.fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=178332');

      const recipePhoto = await screen.findByTestId('recipe-photo');
      const recipeTitle = await screen.findByTestId('recipe-title');
      const recipeCategory = await screen.findByTestId('recipe-category');
      const recipeShareButton = await screen.findByTestId('share-btn');
      const recipeFavoriteButton = await screen.findByTestId('favorite-btn');
      const recipeIngredients = await container.querySelectorAll(RECIPE_INGREDIENTS);
      const recipeInstructions = await screen.findByTestId('instructions');

      expect(recipePhoto).toBeInTheDocument();
      expect(recipeTitle).toBeInTheDocument();
      expect(recipeCategory).toBeInTheDocument();
      expect(recipeShareButton).toBeInTheDocument();
      expect(recipeFavoriteButton).toBeInTheDocument();
      expect(recipeIngredients).toHaveLength(7);
      expect(recipeInstructions).toBeInTheDocument();
    });

    it('O botão Finish recipe é renderizado corretamente', async () => {
      const { history } = renderWithRouterAndContext(<App />);

      act(() => history.push(ROUTE));

      const finishRecipeButton = await screen.findByTestId(FINISH_RECIPE_BUTTON);

      expect(finishRecipeButton).toBeInTheDocument();
      expect(finishRecipeButton).toBeDisabled();
    });

    it('É possível marcar os ingredientes como concluídos', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeIngredients = await container.querySelectorAll(RECIPE_INGREDIENTS);
      let recipeIngredientsCheckboxes = await container
        .querySelectorAll(RECIPE_INGREDIENTS_CHECKBOXES);

      expect(recipeIngredientsCheckboxes[0]).not.toBeChecked();

      userEvent.click(recipeIngredients[0]);

      recipeIngredientsCheckboxes = await container
        .querySelectorAll(RECIPE_INGREDIENTS_CHECKBOXES);

      expect(recipeIngredientsCheckboxes[0]).toBeChecked();
    });

    it('Quando todos os ingredientes estiverem marcados como concluídos é possível adicionar a receita à lista de receitas concluídas', async () => {
      const { container, history } = renderWithRouterAndContext(<App />);

      await act(() => history.push(ROUTE));

      const recipeIngredientsCheckboxes = await container
        .querySelectorAll(RECIPE_INGREDIENTS_CHECKBOXES);

      recipeIngredientsCheckboxes.forEach(async (ingredientCheckbox) => {
        act(() => {
          userEvent.click(ingredientCheckbox);
        });
      });

      const finishRecipeButton = await screen.findByTestId(FINISH_RECIPE_BUTTON);

      expect(finishRecipeButton).not.toBeDisabled();

      act(() => {
        userEvent.click(finishRecipeButton);
      });

      expect(history.location.pathname).toBe('/done-recipes');
    });
  });
});
