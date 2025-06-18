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
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src={state.user?.avatar}
                alt={state.user?.name}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {state.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{state.user?.username}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onViewChange(item.id)}
                className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    activeView === item.id
                      ? 'text-gray-500 dark:text-gray-400' 
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
                {item.count !== undefined && (
                  <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Teams
            </h3>
            <div className="mt-1 space-y-1">
              {teamItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onViewChange(item.id)}
                  className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === item.id
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <button 
            onClick={() => onViewChange('settings')}
            className={`flex items-center w-full text-sm transition-colors ${
              activeView === 'settings'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="mr-3 h-5 w-5 text-gray-400" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}