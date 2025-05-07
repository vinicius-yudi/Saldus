import React, { useState } from 'react';
import { Home, BarChart2, Settings } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'reports', label: 'Relatórios', icon: BarChart2 },
  { id: 'settings', label: 'Configurações', icon: Settings }
];

export const Navigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // This will be replaced with actual router functionality in a more complete implementation
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Dispatch a custom event that the App component can listen to
    window.dispatchEvent(new CustomEvent('navigationChange', { detail: { tab: tabId } }));
  };
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-colors duration-200">
        <ul className="py-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            
            return (
              <li key={tab.id}>
                <button
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                  
                  {isActive && (
                    <span className="ml-auto w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-10 transition-colors duration-200">
        <ul className="flex justify-around py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            
            return (
              <li key={tab.id} className="flex-1">
                <button
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex flex-col items-center py-2 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs mt-1">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};