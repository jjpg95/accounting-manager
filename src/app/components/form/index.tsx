import React from "react";
import { Modal } from "../modal";

export interface FormProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  title: string;
  children: React.ReactNode;
}

export const Form = ({
  isModalOpen,
  handleCloseModal,
  title,
  children,
}: FormProps) => {
  return (
    <Modal isModalOpen={isModalOpen} onClose={handleCloseModal} title={title}>
      <form className="grid grid-cols-1 sm:grid-cols-1 gap-4">{children}</form>
    </Modal>
  );
};
