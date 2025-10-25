import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginModal } from './index';

let logSpy: jest.SpyInstance;

jest.mock('@/app/components/Form', () => ({
  Form: ({
    isModalOpen,
    handleCloseModal,
    handleSubmit,
    title,
    children,
  }: any) => (
    <div data-testid="form-mock">
      {isModalOpen && (
        <form onSubmit={handleSubmit}>
          <h2>{title}</h2>
          {children}
          <button type="button" onClick={handleCloseModal}>
            Close
          </button>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  ),
}));

global.fetch = jest.fn();

describe('LoginModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renders the modal when isModalOpen is true', () => {
    render(<LoginModal isModalOpen={true} setIsModalOpen={jest.fn()} />);
    expect(screen.getByTestId('form-mock')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('does not render the modal when isModalOpen is false', () => {
    render(<LoginModal isModalOpen={false} setIsModalOpen={jest.fn()} />);
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('calls setIsModalOpen with false when close button is clicked', () => {
    const setIsModalOpen = jest.fn();
    render(<LoginModal isModalOpen={true} setIsModalOpen={setIsModalOpen} />);

    fireEvent.click(screen.getByText('Close'));
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('handles login error', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<LoginModal isModalOpen={true} setIsModalOpen={jest.fn()} />);

    fireEvent.submit(
      screen.getByRole('button', { name: 'Submit' }).closest('form')!
    );

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Login error:',
        expect.any(Error)
      );
    });

    consoleLogSpy.mockRestore();
  });
});
