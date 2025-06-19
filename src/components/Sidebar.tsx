import React, { useState } from 'react';
import { Home, Book, Star, Users, Settings, GitBranch, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navigationItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Repositories', icon: Book, path: '/repositories' },
  { name: 'Projects', icon: Package, path: '/projects' },
  { name: 'Packages', icon: Package, path: '/packages' },
  { name: 'Stars', icon: Star, path: '/stars' },
];

const teamItems = [
  { name: 'GitHub', icon: Users, path: '/github-team' },
  { name: 'Open Source', icon: GitBranch, path: '/open-source' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-16 bottom-0 z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="h-full flex flex-col bg-white/60 dark:bg-dark-900/60 backdrop-blur-xl border-r border-gray-200/50 dark:border-dark-700/50">
          {/* Toggle button */}
          <div className="hidden md:flex justify-end p-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
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
                  <img
                    className="h-10 w-10 rounded-full ring-2 ring-primary-500/20 shadow-md"
                    src={user?.profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile.username}`}
                    alt={user?.profile.full_name || user?.profile.username}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user?.profile.full_name || user?.profile.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{user?.profile.username}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed user avatar */}
            {collapsed && (
              <div className="flex justify-center px-2 mb-6">
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-primary-500/20 shadow-md"
                  src={user?.profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile.username}`}
                  alt={user?.profile.full_name || user?.profile.username}
                />
              </div>
            )}
            
            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                      collapsed ? '' : 'mr-3'
                    } ${
                      isActive(item.path)
                        ? 'text-white' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {!collapsed && item.name}
                </button>
              ))}
            </nav>

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
                      onClick={() => navigate(item.path)}
                      className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]'
                      }`}
                    >
                      <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                        isActive(item.path)
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
                    onClick={() => navigate(item.path)}
                    className={`group flex items-center justify-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={item.name}
                  >
                    <item.icon className={`h-5 w-5 transition-all duration-200 ${
                      isActive(item.path)
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
              onClick={() => navigate('/settings')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive('/settings')
                  ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
              title={collapsed ? 'Settings' : undefined}
            >
              <Settings className={`h-5 w-5 transition-all duration-200 ${
                collapsed ? '' : 'mr-3'
              } ${
                isActive('/settings')
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