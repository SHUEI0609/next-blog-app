import React from 'react';
import './globals.css';
import Header from './_components/Header';
import { ThemeProvider } from './_context/ThemeContext';

export const metadata = {
  title: 'API Server',
  description: 'Next.js API Server',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          <Header />
          <main className="main-container">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}