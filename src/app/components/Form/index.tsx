import React from 'react';
import { Modal } from '../Modal';

export interface FormProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  children: React.ReactNode;
}

export const Form = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  title,
  children,
}: FormProps) => {
  return (
    <Modal isModalOpen={isModalOpen} onClose={handleCloseModal} title={title}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-1 gap-4"
      >
        {children}

        <div className="grid grid-cols-2 place-items-center place-content-between pt-4">
          <button
            type="submit"
            className="bg-blue-600 p-3 border rounded-xl text-white w-fit"
          >
            Guardar
          </button>
          <button className="p-3 border rounded-xl" onClick={handleCloseModal}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};
