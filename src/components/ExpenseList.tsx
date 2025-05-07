import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { X } from 'lucide-react';
import { getCategoryIcon } from './icons';

export const ExpenseList: React.FC = () => {
  const { expenses, categories, deleteExpense, getCategoryById } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredExpenses = selectedCategory === 'all'
    ? expenses
    : expenses.filter(expense => expense.category === selectedCategory);
  
  // Group expenses by date
  const groupedExpenses: Record<string, typeof expenses> = {};
  
  filteredExpenses.forEach(expense => {
    const date = expense.date.split('T')[0];
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = [];
    }
    groupedExpenses[date].push(expense);
  });
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Histórico de Despesas
        </h2>
        
        <div className="flex overflow-x-auto pb-2 gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            Todas
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                backgroundColor: selectedCategory === category.id 
                  ? undefined 
                  : `${category.color}30`
              }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="divide-y dark:divide-gray-700">
        {expenses.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Nenhuma despesa registrada ainda.
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Nenhuma despesa encontrada com o filtro atual.
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="py-2">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/30">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formatDate(date)}
                </h3>
              </div>
              
              <ul className="divide-y dark:divide-gray-700">
                {groupedExpenses[date].map(expense => {
                  const category = getCategoryById(expense.category);
                  const IconComponent = category ? getCategoryIcon(category.icon) : null;
                  
                  return (
                    <li 
                      key={expense.id} 
                      className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        {IconComponent && (
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center" 
                            style={{ backgroundColor: `${category?.color}20` }}
                          >
                            <IconComponent 
                              size={20} 
                              style={{ color: category?.color }} 
                            />
                          </div>
                        )}
                        
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {expense.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {category?.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </span>
                        
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          aria-label="Excluir despesa"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};