import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';

const FAVORITE_RECIPE_CARD = '.favorite-recipe-card';

const MOCK_FAVORITED_RECIPES = [
  {
    id: '53013',
    type: 'meal',
    nationality: 'American',
    category: 'Beef',
    alcoholicOrNot: '',
    name: 'Big Mac',
    image: 'https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg',
  },
  {
    id: '11418',
    type: 'drink',
    nationality: '',
    category: 'Ordinary Drink',
    alcoholicOrNot: 'Alcoholic',
    name: 'Gin Squirt',
    image: 'https://www.thecocktaildb.com/images/media/drink/xrbhz61504883702.jpg',
  },
];

describe('Testando o componente FavoriteRecipes', () => {
  const ROUTE = '/favorite-recipes';

  beforeEach(() => localStorage.clear());

  it('São renderizados botões que permitem filtrar as receitas por tipo de receita (All, Meals ou Drinks)', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push(ROUTE));

    const filterByAllBtn = screen.queryByTestId('filter-by-all-btn');
    const filterByMealBtn = screen.queryByTestId('filter-by-meal-btn');
    const filterByDrinkBtn = screen.queryByTestId('filter-by-drink-btn');

    expect(filterByAllBtn).toBeInTheDocument();
    expect(filterByMealBtn).toBeInTheDocument();
    expect(filterByDrinkBtn).toBeInTheDocument();
  });

  it('É renderizada a mensagem "No recipes found" caso o usuário não tenha favoritado nenhuma receita', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push(ROUTE));

    expect(screen.queryByText(/no recipes found/i)).toBeInTheDocument();
  });

  it('Receitas favoritadas pelo usuário são renderizadas corretamente', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAVORITED_RECIPES));

    const { container, history } = renderWithRouterAndContext(<App />);

    await act(() => history.push(ROUTE));

    const recipeCards = container.querySelectorAll(FAVORITE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(2);
  });

  it('É possível filtrar as receitas favoritadas por categoria clicando nos botões de filtro', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAVORITED_RECIPES));

    const { container, history } = renderWithRouterAndContext(<App />);

    await act(() => history.push(ROUTE));

    const filterByAllBtn = screen.queryByTestId('filter-by-all-btn');
    const filterByMealBtn = screen.queryByTestId('filter-by-meal-btn');
    const filterByDrinkBtn = screen.queryByTestId('filter-by-drink-btn');

    let recipeCards = container.querySelectorAll(FAVORITE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(2);

    act(() => userEvent.click(filterByMealBtn));
    recipeCards = container.querySelectorAll(FAVORITE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(1);

    act(() => userEvent.click(filterByDrinkBtn));
    recipeCards = container.querySelectorAll(FAVORITE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(1);

    act(() => userEvent.click(filterByAllBtn));
    recipeCards = container.querySelectorAll(FAVORITE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(2);
  });

  it('É possível remover uma receita dos favoritos ao clicar no botão toggleFavorite', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAVORITED_RECIPES));

    const { container, history } = renderWithRouterAndContext(<App />);

    await act(() => history.push(ROUTE));

    const toggleFavoriteBtns = container.querySelectorAll('[data-testid*=horizontal-favorite-btn]');
    expect(toggleFavoriteBtns).toHaveLength(2);

    let recipeCards = container.querySelectorAll(FAVORITE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(2);

    act(() => userEvent.click(toggleFavoriteBtns[0]));

    recipeCards = container.querySelectorAll(FAVORITE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(1);
  });
});
