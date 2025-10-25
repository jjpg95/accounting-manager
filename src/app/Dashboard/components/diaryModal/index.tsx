import { Form } from '@/app/components/Form';
import React, { forwardRef, useRef, useState } from 'react';

interface DiaryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

interface NumericInputProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testId: string;
}

export const INPUT_CLASSES = 'border rounded-md p-2';

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ placeholder, onChange, testId }, ref) => {
    return (
      <input
        type="number"
        className={INPUT_CLASSES}
        placeholder={placeholder}
        onChange={onChange}
        ref={ref}
        data-testid={`${testId}-input`}
      />
    );
  }
);

export const DiaryModal = ({
  isModalOpen,
  setIsModalOpen,
}: DiaryModalProps) => {
  const [totalNet, setTotalNet] = useState(0);
  const cashRef = useRef<HTMLInputElement>(null);
  const creditCardRef = useRef<HTMLInputElement>(null);
  const expensesRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTotalNet(0);
  };

  const handleNetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cashValue = parseFloat(cashRef.current?.value || '0');
    const creditCardValue = parseFloat(creditCardRef.current?.value || '0');
    const expensesValue = parseFloat(expensesRef.current?.value || '0');
    const netTotal = cashValue + creditCardValue - expensesValue;
    setTotalNet(netTotal);
  };

  return (
    <Form
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      handleSubmit={() => {}}
      title="Registro diario"
    >
      <NumericInput
        placeholder="Efectivo"
        onChange={handleNetChange}
        ref={cashRef}
        testId="cash"
      />
      <NumericInput
        placeholder="Tarjeta"
        onChange={handleNetChange}
        ref={creditCardRef}
        testId="credit-card"
      />
      <NumericInput
        placeholder="Gastos"
        onChange={handleNetChange}
        ref={expensesRef}
        testId="expenses"
      />
      <input
        className={INPUT_CLASSES}
        value={totalNet}
        disabled={true}
        data-testid="total-input"
      />
    </Form>
  );
};
