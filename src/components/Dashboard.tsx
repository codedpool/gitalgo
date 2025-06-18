import React, { useState } from 'react';
import { Search, Plus, Book, Star, Users, TrendingUp, Calendar } from 'lucide-react';
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
    { name: 'Repositories', value: state.user?.publicRepos || 0, icon: Book, color: 'text-blue-600' },
    { name: 'Contributions', value: '1,247', icon: TrendingUp, color: 'text-green-600' },
    { name: 'Followers', value: state.user?.followers || 0, icon: Users, color: 'text-purple-600' },
    { name: 'Following', value: state.user?.following || 0, icon: Users, color: 'text-orange-600' },
  ];

  // Show different content based on sidebar selection
  const renderContent = () => {
    switch (activeView) {
      case 'repositories':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Find a repository..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All</option>
                  <option>Public</option>
                  <option>Private</option>
                  <option>Forks</option>
                  <option>Archived</option>
                </select>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                New Repository
              </button>
            </div>

            <div className="space-y-4">
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
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <Star className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Your starred repositories
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Star repositories to keep track of projects you find interesting.
            </p>
          </div>
        );

      case 'projects':
      case 'packages':
        return (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <Calendar className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No {activeView} yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Get started by creating your first {activeView.slice(0, -1)}.
            </p>
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New {activeView.slice(0, -1)}
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={state.user?.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={state.user?.bio}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );

      default: // dashboard
        return (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Good morning, {state.user?.name?.split(' ')[0]}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Here's what's happening with your projects today.
                  </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  New Repository
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-900/25 transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.name}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs for dashboard overview */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-2" />
                      {tab.name}
                      {tab.count !== undefined && (
                        <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View all
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-4">
                  {mockIssues.slice(0, 3).map((issue, index) => (
                    <div key={issue.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          Opened issue <span className="font-medium">#{issue.number}</span> in{' '}
                          <span className="font-medium">{issue.repository.name}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {issue.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Repositories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Popular Repositories
                </h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
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