"use client";

import { useRef, useState } from "react";
import { Modal } from "../components/modal";

const INPUT_CLASSES = "border rounded-md p-2 max-w-40";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalNet, setTotalNet] = useState(0);
  const liquidReference = useRef<HTMLInputElement>(null);
  const targetReference = useRef<HTMLInputElement>(null);
  const expensesReference = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTotalNet(0);
    setIsModalOpen(false);
  };

  const handleNetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const liquidValue = parseFloat(liquidReference.current?.value || "0");
    const targetValue = parseFloat(targetReference.current?.value || "0");
    const expensesValue = parseFloat(expensesReference.current?.value || "0");
    const netTotal = liquidValue + targetValue - expensesValue;
    setTotalNet(netTotal);
  };

  return (
    <main className="flex flex-col sm:flex-row flex-wrap pt-10 justify-center">
      <section className="flex flex-col w-full sm:w-1/2 pb-10 items-center gap-4">
        <button onClick={handleOpenModal}>Añadir registro</button>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <form className="grid grid-cols-2 sm:grid-cols-1 gap-4">
            <input
              className={INPUT_CLASSES}
              placeholder="Efectivo"
              onChange={handleNetChange}
              ref={liquidReference}
            />
            <input
              className={INPUT_CLASSES}
              placeholder="Tarjeta"
              onChange={handleNetChange}
              ref={targetReference}
            />
            <input
              className={INPUT_CLASSES}
              placeholder="Gastos"
              onChange={handleNetChange}
              ref={expensesReference}
            />
            <input className={INPUT_CLASSES} value={totalNet} disabled={true} />
          </form>
        </Modal>
      </section>
    </main>
  );
}
