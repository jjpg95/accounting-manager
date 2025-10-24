import { Form } from '@/app/components/Form';
import { INPUT_CLASSES } from '@/app/Dashboard/components/diaryModal';
import React from 'react';

interface LoginModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const LoginModal = ({
  isModalOpen,
  setIsModalOpen,
}: LoginModalProps) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'pepeju95@gmail.com',
        pass: '1234',
      }),
    })
      .then((response) => {
        response.json().then(() => {
          console.log('Successful login.');
        });
      })
      .catch((error) => {
        console.log('Login error:', error);
      });
  };

  return (
    <Form
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      handleSubmit={handleSubmit}
      title="Login"
    >
      <input className={INPUT_CLASSES} type="email" />
      <input className={INPUT_CLASSES} type="password" />
    </Form>
  );
};
