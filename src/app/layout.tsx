import React from 'react';
import './globals.css';
import { Metadata } from 'next';
import Nav from '@/app/components/Nav';
import AppProviders from './components/AppProviders';

export const metadata: Metadata = {
  title: 'Your personal accounting',
  description: 'This is an application to check your accounting balance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <AppProviders>
          <Nav />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
