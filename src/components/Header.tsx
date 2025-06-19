import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, Menu, Sun, Moon, User, LogOut, Github } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                <Github className="h-5 w-5 text-white dark:text-gray-900" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                GitHub
              </h1>
            </button>

            {/* Search bar */}
            <div className="hidden md:block relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search or jump to..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-80 pl-10 pr-3 py-2.5 border border-gray-200/50 dark:border-dark-700/50 rounded-xl leading-5 bg-gray-50/50 dark:bg-dark-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-dark-700/50"
                />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 transition-all duration-200 group"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              ) : (
                <Sun className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 transition-all duration-200 group"
              >
                <Bell className="h-5 w-5 group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                  0
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-dark-700/50 rounded-xl shadow-2xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-gray-200/50 dark:border-dark-700/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button className="flex items-center space-x-2 p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 transition-all duration-200 group">
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="hidden sm:block font-medium">Create</span>
              </button>
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-gray-200/50 dark:ring-dark-700/50 group-hover:ring-primary-500/50 transition-all duration-200"
                  src={user?.profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile.username}`}
                  alt={user?.profile.full_name || user?.profile.username}
                />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-dark-700/50 rounded-xl shadow-2xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-gray-200/50 dark:border-dark-700/50">
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-10 w-10 rounded-full ring-2 ring-primary-500/20"
                        src={user?.profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile.username}`}
                        alt={user?.profile.full_name || user?.profile.username}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.profile.full_name || user?.profile.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{user?.profile.username}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate(`/profile/${user?.profile.username}`);
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-dark-700/50 flex items-center space-x-2 transition-all duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>Your profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-dark-700/50 flex items-center space-x-2 transition-all duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-gray-200/50 dark:border-dark-700/50" />
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-dark-700/50 flex items-center space-x-2 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}