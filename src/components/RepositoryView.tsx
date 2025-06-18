import React, { useState } from 'react';
import { 
  Star, GitFork, Eye, Code2, AlertCircle, GitPullRequest, 
  Settings, Shield, Book, FileText, Download, Copy, Check 
} from 'lucide-react';
import { Repository } from '../types';
import { mockFileTree, mockCommits, mockIssues, mockPullRequests } from '../utils/mockData';
import FileExplorer from './FileExplorer';
import CodeViewer from './CodeViewer';

interface RepositoryViewProps {
  repository: Repository;
  onBack: () => void;
}

export default function RepositoryView({ repository, onBack }: RepositoryViewProps) {
  const [activeTab, setActiveTab] = useState('code');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'code', name: 'Code', icon: Code2 },
    { id: 'issues', name: 'Issues', icon: AlertCircle, count: mockIssues.length },
    { id: 'pull-requests', name: 'Pull requests', icon: GitPullRequest, count: mockPullRequests.length },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'insights', name: 'Insights', icon: Book },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const copyCloneUrl = async () => {
    const cloneUrl = `https://github.com/${repository.owner.username}/${repository.name}.git`;
    await navigator.clipboard.writeText(cloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 md:pl-64">
      <div className="p-6">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={onBack}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {repository.owner.username}
              </button>
            </li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            <li className="text-gray-900 dark:text-white font-semibold">
              {repository.name}
            </li>
          </ol>
        </nav>

        {/* Repository Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Book className="h-5 w-5 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {repository.owner.username}/{repository.name}
                </h1>
                {repository.isPrivate && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border">
                    Private
                  </span>
                )}
              </div>
              
              {repository.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {repository.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>Watch</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>{repository.stars.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="h-4 w-4" />
                  <span>{repository.forks.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Star className="h-4 w-4 mr-2" />
                Star
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <GitFork className="h-4 w-4 mr-2" />
                Fork
              </button>
              <div className="relative">
                <button 
                  onClick={copyCloneUrl}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Code'}
                </button>
              </div>
            </div>
          </div>

          {repository.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {repository.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
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
                <tab.icon className="h-4 w-4 mr-2" />
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

        {/* Tab Content */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            {/* Latest Commit */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-6 w-6 rounded-full"
                    src={mockCommits[0].author.avatar}
                    alt={mockCommits[0].author.name}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {mockCommits[0].author.username}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {mockCommits[0].message}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{mockCommits[0].sha}</span>
                  <span>{new Date(mockCommits[0].date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* File Explorer */}
            {selectedFile ? (
              <CodeViewer 
                file={selectedFile} 
                onBack={() => setSelectedFile(null)} 
              />
            ) : (
              <FileExplorer 
                files={mockFileTree} 
                onFileSelect={setSelectedFile} 
              />
            )}
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-4">
            {mockIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-900/25 transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    issue.state === 'open' ? 'text-green-500' : 'text-purple-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        {issue.title}
                      </h3>
                      <span className="text-gray-500 dark:text-gray-400">
                        #{issue.number}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        opened {new Date(issue.createdAt).toLocaleDateString()} by {issue.author.username}
                      </span>
                      <span>{issue.comments} comments</span>
                    </div>
                    {issue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {issue.labels.map((label) => (
                          <span
                            key={label.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `#${label.color}20`,
                              color: `#${label.color}`,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pull-requests' && (
          <div className="space-y-4">
            {mockPullRequests.map((pr) => (
              <div
                key={pr.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-900/25 transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <GitPullRequest className={`h-5 w-5 mt-0.5 ${
                    pr.state === 'open' ? 'text-green-500' : 
                    pr.state === 'merged' ? 'text-purple-500' : 'text-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        {pr.title}
                      </h3>
                      <span className="text-gray-500 dark:text-gray-400">
                        #{pr.number}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        opened {new Date(pr.createdAt).toLocaleDateString()} by {pr.author.username}
                      </span>
                      <span>{pr.commits} commits</span>
                      <span className="text-green-600">+{pr.additions}</span>
                      <span className="text-red-600">-{pr.deletions}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>{pr.sourceBranch}</span>
                      <span>→</span>
                      <span>{pr.targetBranch}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(activeTab === 'security' || activeTab === 'insights' || activeTab === 'settings') && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <FileText className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              This section would contain {activeTab} information and settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}