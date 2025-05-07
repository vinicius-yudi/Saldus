import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Wallet } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wallet className="text-blue-600 dark:text-blue-400" size={24} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Saldus</h1>
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
};