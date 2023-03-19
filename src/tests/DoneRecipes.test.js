import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';

const DONE_RECIPE_CARD = '.done-recipe-card';

describe('Testando o componente DoneRecipes', () => {
  const ROUTE = '/done-recipes';

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

  it('É possível filtrar as receitas concluídas por categoria clicando nos botões de filtro', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify(
      [
        {
          alcoholicOrNot: '',
          category: 'Seafood',
          doneDate: '2023-03-19T21:41:21.741Z',
          id: '53065',
          image: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg',
          name: 'Sushi',
          nationality: 'Japanese',
          tags: [],
          type: 'meal',
        },
        {
          alcoholicOrNot: 'Alcoholic',
          category: 'Ordinary Drink',
          doneDate: '2023-03-19T21:41:36.780Z',
          id: '11415',
          image: 'https://www.thecocktaildb.com/images/media/drink/8cl9sm1582581761.jpg',
          name: 'Gin Sling',
          nationality: '',
          tags: [],
          type: 'drink',
        },
      ],
    ));

    const { container, history } = renderWithRouterAndContext(<App />);

    await act(() => history.push(ROUTE));

    const filterByAllBtn = screen.queryByTestId('filter-by-all-btn');
    const filterByMealBtn = screen.queryByTestId('filter-by-meal-btn');
    const filterByDrinkBtn = screen.queryByTestId('filter-by-drink-btn');

    let recipeCards = container.querySelectorAll(DONE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(2);

    act(() => userEvent.click(filterByMealBtn));
    recipeCards = container.querySelectorAll(DONE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(1);

    act(() => userEvent.click(filterByDrinkBtn));
    recipeCards = container.querySelectorAll(DONE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(1);

    act(() => userEvent.click(filterByAllBtn));
    recipeCards = container.querySelectorAll(DONE_RECIPE_CARD);
    expect(recipeCards).toHaveLength(2);
  });

  it('É renderizada a mensagem "No recipes found" caso o usuário não tenha concluído nenhuma receita', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    await act(() => history.push(ROUTE));

    expect(screen.queryByText(/no recipes found/i)).toBeInTheDocument();
  });
});
