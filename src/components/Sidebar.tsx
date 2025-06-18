import React from 'react';
import { Home, Book, Star, Users, Settings, GitBranch, Package, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../utils/auth';

interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  id: string;
  count?: number;
  requiresPermission?: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', icon: Home, id: 'dashboard' },
  { name: 'Repositories', icon: Book, id: 'repositories' },
  { name: 'Projects', icon: Package, id: 'projects', count: 3 },
  { name: 'Packages', icon: Package, id: 'packages', count: 0 },
  { name: 'Stars', icon: Star, id: 'stars', count: 247 },
];

const teamItems = [
  { name: 'GitHub', icon: Users, id: 'github-team' },
  { name: 'Open Source', icon: GitBranch, id: 'open-source' },
];

const adminItems: NavigationItem[] = [
  { name: 'User Management', icon: Shield, id: 'user-management', requiresPermission: 'admin_users' },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activeView, onViewChange, collapsed, onToggle }: SidebarProps) {
  const { state } = useApp();

  // Filter navigation items based on permissions
  const filteredNavigationItems = navigationItems.map(item => {
    if (item.id === 'repositories') {
      return { ...item, count: state.repositories.length };
    }
    return item;
  });

  const filteredAdminItems = adminItems.filter(item => 
    !item.requiresPermission || authService.hasPermission(item.requiresPermission)
  );

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-16 bottom-0 z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
      }`}>
        <div className="h-full flex flex-col bg-white/60 dark:bg-dark-900/60 backdrop-blur-xl border-r border-gray-200/50 dark:border-dark-700/50">
          {/* Toggle button */}
          <div className="hidden md:flex justify-end p-2">
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 transition-all duration-200"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* User profile section */}
            {!collapsed && (
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-dark-800 dark:to-dark-700 border border-gray-200/50 dark:border-dark-600/50 w-full">
                  <div className="relative">
                    <img
                      className="h-10 w-10 rounded-full ring-2 ring-primary-500/20 shadow-md"
                      src={state.user?.avatar}
                      alt={state.user?.name}
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-dark-800"
                      style={{ backgroundColor: state.user?.role.color }}
                      title={state.user?.role.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {state.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{state.user?.username}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs font-medium" style={{ color: state.user?.role.color }}>
                        {state.user?.role.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed user avatar */}
            {collapsed && (
              <div className="flex justify-center px-2 mb-6">
                <div className="relative">
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-primary-500/20 shadow-md"
                    src={state.user?.avatar}
                    alt={state.user?.name}
                  />
                  <div 
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-dark-800"
                    style={{ backgroundColor: state.user?.role.color }}
                    title={state.user?.role.name}
                  />
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2">
              {filteredNavigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onViewChange(item.id)}
                  className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                      collapsed ? '' : 'mr-3'
                    } ${
                      activeView === item.id
                        ? 'text-white' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {!collapsed && (
                    <>
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
                    </>
                  )}
                </button>
              ))}
            </nav>

            {/* Admin section */}
            {filteredAdminItems.length > 0 && (
              <div className="mt-6 px-3">
                {!collapsed && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Administration
                  </h3>
                )}
                <div className="space-y-2">
                  {filteredAdminItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => onViewChange(item.id)}
                      className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeView === item.id
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25 transform scale-[1.02]'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className={`flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                        collapsed ? '' : 'mr-3'
                      } ${
                        activeView === item.id
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      }`} />
                      {!collapsed && item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Teams section */}
            {!collapsed && (
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
            )}

            {/* Collapsed teams */}
            {collapsed && (
              <div className="mt-8 px-3 space-y-2">
                {teamItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onViewChange(item.id)}
                    className={`group flex items-center justify-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeView === item.id
                        ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={item.name}
                  >
                    <item.icon className={`h-5 w-5 transition-all duration-200 ${
                      activeView === item.id
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings button */}
          <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-dark-700/50 p-4">
            <button 
              onClick={() => onViewChange('settings')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                collapsed ? 'justify-center' : ''
              } ${
                activeView === 'settings'
                  ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
              title={collapsed ? 'Settings' : undefined}
            >
              <Settings className={`h-5 w-5 transition-all duration-200 ${
                collapsed ? '' : 'mr-3'
              } ${
                activeView === 'settings'
                  ? 'text-white'
                  : 'text-gray-400'
              }`} />
              {!collapsed && 'Settings'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}