import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useApp();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label={themeMode === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
    >
      {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};