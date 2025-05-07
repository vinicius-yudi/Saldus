import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrentMonthYear, getMonthName, compareWithPreviousMonth } from '../utils/helpers';
import { TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

export const MonthlyOverview: React.FC = () => {
  const { expenses, categories, getExpensesByMonth, getTotalSpentByMonth } = useApp();
  
  const { month, year } = getCurrentMonthYear();
  const monthName = getMonthName(month);
  
  const comparison = compareWithPreviousMonth(month, year, expenses);
  const { percentageDifference, previousMonthTotal } = comparison;
  
  const monthlyExpenses = getExpensesByMonth(month, year);
  const totalSpent = getTotalSpentByMonth(month, year);
  
  // Get top categories for current month
  const categorySpendings: Record<string, number> = {};
  
  monthlyExpenses.forEach(expense => {
    if (categorySpendings[expense.category]) {
      categorySpendings[expense.category] += expense.amount;
    } else {
      categorySpendings[expense.category] = expense.amount;
    }
  });
  
  const topCategories = Object.entries(categorySpendings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category?.name || 'Desconhecido',
        amount,
        color: category?.color || '#ccc'
      };
    });
  
  const hasPreviousData = previousMonthTotal > 0;
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {monthName} {year}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Visão geral das suas finanças
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total gasto
            </p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(totalSpent)}
            </p>
            
            {hasPreviousData && (
              <div className={`mt-2 flex items-center text-sm ${
                percentageDifference > 0 
                  ? 'text-red-500' 
                  : percentageDifference < 0 
                    ? 'text-green-500' 
                    : 'text-gray-500 dark:text-gray-400'
              }`}>
                {percentageDifference > 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : percentageDifference < 0 ? (
                  <TrendingDown size={16} className="mr-1" />
                ) : (
                  <ArrowRightLeft size={16} className="mr-1" />
                )}
                
                <span>
                  {percentageDifference > 0 
                    ? `${percentageDifference.toFixed(1)}% a mais que no mês passado` 
                    : percentageDifference < 0 
                      ? `${Math.abs(percentageDifference).toFixed(1)}% a menos que no mês passado`
                      : 'Mesmo valor que no mês passado'}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Principais categorias
            </p>
            
            {topCategories.length > 0 ? (
              <div className="space-y-3">
                {topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className="text-gray-800 dark:text-white">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {formatCurrency(category.amount)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {totalSpent > 0 ? Math.round((category.amount / totalSpent) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma despesa registrada neste mês.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          {topCategories.length > 0 ? (
            <div className="relative w-full aspect-square max-w-[240px] mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Donut chart using SVG */}
                {(() => {
                  let currentProgress = 0;
                  
                  return topCategories.map((category, index) => {
                    const percentage = totalSpent > 0 ? (category.amount / totalSpent) * 100 : 0;
                    const strokeWidth = 30;
                    const radius = 50 - strokeWidth / 2;
                    const circumference = 2 * Math.PI * radius;
                    const progress = (percentage / 100) * circumference;
                    const prevProgress = currentProgress;
                    currentProgress += progress;
                    
                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={category.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${progress} ${circumference - progress}`}
                        strokeDashoffset={-prevProgress}
                        strokeLinecap="round"
                      />
                    );
                  });
                })()}
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Adicione despesas para visualizar o gráfico de categorias.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};