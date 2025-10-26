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
    <html lang="en">
      <body>
        <AppProviders>
          <div className="bg-white">
            <Nav />
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
