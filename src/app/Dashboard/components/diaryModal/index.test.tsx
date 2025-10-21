import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiaryModal } from "./index";

jest.mock("@/app/components/modal", () => ({
  Modal: ({
    children,
    onClose,
    isOpen,
  }: {
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
  }) => {
    if (!isOpen) return null;

    return (
      <div data-testid="mock-modal">
        <button onClick={onClose} data-testid="mock-close-button">
          Close Mock
        </button>
        {children}
      </div>
    );
  },
}));

describe("DiaryModal", () => {
  const mockSetIsModalOpen = jest.fn();
  const defaultProps = {
    isModalOpen: true,
    setIsModalOpen: mockSetIsModalOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getInputs = () => ({
    liquid: screen.getByTestId("cash-input") as HTMLInputElement,
    creditCard: screen.getByTestId("credit-card-input") as HTMLInputElement,
    expenses: screen.getByTestId("expenses-input") as HTMLInputElement,
  });

  const getTotalInput = () =>
    screen.getByTestId("total-input") as HTMLInputElement;

  it("should render the modal with all four inputs when it is open", () => {
    render(<DiaryModal {...defaultProps} />);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();

    const { liquid, creditCard, expenses } = getInputs();
    expect(liquid).toBeInTheDocument();
    expect(creditCard).toBeInTheDocument();
    expect(expenses).toBeInTheDocument();
    expect(getTotalInput()).toBeInTheDocument();
  });

  it("should close the modal and reset totalNet when handleCloseModal is called", () => {
    render(<DiaryModal {...defaultProps} />);

    const { liquid } = getInputs();
    fireEvent.change(liquid, { target: { value: "100" } });
    expect(getTotalInput().value).toBe("100");

    fireEvent.click(screen.getByTestId("mock-close-button"));

    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("should correctly calculate totalNet (cash + card - expenses)", () => {
    render(<DiaryModal {...defaultProps} />);
    const { liquid, creditCard, expenses } = getInputs();

    fireEvent.change(liquid, { target: { value: "100" } });
    expect(getTotalInput().value).toBe("100");

    fireEvent.change(creditCard, { target: { value: "50" } });
    expect(getTotalInput().value).toBe("150");

    fireEvent.change(expenses, { target: { value: "25" } });
  });

  it("should treat non-numeric or empty inputs as zero (0)", () => {
    render(<DiaryModal {...defaultProps} />);
    const { creditCard, expenses } = getInputs();

    fireEvent.change(creditCard, { target: { value: "200" } });
    expect(getTotalInput().value).toBe("200");

    fireEvent.change(expenses, { target: { value: "" } });
    expect(getTotalInput().value).toBe("200");

    fireEvent.change(expenses, { target: { value: "expense" } });
    expect(getTotalInput().value).toBe("200");
  });

  it("should update the total when a field is cleared (reset to zero)", () => {
    render(<DiaryModal {...defaultProps} />);
    const { liquid } = getInputs();

    fireEvent.change(liquid, { target: { value: "100" } });
    expect(getTotalInput().value).toBe("100");

    fireEvent.change(liquid, { target: { value: "" } });
    expect(getTotalInput().value).toBe("0");
  });
});
