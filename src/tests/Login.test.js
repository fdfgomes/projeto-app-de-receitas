import React from 'react';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import Login from '../pages/Login';
import renderWithRouter from './helpers/RenderWithRouter';

describe('Testes da página de Login', () => {
  it('deveria ter 2 inputs e 1 botão', () => {
    render(<Login />);

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit-btn')).toBeInTheDocument();
  });

  it('o botão deve estar desabilitado e quando os inputs forem preenchidos, ele habilita. E se clicado, deve redirecionar para a pagina de receitas', async () => {
    const { history } = renderWithRouter(<Login />);

    const sendButton = screen.getByTestId('login-submit-btn');

    expect(sendButton).toBeDisabled();

    userEvent.type(screen.getByTestId('email-input'), 'felipelopesfavato@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '123456789');

    expect(sendButton).toBeEnabled();

    await act(() => userEvent.click(sendButton));

    const { pathname } = history.location;

    expect(pathname).toBe('/meals');
  });
});
