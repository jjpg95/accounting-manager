// components/AuthInitializer.jsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setInitializationFailed } from '@/features/user/userSlice';
import { useAppSelector } from '@/app/hooks/useAppSelector';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const isInitializing = useAppSelector((state) => state.user.isInitializing);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/api/auth/me', { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Authentication failed or token invalid');
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setUser(data));
      })
      .catch((error) => {
        console.error('User initialization failed:', error);
        dispatch(setInitializationFailed());
      });
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Cargando sesión...
      </div>
    );
  }

  return <>{children}</>;
}
