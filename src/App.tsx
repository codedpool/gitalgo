import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RepositoryView from './components/RepositoryView';
import Settings from './components/Settings';
import CreateRepositoryModal from './components/CreateRepositoryModal';
import CreateModal from './components/CreateModal';
import AuthModal from './components/AuthModal';
import UserManagement from './components/UserManagement';
import { mockRepositories } from './utils/mockData';
import { Repository } from './types';
import { authService } from './utils/auth';

function AppContent() {
  const { state, dispatch } = useApp();
  const [currentView, setCurrentView] = useState<'dashboard' | 'repository' | 'settings' | 'user-management'>('dashboard');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load mock repositories only if user is authenticated
    if (state.auth.isAuthenticated && state.repositories.length === 0) {
      dispatch({ type: 'SET_REPOSITORIES', payload: mockRepositories });
    }
  }, [state.auth.isAuthenticated, state.repositories.length, dispatch]);

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
    } else if (view === 'user-management') {
      setCurrentView('user-management');
    } else {
      setCurrentView('dashboard');
    }
    setSelectedRepo(null);
    dispatch({ type: 'SET_CURRENT_REPO', payload: null });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCreateRepository = () => {
    dispatch({ type: 'TOGGLE_CREATE_REPO_MODAL' });
  };

  const handleAuthSuccess = (user: any) => {
    dispatch({ type: 'SET_USER', payload: user });
    const authState = authService.getAuthState();
    dispatch({ type: 'SET_AUTH_STATE', payload: authState });
  };

  const handleLogout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Show loading screen while initializing
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark-950 dark:via-dark-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading GitHub Clone...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!state.auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark-950 dark:via-dark-900 dark:to-slate-900 flex items-center justify-center">
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          onAuthSuccess={handleAuthSuccess}
          initialMode="login"
        />
      </div>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'settings':
        return <Settings />;
      case 'user-management':
        return <UserManagement />;
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
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.02%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.02%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <Header 
        onViewChange={handleViewChange}
        onRepositorySelect={handleRepositorySelect}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />
      
      <div className="flex relative pt-16">
        <Sidebar 
          activeView={activeView} 
          onViewChange={handleViewChange}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
        <div className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}>
          <div className="p-6 animate-fade-in">
            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateRepositoryModal 
        isOpen={state.showCreateRepoModal}
        onClose={() => dispatch({ type: 'TOGGLE_CREATE_REPO_MODAL' })}
      />
      
      <CreateModal 
        isOpen={state.showCreateModal}
        onClose={() => dispatch({ type: 'TOGGLE_CREATE_MODAL' })}
        onCreateRepository={handleCreateRepository}
      />

      <AuthModal
        isOpen={state.showAuthModal}
        onClose={() => dispatch({ type: 'TOGGLE_AUTH_MODAL' })}
        onAuthSuccess={handleAuthSuccess}
        initialMode={state.authMode}
      />
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