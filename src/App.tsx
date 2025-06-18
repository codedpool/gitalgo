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

  const handleShowRegister = () => {
    dispatch({ type: 'TOGGLE_AUTH_MODAL', payload: 'register' });
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
        <div className="absolute top-8 right-8">
          <button
            onClick={handleShowRegister}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            Create Account
          </button>
        </div>
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
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')]"></div>
      
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