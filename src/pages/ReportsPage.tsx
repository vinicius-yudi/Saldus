import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthName } from '../utils/helpers';
import { CHART_COLORS } from '../utils/constants';
import { FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { expenses, categories, getCategoryById } = useApp();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Get all available years from expenses
  const availableYears = Array.from(
    new Set(expenses.map(expense => new Date(expense.date).getFullYear()))
  ).sort();
  
  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }
  
  // Filter expenses by selected month and year
  const filteredExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });
  
  // Calculate total spent
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  
  filteredExpenses.forEach(expense => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount;
    } else {
      expensesByCategory[expense.category] = expense.amount;
    }
  });
  
  // Prepare data for charts
  const categoryData = Object.entries(expensesByCategory)
    .map(([categoryId, amount], index) => {
      const category = getCategoryById(categoryId);
      return {
        id: categoryId,
        name: category?.name || 'Unknown',
        value: amount,
        color: category?.color || CHART_COLORS[index % CHART_COLORS.length],
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
      };
    })
    .sort((a, b) => b.value - a.value);
  
  // Daily spending over the month
  const dailySpending: Record<number, number> = {};
  
  filteredExpenses.forEach(expense => {
    const day = new Date(expense.date).getDate();
    if (dailySpending[day]) {
      dailySpending[day] += expense.amount;
    } else {
      dailySpending[day] = expense.amount;
    }
  });
  
  // Get days in month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  const handleExportPdf = () => {
    alert('Funcionalidade de exportação para PDF será implementada em uma versão futura.');
  };
  
  const monthName = getMonthName(selectedMonth);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Relatório Mensal
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Análise detalhada das suas despesas
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {getMonthName(i)}
              </option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FileText size={16} />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Resumo • {monthName} {selectedYear}
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total gasto</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Despesas registradas</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {filteredExpenses.length}
              </p>
            </div>
            
            {categoryData.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Maior categoria</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {categoryData[0].name} ({formatCurrency(categoryData[0].value)})
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Gastos Diários
          </h2>
          
          {Object.keys(dailySpending).length > 0 ? (
            <div className="h-64">
              <div className="h-full flex items-end gap-1">
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const amount = dailySpending[day] || 0;
                  const maxAmount = Math.max(...Object.values(dailySpending));
                  const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                  
                  return (
                    <div 
                      key={day} 
                      className="flex-1 flex flex-col items-center group cursor-pointer"
                      title={`Dia ${day}: ${formatCurrency(amount)}`}
                    >
                      <div className="relative w-full">
                        <div 
                          className="absolute bottom-0 w-full bg-blue-200 dark:bg-blue-900/70 rounded-t-sm group-hover:bg-blue-300 dark:group-hover:bg-blue-800 transition-colors duration-150"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                      {day % 5 === 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {day}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma despesa registrada neste período.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Distribuição por Categoria
          </h2>
          
          {categoryData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <div className="relative w-full max-w-[200px] aspect-square">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {(() => {
                      let currentProgress = 0;
                      
                      return categoryData.map((category, index) => {
                        const strokeWidth = 30;
                        const radius = 50 - strokeWidth / 2;
                        const circumference = 2 * Math.PI * radius;
                        const progress = (category.percentage / 100) * circumference;
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
                </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
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
                      <div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma despesa registrada neste período.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Detalhes por Categoria
          </h2>
          
          {categoryData.length > 0 ? (
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {category.name}
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {formatCurrency(category.value)}
                    </p>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma despesa registrada neste período.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};