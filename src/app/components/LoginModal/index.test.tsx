import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginModal } from './index';

jest.mock('@/app/components/Form', () => {
  return {
    Form: ({ isModalOpen, handleCloseModal, title, children }: any) => (
      <div
        data-testid="mock-form"
        data-isopen={String(isModalOpen)}
        data-title={title}
      >
        <button data-testid="mock-close-btn" onClick={handleCloseModal}>
          Close
        </button>
        {children}
      </div>
    ),
  };
});

describe('LoginModal component', () => {
  it('renders the Form with provided title, isModalOpen and children', () => {
    const setIsModalOpen = jest.fn();
    render(<LoginModal isModalOpen={true} setIsModalOpen={setIsModalOpen} />);

    const form = screen.getByTestId('mock-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('data-title', 'Login');
    expect(form).toHaveAttribute('data-isopen', 'true');
    expect(form.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(form.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('calls setIsModalOpen(false) when handleCloseModal is invoked', () => {
    const setIsModalOpen = jest.fn();
    render(<LoginModal isModalOpen={true} setIsModalOpen={setIsModalOpen} />);

    fireEvent.click(screen.getByTestId('mock-close-btn'));
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });
});
