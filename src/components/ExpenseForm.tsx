import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { parseNaturalLanguageExpense,} from '../utils/helpers';

export const ExpenseForm: React.FC = () => {
  const { addExpense, categories } = useApp();
  const [naturalInput, setNaturalInput] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [parseError, setParseError] = useState('');

  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedExpense = parseNaturalLanguageExpense(naturalInput, categories);
    
    if (parsedExpense) {
      addExpense({
        amount: parsedExpense.amount!,
        description: parsedExpense.description!,
        category: parsedExpense.category!,
        date: parsedExpense.date!
      });
      
      setNaturalInput('');
      setParseError('');
    } else {
      setParseError('Não consegui entender essa despesa. Por favor, inclua um valor (ex: R$50).');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category || !date) {
      return;
    }
    
    addExpense({
      amount: parseFloat(amount),
      description,
      category,
      date
    });
    
    setAmount('');
    setDescription('');
    setCategory(categories[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const toggleFormType = () => {
    setShowManualForm(!showManualForm);
    setParseError('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Registrar Nova Despesa
      </h2>
      
      <div className="mb-4">
        <button
          type="button"
          onClick={toggleFormType}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showManualForm ? 'Usar entrada rápida' : 'Usar formulário detalhado'}
        </button>
      </div>
      
      {!showManualForm ? (
        <form onSubmit={handleNaturalSubmit}>
          <div className="mb-4">
            <label htmlFor="naturalInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descreva sua despesa
            </label>
            <input
              type="text"
              id="naturalInput"
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              placeholder="Ex: Gastei R$50 no mercado"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {parseError && (
              <p className="mt-1 text-red-500 text-sm">{parseError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Exemplos: "Gastei R$300 na gasolina", "R$25 no café"
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Registrar
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleManualSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                R$
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0,00"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compras no mercado"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Registrar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};