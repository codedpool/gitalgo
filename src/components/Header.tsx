import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, Menu, Sun, Moon, User, LogOut, Settings as SettingsIcon, Github } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockRepositories, mockIssues } from '../utils/mockData';

interface SearchResult {
  type: 'repository' | 'user' | 'issue';
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
}

interface HeaderProps {
  onViewChange?: (view: string) => void;
  onRepositorySelect?: (repository: any) => void;
  onToggleSidebar?: () => void;
}

export default function Header({ onViewChange, onRepositorySelect, onToggleSidebar }: HeaderProps) {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ 
      type: 'SET_THEME', 
      payload: newTheme
    });
    
    // Add a subtle animation effect
    document.documentElement.style.transition = 'all 0.3s ease';
  };

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];

    // Search repositories
    mockRepositories.forEach(repo => {
      if (repo.name.toLowerCase().includes(query.toLowerCase()) || 
          repo.description?.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'repository',
          id: repo.id,
          title: `${repo.owner.username}/${repo.name}`,
          subtitle: repo.description,
          avatar: repo.owner.avatar
        });
      }
    });

    // Search issues
    mockIssues.forEach(issue => {
      if (issue.title.toLowerCase().includes(query.toLowerCase()) ||
          issue.body.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'issue',
          id: issue.id,
          title: issue.title,
          subtitle: `#${issue.number} in ${issue.repository.name}`,
          avatar: issue.author.avatar
        });
      }
    });

    // Add user search result
    if (state.user?.name.toLowerCase().includes(query.toLowerCase()) ||
        state.user?.username.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        type: 'user',
        id: state.user.id,
        title: state.user.name,
        subtitle: `@${state.user.username}`,
        avatar: state.user.avatar
      });
    }

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === 'repository') {
      const repo = mockRepositories.find(r => r.id === result.id);
      if (repo && onRepositorySelect) {
        onRepositorySelect(repo);
      }
    } else if (result.type === 'user') {
      onViewChange?.('profile');
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const notifications = [
    {
      id: '1',
      type: 'issue',
      title: 'New issue opened in Hello-World',
      message: 'Bug: Application crashes when clicking submit button',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: '2',
      type: 'pr',
      title: 'Pull request merged',
      message: 'Add user authentication system has been merged',
      time: '1 hour ago',
      unread: true
    },
    {
      id: '3',
      type: 'star',
      title: 'Someone starred your repository',
      message: 'johndoe starred Hello-World',
      time: '3 hours ago',
      unread: false
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
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
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 md:hidden transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                <Github className="h-5 w-5 text-white dark:text-gray-900" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                GitHub
              </h1>
            </div>

            {/* Search bar */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search or jump to..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="block w-80 pl-10 pr-3 py-2.5 border border-gray-200/50 dark:border-dark-700/50 rounded-xl leading-5 bg-gray-50/50 dark:bg-dark-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-dark-700/50"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-dark-700/50 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50 animate-slide-down">
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50/50 dark:hover:bg-dark-700/50 flex items-center space-x-3 transition-all duration-200 group"
                      >
                        <img
                          src={result.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary-500/30 transition-all duration-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </div>
                          {result.subtitle && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {result.subtitle}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 capitalize px-2 py-1 bg-gray-100/50 dark:bg-dark-700/50 rounded-md">
                          {result.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-dark-800/50 transition-all duration-200 group"
              title={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {state.theme === 'light' ? (
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
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse-slow">
                  {notifications.filter(n => n.unread).length}
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-dark-700/50 rounded-xl shadow-2xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-gray-200/50 dark:border-dark-700/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100/50 dark:border-dark-700/50 hover:bg-gray-50/50 dark:hover:bg-dark-700/50 transition-all duration-200 ${
                          notification.unread ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-gradient-to-r from-primary-500 to-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-dark-600'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200/50 dark:border-dark-700/50">
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
                      View all notifications
                    </button>
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
                  src={state.user?.avatar}
                  alt={state.user?.name}
                />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-dark-700/50 rounded-xl shadow-2xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-gray-200/50 dark:border-dark-700/50">
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-10 w-10 rounded-full ring-2 ring-primary-500/20"
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
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onViewChange?.('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-dark-700/50 flex items-center space-x-2 transition-all duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>Your profile</span>
                    </button>
                    <button
                      onClick={() => {
                        onViewChange?.('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-dark-700/50 flex items-center space-x-2 transition-all duration-200"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-gray-200/50 dark:border-dark-700/50" />
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-dark-700/50 flex items-center space-x-2 transition-all duration-200">
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