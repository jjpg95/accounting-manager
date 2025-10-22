import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './';

jest.mock('./components/diaryModal', () => ({
  DiaryModal: ({ isModalOpen }: { isModalOpen: boolean }) =>
    isModalOpen ? (
      <div data-testid="mock-diary-modal">Modal abierto</div>
    ) : null,
}));

describe('Dashboard', () => {
  it('should open DiaryModal when button is clicked', () => {
    render(<Dashboard />);

    expect(screen.queryByTestId('mock-diary-modal')).toBeNull();

    fireEvent.click(screen.getByText('Añadir registro'));

    expect(screen.getByTestId('mock-diary-modal')).toBeInTheDocument();
  });
});
