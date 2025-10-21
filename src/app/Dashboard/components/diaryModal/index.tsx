import { Modal } from "@/app/components/modal";
import { useRef, useState } from "react";

interface DiaryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const INPUT_CLASSES = "border rounded-md p-2 max-w-40";

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
    const cashValue = parseFloat(cashRef.current?.value || "0") || 0;
    const creditCardValue =
      parseFloat(creditCardRef.current?.value || "0") || 0;
    const expensesValue = parseFloat(expensesRef.current?.value || "0") || 0;
    const netTotal = cashValue + creditCardValue - expensesValue;
    setTotalNet(netTotal);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
      <form className="grid grid-cols-2 sm:grid-cols-1 gap-4">
        <input
          className={INPUT_CLASSES}
          placeholder="Efectivo"
          onChange={handleNetChange}
          ref={cashRef}
          data-testid="cash-input"
        />
        <input
          className={INPUT_CLASSES}
          placeholder="Tarjeta"
          onChange={handleNetChange}
          ref={creditCardRef}
          data-testid="credit-card-input"
        />
        <input
          className={INPUT_CLASSES}
          placeholder="Gastos"
          onChange={handleNetChange}
          ref={expensesRef}
          data-testid="expenses-input"
        />
        <input
          className={INPUT_CLASSES}
          value={totalNet}
          disabled={true}
          data-testid="total-input"
        />
      </form>
    </Modal>
  );
};
