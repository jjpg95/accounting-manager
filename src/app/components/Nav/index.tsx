'use client';

import Image from 'next/image';
import { useLoginModal } from '@/app/context/LoginModalContext';

export default function Nav() {
  const { setIsLoginModalOpen } = useLoginModal();

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <header className="flex z-50 border-b border-gray-300 border-solid h-16 top-0 inset-x-0 absolute">
      <button onClick={handleLoginModalOpen}>
        <Image src="/notLogged.svg" alt="Login" width={40} height={40} />
      </button>
    </header>
  );
}
