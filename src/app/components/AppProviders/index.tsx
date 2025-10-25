'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { LoginModalProvider } from '@/app/context/LoginModalContext';
import AuthInitializer from '../AuthInitializer';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <LoginModalProvider>{children}</LoginModalProvider>
      </AuthInitializer>
    </Provider>
  );
}
