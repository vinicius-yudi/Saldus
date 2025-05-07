import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Category, ThemeMode } from '../types';
import { generateId } from '../utils/helpers';
import { defaultCategories } from '../utils/constants';

interface AppContextType {
  expenses: Expense[];
  categories: Category[];
  themeMode: ThemeMode;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  toggleTheme: () => void;
  getExpensesByMonth: (month: number, year: number) => Expense[];
  getTotalSpentByMonth: (month: number, year: number) => number;
  getCategoryById: (id: string) => Category | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const toggleTheme = () => {
    setThemeMode(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const getExpensesByMonth = (month: number, year: number) => {
    return expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const getTotalSpentByMonth = (month: number, year: number) => {
    const monthlyExpenses = getExpensesByMonth(month, year);
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        expenses,
        categories,
        themeMode,
        addExpense,
        deleteExpense,
        addCategory,
        deleteCategory,
        toggleTheme,
        getExpensesByMonth,
        getTotalSpentByMonth,
        getCategoryById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};