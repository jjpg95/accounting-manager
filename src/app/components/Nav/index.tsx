'use client';

import Image from 'next/image';
import { useLoginModal } from '@/app/context/LoginModalContext';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/user/userSlice';
import { useEffect } from 'react';

export default function Nav() {
  const { setIsLoginModalOpen } = useLoginModal();
  const isUserLoggedIn = useAppSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        dispatch(logout());
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  useEffect(() => {
    if (!isUserLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, [isUserLoggedIn]);

  return (
    <header className="flex z-50 border-b border-gray-300 border-solid h-16 top-0 inset-x-0 absolute">
      <div className="flex w-full max-w-7xl justify-between items-center mx-auto px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-x-6">
          <button className="md:hidden p-3 -m-3">
            <span className="absolute sr-only whitespace-nowrap border-0 w-px h-px -m-px p-0 overflow-hidden">
              Open main menu
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              data-slot="icon"
              aria-hidden="true"
              className="text-gray-900 w-5 h-5"
            >
              <path
                d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
          <Image
            src="/logo.svg"
            alt="App Logo"
            width={120}
            height={40}
            className="w-auto h-8"
          />
        </div>
        <nav className="md:flex md:gap-x-11 md:text-sm md:font-semibold md:text-gray-700 hidden">
          <a>test</a>
          <a>test</a>
          <a>test</a>
          <a>test</a>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-x-8">
          {isUserLoggedIn ? (
            <button onClick={handleLogout} aria-label="Logout">
              <Image
                src="/loggedNav.svg"
                alt="User Logged In"
                width={40}
                height={40}
              />
            </button>
          ) : (
            <button onClick={handleLoginModalOpen} aria-label="Login">
              <Image src="/notLogged.svg" alt="Login" width={40} height={40} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
