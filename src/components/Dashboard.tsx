import React, { useState } from 'react';
import { Search, Plus, Book, Star, Users, TrendingUp, Calendar, Zap, Activity, GitBranch } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockRepositories, mockIssues } from '../utils/mockData';
import RepositoryCard from './RepositoryCard';

interface DashboardProps {
  activeView: string;
  onRepositorySelect: (repository: any) => void;
}

export default function Dashboard({ activeView, onRepositorySelect }: DashboardProps) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Book },
    { id: 'repositories', name: 'Repositories', icon: Book, count: mockRepositories.length },
    { id: 'projects', name: 'Projects', icon: Star, count: 3 },
    { id: 'packages', name: 'Packages', icon: Users, count: 0 },
  ];

  const stats = [
    { name: 'Repositories', value: state.user?.publicRepos || 0, icon: Book, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' },
    { name: 'Contributions', value: '1,247', icon: TrendingUp, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' },
    { name: 'Followers', value: state.user?.followers || 0, icon: Users, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20' },
    { name: 'Following', value: state.user?.following || 0, icon: Users, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20' },
  ];

  // Show different content based on sidebar selection
  const renderContent = () => {
    switch (activeView) {
      case 'repositories':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Find a repository..."
                    className="pl-10 pr-4 py-3 border border-gray-200/50 dark:border-dark-700/50 rounded-xl bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/50"
                  />
                </div>
                <select className="border border-gray-200/50 dark:border-dark-700/50 rounded-xl px-4 py-3 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200">
                  <option>All</option>
                  <option>Public</option>
                  <option>Private</option>
                  <option>Forks</option>
                  <option>Archived</option>
                </select>
              </div>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105 hover:shadow-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Repository
              </button>
            </div>

            <div className="space-y-6">
              {mockRepositories.map((repo) => (
                <RepositoryCard 
                  key={repo.id} 
                  repository={repo} 
                  onClick={() => onRepositorySelect(repo)}
                />
              ))}
            </div>
          </div>
        );

      case 'stars':
        return (
          <div className="text-center py-16 animate-fade-in">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
              <Star className="h-full w-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your starred repositories
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Star repositories to keep track of projects you find interesting.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-xl hover:from-primary-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-lg">
              <Star className="h-4 w-4 mr-2" />
              Explore Repositories
            </button>
          </div>
        );

      case 'projects':
      case 'packages':
        return (
          <div className="text-center py-16 animate-fade-in">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
              <Calendar className="h-full w-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No {activeView} yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by creating your first {activeView.slice(0, -1)}.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-xl hover:from-primary-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New {activeView.slice(0, -1)}
            </button>
          </div>
        );

      default: // dashboard
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                    Good morning, {state.user?.name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Here's what's happening with your projects today.
                  </p>
                </div>
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105 hover:shadow-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  New Repository
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.name}
                  className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm rounded-2xl border border-white/20 dark:border-dark-700/50 p-6 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 transition-all duration-300 hover:scale-105 animate-slide-up group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.name}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs for dashboard overview */}
            <div className="mb-6">
              <div className="border-b border-gray-200/50 dark:border-dark-700/50">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group inline-flex items-center py-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      {tab.name}
                      {tab.count !== undefined && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
                            : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary-500" />
                  Recent Activity
                </h2>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  View all
                </button>
              </div>
              <div className="bg-white/70 dark:bg-dark-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 p-6 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  {mockIssues.slice(0, 3).map((issue, index) => (
                    <div key={issue.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-dark-700/50 transition-all duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full mt-2 animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Opened issue <span className="font-bold text-primary-600 dark:text-primary-400">#{issue.number}</span> in{' '}
                          <span className="font-bold">{issue.repository.name}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                          {issue.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Repositories */}
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary-500" />
                  Popular Repositories
                </h2>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockRepositories.slice(0, 2).map((repo) => (
                  <RepositoryCard 
                    key={repo.id} 
                    repository={repo} 
                    onClick={() => onRepositorySelect(repo)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 md:pl-64">
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}