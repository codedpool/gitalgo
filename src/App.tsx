import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RepositoryView from './components/RepositoryView';
import Settings from './components/Settings';
import { mockRepositories } from './utils/mockData';
import { Repository } from './types';

function AppContent() {
  const { state, dispatch } = useApp();
  const [currentView, setCurrentView] = useState<'dashboard' | 'repository' | 'settings'>('dashboard');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    // Load mock repositories
    dispatch({ type: 'SET_REPOSITORIES', payload: mockRepositories });
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to document with smooth transition
    const root = document.documentElement;
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (state.theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [state.theme]);

  const handleRepositorySelect = (repository: Repository) => {
    setSelectedRepo(repository);
    setCurrentView('repository');
    dispatch({ type: 'SET_CURRENT_REPO', payload: repository });
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedRepo(null);
    setActiveView('dashboard');
    dispatch({ type: 'SET_CURRENT_REPO', payload: null });
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view === 'settings') {
      setCurrentView('settings');
    } else {
      setCurrentView('dashboard');
    }
    setSelectedRepo(null);
    dispatch({ type: 'SET_CURRENT_REPO', payload: null });
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'settings':
        return <Settings />;
      case 'repository':
        return selectedRepo && (
          <RepositoryView 
            repository={selectedRepo} 
            onBack={handleBackToDashboard}
          />
        );
      default:
        return (
          <Dashboard 
            activeView={activeView}
            onRepositorySelect={handleRepositorySelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark-950 dark:via-dark-900 dark:to-slate-900 transition-all duration-500">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <Header 
        onViewChange={handleViewChange}
        onRepositorySelect={handleRepositorySelect}
      />
      
      <div className="flex relative">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
        <div className="flex-1 md:pl-64">
          <div className="p-6 animate-fade-in">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}