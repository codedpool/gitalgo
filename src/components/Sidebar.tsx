import React from 'react';
import { Home, Book, Star, Users, Settings, GitBranch, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  id: string;
  count?: number;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', icon: Home, id: 'dashboard' },
  { name: 'Repositories', icon: Book, id: 'repositories', count: 8 },
  { name: 'Projects', icon: Package, id: 'projects', count: 3 },
  { name: 'Packages', icon: Package, id: 'packages', count: 0 },
  { name: 'Stars', icon: Star, id: 'stars', count: 247 },
];

const teamItems = [
  { name: 'GitHub', icon: Users, id: 'github-team' },
  { name: 'Open Source', icon: GitBranch, id: 'open-source' },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { state } = useApp();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
      <div className="flex-1 flex flex-col min-h-0 bg-white/60 dark:bg-dark-900/60 backdrop-blur-xl border-r border-gray-200/50 dark:border-dark-700/50">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-dark-800 dark:to-dark-700 border border-gray-200/50 dark:border-dark-600/50 w-full">
              <img
                className="h-10 w-10 rounded-full ring-2 ring-primary-500/20 shadow-md"
                src={state.user?.avatar}
                alt={state.user?.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {state.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @{state.user?.username}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-3 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onViewChange(item.id)}
                className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                    activeView === item.id
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }`}
                />
                {item.name}
                {item.count !== undefined && (
                  <span className={`ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200/50 dark:bg-dark-700/50 text-gray-600 dark:text-gray-300 group-hover:bg-gray-300/50 dark:group-hover:bg-dark-600/50'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8 px-3">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Teams
            </h3>
            <div className="space-y-2">
              {teamItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onViewChange(item.id)}
                  className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]'
                  }`}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                    activeView === item.id
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }`} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-dark-700/50 p-4">
          <button 
            onClick={() => onViewChange('settings')}
            className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeView === 'settings'
                ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className={`mr-3 h-5 w-5 transition-all duration-200 ${
              activeView === 'settings'
                ? 'text-white'
                : 'text-gray-400'
            }`} />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}