import React from 'react';
import { useApp } from '../context/AppContext';
import { generateRecommendations } from '../utils/helpers';
import { LightbulbIcon } from 'lucide-react';

export const RecommendationsList: React.FC = () => {
  const { expenses, categories } = useApp();
  
  const recommendations = generateRecommendations(expenses, categories);
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        <LightbulbIcon className="text-yellow-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Recomendações Inteligentes
        </h2>
      </div>
      
      {recommendations.length > 0 ? (
        <ul className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-gray-800 dark:text-white">{recommendation}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            Continue registrando suas despesas para receber recomendações personalizadas para economizar.
          </p>
        </div>
      )}
    </div>
  );
};