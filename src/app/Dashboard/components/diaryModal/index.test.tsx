import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiaryModal, NumericInput } from './index';
import { Modal, ModalProps } from '@/app/components/modal';
import { FormProps } from '@/app/components/form';

jest.mock('@/app/components/modal', () => ({
  Modal: ({ children, onClose, title, isModalOpen }: ModalProps) => {
    if (!isModalOpen) return null;

    return (
      <div data-testid="mock-modal">
        <h1>{title}</h1>
        <button onClick={onClose} data-testid="mock-close-button">
          Close Mock
        </button>
        {children}
      </div>
    );
  },
}));

jest.mock('@/app/components/form', () => ({
  Form: ({ isModalOpen, handleCloseModal, title, children }: FormProps) => {
    if (!isModalOpen) return null;

    return (
      <Modal isModalOpen={isModalOpen} onClose={handleCloseModal} title={title}>
        <form>{children}</form>
      </Modal>
    );
  },
}));

describe('DiaryModal', () => {
  const mockSetIsModalOpen = jest.fn();
  const defaultProps = {
    isModalOpen: true,
    setIsModalOpen: mockSetIsModalOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getInputs = () => ({
    liquid: screen.getByTestId('cash-input') as HTMLInputElement,
    creditCard: screen.getByTestId('credit-card-input') as HTMLInputElement,
    expenses: screen.getByTestId('expenses-input') as HTMLInputElement,
  });

  const getTotalInput = () =>
    screen.getByTestId('total-input') as HTMLInputElement;

  it('should render the modal with all four inputs when it is open', () => {
    render(<DiaryModal {...defaultProps} />);

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

    const { liquid, creditCard, expenses } = getInputs();
    expect(liquid).toBeInTheDocument();
    expect(creditCard).toBeInTheDocument();
    expect(expenses).toBeInTheDocument();
    expect(getTotalInput()).toBeInTheDocument();
  });

  it('should call setIsModalOpen(false) when the modal is closed', () => {
    render(<DiaryModal {...defaultProps} />);

    const closeButton = screen.getByTestId('mock-close-button');
    fireEvent.click(closeButton);

    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('should correctly calculate the total net value', () => {
    render(
      <DiaryModal isModalOpen={true} setIsModalOpen={mockSetIsModalOpen} />
    );

    const cashInput = screen.getByTestId('cash-input');
    const creditCardInput = screen.getByTestId('credit-card-input');
    const expensesInput = screen.getByTestId('expenses-input');
    const totalInput = screen.getByTestId('total-input');

    fireEvent.change(cashInput, { target: { value: '100' } });
    fireEvent.change(creditCardInput, { target: { value: '50' } });
    fireEvent.change(expensesInput, { target: { value: '30' } });

    expect(totalInput).toHaveValue('120');
  });

  it('should reset total net value when modal is closed', () => {
    const { rerender } = render(
      <DiaryModal isModalOpen={true} setIsModalOpen={mockSetIsModalOpen} />
    );

    const cashInput = screen.getByTestId('cash-input');
    const creditCardInput = screen.getByTestId('credit-card-input');
    const expensesInput = screen.getByTestId('expenses-input');
    const totalInput = screen.getByTestId('total-input');
    fireEvent.change(cashInput, { target: { value: '200' } });
    fireEvent.change(creditCardInput, { target: { value: '100' } });
    fireEvent.change(expensesInput, { target: { value: '50' } });

    expect(totalInput).toHaveValue('250');
    const closeButton = screen.getByTestId('mock-close-button');
    fireEvent.click(closeButton);

    rerender(
      <DiaryModal isModalOpen={true} setIsModalOpen={mockSetIsModalOpen} />
    );
    expect(getTotalInput()).toHaveValue('0');
  });

  it('should treat empty cash input as 0 when calculating total', () => {
    render(<DiaryModal isModalOpen={true} setIsModalOpen={jest.fn()} />);

    const creditCardInput = screen.getByTestId('credit-card-input');
    const expensesInput = screen.getByTestId('expenses-input');
    const totalInput = screen.getByTestId('total-input');

    fireEvent.change(creditCardInput, { target: { value: '100' } });
    fireEvent.change(expensesInput, { target: { value: '40' } });

    expect(totalInput).toHaveValue('60');
  });

  describe('NumericInput', () => {
    it('renders correctly and calls onChange', () => {
      const handleChange = jest.fn();
      render(
        <NumericInput
          placeholder="Test input"
          onChange={handleChange}
          testId="test"
          ref={null}
        />
      );

      const input = screen.getByTestId('test-input') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      fireEvent.change(input, { target: { value: '42' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });
});
