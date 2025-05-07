import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  useEffect(() => {
    const handleNavigationChange = (event: CustomEvent<{ tab: string }>) => {
      setCurrentTab(event.detail.tab);
    };
    
    window.addEventListener('navigationChange', handleNavigationChange as EventListener);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavigationChange as EventListener);
    };
  }, []);
  
  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <AppProvider>
      <Layout>
        {renderContent()}
      </Layout>
    </AppProvider>
  );
}

export default App;