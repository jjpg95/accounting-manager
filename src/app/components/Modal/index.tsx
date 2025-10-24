import React, { ReactNode } from 'react';

export interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const MODAL_CLASSES =
  'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50';

export const Modal = ({
  isModalOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  if (!isModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={MODAL_CLASSES}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-2/4 md:w-96 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4">
          <div className="w-6" />
          <h2 className="text-xl font-semibold ">{title}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 self-end cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={onClose}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        {children}
      </div>
    </div>
  );
};
