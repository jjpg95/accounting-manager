import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './';

describe('Modal', () => {
  it('should not call onClose when clicking inside the modal content', () => {
    const mockOnClose = jest.fn();

    render(
      <Modal isModalOpen={true} onClose={mockOnClose} title="Test Modal">
        <div data-testid="modal-content">Content</div>
      </Modal>
    );

    const content = screen.getByTestId('modal-content');

    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should call onClose when clicking on the overlay', () => {
    const mockOnClose = jest.fn();

    render(
      <Modal isModalOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog');

    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
