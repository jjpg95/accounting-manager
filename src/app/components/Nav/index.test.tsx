import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from './';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import AuthInitializer from '../AuthInitializer';
const ctx = require('@/app/context/LoginModalContext');

const mockSetIsLoginModalOpen = jest.fn();

jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      const { src, alt, width, height } = props;
      return <img src={src} alt={alt} width={width} height={height} />;
    },
  };
});

jest.mock('@/app/context/LoginModalContext', () => ({
  useLoginModal: jest.fn(),
}));

jest.mock('@/app/hooks/useSetUser', () => ({
  useSetUser: jest.fn().mockImplementation(() => jest.fn()),
}));

const rootReducer = (state = { user: { isAuthenticated: false } }) => state;

const renderComponent = (isAuthenticated: boolean) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      user: {
        isAuthenticated,
      },
    },
  });

  return render(
    <Provider store={store}>
      <AuthInitializer>
        <Nav />
      </AuthInitializer>
    </Provider>
  );
};

global.fetch = jest.fn();

describe('Nav', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    (ctx.useLoginModal as jest.Mock).mockReturnValue({
      setIsLoginModalOpen: mockSetIsLoginModalOpen,
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('renders the login image button', () => {
    renderComponent(false);

    const img = screen.getByAltText('Login') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/notLogged.svg');
    expect(img.width).toBe(40);
    expect(img.height).toBe(40);
  });

  it('opens the login modal when the login button is clicked', () => {
    renderComponent(false);

    const button = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(button);

    expect(mockSetIsLoginModalOpen).toHaveBeenCalledWith(true);
  });

  it('renders the logged in image button when user is authenticated', () => {
    renderComponent(true);

    const img = screen.getByAltText('User Logged In') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/loggedNav.svg');
    expect(img.width).toBe(40);
    expect(img.height).toBe(40);
  });

  it('calls logout function when the logged in button is clicked', () => {
    renderComponent(true);

    const button = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
    });
  });

  it('handles logout failure gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    renderComponent(true);

    const button = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
    });
  });
});
