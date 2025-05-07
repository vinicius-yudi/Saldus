import React from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1">
        <Navigation />
        
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};