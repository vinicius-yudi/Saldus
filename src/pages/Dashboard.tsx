import React from 'react';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { MonthlyOverview } from '../components/MonthlyOverview';
import { RecommendationsList } from '../components/RecommendationsList';

export const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MonthlyOverview />
        <ExpenseForm />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseList />
        </div>
        
        <div>
          <RecommendationsList />
        </div>
      </div>
    </div>
  );
};